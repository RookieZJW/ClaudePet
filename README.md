# 🐱 Claude Pet — 桌面宠物

实时反映 **Claude Code 状态** 的桌面宠物。14 个角色，番茄钟，窗口吸附，MP3 语音包，自动静音。

## 快速开始

```bash
cd E:\claude-pet
npm install
npm start
```

## 打包

```bash
npm run build          # ClaudePet.exe (72MB, 便携版)
npm run build:installer # 安装版
```

## 联动 Claude Code

合并到 `~/.claude/settings.json`：

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

## 角色 (14 个)

🍡 小麻薯(默认) | 🐱 小橘猫 | 🐶 小柯基 | 🐰 小白兔 | 🦆 小黄鸭 | 🦢 小天鹅 | 🐴 小棕马 | 🐼 小熊猫 | 🐧 小企鹅 | 🦊 小狐狸 | 🐸 小青蛙 | 🐷 小猪猪 | 🦸 钢铁侠 | 💜 灭霸

右键切换角色，⭐ 设为默认。

## 操作

| 操作 | 效果 |
|---|---|
| 拖拽 | 移动 |
| 单击 | 互动气泡 |
| 右键 | 角色/主题/番茄钟/语音/穿透/吸附 |

## 功能

| 功能 | 说明 |
|---|---|
| 🍅 番茄钟 | 25min 专注 / 5min 休息 / 15min 长休，自动循环 |
| 🧲 窗口吸附 | 自动贴到活跃窗口边缘 |
| 👆 穿透模式 | 不挡桌面操作 |
| 🔊 MP3 语音 | `sounds/` 目录放 MP3 即可，TTS 兜底 |
| 🔇 自动静音 | 5 分钟无操作自动静音，有活动自动唤醒 |

## 语音包

34 个 MP3 文件覆盖全部场景，详见 `sounds/README.txt`。

## 项目结构

```
claude-pet/
├── main.js / preload.js / pet.html    # Electron 三层
├── characters.js                      # 14 个角色
├── update-status.js                   # Hooks 桥接
├── get-active-window.ps1              # 窗口吸附
├── sounds/                            # MP3 语音包
├── assets/                            # 图标
└── package.json
```

## 配置

`%USERPROFILE%\.claude-pet\config.json`

## 卸载

删除项目目录 + `~/.claude-pet` + settings.json 中 hooks。
