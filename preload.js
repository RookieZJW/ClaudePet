const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("claudePet", {
  onStatusChange: (cb) => ipcRenderer.on("status-change", (e, d) => cb(d)),
  onPassthroughChange: (cb) => ipcRenderer.on("passthrough-change", (e, d) => cb(d)),
  onSnapPosition: (cb) => ipcRenderer.on("snap-position", (e, d) => cb(d)),
  onThemeChange: (cb) => ipcRenderer.on("theme-change", (e, d) => cb(d)),
  onCharacterChange: (cb) => ipcRenderer.on("character-change", (e, d) => cb(d)),

  getTheme: () => ipcRenderer.invoke("get-theme"),
  getCharacter: () => ipcRenderer.invoke("get-character"),

  setWindowPos: (x, y) => ipcRenderer.send("set-window-pos", { x, y }),
  getWindowPos: () => ipcRenderer.invoke("get-window-pos"),
  togglePassthrough: () => ipcRenderer.send("toggle-passthrough"),
  toggleSnapping: () => ipcRenderer.send("toggle-snapping"),
  setTheme: (t) => ipcRenderer.send("set-theme", t),
  setCharacter: (id) => ipcRenderer.send("set-character", id),
  setDefaultChar: (id) => ipcRenderer.send("set-default-char", id),
  pomoStart: (s, p) => ipcRenderer.send("pomo-start", { seconds: s, phase: p }),
  pomoStop: () => ipcRenderer.send("pomo-stop"),
  onPomoStatus: (cb) => ipcRenderer.on("pomo-status", (e, d) => cb(d)),
  onTtsToggle: (cb) => ipcRenderer.on("tts-toggle", () => cb()),
  showContextMenu: (d) => ipcRenderer.send("show-context-menu", d),
  getPomo: () => ipcRenderer.invoke("get-pomo"),

  platform: process.platform,
});
