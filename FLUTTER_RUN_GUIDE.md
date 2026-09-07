# Flutter应用运行指南

## ✅ 当前状态

- ✅ Flutter SDK 3.47.2 已安装
- ✅ Flutter项目已初始化
- ✅ 所有依赖包已下载（76个包）
- ⚠️ 需要启用Windows开发者模式

## 🚀 运行步骤

### 1. 启用Windows开发者模式

运行以下命令打开设置：
```bash
start ms-settings:developers
```

或手动操作：
1. 打开 **设置** → **更新和安全** → **开发者选项**
2. 选择 **开发人员模式**
3. 确认并重启系统（如需要）

### 2. 启动后端服务器

```bash
cd backend
npm start
```

后端将运行在 `http://localhost:3000`

### 3. 运行Flutter应用

在Android模拟器或设备上运行：
```bash
cd flutter_app
flutter run
```

或在Chrome浏览器中运行：
```bash
flutter run -d chrome
```

### 4. 修改API配置（如需要）

编辑 `flutter_app/lib/config/api_config.dart`:

**Android模拟器**:
```dart
static const String baseUrl = 'http://10.0.2.2:3000/api';
```

**iOS模拟器**:
```dart
static const String baseUrl = 'http://localhost:3000/api';
```

**真机测试**:
```dart
static const String baseUrl = 'http://你的IP地址:3000/api';
```

## 📱 测试功能

应用启动后可以测试：
- ✅ 启动页动画
- ✅ 歌曲列表展示
- ✅ 从后端API获取数据
- ✅ Material Design 3主题
- ✅ 暗色模式支持

## 🔧 常用命令

```bash
# 查看可用设备
flutter devices

# 在特定设备运行
flutter run -d <device-id>

# 在Chrome运行
flutter run -d chrome

# 热重载
r (在运行时按r键)

# 完全重启
R (在运行时按R键)

# 查看日志
flutter logs

# 清理构建缓存
flutter clean
```

## 📦 已安装的依赖

- `http: ^1.6.0` - HTTP客户端
- `provider: ^6.1.5` - 状态管理
- `audioplayers: ^5.2.1` - 音频播放
- `shared_preferences: ^2.5.5` - 本地存储
- `cupertino_icons: ^1.0.9` - iOS风格图标

## 🎯 下一步开发

1. 实现LearningScreen页面
2. 集成音频播放功能
3. 实现歌词同步滚动
4. 添加词汇分析交互
5. 实现学习记录功能

## 📞 遇到问题？

### Flutter命令找不到
```bash
export PATH="$PATH:/c/Users/25032/develop/flutter/bin"
```

### 端口被占用
```bash
# Windows查找并杀死进程
netstat -ano | findstr :3000
taskkill /PID <进程ID> /F
```

### 依赖冲突
```bash
flutter pub get --offline
flutter pub upgrade
```

---

**准备就绪！启用开发者模式后即可运行应用** 🚀
