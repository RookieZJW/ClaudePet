# 🐱 Claude Pet — 桌面宠物

实时反映 **Claude Code 状态** 的桌面宠物。当 Claude 思考、调用工具、等待确认或空闲时，宠物会切换不同的动画和表情。

## 效果预览

| Claude Code 状态 | 宠物表现 |
|---|---|
| 启动 (SessionStart) | ✨ 弹入动画 + 粒子特效 |
| 收到消息 (UserPromptSubmit) | 🤔 思考动画 — 眼睛上翻、天线抖动 |
| 调用工具 (PreToolUse) | 🔧 工具动画 — 身体震动、手臂举起、显示工具图标 |
| 处理中 (PostToolUse) | ⚙️ 天线转圈、身体脉冲 |
| 等待确认 (PermissionRequest) | 🙋 大眼睛 + 问号 |
| 空闲 (Stop) | 😴 呼吸动画 + 随机气泡吐槽 |
| 退出 (SessionEnd) | 👋 缩小淡出 |
| 子任务 (SubagentStart/Stop) | 🚀 分身特效 |
| 压缩上下文 (PreCompact) | 🧹 压缩动画 |

## 9 个角色

| 角色 | 风格 | 特殊能力 |
|---|---|---|
| 🍡 **小麻薯** (默认) | CSS 精绘 + 5 套主题换色 | 呼吸动画、天线脉冲、双高光眼睛 |
| 🐱 **小橘猫** | SVG — 三角耳 + 条纹尾巴 | 尾巴摇摆、耳朵摆动、胡须抽动 |
| 🐶 **小柯基** | SVG — 大立耳 + 吐舌头 | 尾巴高速摇、耳朵弹动、舌头喘气 |
| 🐰 **小白兔** | SVG — 长耳朵 + 粉鼻 | 长耳朵交替摆动、胡须 |
| 🦆 **小黄鸭** | SVG — 扁喙 + 蹼足 | 翅膀拍打、喙部开合 |
| 🦢 **小天鹅** | SVG — S 形颈 + 纯白 | 脖颈优雅摆动、翅膀微展 |
| 🐴 **小棕马** | SVG — 鬃毛 + 大眼 | 鬃毛飘动、尾巴甩 |
| 🦸 **钢铁侠** | SVG — 红金盔甲 | 方舟反应堆脉动、脉冲炮开火 |
| 💜 **灭霸** | SVG — 紫金配色 | 无限宝石闪光、霸气微笑 |

## 快速开始

```bash
# 1. 进入项目
cd E:\claude-pet

# 2. 安装依赖
npm install

# 3. 启动宠物
npm start
```

宠物出现在屏幕右下角，**透明置顶**，可拖拽移动。

## 关联 Claude Code

让宠物实时响应 Claude Code 的状态：

### 1. 打开设置文件

```
~/.claude/settings.json
```

（即 `C:\Users\你的用户名\.claude\settings.json`）

### 2. 添加 hooks

将以下 `hooks` 字段**合并**到 settings.json 中（不要把原有配置删掉）：

```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "node \"E:/claude-pet/update-status.js\" session_start",
        "timeout": 5000
      }]
    }],
    "UserPromptSubmit": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "node \"E:/claude-pet/update-status.js\" thinking",
        "timeout": 5000
      }]
    }],
    "PreToolUse": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "node \"E:/claude-pet/update-status.js\" tool_use",
        "timeout": 5000
      }]
    }],
    "PostToolUse": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "node \"E:/claude-pet/update-status.js\" processing",
        "timeout": 5000
      }]
    }],
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "node \"E:/claude-pet/update-status.js\" idle",
        "timeout": 5000
      }]
    }],
    "SessionEnd": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "node \"E:/claude-pet/update-status.js\" session_end",
        "timeout": 5000
      }]
    }],
    "PermissionRequest": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "node \"E:/claude-pet/update-status.js\" waiting_permission",
        "timeout": 5000
      }]
    }],
    "PreCompact": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "node \"E:/claude-pet/update-status.js\" compacting",
        "timeout": 5000
      }]
    }],
    "SubagentStart": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "node \"E:/claude-pet/update-status.js\" subagent_start",
        "timeout": 5000
      }]
    }],
    "SubagentStop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "node \"E:/claude-pet/update-status.js\" processing",
        "timeout": 5000
      }]
    }]
  }
}
```

> ⚠️ **路径**：如果你的项目不在 `E:\claude-pet`，把路径改成实际位置。Windows 上用正斜杠 `E:/xxx/update-status.js` 即可。

