import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      getAllFiles(full, fileList);
    } else {
      fileList.push(full);
    }
  }
  return fileList;
}

const allFiles = getAllFiles('./src');
const urls = new Set();
const localPaths = new Set();

// Broader regex to catch all image strings in RCM_IMAGES, etc.
const urlRegex = /(https?:\/\/[^\s"'`<>]+)/gi;
const localRegex = /['"`](\/(?:[^\s"'`]+?\.)(?:png|jpg|jpeg|gif|webp|avif|svg))['"`]/gi;

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    const u = match[1];
    if (u.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)(\?.*)?$/i) || u.includes('wixstatic.com') || u.includes('ytimg.com')) {
      urls.add(u);
    }
  }
  while ((match = localRegex.exec(content)) !== null) {
    localPaths.add(match[1]);
  }
}

console.log('Found remote image URLs:', urls.size);
console.log('Found local image paths:', localPaths.size);

console.log('\n--- CHECKING LOCAL PATHS ---');
for (const p of localPaths) {
  const fullPath = path.join('./public', p);
  const exists = fs.existsSync(fullPath);
  if (!exists) {
    console.log(`[MISSING LOCAL] ${p} -> ${fullPath}`);
  } else {
    console.log(`[OK LOCAL] ${p}`);
  }
}

async function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
        resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
      });
      req.on('error', (err) => resolve({ url, status: 'ERR: ' + err.message, ok: false }));
      req.setTimeout(6000, () => { req.destroy(); resolve({ url, status: 'TIMEOUT', ok: false }); });
    } catch (e) {
      resolve({ url, status: 'EXC: ' + e.message, ok: false });
    }
  });
}

async function run() {
  console.log('\n--- CHECKING REMOTE IMAGE URLS ---');
  for (const u of urls) {
    const res = await checkUrl(u);
    if (!res.ok) {
      console.log(`[BROKEN REMOTE] ${res.status} | ${u}`);
    } else {
      console.log(`[OK REMOTE] ${res.status} | ${u}`);
    }
  }
}

run();
