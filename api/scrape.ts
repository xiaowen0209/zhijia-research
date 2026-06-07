import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ScrapeRequest {
  keyword: string;
  sources: string[];
  dataTypes: string[];
  limit: number;
}

interface ScrapeResult {
  id: string;
  source: string;
  type: string;
  title: string;
  content: string;
  date: string;
  url: string;
  parsed: any;
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { keyword, sources = [], dataTypes = [], limit = 10 } = req.body as ScrapeRequest;

    if (!keyword) {
      return res.status(400).json({ success: false, error: 'Missing keyword' });
    }

    const apifyToken = process.env.APIFY_API_KEY;
    if (!apifyToken) {
      return res.status(500).json({ success: false, error: 'APIFY_API_KEY not configured' });
    }

    const { ApifyClient } = require('apify-client');
    const client = new ApifyClient({ token: apifyToken });

    // Build search query
    const searchQuery = buildSearchQuery(keyword, dataTypes);

    // Step 1: Google Search for relevant URLs
    let allUrls: string[] = [];
    try {
      const searchRun = await client.actor('apify/google-search-scraper').call({
        queries: searchQuery,
        maxResultsPerQuery: Math.min(limit * 2, 50)
      });

      const { items } = await client.dataset(searchRun.defaultDatasetId).listItems();
      allUrls = (items || [])
        .map((item: any) => item.url || item.link)
        .filter((url: string) => url && !url.includes('google.com'))
        .slice(0, limit);
    } catch (e: any) {
      console.error('Search error:', e.message);
      return res.status(500).json({
        success: false,
        error: `搜索失败: ${e.message}。请检查 APIFY_API_KEY 是否正确。`
      });
    }

    if (allUrls.length === 0) {
      return res.status(200).json({
        success: true,
        results: [],
        message: `未找到与"${keyword}"相关的结果`
      });
    }

    // Step 2: Scrape each URL
    const results: ScrapeResult[] = [];
    for (const url of allUrls) {
      try {
        const scrapeRun = await client.actor('apify/web-scraper').call({
          startUrls: [{ url }],
          runMode: 'PRODUCTION',
          maxCrawlingDepth: 0,
          maxCrawlPages: 1,
          saveHtml: false,
          saveFiles: false,
          removeElementsCssSelector: 'nav, footer, script, style',
        });

        const { items: scrapedItems } = await client.dataset(scrapeRun.defaultDatasetId).listItems();

        if (scrapedItems && scrapedItems.length > 0) {
          const content = scrapedItems[0];
          const parsed = parseContent(content, dataTypes);
          results.push({
            id: generateId(),
            source: identifySource(url),
            type: identifyDataType(content, dataTypes),
            title: content.title || content.headline || '',
            content: unescapeHtml(content.text || content.html || '').slice(0, 2000),
            date: extractDate(content),
            url: url,
            parsed
          });
        }
      } catch (e: any) {
        console.error(`Failed to scrape ${url}:`, e.message);
        results.push({
          id: generateId(),
          source: 'unknown',
          type: 'unknown',
          title: `抓取失败: ${url.slice(0, 60)}`,
          content: '',
          date: '',
          url,
          parsed: null,
          error: e.message
        });
      }
    }

    return res.status(200).json({ success: true, results });
  } catch (error: any) {
    console.error('Scrape error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Unknown error' });
  }
}

// ===== Helper Functions =====

function buildSearchQuery(keyword: string, dataTypes: string[]): string {
  const query = `${keyword} 智能驾驶 自动驾驶`;
  if (dataTypes.includes('ota')) return `${query} OTA 版本更新`;
  if (dataTypes.includes('test')) return `${query} 实测 测评 体验`;
  if (dataTypes.includes('news')) return `${query} 新闻 动态`;
  if (dataTypes.includes('issue')) return `${query} 问题 口碑 反馈`;
  return query;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function identifySource(url: string): string {
  if (url.includes('36kr.com')) return '36氪';
  if (url.includes('jiemian.com')) return '界面新闻';
  if (url.includes('bilibili.com')) return '哔哩哔哩';
  if (url.includes('douyin.com')) return '抖音';
  if (url.includes('weibo.com')) return '微博';
  if (url.includes('dongchedi.com')) return '懂车帝';
  if (url.includes('autohome.com.cn')) return '汽车之家';
  if (url.includes('xcar.com.cn')) return '爱卡汽车';
  if (url.includes('d1ev.com')) return '第一电动';
  if (url.includes('cnii.com.cn') || url.includes('163.com/auto')) return '汽车媒体';
  if (url.includes('huawei.com') || url.includes('tesla.cn') || url.includes('xiaopeng.com') || url.includes('lixiang.com')) return '品牌官网';
  return '网页';
}

function identifyDataType(content: any, dataTypes: string[]): string {
  const text = (content.title || '') + ' ' + (content.text || '');
  if (dataTypes.includes('ota') && /\b(OTA|版本|推送|升级|更新)\b/.test(text)) return 'ota';
  if (dataTypes.includes('test') && /\b(实测|测评|试驾|体验|测试)\b/.test(text)) return 'test';
  if (dataTypes.includes('issue') && /\b(问题|bug|故障|缺陷|投诉|召回)\b/i.test(text)) return 'issue';
  return 'news';
}

function extractDate(content: any): string {
  const text = (content.text || content.title || '') + (content.date || '');
  const dateMatch = text.match(/(\d{4}[-/年]\d{1,2}[-/月]\d{1,2})/);
  if (dateMatch) {
    return dateMatch[1]
      .replace('年', '-')
      .replace('月', '-')
      .replace('日', '')
      .replace(/\//g, '-');
  }
  return new Date().toISOString().slice(0, 10);
}

function parseContent(content: any, dataTypes: string[]): any {
  const text = (content.text || content.title || '').slice(0, 3000);
  const result: any = {};

  // Extract brand
  const brand = identifyBrand(text);
  if (brand) {
    result.brand = brand;
  }

  // Extract version info
  const versionMatch = text.match(/([A-Z][A-Za-z]*[\s.]*\d+\.?\d*)/);
  if (versionMatch && dataTypes.includes('ota')) {
    result.version = versionMatch[1].trim();
  }

  // Extract features (lines or comma-separated after keywords)
  const featureMatch = text.match(/(?:功能|新增|支持|特点)[:：]?\s*(.+?)(?:[。！\n]|$)/);
  if (featureMatch) {
    const features = featureMatch[1].split(/[,，、;；]/).map(f => f.trim()).filter(f => f.length > 2).slice(0, 5);
    if (features.length > 0) result.features = features;
  }

  return result;
}

function identifyBrand(text: string): string | null {
  const brandMap: Record<string, string[]> = {
    'H': ['华为', 'ADS', '问界', '鸿蒙智驾', '鸿蒙'],
    'X': ['小鹏', 'XNGP', 'G9', 'P7', 'P5', 'MONA'],
    'T': ['特斯拉', 'FSD', 'Model', 'Autopilot', 'HW4'],
    'L': ['理想', 'AD Max', 'L7', 'L6', 'AD Pro', 'MEGA'],
    'Mi': ['小米', 'SU7', 'Xiaomi Pilot', 'HyperOS', '小米智驾'],
    'HX': ['地平线', 'Horizon', 'HSD', '征程', 'J6P'],
    'BYD': ['比亚迪', 'BYD', '天神之眼', '腾势', '仰望']
  };
  for (const [brand, keywords] of Object.entries(brandMap)) {
    if (keywords.some(kw => text.includes(kw))) return brand;
  }
  return null;
}

function unescapeHtml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));
}