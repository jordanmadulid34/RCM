import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const mappings = {
  'public/logo/rc-makati-logo.png': 'https://static.wixstatic.com/media/941b16_eb038f7898594cf288b37052aaecaa44~mv2.png',
  'public/about-section/bg.jpg': 'https://static.wixstatic.com/media/b2fb7d_7120845956ba471a8faed4ec2c05839c~mv2.jpg',
  'public/vanguard-section/bg.jpg': 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
  'public/benefactor-section/bg.jpg': 'https://static.wixstatic.com/media/b2fb7d_daebb40a8d074468890b4fc57e3ff879~mv2.jpg',
  'public/benefits-section/bg.jpg': 'https://static.wixstatic.com/media/b2fb7d_e95fea3b58284b6a98e28b7f1cdca5ee~mv2.jpg',
  'public/partnership-section/bg.jpg': 'https://static.wixstatic.com/media/941b16_fee94a5547814ae6b8ff9aa69c809b81~mv2.jpeg',
  'public/projects-section/bg.jpg': 'https://static.wixstatic.com/media/b2fb7d_2819b63aefc348b69e03700461a85ccd~mv2.jpg',

  'public/four-way-test/test-1.jpg': 'https://static.wixstatic.com/media/941b16_c7f3a903128341189db574743bf22539~mv2.jpg',
  'public/four-way-test/test-2.jpg': 'https://static.wixstatic.com/media/941b16_1b106fe9c46d451f9f0c679ca331457d~mv2.jpeg',
  'public/four-way-test/test-3.jpg': 'https://static.wixstatic.com/media/941b16_b5dbc984533b429297f98f66bc19d746~mv2.jpeg',
  'public/four-way-test/test-4.jpg': 'https://static.wixstatic.com/media/941b16_10efc9654d1a499da8c4554a5febda96~mv2.jpeg',

  'public/pillar-cards/personal-growth.jpg': 'https://static.wixstatic.com/media/941b16_036ed96854ba4cb69db75edce7174d29~mv2.jpeg',
  'public/pillar-cards/professional-fellowship.jpg': 'https://static.wixstatic.com/media/941b16_42cc8a5cc96f489c9e5759140e605318~mv2.jpeg',
  'public/pillar-cards/global-network.jpg': 'https://static.wixstatic.com/media/941b16_49afe1d200c44146b4227c232a7e8d53~mv2.jpeg',
  'public/pillar-cards/real-impact.jpg': 'https://static.wixstatic.com/media/941b16_3dd02a0816f645c1a47e5cb7bc694b75~mv2.jpeg',

  'public/assets/images/brotherhood_agreement.jpg': 'https://static.wixstatic.com/media/83b216_7a92dd9abba14620a42d323fe4cb88c6~mv2.jpg',
  'public/assets/images/rotary_connect.jpg': 'https://static.wixstatic.com/media/941b16_322993c028494662a47309666ac7badb~mv2.jpeg',
  'public/assets/images/rotary_empower.jpg': 'https://static.wixstatic.com/media/941b16_df2ce6b17c0942d898c55284c022a77f~mv2.jpeg',
  'public/assets/images/rotary_endpolio.jpg': 'https://static.wixstatic.com/media/941b16_23864e39247c476d81048af0030cb785~mv2.jpeg',
  'public/assets/images/rotary_learn.jpg': 'https://static.wixstatic.com/media/941b16_549ce9c535ff49bf800c40a4402d1bcc~mv2.jpeg',
  'public/assets/images/rotary_peace.jpg': 'https://static.wixstatic.com/media/941b16_e9a50dfcd16d4daebd7e2d2167f4182d~mv2.jpeg',
  'public/assets/images/rotary_savelives.jpg': 'https://static.wixstatic.com/media/941b16_41a7b843b1354c718c8b28b9d6454bfe~mv2.jpeg',
  'public/assets/images/rotary_transform.jpg': 'https://static.wixstatic.com/media/b2fb7d_5ba3ca4237a5446f8b1620070e5b4b4d~mv2.jpg',

  'public/membership-banner/1.jpeg': 'https://static.wixstatic.com/media/b2fb7d_6a1eaad6b2514ae3ae4479f709550b4b~mv2.jpg',
  'public/membership-banner/2.jpeg': 'https://static.wixstatic.com/media/b2fb7d_2819b63aefc348b69e03700461a85ccd~mv2.jpg',
  'public/membership-banner/3.jpeg': 'https://static.wixstatic.com/media/b2fb7d_c0f3f9723a7941899962ccbcffc724ee~mv2.jpg',
  'public/membership-banner/4.jpeg': 'https://static.wixstatic.com/media/b2fb7d_daebb40a8d074468890b4fc57e3ff879~mv2.jpg',
  'public/membership-banner/5.jpeg': 'https://static.wixstatic.com/media/b2fb7d_e95fea3b58284b6a98e28b7f1cdca5ee~mv2.jpg',
  'public/membership-banner/6.jpeg': 'https://static.wixstatic.com/media/941b16_c7f3a903128341189db574743bf22539~mv2.jpg',
  'public/membership-banner/7.jpeg': 'https://static.wixstatic.com/media/941b16_1b106fe9c46d451f9f0c679ca331457d~mv2.jpeg',
  'public/membership-banner/8.jpeg': 'https://static.wixstatic.com/media/941b16_b5dbc984533b429297f98f66bc19d746~mv2.jpeg',
  'public/membership-banner/9.jpeg': 'https://static.wixstatic.com/media/941b16_10efc9654d1a499da8c4554a5febda96~mv2.jpeg',
  'public/membership-banner/10.jpeg': 'https://static.wixstatic.com/media/941b16_036ed96854ba4cb69db75edce7174d29~mv2.jpeg',
  'public/membership-banner/11.jpeg': 'https://static.wixstatic.com/media/941b16_42cc8a5cc96f489c9e5759140e605318~mv2.jpeg',
  'public/membership-banner/12.jpeg': 'https://static.wixstatic.com/media/941b16_49afe1d200c44146b4227c232a7e8d53~mv2.jpeg',

  'public/newsroom-banner/1.jpg': 'https://static.wixstatic.com/media/b2fb7d_9946319f5a2845d18303c2396cb5011a~mv2.jpg',
  'public/newsroom-banner/2.jpg': 'https://static.wixstatic.com/media/b2fb7d_a9b11276feb747a9a98acbff46597292~mv2.jpg',
  'public/newsroom-banner/3.jpg': 'https://static.wixstatic.com/media/b2fb7d_7120845956ba471a8faed4ec2c05839c~mv2.jpg',
  'public/newsroom-banner/4.jpg': 'https://static.wixstatic.com/media/b2fb7d_b1fbf77300f9440ca4f20030468fcc2c~mv2.jpg',
  'public/newsroom-banner/5.jpg': 'https://static.wixstatic.com/media/b2fb7d_ca7371be21054818ab83365c2c4cdbcd~mv2.jpg',
  'public/newsroom-banner/6.jpg': 'https://static.wixstatic.com/media/b2fb7d_18c2b22ec6ac417db7c39790b1a8d22e~mv2.jpg',
  'public/newsroom-banner/7.jpg': 'https://static.wixstatic.com/media/b2fb7d_9ca5c0980d0144b9953d0bc513ff1e4b~mv2.jpg',
  'public/newsroom-banner/8.jpg': 'https://static.wixstatic.com/media/b2fb7d_61af72bf16df4676861410e08c31a646~mv2.jpg',
  'public/newsroom-banner/9.jpg': 'https://static.wixstatic.com/media/941b16_08889c5f52a94cc9b24bc23def78ef29f000.jpg',
  'public/newsroom-banner/10.jpg': 'https://static.wixstatic.com/media/941b16_b8f80fe80e2243b7ae964af0f2049fc4~mv2.jpeg',
  'public/newsroom-banner/11.jpg': 'https://static.wixstatic.com/media/b2fb7d_252c4335f7034af7aff0e281377869cb~mv2.png',
  'public/newsroom-banner/12.jpg': 'https://static.wixstatic.com/media/941b16_fee94a5547814ae6b8ff9aa69c809b81~mv2.jpeg',
  'public/newsroom-banner/13.jpg': 'https://static.wixstatic.com/media/941b16_ec48e9c04bf34a3da602b9d7ba91e962~mv2.jpeg'
};

async function downloadFile(dest, url) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode !== 200) {
        console.error(`FAILED [${res.statusCode}] ${dest} <- ${url}`);
        return resolve(false);
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(dest, buf);
        const isJpg = buf[0] === 0xff && buf[1] === 0xd8;
        const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
        console.log(`[SUCCESS] ${dest} (${buf.length} bytes) | JPG:${isJpg} PNG:${isPng}`);
        resolve(true);
      });
    }).on('error', (err) => {
      console.error(`ERROR ${dest}: ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  console.log(`Starting download for ${Object.keys(mappings).length} files...`);
  for (const [dest, url] of Object.entries(mappings)) {
    await downloadFile(dest, url);
  }
  console.log('All downloads completed!');
}

run();
