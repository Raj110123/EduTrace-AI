'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import VideoPlayer from '@/components/video/VideoPlayer';
import TranscriptPanel from '@/components/video/TranscriptPanel';
import { PlayCircle, FileText, MessageSquare } from 'lucide-react';

export default function VideoAnalysisPage() {
  const { videoId } = useParams();
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('quiz');
  const [playerInfo, setPlayerInfo] = useState({ currentTime: 0 });
  
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get(`/personal/video/${videoId}`);
        if(res.data.success) {
          setVideo(res.data.video);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchVideo();
    
    return () => clearInterval(intervalRef.current);
  }, [videoId]);

  const handlePlayerReady = (event) => {
    playerRef.current = event.target;
    
    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setPlayerInfo({ currentTime: playerRef.current.getCurrentTime() });
      }
    }, 1000);
  };

  const handleTimestampClick = (seconds) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(seconds, true);
      playerRef.current.playVideo();
    }
  };

  if (loading || !video) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading video data...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
      
      {/* Left Column: Video & Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '0.5rem', overflow: 'hidden' }}>
           <VideoPlayer 
             videoId={video.youtubeVideoId} 
             onReady={handlePlayerReady} 
           />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          <TabButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} icon={<PlayCircle size={18} />} label="Take Quiz" />
          <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={<FileText size={18} />} label="Summary" />
          <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={18} />} label="AI Doubt Resolver" />
        </div>
        
        <div className="tab-content" style={{ minHeight: '300px' }}>
          {activeTab === 'quiz' && <QuizGeneratorTab videoId={videoId} />}
          {activeTab === 'summary' && <div>Summary Generator (Coming Soon)</div>}
          {activeTab === 'chat' && <div>Chat Interface (Coming Soon)</div>}
        </div>
      </div>
      
      {/* Right Column: Transcript */}
      <div>
        <TranscriptPanel 
          segments={video.transcript.segments} 
          onTimestampClick={handleTimestampClick} 
          activeTime={playerInfo.currentTime} 
        />
      </div>

    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.75rem 1.25rem',
        background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        border: 'none',
        borderBottom: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: active ? '600' : '500',
        transition: 'all 0.2s'
      }}
    >
      <span style={{ color: active ? 'var(--accent-primary)' : 'inherit' }}>{icon}</span>
      {label}
    </button>
  );
}

function QuizGeneratorTab({ videoId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const generateQuiz = async () => {
    setLoading(true);
    try {
      // Mocked request to generate quiz
      const res = await api.post('/personal/generate-quiz', { videoId, difficulty: 'medium' });
      if (res.data.success) {
         router.push(`/personal/quiz/${res.data.quiz._id}`);
      }
    } catch (err) {
      console.error(err);
      // Fallback redirect for visual purposes if backend drops
      router.push(`/personal/quiz/mock-id`);
    }
  };

  return (
    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <PlayCircle size={32} />
      </div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Generate Auto-Quiz</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
        Test your understanding of this video. We'll generate 10 MCQs and 5 short answer questions based exactly on the transcript.
      </p>
      <button onClick={generateQuiz} className="btn btn-primary" disabled={loading} style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
        {loading ? 'AI is analyzing transcript...' : 'Generate New Quiz'}
      </button>
    </div>
  );
}
