import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

async function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const client = u.protocol === 'https:' ? https : http;
      const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
        resolve({ url, status: res.statusCode });
      });
      req.on('error', (err) => resolve({ url, status: 'ERR: ' + err.message }));
      req.setTimeout(5000, () => { req.destroy(); resolve({ url, status: 'TIMEOUT' }); });
    } catch(e) {
      resolve({ url, status: 'INVALID_URL: ' + e.message });
    }
  });
}

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

const allSrcFiles = getAllFiles('./src');
const urlRegex = /(https?:\/\/[^\s"'`<>]+)/gi;

async function audit() {
  const urlToFiles = new Map();
  for (const f of allSrcFiles) {
    const content = fs.readFileSync(f, 'utf8');
    let match;
    while ((match = urlRegex.exec(content)) !== null) {
      let u = match[1].replace(/[,;)'"`]*$/, '');
      if (u.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)(\?.*)?$/i) || u.includes('wixstatic.com') || u.includes('ytimg.com') || u.includes('bing.net')) {
        if (!urlToFiles.has(u)) urlToFiles.set(u, []);
        urlToFiles.get(u).push(f);
      }
    }
  }

  console.log(`Auditing ${urlToFiles.size} unique image URLs across ${allSrcFiles.length} files...`);
  const broken = [];
  for (const [url, fileList] of urlToFiles.entries()) {
    const res = await checkUrl(url);
    if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
      console.log(`BROKEN [${res.status}]: ${url}\n  In files: ${fileList.join(', ')}`);
      broken.push({ url, status: res.status, files: fileList });
    }
  }
  console.log(`\nAudit finished. Found ${broken.length} broken image URLs.`);

  // Also check local images in public/
  const localImgRegex = /['"`](\/(?:[^\s"'`]+?\.)(?:png|jpg|jpeg|gif|webp|avif|svg))['"`]/gi;
  const missingLocal = [];
  for (const f of allSrcFiles) {
    const content = fs.readFileSync(f, 'utf8');
    let match;
    while ((match = localImgRegex.exec(content)) !== null) {
      const p = match[1];
      const fullPath = path.join('./public', p);
      if (!fs.existsSync(fullPath)) {
        missingLocal.push({ path: p, file: f });
      }
    }
  }
  console.log(`\nFound ${missingLocal.length} missing local images:`);
  for (const m of missingLocal) {
    console.log(`MISSING LOCAL: ${m.path} (in ${m.file})`);
  }
}

audit();
