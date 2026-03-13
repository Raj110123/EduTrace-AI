'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Search, UserPlus, FileText, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import api from '@/lib/api';

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && user?.role === 'instructor') {
      router.push('/dashboard');
    }

    const fetchClasses = async () => {
      try {
        const response = await api.get('/classroom/student/my-classes');
        if (response.data.success) {
          setClasses(response.data.classrooms);
        }
      } catch (error) {
        console.error('Error fetching student classes:', error);
      }
    };

    if (user && user.role === 'student') {
      fetchClasses();
    }
  }, [user, loading, router]);

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    try {
      const response = await api.post('/classroom/join', {
        classCode: joinCode
      });

      if (response.data.success) {
        setClasses([...classes, response.data.classroom]);
        setJoinCode('');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error joining class:', error);
      alert(error.response?.data?.message || 'Failed to join class');
    }
  };

  if (loading || !user) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading Student Dashboard...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">My Classrooms</h1>
          <p className="page-description">View your enrolled classes and complete pending assignments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> Join Class
        </button>
      </div>

      <div className="grid-cards">
        {classes.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>You haven't joined any classes</h3>
            <p style={{ marginBottom: '1.5rem' }}>Ask your instructor for a Join Code to connect to their digital classroom.</p>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Join Your First Class</button>
          </div>
        ) : (
          classes.map((cls) => (
            <div key={cls._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{cls.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Instructor: {cls.instructorId?.name || 'Unknown'}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <Clock size={20} color="var(--warning)" style={{ margin: '0 auto 0.5rem' }} />
                  <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 'bold' }}>{cls.quizzes?.length || 0}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Quizzes</span>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <CheckCircle size={20} color="var(--success)" style={{ margin: '0 auto 0.5rem' }} />
                  <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 'bold' }}>0</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Completed</span>
                </div>
              </div>

              <Link href={`/college/student/${cls._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Enter Classroom
              </Link>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Join a Classroom">
        <form onSubmit={handleJoinClass}>
          <div className="input-group">
            <label className="input-label">Class Join Code</label>
            <input
              type="text"
              className="input-field"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="e.g. ABCD-1234"
              required
            />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Ask your instructor for the unique join code to access their classroom.
          </p>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Join Class</button>
        </form>
      </Modal>

    </div>
  );
}
