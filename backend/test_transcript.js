const { YouTubeTranscript } = require('youtube-transcript');

async function test() {
  try {
    const videoId = 'l6ZxKq1zFVk';
    console.log(`Fetching transcript for ${videoId}...`);
    const transcript = await YouTubeTranscript.fetchTranscript(videoId);
    console.log(`Success! Got ${transcript.length} segments.`);
    console.log('First segment:', transcript[0]);
  } catch (error) {
    console.error('Failed:', error);
  }
}

test();
