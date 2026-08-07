import fs from 'fs';
import https from 'https';

const files = [
  "src/data/rcmData.ts",
  "src/data/homePageData.ts",
  "src/data/pillarProjectsData.ts",
  "src/data/galleryData.ts",
  "src/data/presidentsData.ts"
];

const urlRegex = /(https?:\/\/[^\s"'`<>]+)/gi;
const urls = new Set();

for (const f of files) {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, "utf8");
    let m;
    while ((m = urlRegex.exec(c)) !== null) {
      let u = m[1].replace(/[,;)'"`]*$/, "");
      if (u.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)(\?.*)?$/i) || u.includes("wixstatic.com") || u.includes("ytimg.com")) {
        urls.add(u);
      }
    }
  }
}

console.log("Checking", urls.size, "data image URLs...");

async function check(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Referer": "" } }, (res) => {
      resolve({ url, code: res.statusCode });
    });
    req.on("error", (e) => resolve({ url, code: e.message }));
    req.setTimeout(4000, () => { req.destroy(); resolve({ url, code: "TIMEOUT" }); });
  });
}

(async () => {
  let badCount = 0;
  for (const u of urls) {
    const r = await check(u);
    if (r.code !== 200 && r.code !== 301 && r.code !== 302) {
      console.log(`BAD [${r.code}]: ${u}`);
      badCount++;
    }
  }
  console.log("Check complete. Total bad:", badCount);
})();
