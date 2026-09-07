class LyricLine {
  final int id;
  final int songId;
  final int lineIndex;
  final int startTimeMs;
  final String text;
  final String? translation;

  LyricLine({
    required this.id,
    required this.songId,
    required this.lineIndex,
    required this.startTimeMs,
    required this.text,
    this.translation,
  });

  factory LyricLine.fromJson(Map<String, dynamic> json) {
    return LyricLine(
      id: json['id'] as int,
      songId: json['song_id'] as int,
      lineIndex: json['line_index'] as int,
      startTimeMs: json['start_time_ms'] as int,
      text: json['text'] as String,
      translation: json['translation'] as String?,
    );
  }

  double get startTimeSeconds => startTimeMs / 1000.0;
}
