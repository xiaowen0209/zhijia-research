// ==========================================
// 智驾研究台 — 本地爬虫服务器 v5
// 启动: node scraper.js
// 用于抓取指定网页内容 + 搜索关键词
// ==========================================

const http = require('http');
const https = require('https');
const PORT = 3456;

function json(res, data, code = 200) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
  res.end(JSON.stringify(data));
}

function fetchUrl(url, timeout = 12000) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request({
      hostname: u.hostname, path: u.pathname + u.search, method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache'
      }, timeout
    }, resp => {
      if ([301,302,307,308].includes(resp.statusCode)) {
        const redirectUrl = resp.headers.location || '';
        if (redirectUrl) return fetchUrl(redirectUrl.startsWith('http') ? redirectUrl : new URL(redirectUrl, url).href, timeout).then(resolve).catch(reject);
      }
      let chunks = []; resp.on('data', c => chunks.push(c));
      resp.on('end', () => resolve({ status: resp.statusCode, body: Buffer.concat(chunks).toString('utf8'), url }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

function stripHtml(html) {
  return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/&#\d+;/g, ' ').replace(/\s+/g, ' ').trim();
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

async function scrapeUrl(url) {
  console.log('[抓取] ' + url.slice(0, 80));
  const { body } = await fetchUrl(url);

  // Extract title
  let title = '';
  const titleMatch = body.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) title = titleMatch[1].trim();

  // Extract description
  let desc = '';
  const descMatch = body.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i) || body.match(/<meta[^>]*content="([^"]+)"[^>]*name="description"/i);
  if (descMatch) desc = descMatch[1];

  // Extract main text
  const text = stripHtml(body).slice(0, 3000);
  const content = (desc || '') + ' ' + text;

  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    source: guessSource(url),
    type: guessType(content),
    title: title || url.slice(0, 60),
    content: content.slice(0, 1500),
    date: extractDate(content),
    url,
    parsed: { brand: findBrand(content) }
  };
}

// ===== Server =====
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }); return res.end(); }

  if (req.method === 'POST' && req.url === '/api/scrape') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { url, urls = [], keyword = '' } = JSON.parse(body);

        // URL 模式：直接抓取指定 URL
        if (url) {
          const result = await scrapeUrl(url);
          return json(res, { success: true, results: [result], keyword: '' });
        }

        // 多 URL 模式
        if (urls.length > 0) {
          const results = [];
          for (const u of urls.slice(0, 5)) {
            try { results.push(await scrapeUrl(u)); } catch (e) { console.log('失败: ' + u.slice(0, 50)); }
          }
          return json(res, { success: true, results, keyword: '' });
        }

        // 关键词模式：尝试通过百度搜索
        if (keyword) {
          console.log('[搜索] ' + keyword);
          try {
            const query = encodeURIComponent(keyword + ' 智能驾驶');
            const resp = await fetchUrl(`https://www.baidu.com/s?wd=${query}&rn=10`);
            // Extract links from Baidu
            const links = [];
            const re = /<a[^>]*href="(https?:\/\/[^"]+)"[^>]*data-showurl[^>]*>([\s\S]*?)<\/a>/gi;
            let m;
            while ((m = re.exec(resp.body)) !== null) {
              const href = m[1], text = m[2].replace(/<[^>]+>/g, '').trim();
              if (href && text && text.length > 5 && !href.includes('baidu.com') && !links.find(l => l.url === href)) {
                links.push({ url: href, title: text });
              }
            }
            // Try broader regex if none found
            if (links.length === 0) {
              const re2 = /href="(https?:\/\/[^"]+)"[^>]*>([^<]{10,100})<\/a>/gi;
              while ((m = re2.exec(resp.body)) !== null) {
                const href = m[1], text = m[2].replace(/<[^>]+>/g, '').trim();
                if (href && text && !href.includes('baidu.com') && !links.find(l => l.url === href) && links.length < 10) {
                  links.push({ url: href, title: text });
                }
              }
            }
            console.log('[搜索] 找到 ' + links.length + ' 个链接');
            const results = [];
            for (const link of links.slice(0, 5)) {
              try {
                const r = await scrapeUrl(link.url);
                if (r.content.length > 100) results.push(r);
              } catch (e) { continue; }
            }
            return json(res, { success: true, results, keyword });
          } catch (e) {
            return json(res, { success: false, error: '搜索失败: ' + e.message });
          }
        }

        return json(res, { success: false, error: '请提供 url 或 keyword' }, 400);
      } catch (e) {
        json(res, { success: false, error: e.message }, 500);
      }
    });
    return;
  }

  if (req.url === '/health') return json(res, { status: 'ok' });
  json(res, { error: 'Not found' }, 404);
});

server.listen(PORT, () => {
  console.log('  智驾研究台 爬虫服务器 v5');
  console.log('  http://localhost:' + PORT + '/api/scrape');
  console.log('  模式: URL直接抓取 + 百度关键词搜索');
  console.log('');
});
