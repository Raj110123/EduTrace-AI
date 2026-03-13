'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Video, Edit3, Settings, Users, Plus, Play } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Link from 'next/link';

export default function InstructorClassroomDetail() {
  const { classId } = useParams();
  const router = useRouter();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    // Mock fetch classroom
    setClassroom({
      _id: classId,
      name: 'CS101: Intro to React',
      joinCode: 'React-324A',
      videos: [
        { _id: 'v1', title: 'React State Management', url: 'https://youtube.com/watch?v=123', hasQuiz: true, published: true },
        { _id: 'v2', title: 'React Context API', url: 'https://youtube.com/watch?v=456', hasQuiz: false, published: false }
      ],
      students: [{ _id: 's1', name: 'Alice' }, { _id: 's2', name: 'Bob' }]
    });
    setLoading(false);
  }, [classId]);

  const handleUploadVideo = (e) => {
    e.preventDefault();
    if(!videoUrl) return;
    // Mock upload
    setClassroom({
      ...classroom,
      videos: [...classroom.videos, { _id: `v${Date.now()}`, title: 'Newly Uploaded Lecture', url: videoUrl, hasQuiz: false, published: false }]
    });
    setVideoUrl('');
    setIsUploadModalOpen(false);
  };

  if (loading || !classroom) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading Classroom...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
           <Link href="/college/instructor" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
           <h1 className="page-title" style={{ fontSize: '2rem' }}>{classroom.name}</h1>
           <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
             <span className="badge badge-blue">Code: {classroom.joinCode}</span>
             <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={12}/> {classroom.students.length} Students</span>
           </div>
        </div>
        <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(true)}>
          <Video size={18} /> Upload Lecture
        </button>
      </div>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Course Materials</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {classroom.videos.length === 0 ? (
           <p style={{ color: 'var(--text-secondary)' }}>No lectures uploaded yet.</p>
        ) : (
          classroom.videos.map((vid) => (
             <div key={vid._id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                      <Play size={24} />
                   </div>
                   <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{vid.title}</h3>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                         {vid.hasQuiz ? <span className="badge badge-green">Quiz Generated</span> : <span className="badge badge-yellow">No Quiz</span>}
                         {vid.published ? <span className="badge badge-blue">Published to Students</span> : <span className="badge badge-red">Draft</span>}
                      </div>
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => router.push(`/personal/video/${vid._id}`)}>
                      <Edit3 size={16} /> Manage Content
                   </button>
                </div>
             </div>
          ))
        )}
      </div>

      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Video Lecture">
        <form onSubmit={handleUploadVideo}>
          <div className="input-group">
            <label className="input-label">YouTube URL</label>
            <input 
              type="url" 
              className="input-field" 
              value={videoUrl} 
              onChange={(e) => setVideoUrl(e.target.value)} 
              placeholder="https://youtube.com/watch?v=..."
              required 
            />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            We will extract the transcript so you can verify it before publishing.
          </p>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Import Video</button>
        </form>
      </Modal>

    </div>
  );
}
