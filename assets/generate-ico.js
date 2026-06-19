const fs = require("fs");
const png = fs.readFileSync("icon.png");
const pngSize = png.length;

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);

const entry = Buffer.alloc(16);
entry.writeUInt8(0, 0); entry.writeUInt8(0, 1); entry.writeUInt8(0, 2); entry.writeUInt8(0, 3);
entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(pngSize, 8); entry.writeUInt32LE(22, 12);

fs.writeFileSync("icon.ico", Buffer.concat([header, entry, png]));
console.log("✅ icon.ico " + (6 + 16 + pngSize) + " bytes");
