import 'package:audioplayers/audioplayers.dart';

class AudioService {
  static final AudioService _instance = AudioService._internal();
  factory AudioService() => _instance;
  AudioService._internal();

  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _isPlaying = false;
  double _playbackSpeed = 1.0;

  bool get isPlaying => _isPlaying;
  double get playbackSpeed => _playbackSpeed;

  // 初始化音频
  Future<void> initAudio(String url) async {
    try {
      await _audioPlayer.setSource(UrlSource(url));
      await _audioPlayer.setReleaseMode(ReleaseMode.stop);
    } catch (e) {
      print('Audio init error: $e');
      throw Exception('音频加载失败');
    }
  }

  // 播放/暂停
  Future<void> togglePlayPause() async {
    try {
      if (_isPlaying) {
        await _audioPlayer.pause();
        _isPlaying = false;
      } else {
        await _audioPlayer.resume();
        _isPlaying = true;
      }
    } catch (e) {
      print('Play/Pause error: $e');
    }
  }

  // 播放指定位置
  Future<void> playFromPosition(Duration position) async {
    try {
      await _audioPlayer.seek(position);
      await _audioPlayer.resume();
      _isPlaying = true;
    } catch (e) {
      print('Seek error: $e');
    }
  }

  // 设置播放速度
  Future<void> setPlaybackSpeed(double speed) async {
    try {
      _playbackSpeed = speed;
      await _audioPlayer.setPlaybackRate(speed);
    } catch (e) {
      print('Speed error: $e');
    }
  }

  // 停止播放
  Future<void> stop() async {
    try {
      await _audioPlayer.stop();
      _isPlaying = false;
    } catch (e) {
      print('Stop error: $e');
    }
  }

  // 获取当前播放位置
  Future<Duration?> getCurrentPosition() async {
    return await _audioPlayer.getCurrentPosition();
  }

  // 获取音频时长
  Future<Duration?> getDuration() async {
    return await _audioPlayer.getDuration();
  }

  // 监听播放进度
  Stream<Duration> get onPositionChanged => _audioPlayer.onPositionChanged;

  // 监听播放状态
  Stream<PlayerState> get onPlayerStateChanged => _audioPlayer.onPlayerStateChanged;

  // 释放资源
  void dispose() {
    _audioPlayer.dispose();
  }
}
