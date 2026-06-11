// ==========================================
// 智驾研究台 — 本地爬虫服务器
// 启动: node scraper.js
// 前端通过 http://localhost:3456/api/scrape 调用
// ==========================================

const http = require('http');
const https = require('https');
const PORT = 3456;

function json(res, data, code = 200) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
  res.end(JSON.stringify(data));
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'Accept': 'text/html', 'Accept-Language': 'zh-CN,zh;q=0.9' }, timeout: 12000 };
    const req = https.request(opts, resp => { let chunks = []; resp.on('data', c => chunks.push(c)); resp.on('end', () => resolve(Buffer.concat(chunks).toString('utf8'))); });
    req.on('error', reject); req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

function guessSource(url) {
  const m = { '36kr.com': '36氪', 'dongchedi.com': '懂车帝', 'autohome.com.cn': '汽车之家', 'd1ev.com': '第一电动', 'gasgoo.com': '盖世汽车', 'zhihu.com': '知乎', 'iauto.com': '汽车商业评论', 'xcar.com.cn': '爱卡汽车', 'ithome.com': 'IT之家', 'jiemian.com': '界面', 'bilibili.com': 'B站' };
  for (const [k, v] of Object.entries(m)) if (url.includes(k)) return v;
  return '网页';
}

function guessType(text) {
  if (/[Oo][Tt][Aa]|FOTA|SOTA|版本更新|推送|升级/.test(text)) return 'ota';
  if (/实测|测评|试驾|体验|路测|横评/.test(text)) return 'test';
  if (/问题|故障|投诉|召回|缺陷|吐槽/.test(text)) return 'issue';
  return 'news';
}

function extractDate(text) {
  const m = text.match(/(\d{4}[-/年]\d{1,2}[-/月]\d{1,2})/);
  return m ? m[1].replace(/[年/]/g, '-').replace(/月/, '-').replace(/日/, '') : new Date().toISOString().slice(0, 10);
}

function findBrand(text) {
  if (/华为|ADS|问界|鸿蒙智驾/.test(text)) return 'H';
  if (/小鹏|XNGP|G9|P7|MONA/.test(text)) return 'X';
  if (/特斯拉|FSD|Model|Tesla|HW4/.test(text)) return 'T';
  if (/理想|AD Max|AD Pro|L7|L6|MEGA/.test(text)) return 'L';
  if (/小米|SU7|Pilot|Xiaomi/.test(text)) return 'Mi';
  if (/地平线|HSD|征程|J6P|Horizon/.test(text)) return 'HX';
  if (/比亚迪|BYD|天神之眼|腾势/.test(text)) return 'BYD';
  if (/百度|Apollo|萝卜快跑/.test(text)) return 'BD';
  return null;
}

// 智驾关键词过滤器
const AUTO_KW = ['智能驾驶', '自动驾驶', '智驾', '辅助驾驶', 'NOA', 'NGP', 'NOP', 'FSD', 'XNGP', 'ADS', 'HSD', 'AD Max', '激光雷达', 'BEV', '端到端', 'OTA', '版本', '实测', '测评', '特斯拉', '小鹏', '理想', '蔚来', '问界', 'SU7', '比亚迪', '地平线', '芯片', '算力', 'TOPS', 'Robotaxi', 'L3', 'L4', 'AEB', '车道保持'];

function isAutoRelated(text) { return AUTO_KW.some(kw => text.includes(kw)); }