### 3. 重启 Claude Code

重新打开 Claude Code 终端，hooks 即生效。

## 操作指南

| 操作 | 效果 |
|---|---|
| **拖拽宠物身体** | 移动位置（系统级拖拽，丝滑） |
| **单击宠物** | 随机互动气泡 |
| **右键菜单** | 切换角色 / 穿透模式 / 吸附开关 / 隐藏 / 退出 |
| **右键 → 🎭 角色 → ⭐ 设为默认** | 下次启动默认显示此角色 |
| **任务栏托盘右键** | 穿透 / 吸附 / 主题(仅麻薯) / 重置 / 退出 |

## 穿透模式

- **默认关闭** — 宠物可拖拽交互
- **右键 → 开启穿透** — 宠物半透明，点击直接穿透到桌面（不挡图标）
- 托盘菜单可随时切换

## 窗口吸附

宠物自动检测前台窗口，靠近时吸附到窗口边缘（顶部/底部/左侧/右侧）。窗口关闭后宠物回到原位。

- 右键可开关
- 吸附距离约 80px

## 主题（仅限 🍡 麻薯）

麻薯角色支持 5 套配色，通过托盘右键菜单切换：

| 主题 | 配色 |
|---|---|
| 🟠 暖橙 | 经典暖色调 |
| 🔵 冰蓝 | 清爽冷色调 |
| 🌸 樱花 | 粉嫩少女风 |
| 🌿 森林 | 自然绿色调 |
| 🌙 午夜 | 神秘紫色调 |

## 空闲动画

宠物空闲时会自动触发：

| 动画 | 触发间隔 |
|---|---|
| 😉 眨眼 | 每 3~9 秒 |
| 🙆 伸懒腰 | 每 18~43 秒 |
| 🥱 打哈欠 | 每 30~70 秒 |
| 💬 随机吐槽 | 每 ~25 秒 (30% 概率) |
| 🎉 开心扭动 | 从其他状态回到空闲时 |

## 工作原理

```
Claude Code hooks 触发
    │
    ▼
node update-status.js <status> [tool_name]
    │
    ▼
写入 ~/.claude-pet/status.json (原子写入)
    │
    ▼
Electron 主进程每 400ms 轮询
    │
    ▼
检测到变化 → IPC 推送渲染进程
    │
    ▼
渲染进程切换 CSS 动画状态 + 特效
```

## 项目结构

```
claude-pet/
├── package.json            # 项目配置 + electron-builder 打包
├── main.js                 # Electron 主进程 (窗口/托盘/吸附/轮询/IPC)
├── preload.js              # 安全 IPC 桥接 (contextBridge)
├── pet.html                # 宠物 UI (HTML + CSS 主题 + 动画 + 交互逻辑)
├── characters.js           # 9 个角色库 (SVG/HTML + 专属 CSS 动画)
├── update-status.js        # CLI 桥接脚本 (hooks 调用)
├── get-active-window.ps1   # PowerShell 辅助 (获取前台窗口位置)
├── hooks-config.json       # 参考 hooks 配置
├── .npmrc                  # npm 国内镜像加速
├── README.md               # 本文件
└── deploy.md               # 部署与打包指南
```

## 技术栈

| 层 | 技术 |
|---|---|
| 桌面框架 | Electron (透明置顶窗口) |
| 角色渲染 | SVG (8个角色) + CSS Art (麻薯) |
| 动画 | CSS Animations + SVG SMIL |
| 状态桥接 | Claude Code Hooks → 文件轮询 → IPC |
| 窗口吸附 | PowerShell + Win32 API |
| 打包 | electron-builder |

## 常见问题

**Q: 宠物拖拽不流畅？**
A: 关闭穿透模式（右键 → 关闭穿透），系统级拖拽保证丝滑。

**Q: 角色切换后没变化？**
A: 确保 `characters.js` 在 `pet.html` 同级目录且可读取。

**Q: hooks 不生效？**
A: 重启 Claude Code（hooks 只在启动时加载），确认 `update-status.js` 路径正确。

**Q: 窗口吸附不准？**
A: 吸附依赖 PowerShell 获取前台窗口，部分 UWP 应用可能无法正确获取。关闭吸附即可。

**Q: 怎么卸载？**
A: 删除 `E:\claude-pet` 目录，删除 `~/.claude-pet` 目录，移除 settings.json 中的 hooks 配置。
