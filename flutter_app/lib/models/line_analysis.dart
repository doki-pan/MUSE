class LineAnalysis {
  final int id;
  final int lineId;
  final String kind; // 'word', 'grammar', 'expression'
  final String term;
  final String meaning;
  final String? note;
  final String? audioUrl;

  LineAnalysis({
    required this.id,
    required this.lineId,
    required this.kind,
    required this.term,
    required this.meaning,
    this.note,
    this.audioUrl,
  });

  factory LineAnalysis.fromJson(Map<String, dynamic> json) {
    return LineAnalysis(
      id: json['id'] as int,
      lineId: json['line_id'] as int,
      kind: json['kind'] as String,
      term: json['term'] as String,
      meaning: json['meaning'] as String,
      note: json['note'] as String?,
      audioUrl: json['audio_url'] as String?,
    );
  }

  bool get isWord => kind == 'word';
  bool get isGrammar => kind == 'grammar';
  bool get isExpression => kind == 'expression';
}
