export default function TranscriptPanel({ segments, onTimestampClick, activeTime }) {
  // Format seconds to [MM:SS]
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!segments || segments.length === 0) return <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>No transcript available.</div>;

  return (
    <div className="glass-card" style={{ height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
      <h3 style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 10 }}>Transcript</h3>
      
      {segments.map((segment, idx) => {
        const isActive = activeTime >= segment.startTime && activeTime < segment.endTime;
        
        return (
          <div 
            key={idx}
            onClick={() => onTimestampClick(segment.startTime)}
            style={{
              display: 'flex', 
              gap: '1rem', 
              padding: '0.5rem', 
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => {
               if(!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            }}
            onMouseOut={(e) => {
               if(!isActive) e.currentTarget.style.background = 'transparent'
            }}
          >
            <span style={{ color: 'var(--accent-primary)', fontFamily: 'monospace', fontSize: '0.85rem', flexShrink: 0 }}>
              [{formatTime(segment.startTime)}]
            </span>
            <span style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {segment.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
