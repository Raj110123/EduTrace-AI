'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Users, Plus, Video, Copy, ExternalLink, Activity } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Link from 'next/link';

export default function InstructorDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  useEffect(() => {
    if (!loading && user?.role !== 'instructor') {
      router.push('/dashboard');
    }
    
    // Mock classes fetch
    setClasses([
       { _id: 'c1', name: 'CS101: Intro to React', joinCode: 'React-324A', studentCount: 24, activeQuizzes: 3 },
       { _id: 'c2', name: 'Advanced Web Dev', joinCode: 'Web-890B', studentCount: 15, activeQuizzes: 1 }
    ]);
  }, [user, loading, router]);

  const handleCreateClass = (e) => {
    e.preventDefault();
    if(!newClassName.trim()) return;
    
    const newClass = {
      _id: `c${Date.now()}`,
      name: newClassName,
      joinCode: `${newClassName.substring(0,4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      studentCount: 0,
      activeQuizzes: 0
    };
    
    setClasses([...classes, newClass]);
    setNewClassName('');
    setIsModalOpen(false);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Join code copied to clipboard!');
  };

  if (loading || !user) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading Instructor Dashboard...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
           <h1 className="page-title">Instructor Dashboard</h1>
           <p className="page-description">Manage your classrooms, upload videos, and publish verfied assessments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create New Class
        </button>
      </div>

      <div className="grid-cards">
        {classes.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
             <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>No active classrooms</h3>
             <p>Create your first class to start onboarding students and assigning dynamic video quizzes.</p>
          </div>
        ) : (
          classes.map((cls) => (
            <div key={cls._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', paddingRight: '1rem' }}>{cls.name}</h2>
                  <div className="badge badge-blue">{cls.studentCount} Students</div>
               </div>
               
               <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Join Code</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' }}>{cls.joinCode}</span>
                  </div>
                  <button className="btn btn-secondary" onClick={() => copyCode(cls.joinCode)} style={{ padding: '0.5rem' }} title="Copy Code">
                    <Copy size={16} />
                  </button>
               </div>
               
               <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                 <Link href={`/college/instructor/${cls._id}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                   Manage Class
                 </Link>
                 <Link href={`/college/instructor/${cls._id}/analytics`} className="btn btn-secondary" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="View Analytics">
                   <Activity size={18} />
                 </Link>
               </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Classroom">
        <form onSubmit={handleCreateClass}>
          <div className="input-group">
            <label className="input-label">Classroom Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={newClassName} 
              onChange={(e) => setNewClassName(e.target.value)} 
              placeholder="e.g. Intro to Computer Science"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Create Class</button>
        </form>
      </Modal>

    </div>
  );
}
