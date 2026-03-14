const { YouTubeTranscriptApi } = require('yt-transcript-api');

async function test() {
  try {
    const videoId = 'l6ZxKq1zFVk';
    console.log(`Fetching transcript for ${videoId} using YouTubeTranscriptApi.fetch...`);
    const transcript = await YouTubeTranscriptApi.fetch(videoId);
    console.log(`Success! Got ${transcript.length} segments.`);
    console.log('First segment:', transcript[0]);
  } catch (error) {
    console.error('Failed:', error);
  }
}

test();
