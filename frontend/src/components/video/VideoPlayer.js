import YouTube from 'react-youtube';

export default function VideoPlayer({ videoId, onReady, startSeconds }) {
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', background: '#000' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <YouTube 
          videoId={videoId} 
          opts={opts} 
          onReady={onReady}
          className="w-full h-full"
          iframeClassName="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
