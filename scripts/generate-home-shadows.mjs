import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const directory = new URL("../src/assets/effects/", import.meta.url);
await mkdir(directory, { recursive: true });

const shadows = [
  {
    name: "nodus-card-shadow.webp",
    width: 512,
    height: 512,
    body: `<defs><filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="22"/></filter></defs><g fill="#000" filter="url(#soft)"><rect x="55" y="55" width="402" height="386" rx="18" opacity=".72"/><rect x="86" y="96" width="340" height="330" rx="22" opacity=".8"/></g>`,
  },
  {
    name: "nodus-ground-shadow.webp",
    width: 384,
    height: 96,
    body: `<defs><radialGradient id="ground"><stop stop-color="#000" stop-opacity=".85"/><stop offset=".48" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><ellipse cx="192" cy="48" rx="188" ry="44" fill="url(#ground)"/>`,
  },
];

for (const { name, width, height, body } of shadows) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
  await sharp(Buffer.from(svg))
    .webp({ quality: 85, alphaQuality: 100, effort: 6 })
    .toFile(fileURLToPath(new URL(name, directory)));
}
