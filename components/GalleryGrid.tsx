import fs from "fs";
import path from "path";
import GalleryGridClient, { type GalleryItem } from "./GalleryGridClient";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

function loadGallery(): GalleryItem[] {
  const dir = path.join(process.cwd(), "public", "images", "gallery");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => IMAGE_EXT.test(f));
  const fromName = (f: string) => f.replace(IMAGE_EXT, "").replace(/[-_]+/g, " ");

  let listed: Partial<GalleryItem>[] = [];
  try {
    listed = JSON.parse(fs.readFileSync(path.join(dir, "gallery.json"), "utf-8"));
  } catch {
    listed = [];
  }

  // gallery.json controls order; any images not listed are appended alphabetically.
  const ordered = listed.filter((i) => i.file && files.includes(i.file)).map((i) => i.file!);
  const rest = files.filter((f) => !ordered.includes(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return [...ordered, ...rest].map((file) => {
    const meta = listed.find((i) => i.file === file);
    return {
      file,
      caption: meta?.caption || fromName(file),
      alt: meta?.alt || meta?.caption || fromName(file),
    };
  });
}

export default function GalleryGrid({ title = "Recent Work", limit }: { title?: string; limit?: number }) {
  const items = loadGallery();
  return <GalleryGridClient items={limit ? items.slice(0, limit) : items} title={title} />;
}
