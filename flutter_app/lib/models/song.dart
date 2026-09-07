class Song {
  final int id;
  final String title;
  final String artist;
  final String? album;
  final String? level;
  final String? art;
  final String? audioUrl;
  final String? lyricUrl;
  final int durationSeconds;

  Song({
    required this.id,
    required this.title,
    required this.artist,
    this.album,
    this.level,
    this.art,
    this.audioUrl,
    this.lyricUrl,
    required this.durationSeconds,
  });

  factory Song.fromJson(Map<String, dynamic> json) {
    return Song(
      id: json['id'] as int,
      title: json['title'] as String,
      artist: json['artist'] as String,
      album: json['album'] as String?,
      level: json['level'] as String?,
      art: json['art'] as String?,
      audioUrl: json['audio_url'] as String?,
      lyricUrl: json['lyric_url'] as String?,
      durationSeconds: json['duration_seconds'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'artist': artist,
      'album': album,
      'level': level,
      'art': art,
      'audio_url': audioUrl,
      'lyric_url': lyricUrl,
      'duration_seconds': durationSeconds,
    };
  }
}
