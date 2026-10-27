// Usage: node scripts/optimize-images.mjs <srcDir>
// Converts generated/raw images into web-ready assets under public/images.
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const src = process.argv[2];
if (!src) throw new Error("Pass the source image directory");

const out = path.join(process.cwd(), "public", "images");
const gallery = [
  "kitchen-navy-island-brass",
  "kitchen-sage-green-shaker",
  "kitchen-walnut-modern",
  "bath-white-oak-double-vanity",
  "bath-navy-floating-vanity",
];

const find = (name) => {
  const f = fs.readdirSync(src).find((x) => x.startsWith(name + "."));
  if (!f) throw new Error("Missing source image: " + name);
  return path.join(src, f);
};

for (const name of gallery) {
  await sharp(find(name)).webp({ quality: 80 }).toFile(path.join(out, "gallery", name + ".webp"));
}

const hero = find("hero-kitchen");
await sharp(hero).webp({ quality: 80 }).toFile(path.join(out, "gallery", "kitchen-white-shaker-quartz.webp"));
await sharp(hero).resize(1920, 1080, { fit: "cover" }).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(out, "hero.jpg"));
await sharp(hero).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(process.cwd(), "public", "og.jpg"));
await sharp(find("install-soft-close-hinge")).webp({ quality: 80 }).toFile(path.join(out, "install-soft-close-hinge.webp"));

console.log("done");
