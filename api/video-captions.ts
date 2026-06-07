import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'Missing video URL' });
    }

    const platform = identifyPlatform(url);
    const apifyToken = process.env.APIFY_API_KEY;

    if (!apifyToken) {
      return res.status(500).json({ success: false, error: 'APIFY_API_KEY not configured' });
    }

    const { ApifyClient } = require('apify-client');
    const client = new ApifyClient({ token: apifyToken });

    try {
      // For Bilibili and Douyin, try to scrape the page for metadata
      const scrapeRun = await client.actor('apify/web-scraper').call({
        startUrls: [{ url }],
        runMode: 'PRODUCTION',
        maxCrawlingDepth: 0,
        maxCrawlPages: 1,
        saveHtml: false,
        saveFiles: false
      });

      const { items } = await client.dataset(scrapeRun.defaultDatasetId).listItems();

      if (items && items.length > 0) {
        const content = items[0];
        const captions: string[] = [];

        // Try to extract title and description as captions
        if (content.title) captions.push(`标题: ${content.title}`);
        if (content.text) {
          const text = unescapeHtml(content.text);
          // Split into sentences for better readability
          const sentences = text
            .replace(/\s+/g, ' ')
            .match(/[^。！？.!?\n]+[。！？.!?]?/g)
            ?.slice(0, 20)
            ?.map(s => s.trim())
            ?.filter(s => s.length > 5) || [];
          captions.push(...sentences);
        }

        return res.status(200).json({
          success: true,
          platform,
          url,
          captions: captions.filter(Boolean),
          title: content.title || '',
          description: (content.text || '').slice(0, 500)
        });
      }

      return res.status(200).json({
        success: false,
        platform,
        error: `无法从 ${platform} 获取视频信息`,
        note: `${platform} 的视频字幕提取可能需要该平台的官方 API。请尝试手动复制视频描述和评论区的文字内容。`
      });
    } catch (e: any) {
      return res.status(500).json({
        success: false,
        platform,
        error: `提取失败: ${e.message}`
      });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

function identifyPlatform(url: string): string {
  if (url.includes('bilibili.com')) return '哔哩哔哩';
  if (url.includes('douyin.com')) return '抖音';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('weibo.com')) return '微博';
  if (url.includes('ixigua.com')) return '西瓜视频';
  return '未知平台';
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