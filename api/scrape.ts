import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { keyword, sources = [], dataTypes = [], limit = 10 } = req.body;
    if (!keyword) return res.status(400).json({ success: false, error: 'Missing keyword' });

    // Step 1: Search DuckDuckGo for relevant URLs
    const searchQuery = buildSearchQuery(keyword, dataTypes);
    const urls = await searchDuckDuckGo(searchQuery, limit);

    // Step 2: Scrape each URL
    const results = [];
    for (const item of urls) {
      try {
        const scraped = await scrapePage(item.url);
        const text = (scraped.title + ' ' + scraped.content).slice(0, 5000);
        results.push({
          id: generateId(),
          source: identifySource(item.url),
          type: identifyDataType(text, dataTypes),
          title: scraped.title || item.title || '',
          content: scraped.content.slice(0, 2000),
          date: extractDate(text),
          url: item.url,
          parsed: parseContent(text, dataTypes)
        });
      } catch (e: any) {
        results.push({
          id: generateId(),
          source: 'unknown',
          type: 'unknown',
          title: item.title || item.url.slice(0, 60),
          content: '',
          date: '',
          url: item.url,
          parsed: null
        });
      }
    }

    return res.status(200).json({ success: true, results });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function searchDuckDuckGo(query: string, limit: number): Promise<{url: string; title: string}[]> {
  const params = new URLSearchParams({ q: query, ia: 'web' });
  const resp = await fetch(`https://lite.duckduckgo.com/lite/?${params}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ZhijiaBot/1.0)' }
  });
  const html = await resp.text();
  const $ = cheerio.load(html);

  const results: {url: string; title: string}[] = [];
  $('a.result-link, table tr a[rel="nofollow"]').each((_, el) => {
    const $el = $(el);
    const url = cleanUrl($el.attr('href') || '');
    const title = $el.text().trim();
    if (url && !url.includes('duckduckgo.com') && !url.includes('youtube.com')) {
      results.push({ url, title });
    }
  });

  return results.slice(0, limit);
}

async function scrapePage(url: string): Promise<{title: string; content: string}> {
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ZhijiaBot/1.0)' },
      signal: AbortSignal.timeout(10000)
    });
    const html = await resp.text();
    const $ = cheerio.load(html);

    // Remove noise
    $('script, style, nav, footer, iframe, .ad, .sidebar, .comment').remove();

    const title = $('title').text().trim() || $('h1').first().text().trim();
    let content = '';

    // Try common content selectors first
    const selectors = ['article', '.article', '.content', '.post', '.entry', '.main', 'main', '#content', '#main'];
    for (const sel of selectors) {
      const el = $(sel);
      if (el.length && (el.text().length > 200)) {
        content = el.text();
        break;
      }
    }

    // Fallback to body text
    if (!content) content = $('body').text();

    // Clean up
    content = content.replace(/\s+/g, ' ').trim();

    return { title, content };
  } catch {
    return { title: '', content: '' };
  }
}

function cleanUrl(url: string): string {
  // Remove DuckDuckGo redirect wrapper
  const match = url.match(/uddg=(https?%3A[^&]+)/);
  if (match) return decodeURIComponent(match[1]);
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('http')) return url;
  return '';
}

function buildSearchQuery(keyword: string, dataTypes: string[]): string {
  const prefix = keyword + ' 智能驾驶 自动驾驶';
  if (dataTypes.includes('ota')) return prefix + ' OTA 版本';
  if (dataTypes.includes('test')) return prefix + ' 实测 测评';
  if (dataTypes.includes('news')) return prefix + ' 新闻';
  return prefix;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function identifySource(url: string): string {
  const map: Record<string, string> = {
    '36kr.com': '36氪', 'bilibili.com': '哔哩哔哩', 'douyin.com': '抖音',
    'weibo.com': '微博', 'dongchedi.com': '懂车帝', 'autohome.com.cn': '汽车之家',
    'd1ev.com': '第一电动', 'jiemian.com': '界面', 'cnii.com.cn': '中国信通院',
    '163.com': '网易', 'qq.com': '腾讯', 'zhihu.com': '知乎', 'gasgoo.com': '盖世汽车'
  };
  for (const [k, v] of Object.entries(map)) {
    if (url.includes(k)) return v;
  }
  return '网页';
}

function identifyDataType(text: string, dataTypes: string[]): string {
  if (dataTypes.includes('ota') && /OTA|版本|推送|升级/.test(text)) return 'ota';
  if (dataTypes.includes('test') && /实测|测评|试驾|体验|测试/.test(text)) return 'test';
  if (dataTypes.includes('issue') && /问题|故障|投诉|缺陷|召回/.test(text)) return 'issue';
  return 'news';
}

function extractDate(text: string): string {
  const m = text.match(/(\d{4}[-/年]\d{1,2}[-/月]\d{1,2})/);
  return m ? m[1].replace(/[年/]/g, '-').replace(/月/, '-').replace(/日/, '') : '';
}

function parseContent(text: string, dataTypes: string[]): any {
  const result: any = {};
  const brand = identifyBrand(text);
  if (brand) result.brand = brand;
  const vm = text.match(/([A-Z][A-Za-z]*\s*\d+\.?\d*)/);
  if (vm && dataTypes.includes('ota')) result.version = vm[1].trim();
  return result;
}

function identifyBrand(text: string): string | null {
  const map: Record<string, string[]> = {
    'H': ['华为', 'ADS', '问界', '鸿蒙智驾'],
    'X': ['小鹏', 'XNGP', 'G9', 'P7'],
    'T': ['特斯拉', 'FSD', 'Model'],
    'L': ['理想', 'AD Max', 'L7', 'L6', 'AD Pro'],
    'Mi': ['小米', 'SU7', 'Xiaomi Pilot'],
    'HX': ['地平线', 'HSD', '征程', 'J6P'],
    'BYD': ['比亚迪', 'BYD', '天神之眼']
  };
  for (const [k, v] of Object.entries(map)) {
    if (v.some(kw => text.includes(kw))) return k;
  }
  return null;
}