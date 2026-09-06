# MUSE - 音乐学语言App (v2.0)

## 🎯 架构概述

### 技术栈
- **前端**: Flutter 3.24.3 (Dart)
- **后端**: Node.js 24.x + Express.js
- **数据库**: SQLite (Node.js内置)
- **API**: RESTful API

### 项目结构
```
音乐学语言app/
├── backend/                  # Node.js后端
│   ├── src/
│   │   ├── server.js        # Express API服务器
│   │   └── seed.js          # 数据库初始化脚本
│   ├── data/
│   │   └── muse.db          # SQLite数据库
│   ├── assets/              # 音频和歌词资源
│   └── package.json
│
├── flutter_app/             # Flutter移动应用
│   ├── lib/
│   │   ├── main.dart
│   │   ├── models/          # 数据模型
│   │   ├── services/        # API调用服务
│   │   ├── screens/         # 页面组件
│   │   ├── widgets/         # UI组件
│   │   └── providers/       # 状态管理
│   ├── assets/
│   └── pubspec.yaml
│
└── database/                # 数据库Schema文档
```

## 📊 数据库设计

### songs (歌曲表)
```sql
CREATE TABLE songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  level TEXT,                      -- 难度等级 (A1, A2, B1, B2, C1, C2)
  art TEXT,                        -- 封面主题色
  audio_url TEXT,
  lyric_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### lyric_lines (歌词行表)
```sql
CREATE TABLE lyric_lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  song_id INTEGER NOT NULL,
  line_index INTEGER NOT NULL,
  start_time_ms INTEGER NOT NULL,   -- 开始时间(毫秒)
  text TEXT NOT NULL,                -- 原文
  translation TEXT,                  -- 中文翻译
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  UNIQUE(song_id, line_index)
);
```

### line_analysis (语言学习分析表)
```sql
CREATE TABLE line_analysis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  line_id INTEGER NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('word', 'grammar', 'expression')),
  term TEXT NOT NULL,                -- 词汇/语法点/表达
  meaning TEXT NOT NULL,             -- 含义
  note TEXT,                         -- 用法说明
  audio_url TEXT,                    -- 发音音频URL
  FOREIGN KEY (line_id) REFERENCES lyric_lines(id) ON DELETE CASCADE,
  UNIQUE(line_id, kind, term)
);
```

### daily_learning (学习记录表)
```sql
CREATE TABLE daily_learning (
  study_date TEXT PRIMARY KEY,
  minutes INTEGER NOT NULL DEFAULT 0,
  songs_completed INTEGER NOT NULL DEFAULT 0,
  lines_completed INTEGER NOT NULL DEFAULT 0
);
```

## 🔌 API接口

### 基础URL
```
http://localhost:3000/api
```

### 端点列表

#### 1. 获取所有歌曲
```http
GET /api/songs
```
Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "REALLY REALLY",
      "artist": "WINNER",
      "album": "EVERYD4Y",
      "level": "B1",
      "art": "yellow",
      "audio_url": "/assets/winner-really-really.mp3",
      "duration_seconds": 204
    }
  ]
}
```

#### 2. 获取歌曲详情
```http
GET /api/songs/:id
```
Response:
```json
{
  "success": true,
  "data": {
    "song": { /* song object */ },
    "lines": [
      {
        "id": 1,
        "song_id": 1,
        "line_index": 0,
        "start_time_ms": 5000,
        "text": "어디야 집이야",
        "translation": "你在哪儿？在家吗？"
      }
    ],
    "analyses": [
      {
        "id": 1,
        "line_id": 1,
        "kind": "word",
        "term": "어디야",
        "meaning": "在哪里",
        "note": "어디야? · 你在哪儿？"
      }
    ]
  }
}
```

#### 3. 获取学习日历
```http
GET /api/calendar
```

#### 4. 更新学习记录
```http
POST /api/calendar
Content-Type: application/json

{
  "study_date": "2026-09-06",
  "minutes": 15,
  "songs_completed": 1,
  "lines_completed": 5
}
```

#### 5. 获取首页数据
```http
GET /api/home
```

## 📱 Flutter应用架构

### 目录结构
```
lib/
├── main.dart                 # 应用入口
├── models/                   # 数据模型
│   ├── song.dart
│   ├── lyric_line.dart
│   └── learning_record.dart
├── services/                 # API服务
│   └── api_service.dart
├── providers/                # 状态管理 (Provider)
│   ├── song_provider.dart
│   └── learning_provider.dart
├── screens/                  # 页面
│   ├── home_screen.dart
│   ├── learning_screen.dart
│   ├── calendar_screen.dart
│   └── onboarding_screen.dart
└── widgets/                  # 可复用组件
    ├── song_card.dart
    ├── lyric_display.dart
    ├── word_analysis_card.dart
    └── progress_bar.dart
```

### 依赖包
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0              # HTTP请求
  provider: ^6.1.1          # 状态管理
  audioplayers: ^5.2.1      # 音频播放
  shared_preferences: ^2.2.2 # 本地存储
```

## 🚀 开发流程

### 1. 后端启动
```bash
cd backend
npm install
npm run seed      # 初始化数据库
npm start         # 启动API服务器 (http://localhost:3000)
```

### 2. Flutter开发
```bash
cd flutter_app
flutter pub get
flutter run       # 启动模拟器或连接真机
```

## 🎨 核心功能

### 学习模式
1. **歌曲列表** - 浏览可学习的歌曲
2. **逐句学习** - 同步歌词显示
3. **词汇标注** - 点击词汇查看解释
4. **单句循环** - 重复播放当前句子
5. **变速播放** - 0.75x / 1.0x切换

### 学习记录
- 每日学习时长
- 完成歌曲数
- 掌握句子数
- 日历热力图

## 🔄 数据流

```
Flutter App
    ↓ HTTP请求
Express API Server
    ↓ SQL查询
SQLite Database
    ↓ 返回数据
Express API Server
    ↓ JSON响应
Flutter App (更新UI)
```

## 📝 下一步开发计划

- [x] 后端API实现
- [x] 数据库Schema设计
- [x] 示例数据填充
- [ ] Flutter项目初始化
- [ ] API Service封装
- [ ] 首页UI实现
- [ ] 学习页面实现
- [ ] 音频播放器集成
- [ ] 日历页面实现
- [ ] 离线数据缓存

## 技术决策说明

### 为什么选择Flutter而不是继续Web？
1. **更好的移动体验** - 原生性能和手势
2. **跨平台支持** - iOS + Android一套代码
3. **丰富的音频库** - audioplayers等成熟方案
4. **独立打包** - 可发布到应用商店

### 为什么后端继续用Node.js而不是Spring Boot？
1. **快速迭代** - 无需安装JDK和配置Java环境
2. **轻量级** - 音乐学习app不需要重量级企业框架
3. **统一生态** - JavaScript/Dart都是现代语言
4. **SQLite原生支持** - Node.js 22.5+内置SQLite模块
