# 部署与打包指南

## 前置条件

- Node.js ≥ 18
- npm ≥ 9
- Windows 10/11（透明窗口 + 吸附功能仅限 Windows）

macOS/Linux 可运行但吸附功能不可用（依赖 PowerShell + Win32 API）。

## 开发模式

```bash
cd E:\claude-pet
npm install
npm start
```

## 打包为独立 exe

### 便携版

```bash
npm run build
```

输出：`dist/ClaudePet.exe`（约 71MB）

- 单文件，拷贝即用
- 不写注册表，不创建快捷方式

### 安装版

```bash
npm run build:installer
```

输出：`dist/Claude Pet Setup x.x.x.exe`，标准安装向导。

## 配置文件

| 文件 | 路径 |
|---|---|
| 状态文件 | `%USERPROFILE%\.claude-pet\status.json` |
| 用户配置 | `%USERPROFILE%\.claude-pet\config.json` |
| MP3 语音包 | `E:\claude-pet\sounds\`（34 个文件，详见 README.txt） |
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

## 自定义语音

把 MP3 放到 `sounds/` 目录，文件名对应场景即可自动播放。文件不存在则降级用系统 TTS。

完整清单见 `sounds/README.txt`，共 34 个场景覆盖。

## 自定义角色

在 `characters.js` 中添加：

```js
CHARACTERS.myPet = {
  name: "我的宠物",
  emoji: "🐲",
  svg: `<svg viewBox="0 0 120 130">...</svg>`,
  css: `.state-idle #my-element { animation: myAnim 2s infinite; } @keyframes myAnim { ... }`,
};
```

SVG viewBox 建议 `0 0 120 130`。元素 ID 命名规范 `c-eyeL`、`c-pupL` 等以便动画系统定位。

## 开机自启动

### 启动文件夹

`Win + R` → `shell:startup` → 放入 `ClaudePet.exe` 快捷方式

### 任务计划程序

创建任务 → 触发器：登录时 → 操作：启动 `ClaudePet.exe`

## 卸载

1. 删除 `E:\claude-pet` 目录
2. 删除 `%USERPROFILE%\.claude-pet` 目录
3. 从 `~/.claude/settings.json` 中移除 hooks 配置

## 版本历史

| 版本 | 内容 |
|---|---|
| v1.4 | 5 个新角色 (熊猫/企鹅/狐狸/青蛙/小猪)、34 个 MP3 语音包、TTS 兜底、清理 |
| v1.3 | 番茄钟、原生右键菜单、setBounds 修复窗口扩大、90% 缩放 |
| v1.2 | 9 角色、窗口吸附、托盘图标、拖拽修复、气泡位置绑定 |
| v1.1 | 5 套主题、眨眼/哈欠/伸懒腰 |
| v1.0 | 基础 CSS 宠物、Claude Code Hooks 联动 |
