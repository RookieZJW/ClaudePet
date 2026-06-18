# 🐱 Claude Pet — 桌面宠物

实时反映 **Claude Code 状态** 的桌面宠物。Claude 思考、调用工具、等待确认或空闲时，宠物切换动画和表情。

## 特性

- 🍡 **9 个角色** — 麻薯(默认)/橘猫/柯基/白兔/黄鸭/天鹅/棕马/钢铁侠/灭霸
- 🎨 **主题换色** — 麻薯支持 5 套配色
- 🍅 **番茄钟** — 25 分钟专注 / 5 分钟休息 / 长休，自动循环
- 🧲 **窗口吸附** — 自动贴到活跃窗口边缘
- 👆 **穿透模式** — 不挡桌面操作
- 💬 **对话气泡** — 状态提示 + 随机吐槽
- 🖱️ **拖拽移动** — 随意摆放
- 📊 **Claude Code 联动** — 10 个 hook 事件实时同步

## 快速开始

```bash
cd E:\claude-pet
npm install
npm start
```

宠物出现在屏幕右下角。

## 打包

```bash
npm run build          # 便携版 ClaudePet.exe (单文件, 71MB)
npm run build:installer # 安装版
```

## 联动 Claude Code

将以下 `hooks` 合并到 `~/.claude/settings.json`：

```json
{
  "hooks": {
    "SessionStart": [{ "matcher": "", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" session_start" }] }],
    "UserPromptSubmit": [{ "matcher": "", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" thinking" }] }],
    "PreToolUse": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" tool_use" }] }],
    "PostToolUse": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" processing" }] }],
    "Stop": [{ "matcher": "", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" idle" }] }],
    "SessionEnd": [{ "matcher": "", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" session_end" }] }],
    "PermissionRequest": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" waiting_permission" }] }],
    "PreCompact": [{ "matcher": "", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" compacting" }] }],
    "SubagentStart": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" subagent_start" }] }],
    "SubagentStop": [{ "matcher": "*", "hooks": [{ "type": "command", "command": "node \"E:/claude-pet/update-status.js\" processing" }] }]
  }
}
```

## 角色

| 角色 | 类型 | 特色 |
|---|---|---|
| 🍡 小麻薯 | CSS 精绘 | 5 套主题, 呼吸动画, 天线脉冲 |
| 🐱 小橘猫 | SVG | 尾巴摇摆, 耳朵摆动, 胡须 |
| 🐶 小柯基 | SVG | 大耳朵, 吐舌头, 尾巴高速摇 |
| 🐰 小白兔 | SVG | 长耳朵交替摆动, 圆尾巴 |
| 🦆 小黄鸭 | SVG | 翅膀拍打, 喙部开合 |
| 🦢 小天鹅 | SVG | S 形颈, 翅膀微展 |
| 🐴 小棕马 | SVG | 鬃毛飘动, 大眼 |
| 🦸 钢铁侠 | SVG | 方舟反应堆, 脉冲炮 |
| 💜 灭霸 | SVG | 无限宝石, 霸气微笑 |

## 操作

| 操作 | 效果 |
|---|---|
| 拖拽宠物 | 移动 |
| 单击 | 互动气泡 |
| 右键 | 原生菜单 (角色/主题/番茄钟/穿透/吸附) |
| 托盘右键 | 穿透/吸附/主题(麻薯)/重置/退出 |

## 状态联动

| Claude Code 事件 | 宠物表现 |
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
├── main.js              # Electron 主进程
├── preload.js           # IPC 桥接
├── pet.html             # 宠物 UI + CSS + 动画
├── characters.js        # 9 个角色定义 (SVG/CSS)
├── update-status.js     # Hooks 桥接脚本
├── get-active-window.ps1 # 吸附辅助
├── hooks-config.json    # 参考 hooks 配置
└── package.json         # 项目配置 + 打包
```

## 技术栈

Electron · SVG · CSS Animations · Claude Code Hooks · Win32 API

## 常见问题

**Q: 拖拽窗口会变大？**  
A: v1.3 已修复。根因是 `setPosition` 不锁尺寸，改用 `setBounds`。

**Q: Hooks 不生效？**  
A: 重启 Claude Code；确认 `update-status.js` 路径正确。

**Q: 怎么设为默认角色？**  
A: 右键 → ⭐ 设为默认。

**Q: 怎么卸载？**  
A: 删除项目目录 + `~/.claude-pet` 目录 + settings.json 中的 hooks。
