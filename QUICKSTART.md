# MUSE - 快速启动指南

## 🚀 立即开始

### 前置条件
- ✅ Node.js 24.x 已安装
- ✅ Git 已配置
- 🚧 Flutter SDK 正在安装

### 1. 启动后端服务器

```bash
# 进入后端目录
cd backend

# 安装依赖 (首次)
npm install

# 初始化数据库 (首次)
npm run seed

# 启动服务器
npm start
```

服务器将运行在 `http://localhost:3000`

### 2. 测试API

打开浏览器或使用curl测试:

```bash
# 获取首页数据
curl http://localhost:3000/api/home

# 获取歌曲列表
curl http://localhost:3000/api/songs

# 获取特定歌曲详情
curl http://localhost:3000/api/songs/1
```

### 3. 开发Flutter应用 (SDK安装完成后)

```bash
# 配置Flutter环境变量
export PATH="$PATH:C:/Users/25032/develop/flutter/bin"

# 检查Flutter环境
flutter doctor

# 创建Flutter项目
cd flutter_app
flutter create .

# 获取依赖
flutter pub get

# 运行应用 (需要连接设备或启动模拟器)
flutter run
```

## 📁 项目结构

```
音乐学语言app/
├── backend/           # ✅ 后端已完成
│   ├── src/          # API服务器源码
│   ├── data/         # SQLite数据库
│   └── assets/       # 音频和歌词文件
│
└── flutter_app/      # 🚧 前端开发中
    ├── lib/          # Dart源码
    ├── assets/       # 资源文件
    └── pubspec.yaml  # 依赖配置
```

## 🔧 常用命令

### 后端
```bash
npm start          # 启动服务器
npm run dev        # 开发模式 (热重载)
npm run seed       # 重新初始化数据库
```

### Flutter (安装完成后)
```bash
flutter run                    # 运行应用
flutter run -d chrome          # 在Chrome中运行
flutter build apk              # 构建Android APK
flutter clean                  # 清理构建缓存
```

## 🌐 API端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/home` | GET | 首页数据(歌曲+日历) |
| `/api/songs` | GET | 所有歌曲列表 |
| `/api/songs/:id` | GET | 歌曲详情 |
| `/api/calendar` | GET | 学习日历 |
| `/api/calendar` | POST | 更新学习记录 |

## 📱 设备配置

### Android模拟器
修改 `lib/config/api_config.dart`:
```dart
static const String baseUrl = 'http://10.0.2.2:3000/api';
```

### iOS模拟器
```dart
static const String baseUrl = 'http://localhost:3000/api';
```

### 真机测试
```dart
static const String baseUrl = 'http://你的IP:3000/api';
```

## 🐛 问题排查

### 后端无法启动
```bash
# 检查端口占用
netstat -ano | findstr :3000

# 杀死进程
taskkill /PID <进程ID> /F
```

### Flutter命令无法识别
```bash
# 检查PATH环境变量
echo $PATH

# 手动添加Flutter到PATH
export PATH="$PATH:C:/Users/25032/develop/flutter/bin"
```

### 数据库损坏
```bash
# 删除旧数据库
rm backend/data/muse.db

# 重新初始化
cd backend
npm run seed
```

## 📚 文档

- [完整架构文档](./ARCHITECTURE_NEW.md)
- [重构总结](./REFACTORING_SUMMARY.md)
- [Flutter开发指南](./flutter_app/README.md)

## ✅ 已完成
- [x] 后端API实现
- [x] 数据库设计
- [x] 示例数据导入
- [x] API测试通过
- [x] 文档完善
- [x] Git版本控制

## 🚧 进行中
- [ ] Flutter SDK安装
- [ ] Flutter项目初始化
- [ ] UI实现
- [ ] 音频播放集成

## 下一步
1. 等待Flutter SDK下载完成
2. 解压并配置环境变量
3. 运行 `flutter doctor`
4. 初始化Flutter项目
5. 开始UI开发

---

**当前状态**: 后端运行中，Flutter SDK下载中（~35%完成）

**预计完成时间**: 1-2周
