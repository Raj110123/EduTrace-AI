const { YoutubeTranscript } = require('youtube-transcript');

/**
 * Extracts video ID from a YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null
 */
const extractVideoId = (url) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtube.com')) {
      return parsedUrl.searchParams.get('v');
    } else if (parsedUrl.hostname.includes('youtu.be')) {
      return parsedUrl.pathname.slice(1);
    }
  } catch (error) {
    console.error('Invalid URL passed to extractVideoId');
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
      throw new Error('Invalid YouTube URL');
    }

    const transcriptList = await YoutubeTranscript.fetchTranscript(videoId);
    
    // Parse the transcript into segments and raw text
    let rawText = '';
    const segments = transcriptList.map(item => {
      // Decode potential HTML entities in text
      const decodedText = item.text.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
      rawText += decodedText + ' ';
      return {
        text: decodedText,
        startTime: item.offset,
        endTime: item.offset + item.duration
      };
    });

    return {
      videoId,
      raw: rawText.trim(),
      segments
    };
  } catch (error) {
    console.error(`Error fetching transcript: ${error.message}`);
    throw new Error('Could not fetch video transcript. Subtitles may be disabled or video might be private.');
  }
};

module.exports = {
  extractVideoId,
  fetchTranscript
};
