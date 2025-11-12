import fs from "fs";
import path from "path";
import Image from "next/image";
import GalleryGridClient from "./GalleryGridClient";

export default function GalleryGrid() {
  const dir = path.join(process.cwd(), "public", "images", "gallery");
  const files = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) =>
          [".svg", ".jpg", ".jpeg", ".png", ".webp"].some((ext) =>
            f.toLowerCase().endsWith(ext)
          )
        )
        // natural sort so placeholder_1 .. placeholder_6 is in order
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    : [];

  // Try to load captions from gallery.json
  let captionsMap: Record<string, string> | undefined;
  try {
    const captionsPath = path.join(process.cwd(), "public", "images", "gallery", "gallery.json");
    if (fs.existsSync(captionsPath)) {
      const captionsData = fs.readFileSync(captionsPath, "utf-8");
      const captions = JSON.parse(captionsData);
      if (Array.isArray(captions)) {
        captionsMap = {};
        captions.forEach((item: { file: string; caption: string }) => {
          if (item.file && item.caption) {
            captionsMap![item.file] = item.caption;
          }
        });
      }
    }
  } catch {
    // Silently fall back to filename-derived captions
    captionsMap = undefined;
  }

  return <GalleryGridClient files={files} captions={captionsMap} />;
}
