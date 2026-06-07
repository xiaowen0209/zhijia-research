// ==========================================
// 智驾研究台 — 本地抓取服务器
// 使用方法: node scrape-server.js
// 然后打开网站，点击数据采集→网页抓取
// ==========================================

const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = 3456;

// CORS + JSON helper
function json(res, data, code = 200) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data, null, 2));
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const u = new URL(url);
    const opts = {
      hostname: u.hostname, port: u.port, path: u.pathname + u.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-CN,zh;q=0.9'
      },
      timeout: 10000
    };
    const req = lib.request(opts, (resp) => {
      let chunks = [];
      resp.on('data', c => chunks.push(c));
      resp.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        resolve(body);
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

function extractText(html) {
  // Simple HTML text extraction
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function guessSource(url) {
  const m = {
    '36kr.com': '36氪', 'dongchedi.com': '懂车帝', 'autohome.com.cn': '汽车之家',
    'bilibili.com': 'B站', 'zhihu.com': '知乎', 'weibo.com': '微博',
    'd1ev.com': '第一电动', 'jiemian.com': '界面', '163.com': '网易',
    'qq.com': '腾讯', 'gasgoo.com': '盖世汽车', 'xcar.com.cn': '爱卡汽车',
    'cnii.com.cn': '中国信通院'
  };
  for (const [k, v] of Object.entries(m)) { if (url.includes(k)) return v; }
  return '网页';
}

function guessType(text) {
  const s = text.toLowerCase();
  if (/[Oo][Tt][Aa]|版本|推送|升级/.test(s)) return 'ota';
  if (/实测|测评|试驾|体验|测试/.test(s)) return 'test';
  if (/问题|故障|投诉|召回/.test(s)) return 'issue';
  return 'news';
}

function extractDate(text) {
  const m = text.match(/(\d{4}[-/年]\d{1,2}[-/月]\d{1,2})/);
  return m ? m[1].replace(/[年/]/g, '-').replace(/月/, '-').replace(/日/, '') : '';
}

function findBrand(text) {
  const map = {
    'H': /华为|ADS|问界|鸿蒙/, 'X': /小鹏|XNGP|G9|P7/,
    'T': /特斯拉|FSD|Model/, 'L': /理想|AD Max|L7|L6|MEGA/,
    'Mi': /小米|SU7|Pilot/, 'HX': /地平线|HSD|征程|J6P/,
    'BYD': /比亚迪|BYD|天神之眼/
  };
  for (const [k, re] of Object.entries(map)) { if (re.test(text)) return k; }
  return null;
}

// Parse Bing search results from HTML
function parseBingResults(html, limit) {
  const results = [];
  const seen = new Set();

  // Match Bing result blocks: h2 > a for title, .b_caption for snippet
  const blockRe = /<li class="b_algo"[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = blockRe.exec(html)) !== null && results.length < limit) {
    const block = match[1];

    // Extract URL and title
    const linkMatch = block.match(/<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!linkMatch) continue;

    let url = linkMatch[1];
    const title = linkMatch[2].replace(/<[^>]+>/g, '').trim();
    if (!url || !title || seen.has(url)) continue;
    if (url.includes('bing.com') || url.includes('microsoft.com') || url.includes('go.microsoft.com')) continue;

    seen.add(url);
    const snippetMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    const text = title + ' ' + snippet;
    results.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      source: guessSource(url),
      type: guessType(text),
      title,
      content: snippet.slice(0, 500) || title,
      date: extractDate(text) || new Date().toISOString().slice(0, 10),
      url,
      parsed: { brand: findBrand(text) }
    });
  }
  return results;
}

// ===== Server =====
const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // API endpoint
  if (req.method === 'POST' && req.url === '/api/scrape') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { keyword, types = [], limit = 10 } = JSON.parse(body);
        if (!keyword) return json(res, { success: false, error: 'Missing keyword' }, 400);

        const query = encodeURIComponent(keyword + ' 智能驾驶 ' + types.join(' '));
        const bingUrl = `https://cn.bing.com/search?q=${query}&count=${Math.min(limit * 2, 30)}&setlang=zh-cn`;

        console.log(`[scrape] 搜索: ${keyword}`);
        const html = await fetchUrl(bingUrl);
        const results = parseBingResults(html, limit);

        console.log(`[scrape] 找到 ${results.length} 条结果`);
        json(res, { success: true, results });
      } catch (e) {
        console.error('[scrape] 错误:', e.message);
        json(res, { success: false, error: e.message }, 500);
      }
    });
    return;
  }

  // Health check
  if (req.url === '/health') {
    return json(res, { status: 'ok', message: '智驾研究台抓取服务器运行中' });
  }

  // 404
  json(res, { error: 'Not found' }, 404);
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ===================================');
  console.log('  智驾研究台 — 本地抓取服务器');
  console.log(`  地址: http://localhost:${PORT}`);
  console.log(`  API:  http://localhost:${PORT}/api/scrape`);
  console.log('  按 Ctrl+C 停止');
  console.log('  ===================================');
  console.log('');
});
