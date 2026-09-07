# PowerShell执行策略问题修复指南

## 问题
```
npm : 无法加载文件 C:\nvm4w\nodejs\npm.ps1，因为在此系统上禁止运行脚本。
```

## 解决方案

### 方法1：修改执行策略（推荐）

1. **以管理员身份运行PowerShell**
   - 按 `Win + X`
   - 选择 "Windows PowerShell (管理员)" 或 "终端 (管理员)"

2. **执行以下命令**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **确认修改**
   - 输入 `Y` 并按回车

4. **验证**
   ```powershell
   Get-ExecutionPolicy
   ```
   应该显示 `RemoteSigned`

### 方法2：使用Git Bash（临时方案）

在Git Bash中运行npm命令：
```bash
cd backend
npm start
```

Git Bash不受PowerShell执行策略限制。

### 方法3：使用CMD（临时方案）

在命令提示符中运行：
```cmd
cd backend
npm start
```

## 执行策略说明

- **Restricted**: 默认设置，禁止所有脚本
- **RemoteSigned**: 允许本地脚本，远程脚本需签名（推荐）
- **Unrestricted**: 允许所有脚本（不推荐）

## 快速启动后端

使用Git Bash（最简单）：
```bash
cd "D:\programs\音乐学语言app\backend"
npm start
```

或修改执行策略后使用PowerShell：
```powershell
cd D:\programs\音乐学语言app\backend
npm start
```

## 验证后端运行

打开浏览器访问：
```
http://localhost:3000/api/home
```

应该看到JSON格式的数据。

---

**推荐使用Git Bash来运行npm命令，更简单稳定** ✅
