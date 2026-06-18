const {
  app, BrowserWindow, Tray, Menu, nativeImage,
  ipcMain, screen,
} = require("electron");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// ── 路径 ──────────────────────────────────────────
const STATUS_DIR = path.join(process.env.USERPROFILE || process.env.HOME, ".claude-pet");
const STATUS_FILE = path.join(STATUS_DIR, "status.json");
const CONFIG_FILE = path.join(STATUS_DIR, "config.json");
const PS_SCRIPT = path.join(__dirname, "get-active-window.ps1");

// ── 全局 ──────────────────────────────────────────
let mainWindow = null, tray = null;
let lastStatus = null, pollTimer = null, snapTimer = null;
let isPassthrough = false;
let snapEnabled = true;
let currentTheme = "warm";
let currentCharacter = "mochi";
let defaultCharacter = "mochi";
let snapTarget = null;        // 当前吸附目标窗口 rect
let petFreePos = null;        // 吸附前的自由位置

// ── 配置读写 ──────────────────────────────────────
function loadConfig() {
  try { if (fs.existsSync(CONFIG_FILE)) return JSON.parse(fs.readFileSync(CONFIG_FILE,"utf8")); }
  catch(e) {}
  return {};
}
function saveConfig(obj) {
  if (!fs.existsSync(STATUS_DIR)) fs.mkdirSync(STATUS_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(obj, null, 2));
}

// ── 状态文件 ──────────────────────────────────────
function ensureStatusDir() {
  if (!fs.existsSync(STATUS_DIR)) fs.mkdirSync(STATUS_DIR, { recursive: true });
}
function readStatus() {
  try {
    if (!fs.existsSync(STATUS_FILE)) return null;
    const raw = fs.readFileSync(STATUS_FILE, "utf8").trim();
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}

// ── 获取前台窗口位置 (异步, 绝不阻塞主进程) ────────
function getActiveWindowBounds() {
  return new Promise((resolve) => {
    exec(
      `powershell -NoProfile -ExecutionPolicy Bypass -File "${PS_SCRIPT}"`,
      { timeout: 3000, windowsHide: true },
      (err, stdout) => {
        if (err) { resolve(null); return; }
        try {
          const [l, t, r, b] = stdout.trim().split(",").map(Number);
          if (isNaN(l) || r - l <= 100 || b - t <= 100) { resolve(null); return; }
          resolve({ x: l, y: t, width: r - l, height: b - t });
        } catch(e) { resolve(null); }
      }
    );
  });
}

// ── 吸附逻辑 ──────────────────────────────────────
const SNAP_DISTANCE = 80;  // 吸附触发距离
const PET_W = 280, PET_H = 340;

function calcSnapPosition(petBounds, winBounds, scrBounds) {
  if (!winBounds || !scrBounds) return null;

  const petCX = petBounds.x + petBounds.width / 2;
  const petCY = petBounds.y + petBounds.height / 2;

  // 检测宠物与窗口各边的距离, 选最近的
  const edges = [
    { side: "top",    tx: petCX - PET_W/2, ty: winBounds.y - PET_H + 12, dist: Math.abs(petBounds.y + PET_H - winBounds.y) },
    { side: "bottom", tx: petCX - PET_W/2, ty: winBounds.y + winBounds.height - 12, dist: Math.abs(petBounds.y - (winBounds.y + winBounds.height)) },
    { side: "left",   tx: winBounds.x - PET_W + 12, ty: petCY - PET_H/2, dist: Math.abs(petBounds.x + PET_W - winBounds.x) },
    { side: "right",  tx: winBounds.x + winBounds.width - 12, ty: petCY - PET_H/2, dist: Math.abs(petBounds.x - (winBounds.x + winBounds.width)) },
  ];

  const nearest = edges.reduce((a, b) => a.dist < b.dist ? a : b);
  if (nearest.dist > SNAP_DISTANCE) return null;

  // 限制在屏幕内
  nearest.tx = Math.max(scrBounds.x, Math.min(scrBounds.x + scrBounds.width - PET_W, nearest.tx));
  nearest.ty = Math.max(scrBounds.y, Math.min(scrBounds.y + scrBounds.height - PET_H, nearest.ty));
  return nearest;
}

async function snapLoop() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (!snapEnabled) { snapTarget = null; return; }

  const winBounds = await getActiveWindowBounds();
  // 异步等待期间窗口可能已销毁
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const scrBounds = screen.getPrimaryDisplay().workArea;
  const petPos = mainWindow.getPosition();
  const petBounds = { x: petPos[0], y: petPos[1], width: PET_W, height: PET_H };

  const result = calcSnapPosition(petBounds, winBounds, scrBounds);

  if (result) {
    if (!snapTarget) petFreePos = { x: petPos[0], y: petPos[1] };
    snapTarget = winBounds;
    mainWindow.setPosition(Math.round(result.tx), Math.round(result.ty));
    mainWindow.webContents.send("snap-position", { side: result.side, active: true });
  } else if (snapTarget) {
    snapTarget = null;
    if (petFreePos) mainWindow.setPosition(petFreePos.x, petFreePos.y);
    mainWindow.webContents.send("snap-position", { side: null, active: false });
  }
}

