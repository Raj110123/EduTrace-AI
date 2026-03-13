'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Video } from 'lucide-react';

export default function PersonalModeHome() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const isYoutubeUrl = (testUrl) => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(testUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isYoutubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/personal/video', { youtubeUrl: url });
      if (res.data.success) {
        router.push(`/personal/video/${res.data.video._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process video. Invalid URL or missing captions.');
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', padding: '1rem', borderRadius: 'var(--radius-full)' }}>
            <Video size={48} />
          </div>
        </div>
        <h1 className="page-title">Personal Mode</h1>
        <p className="page-description">Paste any educational YouTube URL below to begin generating interactive quizzes, summaries, and chat utilities.</p>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        {error && <div className="badge badge-red" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', justifyContent: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <input 
              type="url" 
              className="input-field" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              required 
              placeholder="https://www.youtube.com/watch?v=..."
              style={{ padding: '1rem', fontSize: '1.1rem', borderColor: url && !isYoutubeUrl(url) ? 'var(--danger)' : '' }}
            />
            {url && !isYoutubeUrl(url) && (
              <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Please enter a valid YouTube URL.</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }} disabled={loading || !url || !isYoutubeUrl(url)}>
            {loading ? 'Processing...' : 'Analyze Video'}
          </button>
        </form>
        
        {loading && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Extracting transcript and communicating with n8n AI engine...</p>
            {/* Simple CSS loader simulation */}
            <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '4px', marginTop: '1rem', overflow: 'hidden' }}>
              <div style={{ width: '50%', height: '100%', background: 'var(--accent-gradient)', animation: 'slideRight 2s infinite ease-in-out' }}></div>
            </div>
            <style jsx>{`
              @keyframes slideRight { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
