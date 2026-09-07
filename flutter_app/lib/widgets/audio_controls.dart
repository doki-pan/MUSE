import 'package:flutter/material.dart';

class AudioControls extends StatelessWidget {
  final bool isPlaying;
  final double playbackSpeed;
  final int currentLine;
  final int totalLines;
  final VoidCallback onPlayPause;
  final VoidCallback onSpeedToggle;
  final VoidCallback onPrevious;
  final VoidCallback onNext;

  const AudioControls({
    super.key,
    required this.isPlaying,
    required this.playbackSpeed,
    required this.currentLine,
    required this.totalLines,
    required this.onPlayPause,
    required this.onSpeedToggle,
    required this.onPrevious,
    required this.onNext,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // 句子计数器
          Text(
            '第 $currentLine / $totalLines 句',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
          ),
          const SizedBox(height: 12),

          // 控制按钮
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              // 变速按钮
              OutlinedButton(
                onPressed: onSpeedToggle,
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                ),
                child: Text('${playbackSpeed}x'),
              ),

              // 上一句
              IconButton(
                onPressed: currentLine > 1 ? onPrevious : null,
                icon: const Icon(Icons.skip_previous),
                iconSize: 32,
              ),

              // 播放/暂停（主按钮）
              Container(
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primary,
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  onPressed: onPlayPause,
                  icon: Icon(
                    isPlaying ? Icons.pause : Icons.play_arrow,
                    color: Theme.of(context).colorScheme.onPrimary,
                  ),
                  iconSize: 36,
                ),
              ),

              // 下一句
              IconButton(
                onPressed: currentLine < totalLines ? onNext : null,
                icon: const Icon(Icons.skip_next),
                iconSize: 32,
              ),

              // 单句循环
              IconButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('单句循环播放')),
                  );
                },
                icon: const Icon(Icons.repeat_one),
                iconSize: 28,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
