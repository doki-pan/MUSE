# MUSE - 音乐学语言 App

通过听歌学习韩语的 Web 应用

## 🚀 快速开始

### 方法 1: 使用启动脚本（推荐）

**Windows 用户:**
```bash
双击运行 start-server.bat
```

**Mac/Linux 用户:**
```bash
bash start-server.sh
```

然后在浏览器中打开: **http://127.0.0.1:4173**

### 方法 2: 手动启动

```bash
node server.js
```

然后在浏览器中打开: **http://127.0.0.1:4173**

## ⚠️ 重要提示

**不要直接双击打开 index.html 文件！**

必须通过 HTTP 服务器访问应用，否则会出现以下问题：
- ❌ 歌词无法加载
- ❌ 音频无法播放
- ❌ API 请求失败

## 📁 项目结构

```
音乐学语言app/
├── index.html           # 主页面
├── app.js              # 应用逻辑
├── styles.css          # 样式文件
├── server.js           # Node.js 服务器
├── muse.sqlite         # SQLite 数据库
├── package.json        # 项目配置
├── start-server.bat    # Windows 启动脚本
├── start-server.sh     # Mac/Linux 启动脚本
└── assets/
    ├── winner-really-really.mp3  # 音频文件
    └── winner-really-really.lrc  # 歌词文件
```

## 🎵 功能特性

- ✅ 实时歌词同步显示
- ✅ 单词、语法、表达解析
- ✅ 逐句播放和学习
- ✅ 速度调节（0.75x / 1.0x）
- ✅ 单词发音播放
- ✅ 学习进度跟踪
- ✅ 日历式学习记录

## 🔧 技术栈

- 前端: HTML5 + CSS3 + 原生 JavaScript
- 后端: Node.js + HTTP Server
- 数据库: SQLite (node:sqlite)
- 音频: Web Audio API

## 📝 歌词格式

LRC 文件使用标准格式:
```
[mm:ss.xx]歌词文本
```

示例:
```
[00:10.160]Really really really really
[00:19.210]어디야 집이야
```

## 🐛 故障排查

### 问题: 歌词不显示

**原因:** 直接打开了 HTML 文件（file:// 协议）

**解决:** 使用启动脚本或运行 `node server.js`，然后访问 http://127.0.0.1:4173

### 问题: 端口被占用

**解决:** 修改 `server.js` 中的端口号（默认 4173）

## 📄 License

本项目仅用于学习和个人使用
