'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Trophy, ArrowLeft, Coins } from 'lucide-react';
import api from '@/lib/api';

export default function QuizResultsPage() {
  const { quizId } = useParams();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!attemptId) {
      setError('No attempt ID provided');
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await api.get(`/quiz/${quizId}/results/${attemptId}`);
        if(res.data.success) {
           setResults(res.data.results);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load results');
      }
    };
    fetchResults();
  }, [quizId, attemptId]);

  if (error) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--danger)' }}>{error}</div>;

  if (!results) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading Results...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Big Score Card */}
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
        {results.totalScore >= 50 && (
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.1, color: 'var(--success)' }}>
            <Trophy size={300} />
          </div>
        )}
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Assessment Complete</h1>
        <div style={{ fontSize: '5rem', fontWeight: '800', lineHeight: 1, fontFamily: 'var(--font-display)', marginBottom: '1.5rem', 
                      color: results.totalScore >= 50 ? 'var(--success)' : 'var(--danger)' }}>
          {results.totalScore}%
        </div>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', background: 'var(--bg-tertiary)', padding: '1rem 2rem', borderRadius: 'var(--radius-full)' }}>
          <div>
             <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold' }}>{results.correctAnswers}</span>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Correct</span>
          </div>
          <div style={{ width: '1px', background: 'var(--border-color)', height: '30px' }}></div>
          <div>
             <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold' }}>{results.incorrectAnswers}</span>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Incorrect</span>
          </div>
          <div style={{ width: '1px', background: 'var(--border-color)', height: '30px' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--coin-gold)' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
               <Coins size={20} /> +{results.coinsEarned}
             </span>
             <span style={{ fontSize: '0.8rem' }}>Coins Earned</span>
          </div>
        </div>
      </div>

      {/* Detailed Review */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Detailed Review</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {results.detailedResults.map((item, idx) => (
          <div key={idx} className="glass-card" style={{ borderLeft: `4px solid ${item.isCorrect ? 'var(--success)' : 'var(--danger)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', lineHeight: 1.4 }}>{item.question}</h3>
              {item.isCorrect ? 
                <span className="badge badge-green">Correct</span> : 
                <span className="badge badge-red">Incorrect</span>
              }
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Your Answer</p>
                <p style={{ fontWeight: '500', color: item.isCorrect ? 'var(--success)' : 'var(--danger)' }}>Option {item.selectedAnswer}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Correct Answer</p>
                <p style={{ fontWeight: '500', color: 'var(--success)' }}>Option {item.correctAnswer}</p>
              </div>
            </div>
            
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '600' }}>Explanation</p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                {item.explanation}
              </p>
            </div>
            
            {item.sourceTimestamp && (
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                 <span className="badge badge-blue" style={{ cursor: 'pointer' }}>
                   📎 Watch Relevant Video Segment [{Math.floor(item.sourceTimestamp.startTime / 60)}:{(item.sourceTimestamp.startTime % 60).toString().padStart(2, '0')}]
                 </span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
