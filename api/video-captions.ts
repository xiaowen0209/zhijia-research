import { ApifyClient } from 'apify';

export default async function handler(req, res) {
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
    const { url } = await req.json();

    if (!url) {
      return res.status(400).json({ success: false, error: 'Missing video URL' });
    }

    // Parse video platform
    const platform = identifyPlatform(url);
    console.log('Video platform:', platform);

    // Check for Apify video data extractors
    const results = await extractVideoCaptions(url, platform);

    return res.status(200).json(results);
  } catch (error) {
    console.error('Video captions error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

function identifyPlatform(url) {
  if (url.includes('bilibili.com')) return 'bilibili';
  if (url.includes('douyin.com')) return 'douyin';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('weibo.com')) return 'weibo';
  return 'unknown';
}

async function extractVideoCaptions(url, platform) {
  const client = new ApifyClient({ token: process.env.APIFY_API_KEY });

  // Try different Apify actors based on platform
  const actorMap = {
    'bilibili': 'apify/web-scraper', // Generic, would need custom parser
    'douyin': 'apify/web-scraper',
    'youtube': 'apify/web-scraper', // YouTube has official extractor
    'weibo': 'apify/web-scraper',
    'unknown': 'apify/web-scraper'
  };

  const actorId = actorMap[platform] || 'apify/web-scraper';

  try {
    const scraped = await client.actor(actorId).call({
      startUrls: [url],
      maxDepth: 0,
      maxPages: 1
    });

    if (scraped && scraped.items && scraped.items.length > 0) {
      const content = scraped.items[0];
      // Try to extract captions from various sources
      const captions = [];

      // Check for transcript/caption data
      if (content.text) {
        captions.push(content.text);
      }

      // Check for embedded caption data
      if (content.data) {
        if (content.data.transcript) captions.push(content.data.transcript);
        if (content.data.captions) captions.push(...content.data.captions);
      }

      return { success: true, captions: captions };
    }

    // Fallback: Return empty with info
    return {
      success: false,
      error: `No captions found for ${platform}. Try manual text entry.`,
      platform,
      note: `For Douyin/Bilibili, consider using the official video API or manual transcription.`
    };
  } catch (error) {
    return {
      success: false,
      error: `Extraction failed: ${error.message}`,
      platform
    };
  }
}