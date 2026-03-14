const { YouTubeTranscriptApi } = require('yt-transcript-api');

/**
 * Extracts video ID from a YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null
 */
const extractVideoId = (url) => {
  try {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
      /(?:youtu\.be\/)([^?\s]+)/,
      /(?:youtube\.com\/embed\/)([^?\s]+)/,
      /(?:youtube\.com\/v\/)([^?\s]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    // Check if it's already a 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtube.com')) {
      return parsedUrl.searchParams.get('v');
    } else if (parsedUrl.hostname.includes('youtu.be')) {
      return parsedUrl.pathname.slice(1);
    }
  } catch (error) {
    console.error('Invalid URL passed to extractVideoId:', url);
  }
  return null;
};

/**
 * Fetches the transcript for a given YouTube video
 * @param {string} url - YouTube video URL
 * @returns {Promise<Object>} - Transcript segments and raw text
 */
const fetchTranscript = async (url) => {
  try {
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error(`Invalid YouTube URL: ${url}`);
    }

    console.log(`[TranscriptService] Fetching transcript for videoId: ${videoId}`);
    // Using getTranscript instead of fetch which is undefined
    const transcriptList = await YouTubeTranscriptApi.getTranscript(videoId);
    
    if (!transcriptList || transcriptList.length === 0) {
      throw new Error('Transcript returned empty.');
    }

    console.log(`[TranscriptService] Got ${transcriptList.length} segments. Sample:`, JSON.stringify(transcriptList[0]));

    let rawText = '';
    const segments = transcriptList.map(item => {
      const text = (item.text || '')
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\n/g, ' ')
        .trim();
      rawText += text + ' ';

      const startTime = item.start || 0;
      const duration = item.duration || item.dur || 0;

      return {
        text,
        startTime: Math.round(startTime * 100) / 100,
        endTime: Math.round((startTime + duration) * 100) / 100
      };
    });

    console.log(`[TranscriptService] Parsed ${segments.length} segments, raw text length: ${rawText.length}`);

    return {
      videoId,
      raw: rawText.trim(),
      segments
    };
  } catch (error) {
    console.error(`[TranscriptService] Error fetching transcript:`, error);
    throw new Error(`Could not fetch video transcript: ${error.message || 'Internal error'}`);
  }
};

/**
 * Parses a transcript string with timestamps [MM:SS] into segments
 * @param {string} rawText 
 * @returns {Array} - Array of segments
 */
const parseTranscriptSegments = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return [];

  const lines = rawText.split('\n');
  const parsedSegments = [];

  lines.forEach(line => {
    // Match [MM:SS] or [HH:MM:SS]
    const match = line.match(/\[((\d{1,2}:)?\d{1,2}:\d{2})\]/);
    if (match) {
      const timeStr = match[1];
      const text = line.replace(match[0], '').trim();
      
      const parts = timeStr.split(':').map(Number);
      let seconds = 0;
      if (parts.length === 3) {
        seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        seconds = parts[0] * 60 + parts[1];
      }
      
      parsedSegments.push({
        startTime: seconds,
        text,
        endTime: seconds + 5 // Approximate end time
      });
    } else if (line.trim()) {
      if (parsedSegments.length > 0) {
        parsedSegments[parsedSegments.length - 1].text += ' ' + line.trim();
      } else {
        parsedSegments.push({ startTime: 0, text: line.trim(), endTime: 5 });
      }
    }
  });

  return parsedSegments;
};

module.exports = {
  extractVideoId,
  fetchTranscript,
  parseTranscriptSegments
};

