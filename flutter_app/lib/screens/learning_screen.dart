import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/audio_service.dart';
import '../models/song.dart';
import '../models/lyric_line.dart';
import '../models/line_analysis.dart';
import '../widgets/lyric_display.dart';
import '../widgets/audio_controls.dart';
import '../widgets/analysis_section.dart';
import '../config/api_config.dart';

class LearningScreen extends StatefulWidget {
  final Song song;

  const LearningScreen({super.key, required this.song});

  @override
  State<LearningScreen> createState() => _LearningScreenState();
}

class _LearningScreenState extends State<LearningScreen> {
  bool _isLoading = true;
  String? _error;

  List<LyricLine> _lines = [];
  List<LineAnalysis> _analyses = [];
  int _currentLineIndex = 0;
  bool _isPlaying = false;
  double _playbackSpeed = 1.0;

  final AudioService _audioService = AudioService();
  bool _audioInitialized = false;

  @override
  void initState() {
    super.initState();
    _loadSongDetail();
  }

  @override
  void dispose() {
    _audioService.stop();
    super.dispose();
  }

  Future<void> _loadSongDetail() async {
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });

      final data = await ApiService.getSongDetail(widget.song.id);

      setState(() {
        _lines = data['lines'] as List<LyricLine>;
        _analyses = data['analyses'] as List<LineAnalysis>;
        _isLoading = false;
      });

      // 初始化音频
      if (widget.song.audioUrl != null && widget.song.audioUrl!.isNotEmpty) {
        await _initAudio();
      }
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _initAudio() async {
    try {
      // 构建完整的音频URL
      final audioUrl = '${ApiConfig.baseUrl.replaceAll('/api', '')}${widget.song.audioUrl}';
      print('Loading audio from: $audioUrl');

      await _audioService.initAudio(audioUrl);

      setState(() {
        _audioInitialized = true;
      });

      // 监听播放状态
      _audioService.onPlayerStateChanged.listen((state) {
        if (mounted) {
          setState(() {
            _isPlaying = state.toString().contains('playing');
          });
        }
      });

      // 监听播放进度，自动跳转到对应歌词
      _audioService.onPositionChanged.listen((position) {
        if (mounted) {
          _updateCurrentLineFromPosition(position);
        }
      });
    } catch (e) {
      print('Audio init error: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('音频加载失败: $e')),
        );
      }
    }
  }

  void _updateCurrentLineFromPosition(Duration position) {
    final positionMs = position.inMilliseconds;

    for (int i = 0; i < _lines.length; i++) {
      final currentLine = _lines[i];
      final nextLine = i < _lines.length - 1 ? _lines[i + 1] : null;

      if (positionMs >= currentLine.startTimeMs &&
          (nextLine == null || positionMs < nextLine.startTimeMs)) {
        if (_currentLineIndex != i) {
          setState(() {
            _currentLineIndex = i;
          });
        }
        break;
      }
    }
  }

  List<LineAnalysis> _getAnalysesForCurrentLine() {
    if (_currentLineIndex >= _lines.length) return [];
    final currentLine = _lines[_currentLineIndex];
    return _analyses.where((a) => a.lineId == currentLine.id).toList();
  }

  void _previousLine() {
    if (_currentLineIndex > 0) {
      setState(() => _currentLineIndex--);
      _seekToCurrentLine();
    }
  }

  void _nextLine() {
    if (_currentLineIndex < _lines.length - 1) {
      setState(() => _currentLineIndex++);
      _seekToCurrentLine();
    }
  }

  Future<void> _seekToCurrentLine() async {
    if (!_audioInitialized || _currentLineIndex >= _lines.length) return;

    final currentLine = _lines[_currentLineIndex];
    final position = Duration(milliseconds: currentLine.startTimeMs);
    await _audioService.playFromPosition(position);
    setState(() => _isPlaying = true);
  }

  Future<void> _togglePlayback() async {
    if (!_audioInitialized) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('音频未加载')),
      );
      return;
    }

    await _audioService.togglePlayPause();
    setState(() => _isPlaying = !_isPlaying);
  }

  Future<void> _toggleSpeed() async {
    final newSpeed = _playbackSpeed == 1.0 ? 0.75 : 1.0;
    await _audioService.setPlaybackSpeed(newSpeed);
    setState(() => _playbackSpeed = newSpeed);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.song.title,
              style: const TextStyle(fontSize: 18),
            ),
            Text(
              widget.song.artist,
              style: TextStyle(
                fontSize: 12,
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite_border),
            onPressed: () {
              // TODO: 收藏功能
            },
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            Text(_error!),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadSongDetail,
              child: const Text('重试'),
            ),
          ],
        ),
      );
    }

    if (_lines.isEmpty) {
      return const Center(child: Text('暂无歌词'));
    }

    final currentLine = _lines[_currentLineIndex];
    final analyses = _getAnalysesForCurrentLine();

    return Column(
      children: [
        // 进度条
        LinearProgressIndicator(
          value: (_currentLineIndex + 1) / _lines.length,
          backgroundColor: Theme.of(context).colorScheme.surfaceVariant,
        ),

        // 歌词显示区
        Expanded(
          flex: 2,
          child: LyricDisplay(
            currentLine: currentLine,
            previousLine: _currentLineIndex > 0 ? _lines[_currentLineIndex - 1] : null,
            nextLine: _currentLineIndex < _lines.length - 1 ? _lines[_currentLineIndex + 1] : null,
            onTap: _togglePlayback,
          ),
        ),

        // 音频控制条
        AudioControls(
          isPlaying: _isPlaying,
          playbackSpeed: _playbackSpeed,
          currentLine: _currentLineIndex + 1,
          totalLines: _lines.length,
          onPlayPause: _togglePlayback,
          onSpeedToggle: _toggleSpeed,
          onPrevious: _previousLine,
          onNext: _nextLine,
        ),

        // 语言分析区
        Expanded(
          flex: 3,
          child: AnalysisSection(
            analyses: analyses,
            currentLineText: currentLine.text,
          ),
        ),
      ],
    );
  }
}
