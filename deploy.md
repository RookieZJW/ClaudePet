# 部署与打包指南

## 前置条件

- Node.js ≥ 18
- npm ≥ 9
- Windows 10/11（透明窗口 + 吸附功能仅限 Windows）

macOS/Linux 可运行但吸附功能不可用（依赖 PowerShell + Win32 API）。

---

## 开发模式

```bash
cd E:\claude-pet
npm install
npm start
```

宠物出现在屏幕右下角，按 `Ctrl+C` 退出。

---

## 打包为独立 exe

### 便携版（单文件，推荐分发）

```bash
npm run build
```

输出：`dist/ClaudePet.exe`

- 无需安装，双击运行
- 首次启动稍慢（解压），之后正常
- 不会写注册表，不会创建开始菜单快捷方式

### 安装版

```bash
npm run build:installer
```

输出：`dist/Claude Pet Setup x.x.x.exe`

- 标准 Windows 安装向导
- 创建桌面快捷方式和开始菜单
- 支持卸载

---

## 配置文件

打包后的 exe 使用以下路径：

| 文件 | 路径 |
|---|---|
| 状态文件 | `%USERPROFILE%\.claude-pet\status.json` |
| 用户配置 | `%USERPROFILE%\.claude-pet\config.json` |
| Claude Code 设置 | `%USERPROFILE%\.claude\settings.json` |

config.json 示例：

```json
{
  "theme": "warm",
  "character": "mochi",
  "defaultCharacter": "mochi",
  "snapEnabled": true
}
```

---

## 分发给其他人

### 方案 A：纯 exe（推荐）

1. 运行 `npm run build`
2. 把 `dist/ClaudePet.exe` 发给对方
3. 对方双击即可运行

**注意事项：**
- 对方也需要配 Claude Code hooks 才能联动
- 单独启动 exe 也可以当纯桌面宠物用（右键切换角色）
- exe 首次启动 Windows Defender 可能拦截（electron 打包的常见现象），点「更多信息 → 仍要运行」即可

### 方案 B：完整项目

1. 打包整个 `E:\claude-pet` 目录为 zip
2. 对方解压后运行 `npm install && npm start`
3. 适合开发者或有 Node.js 环境的用户

---

## 开机自启动

### 方法 1：Windows 启动文件夹

1. `Win + R` → 输入 `shell:startup` → 回车
2. 把 `ClaudePet.exe` (便携版) 的**快捷方式**放进去

### 方法 2：任务计划程序

1. 打开「任务计划程序」
2. 创建任务 → 触发器：登录时
3. 操作：启动程序 → 选择 `ClaudePet.exe`
4. 条件：取消「只有在计算机使用交流电源时才启动」

### 方法 3：注册表

```
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
```

新建字符串值，数据为 exe 完整路径。

---

## 在 macOS/Linux 上运行

### macOS

```bash
cd claude-pet
npm install
npm start
```

托盘图标正常显示。吸附功能不可用（会在日志中静默失败）。

### Linux (X11)

```bash
cd claude-pet
npm install
npm start
```

需要 `libgtk-3-0` 和 `libnotify4`。部分桌面环境（Wayland）的透明窗口可能有兼容性问题。

---

## 自定义角色

在 `characters.js` 中添加新条目：

```js
CHARACTERS.myPet = {
  name: "我的宠物",
  emoji: "🐲",
  // SVG 模式（推荐）：
  svg: `<svg viewBox="0 0 120 130">
    <!-- 你的 SVG 内容 -->
  </svg>`,
  css: `
    /* 角色专属 CSS 动画 */
    .state-idle #my-element { animation: myAnim 2s infinite; }
    @keyframes myAnim { ... }
  `,
  // 或者 HTML 模式（支持主题）：
  // themed: true,
  // html: `<div>你的 HTML</div>`,
};
```

注意：
- SVG viewBox 建议 `0 0 120 130`
- 眼睛元素 ID 建议命名 `c-eyeL`、`c-pupL` 等以便动画系统定位
- `themed: true` 的角色会应用主题 CSS 变量（`--body-1`、`--ear-1` 等）

---

## 更新日志

### v1.2 (当前)

- 9 个可切换角色 (1 HTML + 8 SVG)
- 角色专属动画
- 系统级拖拽 (丝滑)
- 窗口吸附 (PowerShell + Win32 API)
- 穿透模式
- 默认角色记忆
- 托盘图标 (橘猫脸)
- 麻薯主题换色 (5 套)

### v1.1

- 5 套配色主题
- 窗口吸附
- 眨眼/哈欠/伸懒腰

### v1.0

- 基础 CSS 宠物
- Claude Code Hooks 联动
- 拖拽/穿透/托盘
