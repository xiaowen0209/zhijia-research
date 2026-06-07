import { ApifyClient } from 'apify';

export default async function handler(req, res) {
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
    const { keyword, sources = [], dataTypes = [], limit = 10 } = await req.json();

    if (!keyword) {
      return res.status(400).json({ success: false, error: 'Missing keyword' });
    }

    const client = new ApifyClient({ token: process.env.APIFY_API_KEY });

    // Step 1: Search for relevant URLs (using Google Search)
    const searchQuery = buildSearchQuery(keyword, dataTypes);
    const searchResults = await runActor(client, 'apify/google-search-scraper', {
      queries: [searchQuery],
      maxResults: limit * 2
    });

    // Step 2: Extract URLs and deduplicate
    const allUrls = extractUrls(searchResults).slice(0, limit);
    console.log('Extracted URLs:', allUrls.length);

    // Step 3: Scrape content for each URL
    const results = [];
    for (const url of allUrls) {
      try {
        const scraped = await runActor(client, 'apify/web-scraper', {
          startUrls: [url],
          maxDepth: 0,
          maxPages: 1
        });

        if (scraped && scraped.items && scraped.items.length > 0) {
          const content = scraped.items[0];
          const parsed = parseContent(content, dataTypes);
          results.push({
            id: generateId(),
            source: identifySource(url),
            type: identifyDataType(content, dataTypes),
            title: content.title || '',
            content: content.text || '',
            date: extractDate(content),
            url: url,
            parsed
          });
        }
      } catch (e) {
        console.error(`Failed to scrape ${url}:`, e.message);
        results.push({
          id: generateId(),
          source: 'unknown',
          type: 'unknown',
          title: '抓取失败',
          content: '',
          date: '',
          url,
          parsed: null,
          error: e.message
        });
      }
    }

    return res.status(200).json({ success: true, results });
  } catch (error) {
    console.error('Scrape error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// ===== Helper Functions =====

function buildSearchQuery(keyword, dataTypes) {
  const query = `${keyword} 智能驾驶 自动驾驶`;
  if (dataTypes.includes('ota')) return `${query} OTA 版本`;
  if (dataTypes.includes('test')) return `${query} 实测 测评`;
  if (dataTypes.includes('news')) return `${query} 新闻 动态`;
  if (dataTypes.includes('issue')) return `${query} 问题 口碑`;
  return query;
}

function extractUrls(searchResults) {
  const urls = [];
  if (!searchResults || !searchResults.items) return urls;
  searchResults.items.forEach(item => {
    if (item.url) urls.push(item.url);
    if (item.link) urls.push(item.link);
  });
  return [...new Set(urls)];
}

function runActor(client, actorId, input) {
  return client.actor(actorId).call(input);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function identifySource(url) {
  if (url.includes('36kr.com')) return '36氪';
  if (url.includes('jiemian.com')) return '界面新闻';
  if (url.includes('bilibili.com') || url.includes('douyin.com')) return '短视频';
  if (url.includes('weibo.com')) return '微博';
  if (url.includes('dongchedi.com')) return '懂车帝';
  if (url.includes('huawei.com') || url.includes('tesla.cn')) return '品牌官网';
  return 'unknown';
}

function identifyDataType(content, dataTypes) {
  const text = (content.title || '') + ' ' + (content.text || '');
  if (dataTypes.includes('ota') && (text.includes('版本') || text.includes('OTA') || text.includes('推送'))) return 'ota';
  if (dataTypes.includes('test') && (text.includes('实测') || text.includes('测评') || text.includes('体验'))) return 'test';
  if (dataTypes.includes('news') && !text.includes('版本')) return 'news';
  if (dataTypes.includes('issue') && (text.includes('问题') || text.includes('bug') || text.includes('故障'))) return 'issue';
  return 'unknown';
}

function extractDate(content) {
  // Try to extract date from content text or meta
  const text = content.text || content.title || '';
  // Date patterns: 2024-05-28, 5月28日, etc.
  const dateMatch = text.match(/(\d{4}[-/年]\d{1,2}[-/月]\d{1,2})日?/);
  if (dateMatch) {
    return dateMatch[1].replace(/[-/年]/g, '-');
  }
  return new Date().toISOString().slice(0, 10);
}

function parseContent(content, dataTypes) {
  const text = content.text || content.title || '';
  const result: any = {};

  if (dataTypes.includes('ota')) {
    // Try to extract version info
    const versionMatch = text.match(/([A-Za-z]+\s*\d+\.?\d*)/);
    if (versionMatch) result.version = versionMatch[1];
  }

  // Extract brand
  const brand = identifyBrand(text);
  if (brand) result.brand = brand;

  return result;
}

function identifyBrand(text) {
  const brandMap = {
    '华为ADS': ['华为', 'ADS', '问界', '鸿蒙智驾'],
    '小鹏XNGP': ['小鹏', 'XNGP', 'G9', 'P7', 'P5'],
    '特斯拉FSD': ['特斯拉', 'FSD', 'Model', 'Autopilot'],
    '理想AD Max': ['理想', 'AD Max', 'L7', 'L6', 'AD Pro'],
    '小米智驾': ['小米', 'SU7', 'Xiaomi Pilot', 'HyperOS'],
    '地平线HSD': ['地平线', 'Horizon', 'HSD', '征程', 'J6P'],
    '比亚迪': ['比亚迪', 'BYD', '天神之眼', '腾势']
  };
  for (const [brand, keywords] of Object.entries(brandMap)) {
    if (keywords.some(kw => text.includes(kw))) return brand;
  }
  return null;
}