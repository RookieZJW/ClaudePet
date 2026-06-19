# 🐱 Claude Pet — 桌面宠物

实时反映 **Claude Code 状态** 的桌面宠物。14 个角色可选，支持番茄钟、窗口吸附、语音播报、MP3 自定义语音包。

## 快速开始

```bash
cd E:\claude-pet
npm install
npm start
```

宠物出现在屏幕右下角（90% 缩放，252×306）。

## 打包

```bash
npm run build          # 便携版 ClaudePet.exe
npm run build:installer # 安装版
```

## 联动 Claude Code

将以下 `hooks` 合并到 `~/.claude/settings.json`：

```json
{
  "hooks": {
    "SessionStart":       [{ "matcher": "", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" session_start" }] }],
    "UserPromptSubmit":   [{ "matcher": "", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" thinking" }] }],
    "PreToolUse":         [{ "matcher": "*", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" tool_use" }] }],
    "PostToolUse":        [{ "matcher": "*", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" processing" }] }],
    "Stop":               [{ "matcher": "", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" idle" }] }],
    "SessionEnd":         [{ "matcher": "", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" session_end" }] }],
    "PermissionRequest":  [{ "matcher": "*", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" waiting_permission" }] }],
    "PreCompact":         [{ "matcher": "", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" compacting" }] }],
    "SubagentStart":      [{ "matcher": "*", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" subagent_start" }] }],
    "SubagentStop":       [{ "matcher": "*", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" processing" }] }]
  }
}
```

重启 Claude Code 即生效。

## 角色 (14 个)

| 角色 | 类型 | 特色 |
|---|---|---|
| 🍡 小麻薯 (默认) | CSS 精绘 | 5 套主题换色 |
| 🐱 小橘猫 | SVG | 尾巴摇摆、耳朵摆动、胡须 |
| 🐶 小柯基 | SVG | 大耳朵、吐舌头、尾巴高速摇 |
| 🐰 小白兔 | SVG | 长耳朵交替摆动、圆尾巴 |
| 🦆 小黄鸭 | SVG | 翅膀拍打、喙部开合 |
| 🦢 小天鹅 | SVG | S 形颈、翅膀微展 |
| 🐴 小棕马 | SVG | 鬃毛飘动、大眼 |
| 🐼 小熊猫 | SVG | 黑眼圈、叼竹叶 |
| 🐧 小企鹅 | SVG | 橘喙开合、翅膀拍动 |
| 🦊 小狐狸 | SVG | 大尾巴摇摆、尖耳朵 |
| 🐸 小青蛙 | SVG | 凸眼 blink、长腿 |
| 🐷 小猪猪 | SVG | 卷尾巴、猪鼻孔 |
| 🦸 钢铁侠 | SVG | 方舟反应堆、脉冲炮 |
| 💜 灭霸 | SVG | 无限宝石、霸气微笑 |

右键菜单切换角色，⭐ 设为默认下次启动记住。

## 操作

| 操作 | 效果 |
|---|---|
| 拖拽宠物 | 移动位置 |
| 单击宠物 | 互动气泡 + 语音 |
| 右键菜单 | 角色 / 主题 / 番茄钟 / 语音 / 穿透 / 吸附 |
| 托盘右键 | 穿透 / 吸附 / 主题(仅麻薯) / 重置 / 退出 |

## 功能

### 🍅 番茄钟
右键 → 25 分钟专注 / 5 分钟休息 / 15 分钟长休。自动循环：每 4 轮专注后长休。倒计时显示在宠物脚下，最后 60 秒闪烁提醒。

### 🧲 窗口吸附
宠物自动贴到活跃窗口边缘。右键可开关。

### 👆 穿透模式
开启后点击穿透到桌面，不挡图标。开启时宠物变半透明。

### 🔊 语音播报
右键开关。支持 MP3 自定义语音包 — 把 MP3 放到 `sounds/` 目录即可，没有的自动降级 TTS。详见 `sounds/README.txt`。

### 🎨 主题 (仅麻薯)
托盘右键可切换 5 套配色：暖橙 / 冰蓝 / 樱花 / 森林 / 午夜。

## 状态联动

| Claude Code 事件 | 宠物 |
|---|---|
| SessionStart | ✨ 弹入 |
| UserPromptSubmit | 🤔 思考 |
| PreToolUse | 🔧 工具 |
| PostToolUse | ⚙️ 处理 |
| Stop | 😴 待机 |
| SessionEnd | 👋 淡出 |
| PermissionRequest | 🙋 等待 |
| PreCompact | 🧹 整理 |
| SubagentStart/Stop | 🚀 分身 |

## 项目结构

```
claude-pet/
├── main.js              # Electron 主进程 (窗口/托盘/吸附/番茄钟/IPC)
├── preload.js           # 安全 IPC 桥接
├── pet.html             # 宠物 UI (HTML + CSS + 动画 + 交互)
├── characters.js        # 14 个角色 (SVG/CSS + 专属动画)
├── update-status.js     # Claude Code Hooks 桥接脚本
├── get-active-window.ps1 # 窗口吸附 PowerShell 辅助
├── hooks-config.json    # 参考 hooks 配置
├── sounds/              # MP3 语音包目录
│   └── README.txt       # 语音文件清单 (34 个)
└── package.json
```

## 技术栈

Electron · SVG · CSS Animations · Claude Code Hooks · Web Speech API · Win32 API

## 配置存储

用户偏好保存在 `%USERPROFILE%\.claude-pet\config.json`：

```json
{
  "theme": "warm",
  "character": "mochi",
  "defaultCharacter": "mochi",
  "snapEnabled": true
}
```

## 常见问题

**Q: 拖拽或右键窗口会变大？**
A: v1.3 已修复，改用 `setBounds` 同时锁位置+尺寸。

**Q: Hooks 不生效？**
A: 重启 Claude Code（hooks 只在启动时加载），确认 `update-status.js` 路径正确。

**Q: 怎么卸载？**
A: 删除项目目录 + `~/.claude-pet` 目录 + settings.json 中的 hooks 配置。