// ── 创建窗口 ──────────────────────────────────────
function createPetWindow() {
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workArea;
  mainWindow = new BrowserWindow({
    width: PET_W, height: PET_H,
    x: sw - PET_W - 40, y: sh - PET_H - 40,
    transparent: true, frame: false, alwaysOnTop: true,
    resizable: false, skipTaskbar: true, hasShadow: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      backgroundThrottling: false,
      enablePreferredSizeMode: true,
    },
  });
  mainWindow.setIgnoreMouseEvents(false);
  mainWindow.loadFile("pet.html");
  mainWindow.on("closed", () => { mainWindow = null; });
}

// ── 轮询状态文件 ──────────────────────────────────
function startStatusPolling() {
  ensureStatusDir();
  if (!fs.existsSync(STATUS_FILE)) {
    fs.writeFileSync(STATUS_FILE, JSON.stringify({ status: "idle", tool: "", timestamp: new Date().toISOString() }));
  }
  pollTimer = setInterval(() => {
    const data = readStatus();
    if (!data) return;
    const cur = JSON.stringify(data);
    if (cur !== lastStatus) {
      lastStatus = cur;
      if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send("status-change", data);
    }
  }, 400);
}

// ── 窗口吸附 (异步链式, 不阻塞主进程) ──────────────
function scheduleSnapTick() {
  if (!snapTimer) return; // 已停止
  snapTimer = setTimeout(async () => {
    await snapLoop();
    scheduleSnapTick();
  }, 2000);
}
function startSnapPolling() {
  scheduleSnapTick();
}
function stopSnapPolling() {
  if (snapTimer) { clearTimeout(snapTimer); snapTimer = null; }
}

// ── 托盘 ──────────────────────────────────────────
function buildTrayMenu() {
  const items = [
    { label: "🐱 Claude Pet", enabled: false },
    { type: "separator" },
    {
      label: "👆 穿透模式", type: "checkbox", checked: isPassthrough,
      click: () => togglePassthrough(),
    },
    {
      label: "🧲 窗口吸附", type: "checkbox", checked: snapEnabled,
      click: () => toggleSnapping(),
    },
  ];
  // 只有麻薯支持主题换色
  if (currentCharacter === 'mochi') {
    items.push({
      label: "🎨 主题 (仅麻薯)",
      submenu: ["warm","cool","blossom","forest","midnight"].map(t => ({
        label: themeLabel(t), type: "radio", checked: currentTheme === t,
        click: () => setTheme(t),
      })),
    });
  }
  items.push({ type: "separator" });
  items.push({
    label: "📍 重置位置", click: () => {
      if (mainWindow) {
        const { width: sw, height: sh } = screen.getPrimaryDisplay().workArea;
        mainWindow.setPosition(sw - PET_W - 40, sh - PET_H - 40);
      }
    },
  });
  items.push({
    label: "👀 显示/隐藏", click: () => {
      if (mainWindow) mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    },
  });
  items.push({ type: "separator" });
  items.push({ label: "🚪 退出", click: () => app.quit() });
  return Menu.buildFromTemplate(items);
}

function themeLabel(t) {
  return { warm:"🟠 暖橙", cool:"🔵 冰蓝", blossom:"🌸 樱花", forest:"🌿 森林", midnight:"🌙 午夜" }[t] || t;
}

function updateTrayMenu() { if (tray) tray.setContextMenu(buildTrayMenu()); }

