# MUSE Flutter App

音乐学语言移动应用 - 通过K-POP学习韩语

## 功能特性

### ✅ 已实现
- 歌曲列表展示
- 逐句歌词同步显示
- 词汇/语法/表达分析
- 单句循环播放
- 变速播放 (0.75x / 1.0x)
- 学习记录日历

### 🚧 开发中
- 音频播放集成
- 离线数据缓存
- 个人学习统计

## 技术栈

- **Flutter**: 3.24.3
- **Dart**: 3.5+
- **状态管理**: Provider
- **HTTP客户端**: http
- **音频播放**: audioplayers
- **本地存储**: shared_preferences

## 项目结构

```
lib/
├── main.dart                    # 应用入口
├── config/
│   └── api_config.dart         # API配置
├── models/                      # 数据模型
│   ├── song.dart
│   ├── lyric_line.dart
│   ├── line_analysis.dart
│   └── learning_record.dart
├── services/                    # 服务层
│   ├── api_service.dart        # API调用
│   └── audio_service.dart      # 音频控制
├── providers/                   # 状态管理
│   ├── song_provider.dart
│   ├── learning_provider.dart
│   └── audio_provider.dart
├── screens/                     # 页面
│   ├── splash_screen.dart
│   ├── onboarding_screen.dart
│   ├── home_screen.dart
│   ├── learning_screen.dart
│   └── calendar_screen.dart
├── widgets/                     # 组件
│   ├── song_card.dart
│   ├── lyric_display.dart
│   ├── word_chip.dart
│   ├── analysis_card.dart
│   ├── audio_controls.dart
│   └── calendar_heatmap.dart
└── utils/                       # 工具类
    ├── time_formatter.dart
    └── constants.dart
```

## 开始开发

### 前置要求
- Flutter SDK 3.24.3+
- Dart SDK 3.5+
- Android Studio / Xcode (用于模拟器)
- VS Code + Flutter插件 (推荐)

### 安装依赖
```bash
flutter pub get
```

### 运行应用
```bash
# 启动后端API服务器 (在backend目录)
cd ../backend
npm start

# 返回flutter_app目录并运行
cd ../flutter_app
flutter run
```

### 调试模式
```bash
flutter run --debug
```

### 发布构建
```bash
# Android
flutter build apk --release

# iOS (需要Mac)
flutter build ios --release
```

## API配置

编辑 `lib/config/api_config.dart`:

```dart
class ApiConfig {
  // 本地开发
  static const String baseUrl = 'http://localhost:3000/api';
  
  // Android模拟器访问本机
  // static const String baseUrl = 'http://10.0.2.2:3000/api';
  
  // 真机测试 (替换为你的IP)
  // static const String baseUrl = 'http://192.168.1.100:3000/api';
}
```

## 屏幕截图

*即将添加*

## 开发规范

### 命名约定
- **文件名**: `snake_case.dart`
- **类名**: `PascalCase`
- **变量/函数**: `camelCase`
- **常量**: `SCREAMING_SNAKE_CASE`

### 代码组织
1. 导入顺序: Dart SDK → Flutter → 第三方包 → 项目文件
2. 类成员顺序: 静态成员 → 实例变量 → 构造函数 → 方法
3. Widget构建: 小组件拆分，避免过深嵌套

### Git提交规范
```
feat: 新功能
fix: 修复bug
refactor: 重构
style: 样式调整
docs: 文档更新
test: 测试相关
chore: 构建/工具配置
```

## 常见问题

### Q: Android模拟器无法连接本地API
A: 使用 `http://10.0.2.2:3000` 而不是 `http://localhost:3000`

### Q: iOS真机无法播放音频
A: 检查 `Info.plist` 中的音频权限配置

### Q: 热重载后状态丢失
A: Provider状态不会保持，需要重新加载数据

## 许可证

MIT
