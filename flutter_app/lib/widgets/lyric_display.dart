import 'package:flutter/material.dart';
import '../models/lyric_line.dart';

class LyricDisplay extends StatelessWidget {
  final LyricLine currentLine;
  final LyricLine? previousLine;
  final LyricLine? nextLine;
  final VoidCallback onTap;

  const LyricDisplay({
    super.key,
    required this.currentLine,
    this.previousLine,
    this.nextLine,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      color: Theme.of(context).colorScheme.surface,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // 上一句（淡化显示）
          if (previousLine != null)
            Text(
              previousLine!.text,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant.withOpacity(0.5),
                  ),
              textAlign: TextAlign.center,
            ),

          const SizedBox(height: 16),

          // 当前句（高亮显示，可点击播放）
          InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primaryContainer.withOpacity(0.3),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Theme.of(context).colorScheme.primary,
                  width: 2,
                ),
              ),
              child: Column(
                children: [
                  Text(
                    currentLine.text,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Theme.of(context).colorScheme.onSurface,
                          height: 1.5,
                        ),
                    textAlign: TextAlign.center,
                  ),
                  if (currentLine.translation != null) ...[
                    const SizedBox(height: 12),
                    Text(
                      currentLine.translation!,
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // 下一句（淡化显示）
          if (nextLine != null)
            Text(
              nextLine!.text,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant.withOpacity(0.5),
                  ),
              textAlign: TextAlign.center,
            ),

          const SizedBox(height: 24),

          // 提示文字
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.touch_app,
                size: 16,
                color: Theme.of(context).colorScheme.primary,
              ),
              const SizedBox(width: 8),
              Text(
                '点击播放这一句',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.primary,
                    ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
