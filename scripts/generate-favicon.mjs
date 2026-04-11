import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = path.dirname(fileURLToPath(import.meta.url));
const srcPng = path.join(root, "..", "src", "app", "icon.png");
const outIco = path.join(root, "..", "src", "app", "favicon.ico");
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "elevate-favicon-"));
const sizes = [16, 32, 48];
const tmpFiles = [];
for (const s of sizes) {
  const f = path.join(tmpDir, `${s}.png`);
  await sharp(srcPng)
    .resize(s, s, { fit: "cover", position: "centre" })
    .png()
    .toFile(f);
  tmpFiles.push(f);
}

const buf = await pngToIco(tmpFiles);
for (const f of tmpFiles) fs.unlinkSync(f);
fs.rmdirSync(tmpDir);

fs.writeFileSync(outIco, buf);
console.log("Wrote favicon.ico", buf.length, "bytes");