function parseBingResults(html, limit) {
  const results = [];
  const seen = new Set();

  // Split by result blocks
  const blocks = html.split(/<li class="b_algo"/);
  for (let i = 1; i < blocks.length && results.length < limit; i++) {
    const block = blocks[i];

    // Extract URL
    const urlMatch = block.match(/href="(https?:\/\/[^"]+)"/);
    if (!urlMatch) continue;
    const url = urlMatch[1];
    if (seen.has(url) || url.includes('bing.com') || url.includes('go.microsoft.com')) continue;

    // Extract title - try multiple patterns
    let title = '';
    const h2Match = block.match(/<h2>\s*<a[^>]*>([\s\S]*?)<\/a>\s*<\/h2>/i);
    if (h2Match) title = h2Match[1].replace(/<[^>]+>/g, '').trim();
    if (!title) {
      const aMatch = block.match(/<a[^>]*href="https?:\/\/[^"]+"[^>]*>([^<]+)<\/a>/i);
      if (aMatch) title = aMatch[1].trim();
    }
    if (!title || title.length < 5) continue;

    // Extract snippet
    const pMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    let snippet = pMatch ? pMatch[1].replace(/<[^>]+>/g, '').replace(/&ensp;/g, ' ').replace(/&#0\d+;/g, '').replace(/&nbsp;/g, ' ').trim() : '';

    const combined = title + ' ' + snippet;

    // Must be auto-related
    if (!isAutoRelated(combined)) continue;

    seen.add(url);
    results.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), source: guessSource(url), type: guessType(combined), title, content: snippet.slice(0, 500) || title, date: extractDate(combined), url, parsed: { brand: findBrand(combined) } });
  }

  // If Bing returned nothing useful, try site-specific searches
  if (results.length === 0 && html.length > 500 && !html.includes('b_algo')) {
    // Try extracting any auto-related links from the page
    const re = /<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>([^<]{10,100})<\/a>/gi;
    let m;
    while ((m = re.exec(html)) !== null && results.length < limit) {
      const url = m[1], text = m[2].replace(/<[^>]+>/g, '').trim();
      if (!seen.has(url) && url.startsWith('http') && isAutoRelated(text)) {
        seen.add(url);
        results.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), source: guessSource(url), type: guessType(text), title: text.slice(0, 80), content: text, date: extractDate(text), url, parsed: { brand: findBrand(text) } });
      }
    }
  }

  return results;
}

// ===== Server =====
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }); return res.end(); }

  if (req.method === 'POST' && req.url === '/api/scrape') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { keyword = '', limit = 10 } = JSON.parse(body);
        if (!keyword) return json(res, { success: false, error: '请输入关键词' }, 400);

        console.log(`\n[爬虫] 搜索: "${keyword}"`);

        // Search on Bing (works in China)
        const query = encodeURIComponent(keyword + ' 智能驾驶 自动驾驶');
        let allResults = [];

        // Try Bing first
        try {
          const bingUrl = `https://cn.bing.com/search?q=${query}&count=20&setlang=zh-cn`;
          console.log('[爬虫] 请求 Bing...');
          const html = await fetchUrl(bingUrl);
          const results = parseBingResults(html, limit);
          console.log(`[爬虫] Bing 返回 ${results.length} 条智驾相关结果`);
          allResults.push(...results);
        } catch (e) {
          console.log('[爬虫] Bing 请求失败: ' + e.message);
        }

        // If not enough results, try direct site searches
        if (allResults.length < limit) {
          const sites = [
            { name: '36氪', domain: '36kr.com' },
            { name: '懂车帝', domain: 'dongchedi.com' },
            { name: '汽车之家', domain: 'autohome.com.cn' },
            { name: '第一电动', domain: 'd1ev.com' },
          ];
          for (const site of sites) {
            if (allResults.length >= limit) break;
            try {
              const siteQuery = encodeURIComponent(`site:${site.domain} ${keyword} 智能驾驶`);
              const url = `https://cn.bing.com/search?q=${siteQuery}&count=10&setlang=zh-cn`;
              console.log(`[爬虫] 搜索 ${site.name}...`);
              const html = await fetchUrl(url);
              const results = parseBingResults(html, limit - allResults.length);
              console.log(`[爬虫]   ${site.name}: ${results.length} 条`);
              allResults.push(...results);
            } catch (e) {
              console.log(`[爬虫]   ${site.name}: 失败`);
            }
          }
        }

        console.log(`[爬虫] 共 ${allResults.length} 条结果`);
        json(res, { success: true, results: allResults.slice(0, limit), keyword });
      } catch (e) {
        console.error('[爬虫] 错误:', e.message);
        json(res, { success: false, error: e.message }, 500);
      }
    });
    return;
  }

  if (req.url === '/health') return json(res, { status: 'ok', message: '智驾研究台爬虫服务器运行中' });
  json(res, { error: 'Not found' }, 404);
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ╔════════════════════════════════════╗');
  console.log('  ║  智驾研究台 爬虫服务器 v4         ║');
  console.log(`  ║  http://localhost:${PORT}/api/scrape  ║`);
  console.log('  ║  搜索引擎: Bing (国内可用)        ║');
  console.log('  ║  Ctrl+C 停止                      ║');
  console.log('  ╚════════════════════════════════════╝');
  console.log('');
});
