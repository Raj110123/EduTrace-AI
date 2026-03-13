'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function StudentClassroomDetail() {
  const { classId } = useParams();
  const router = useRouter();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch classroom (Student view, only sees published content)
    setClassroom({
      _id: classId,
      name: 'CS101: Intro to React',
      instructor: 'Dr. Smith',
      assignments: [
        { _id: 'a1', videoId: 'v1', quizId: 'q1', title: 'React State Management Quiz', isCompleted: true, score: 85, dueDate: '2026-03-20' },
        { _id: 'a2', videoId: 'v2', quizId: 'q2', title: 'React Context API Quiz', isCompleted: false, score: null, dueDate: '2026-03-25' }
      ]
    });
    setLoading(false);
  }, [classId]);

  if (loading || !classroom) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading Classroom...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '2rem' }}>
         <Link href="/college/student" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
         <h1 className="page-title" style={{ fontSize: '2rem' }}>{classroom.name}</h1>
         <p className="page-description">Instructor: {classroom.instructor}</p>
      </div>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Pending Assignments</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {classroom.assignments.filter(a => !a.isCompleted).length === 0 ? (
           <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>Hooray! No pending assignments.</p>
        ) : (
          classroom.assignments.filter(a => !a.isCompleted).map((assignment) => (
             <div key={assignment._id} className="glass-card" style={{ borderTop: '4px solid var(--warning)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{assignment.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <Clock size={14} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <Link href={`/personal/video/${assignment.videoId}`} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>
                      <Play size={14} /> Watch Lecture
                   </Link>
                   <Link href={`/personal/quiz/${assignment.quizId}`} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>
                      Take Quiz
                   </Link>
                </div>
             </div>
          ))
        )}
      </div>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Completed Work</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {classroom.assignments.filter(a => a.isCompleted).length === 0 ? (
           <p style={{ color: 'var(--text-secondary)' }}>You haven't completed any assignments yet.</p>
        ) : (
          classroom.assignments.filter(a => a.isCompleted).map((assignment) => (
             <div key={assignment._id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderRadius: 'var(--radius-md)', opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                      <CheckCircle size={24} />
                   </div>
                   <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{assignment.title}</h3>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                         <span className="badge badge-green">Completed</span>
                      </div>
                   </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{assignment.score}%</span>
                   <Link href={`/personal/quiz/${assignment.quizId}/results`} style={{ color: 'var(--accent-primary)', fontSize: '0.85rem' }}>View Details &rarr;</Link>
                </div>
             </div>
          ))
        )}
      </div>

    </div>
  );
}
