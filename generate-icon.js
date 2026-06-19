// 生成 256x256 橘猫图标 PNG，electron-builder 会自动转 .ico
const { nativeImage } = require("electron");
const fs = require("fs");

const S = 256, buf = Buffer.alloc(S * S * 4);
const set = (x, y, r, g, b, a = 255) => {
  if (x < 0 || x >= S || y < 0 || y >= S) return;
  const i = ((y | 0) * S + (x | 0)) * 4;
  buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = a;
};
const fillCircle = (cx, cy, r, R, G, B, A = 255) => {
  const rr = r * r;
  for (let y = Math.max(0, (cy - r) | 0); y <= Math.min(S - 1, (cy + r) | 0); y++)
    for (let x = Math.max(0, (cx - r) | 0); x <= Math.min(S - 1, (cx + r) | 0); x++)
      if ((x - cx) ** 2 + (y - cy) ** 2 <= rr) set(x, y, R, G, B, A);
};
const fillTri = (x1, y1, x2, y2, x3, y3, R, G, B) => {
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const d1 = (x - x2) * (y1 - y2) - (x1 - x2) * (y - y2);
      const d2 = (x - x3) * (y2 - y3) - (x2 - x3) * (y - y3);
      const d3 = (x - x1) * (y3 - y1) - (x3 - x1) * (y - y1);
      if (!((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0)))
        set(x, y, R, G, B);
    }
};

// 透明背景
for (let i = 3; i < buf.length; i += 4) buf[i] = 0;

// 圆角背景
fillCircle(128, 128, 124, 0xFF, 0x9A, 0x3C);
fillCircle(128, 128, 118, 0xFF, 0xB0, 0x60);

// 耳朵
fillTri(60, 50, 25, 130, 110, 85, 0xFF, 0x8C, 0x42);
fillTri(65, 58, 36, 118, 100, 88, 0xFF, 0xB0, 0xB0);
fillTri(196, 50, 231, 130, 146, 85, 0xFF, 0x8C, 0x42);
fillTri(191, 58, 220, 118, 156, 88, 0xFF, 0xB0, 0xB0);

// 脸
fillCircle(128, 138, 90, 0xFF, 0x9A, 0x3C);
fillCircle(128, 148, 55, 0xFF, 0xF0, 0xE0);

// 眼睛
fillCircle(95, 120, 22, 0xFF, 0xFF, 0xFF);
fillCircle(161, 120, 22, 0xFF, 0xFF, 0xFF);
fillCircle(97, 123, 13, 0x2C, 0x18, 0x10);
fillCircle(163, 123, 13, 0x2C, 0x18, 0x10);
fillCircle(101, 117, 6, 0xFF, 0xFF, 0xFF);
fillCircle(167, 117, 6, 0xFF, 0xFF, 0xFF);

// 鼻子
fillCircle(128, 152, 12, 0xFF, 0x7B, 0x7B);

// 嘴
for (let dx = -12; dx <= 12; dx++) {
  const my = 166 + Math.abs(dx) * 0.5;
  set(128 + dx, my | 0, 0xC0, 0x80, 0x60);
  set(128 + dx, (my + 1) | 0, 0xC0, 0x80, 0x60);
}

// 胡须 (8条)
for (let l = 0; l < 18; l++) set(55 + l, 134, 0xFF, 0xD0, 0xA0);
for (let l = 0; l < 18; l++) set(55 + l, 148, 0xFF, 0xD0, 0xA0);
for (let l = 0; l < 18; l++) set(185 + l, 134, 0xFF, 0xD0, 0xA0);
for (let l = 0; l < 18; l++) set(185 + l, 148, 0xFF, 0xD0, 0xA0);

// 腮红
fillCircle(78, 144, 10, 0xFF, 0xB0, 0xB0, 120);
fillCircle(178, 144, 10, 0xFF, 0xB0, 0xB0, 120);

// 保存
const img = nativeImage.createFromBuffer(buf, { width: S, height: S });
fs.writeFileSync("assets/icon.png", img.toPNG());
console.log("✅ assets/icon.png generated (256x256)");
