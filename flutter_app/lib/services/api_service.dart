import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/song.dart';
import '../models/lyric_line.dart';
import '../models/line_analysis.dart';

class ApiService {
  // 获取所有歌曲
  static Future<List<Song>> getSongs() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.songs}'),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success'] == true) {
        final List songsJson = data['data'] as List;
        return songsJson.map((json) => Song.fromJson(json)).toList();
      }
      throw Exception('API returned success: false');
    }
    throw Exception('Failed to load songs: ${response.statusCode}');
  }

  // 获取歌曲详情
  static Future<Map<String, dynamic>> getSongDetail(int id) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.songDetail(id)}'),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success'] == true) {
        final songData = data['data'];
        return {
          'song': Song.fromJson(songData['song']),
          'lines': (songData['lines'] as List)
              .map((json) => LyricLine.fromJson(json))
              .toList(),
          'analyses': (songData['analyses'] as List)
              .map((json) => LineAnalysis.fromJson(json))
              .toList(),
        };
      }
      throw Exception('API returned success: false');
    }
    throw Exception('Failed to load song detail: ${response.statusCode}');
  }

  // 获取首页数据
  static Future<Map<String, dynamic>> getHomeData() async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.home}'),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success'] == true) {
        final homeData = data['data'];
        return {
          'songs': (homeData['songs'] as List)
              .map((json) => Song.fromJson(json))
              .toList(),
          'calendar': homeData['calendar'] as List,
        };
      }
      throw Exception('API returned success: false');
    }
    throw Exception('Failed to load home data: ${response.statusCode}');
  }

  // 更新学习记录
  static Future<void> updateLearningRecord({
    required String studyDate,
    int minutes = 0,
    int songsCompleted = 0,
    int linesCompleted = 0,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.calendar}'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'study_date': studyDate,
        'minutes': minutes,
        'songs_completed': songsCompleted,
        'lines_completed': linesCompleted,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to update learning record: ${response.statusCode}');
    }
  }
}
