'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function QuizTakingPage() {
  const { quizId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const startQuiz = async () => {
      try {
        const res = await api.post(`/quiz/${quizId}/start`);
        if (res.data.success) {
          setQuiz(res.data.attempt.quiz);
          setAttemptId(res.data.attempt.attemptId);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load quiz');
      }
    };
    startQuiz();
  }, [quizId]);

  const currentQ = quiz?.mcqs[currentIdx];

  const handleSelect = (questionId, label) => {
    setAnswers({ ...answers, [questionId]: label });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const mcqAnswers = Object.keys(answers).map(qId => ({
      questionId: qId,
      selectedAnswer: answers[qId]
    }));

    try {
      const res = await api.post(`/quiz/${quizId}/submit`, { attemptId, mcqAnswers, saqAnswers: [] });
      if (res.data.success) {
        router.push(`/personal/quiz/${quizId}/results?attemptId=${attemptId}`);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to submit quiz');
      setSubmitting(false);
    }
  };

  if (error) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--danger)' }}>{error}</div>;
  if (!quiz || !currentQ) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>{quiz && !currentQ ? 'No questions found in this quiz.' : 'Loading Quiz...'}</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{quiz.title}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Question {currentIdx + 1} of {quiz.mcqs.length}</p>
        </div>
        <div className="badge badge-yellow" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '1rem' }}>
          <Clock size={16} /> Optional Timer
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card" style={{ padding: '2.5rem 2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
           <h2 style={{ fontSize: '1.25rem', lineHeight: 1.5 }}>{currentQ.question}</h2>
           {currentQ.sourceTimestamp && (
             <div className="badge badge-blue" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }} title="Play video at this embedded timestamp">
                📎 Source {Math.floor(currentQ.sourceTimestamp.startTime / 60)}:{(currentQ.sourceTimestamp.startTime % 60).toString().padStart(2, '0')}
             </div>
           )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {currentQ.options.map((opt) => {
            const isSelected = answers[currentQ._id] === opt.label;
            return (
              <div 
                key={opt.label}
                onClick={() => handleSelect(currentQ._id, opt.label)}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-tertiary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                  {opt.label}
                </div>
                <span style={{ fontSize: '1.05rem' }}>{opt.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
        >
          Previous
        </button>
        
        {currentIdx === quiz.mcqs.length - 1 ? (
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Calculating Score...' : 'Submit Quiz'}
          </button>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={() => setCurrentIdx(prev => Math.min(quiz.mcqs.length - 1, prev + 1))}
          >
            Next Question
          </button>
        )}
      </div>
      
    </div>
  );
}