function createTray() {
  // 手绘 64x64 橘猫脸图标 — 比一个色块好看多了
  const S = 64, buf = Buffer.alloc(S * S * 4);
  const set = (x, y, r, g, b, a = 255) => {
    if (x < 0 || x >= S || y < 0 || y >= S) return;
    const i = ((y | 0) * S + (x | 0)) * 4;
    buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = a;
  };
  const fillCircle = (cx, cy, r, R, G, B, A = 255) => {
    for (let y = cy - r; y <= cy + r; y++)
      for (let x = cx - r; x <= cx + r; x++)
        if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) set(x, y, R, G, B, A);
  };
  const fillTri = (x1, y1, x2, y2, x3, y3, R, G, B) => {
    const minX = Math.max(0, Math.min(x1, x2, x3) - 1);
    const maxX = Math.min(S - 1, Math.max(x1, x2, x3) + 1);
    const minY = Math.max(0, Math.min(y1, y2, y3) - 1);
    const maxY = Math.min(S - 1, Math.max(y1, y2, y3) + 1);
    for (let y = minY; y <= maxY; y++)
      for (let x = minX; x <= maxX; x++) {
        const d1 = (x - x2) * (y1 - y2) - (x1 - x2) * (y - y2);
        const d2 = (x - x3) * (y2 - y3) - (x2 - x3) * (y - y3);
        const d3 = (x - x1) * (y3 - y1) - (x3 - x1) * (y - y1);
        const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
        const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
        if (!(hasNeg && hasPos)) set(x, y, R, G, B);
      }
  };

  // 背景全透明
  for (let i = 3; i < buf.length; i += 4) buf[i] = 0;

  // 左耳 (三角形)
  fillTri(12, 10, 6, 32, 24, 20, 0xFF, 0x8C, 0x42);
  fillTri(14, 14, 10, 28, 22, 20, 0xFF, 0xB0, 0xB0);
  // 右耳
  fillTri(52, 10, 58, 32, 40, 20, 0xFF, 0x8C, 0x42);
  fillTri(50, 14, 54, 28, 42, 20, 0xFF, 0xB0, 0xB0);

  // 脸 (大圆)
  fillCircle(32, 34, 22, 0xFF, 0x9A, 0x3C);
  // 脸内浅色
  fillCircle(32, 37, 13, 0xFF, 0xF0, 0xE0);

  // 眼睛
  fillCircle(23, 30, 5, 0xFF, 0xFF, 0xFF);
  fillCircle(41, 30, 5, 0xFF, 0xFF, 0xFF);
  fillCircle(23, 31, 3, 0x2C, 0x18, 0x10);
  fillCircle(41, 31, 3, 0x2C, 0x18, 0x10);
  // 眼睛高光
  set(25, 29, 255, 255, 255);
  set(43, 29, 255, 255, 255);

  // 鼻子
  fillCircle(32, 38, 3, 0xFF, 0x7B, 0x7B);

  // 嘴 (两条小弧线 — 用像素画)
  for (let dx = -3; dx <= 3; dx++) {
    const mouthY = 42 + Math.abs(dx) * 0.6;
    set(32 + dx, mouthY | 0, 0xC0, 0x80, 0x60);
  }

  // 胡须 (4 条短线)
  for (let l = 0; l < 4; l++) { set(12 + l, 33, 0xFF, 0xD0, 0xA0); }
  for (let l = 0; l < 4; l++) { set(12 + l, 37, 0xFF, 0xD0, 0xA0); }
  for (let l = 0; l < 4; l++) { set(48 + l, 33, 0xFF, 0xD0, 0xA0); }
  for (let l = 0; l < 4; l++) { set(48 + l, 37, 0xFF, 0xD0, 0xA0); }

  tray = new Tray(nativeImage.createFromBuffer(buf, { width: S, height: S }));
  tray.setToolTip("Claude Pet 🐱 — 右键切换角色/穿透/吸附");
  updateTrayMenu();
}

// ── 功能函数 ──────────────────────────────────────
function togglePassthrough() {
  isPassthrough = !isPassthrough;
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setIgnoreMouseEvents(isPassthrough, { forward: true });
    mainWindow.webContents.send("passthrough-change", isPassthrough);
  }
  updateTrayMenu();
}

function toggleSnapping() {
  snapEnabled = !snapEnabled;
  if (!snapEnabled) {
    snapTarget = null;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("snap-position", { side: null, active: false });
    }
  }
  updateTrayMenu();
}

function setTheme(t) {
  currentTheme = t;
  saveConfig({ ...loadConfig(), theme: t });
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send("theme-change", t);
  updateTrayMenu();
}

function setCharacter(id) {
  currentCharacter = id;
  saveConfig({ ...loadConfig(), character: id });
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send("character-change", id);
  updateTrayMenu(); // 切换角色时更新主题菜单可见性
}

function setDefaultChar(id) {
  defaultCharacter = id;
  saveConfig({ ...loadConfig(), defaultCharacter: id });
}

// ── IPC ───────────────────────────────────────────
ipcMain.on("set-window-pos", (e, { x, y }) => {
  if (mainWindow) {
    snapTarget = null;
    mainWindow.setPosition(Math.round(x), Math.round(y));
  }
});
ipcMain.handle("get-window-pos", () => {
  if (mainWindow) { const [x, y] = mainWindow.getPosition(); return { x, y }; }
  return { x: 0, y: 0 };
});
ipcMain.on("toggle-passthrough", () => togglePassthrough());
ipcMain.on("toggle-snapping", () => toggleSnapping());
ipcMain.on("set-theme", (e, t) => setTheme(t));
ipcMain.handle("get-theme", () => currentTheme);
ipcMain.on("set-character", (e, id) => setCharacter(id));
ipcMain.handle("get-character", () => currentCharacter);
ipcMain.on("set-default-char", (e, id) => setDefaultChar(id));

// ── 启动 ──────────────────────────────────────────
app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("enable-zero-copy");

app.whenReady().then(() => {
  ensureStatusDir();
  const cfg = loadConfig();
  currentTheme = cfg.theme || "warm";
  currentCharacter = cfg.defaultCharacter || cfg.character || "mochi";
  defaultCharacter = cfg.defaultCharacter || currentCharacter;
  snapEnabled = cfg.snapEnabled !== false;
  createPetWindow();
  createTray();
  startStatusPolling();
  startSnapPolling();
  setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("theme-change", currentTheme);
      mainWindow.webContents.send("character-change", currentCharacter);
    }
  }, 1000);
});

app.on("window-all-closed", () => {});
app.on("before-quit", () => {
  if (pollTimer) clearInterval(pollTimer);
  stopSnapPolling();
});
app.on("activate", () => { if (!mainWindow) createPetWindow(); });
