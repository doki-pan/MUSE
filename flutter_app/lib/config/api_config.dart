class ApiConfig {
  // 开发环境 - 本地后端
  static const String baseUrl = 'http://localhost:3000/api';

  // Android模拟器访问本机
  // static const String baseUrl = 'http://10.0.2.2:3000/api';

  // iOS模拟器访问本机
  // static const String baseUrl = 'http://localhost:3000/api';

  // 真机测试 (替换为你的本机IP地址)
  // static const String baseUrl = 'http://192.168.1.100:3000/api';

  // API端点
  static const String songs = '/songs';
  static const String home = '/home';
  static const String calendar = '/calendar';

  static String songDetail(int id) => '/songs/$id';
}
