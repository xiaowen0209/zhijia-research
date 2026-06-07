import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'Missing video URL' });

    const platform = identifyPlatform(url);
    const captions: string[] = [];

    try {
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ZhijiaBot/1.0)' },
        signal: AbortSignal.timeout(10000)
      });
      const html = await resp.text();
      const $ = cheerio.load(html);

      $('script, style, nav, footer, iframe').remove();

      // Extract video title
      const title = $('title').text().trim() || $('h1').first().text().trim();
      if (title) captions.push('📌 标题: ' + title);

      // Extract meta description
      const desc = $('meta[name="description"]').attr('content') ||
                   $('meta[property="og:description"]').attr('content') || '';
      if (desc) captions.push('📝 简介: ' + desc);

      // Extract main text content
      const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
      const sentences = bodyText
        .match(/[^。！？.!?\n]+[。！？.!?]?/g)
        ?.slice(0, 15)
        ?.map(s => s.trim())
        ?.filter(s => s.length > 5) || [];
      captions.push(...sentences);

      return res.status(200).json({
        success: true,
        platform,
        url,
        title,
        description: desc.slice(0, 500),
        captions: captions.filter(Boolean).slice(0, 20)
      });
    } catch (e: any) {
      return res.status(500).json({
        success: false,
        platform,
        error: `无法访问该页面: ${e.message}`
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
  return '网页';
}