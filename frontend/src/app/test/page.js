'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Youtube, Loader2, AlertCircle, CheckCircle2, Trophy, Coins, XCircle, Info, ChevronDown, ChevronUp, History, PlayCircle } from 'lucide-react';
import { useCoins } from '@/context/CoinsContext';

export default function TestPage() {
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [transcribing, setTranscribing] = useState(false);
    const [transcribed, setTranscribed] = useState(false);
    const [error, setError] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [expandedCitations, setExpandedCitations] = useState({});
    const { updateCoins, coins: currentTotalCoins } = useCoins();

    const handleTranscribe = async (e) => {
        e.preventDefault();
        if (!youtubeUrl) return;

        if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(youtubeUrl)) {
            setError('Please enter a valid YouTube URL');
            return;
        }

        setTranscribing(true);
        setError('');
        setTranscribed(false);

        try {
            const response = await api.post('/transcription/advanced', { youtubeUrl });
            if (response.data && response.data.audioUrl) {
                setAudioUrl(response.data.audioUrl);
            }
            setTranscribed(true);
        } catch (err) {
            console.error('Transcription error:', err);
            setError('Failed to transcribe video. Please try again.');
        } finally {
            setTranscribing(false);
        }
    };

    const handleGenerateQuiz = async () => {
        setLoading(true);
        setError('');
        setQuestions([]);
        setSelectedAnswers({});

        try {
            const response = await api.post('/test/generate', {
                youtubeUrl,
                audioUrl // Pass the reused audio URL if available
            });

            // Extract questions from the response payload
            // Some n8n webhooks return an array directly, or { questions: [...] }
            let data = response.data;
            let extractedQuestions = [];

            if (Array.isArray(data)) {
                extractedQuestions = data;
            } else if (data && typeof data === 'object') {
                extractedQuestions = data.questions || data.data || data.mcqs || [];
            }

            if (!extractedQuestions || extractedQuestions.length === 0) {
                throw new Error('No questions found in the response.');
            }

            setQuestions(extractedQuestions);
        } catch (err) {
            console.error('Quiz generation error:', err);
            setError('Failed to generate quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionChange = (questionIndex, option) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: option
        });
    };

    const toggleCitation = (index) => {
        setExpandedCitations(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleCompleteQuiz = async () => {
        let correctCount = 0;
        const total = questions.length;

        questions.forEach((q, idx) => {
            const correctAnswer = q.answer || q.Answer || q.correct_answer || q.correctOption;
            if (selectedAnswers[idx] === correctAnswer) {
                correctCount++;
            }
        });

        const earnedCoins = correctCount * 10;
        setScore(correctCount);
        setShowResults(true);

        // Update global coins state (UI only for now)
        updateCoins(currentTotalCoins + earnedCoins);
    };

    if (showResults) {
        return (
            <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
                <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', marginBottom: '2rem', background: 'var(--accent-gradient)', color: 'white' }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                        <Trophy size={40} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Assessment Results</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Great job! You've completed the knowledge check.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '1px', marginBottom: '0.5rem' }}>Your Score</span>
                        <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                            {score} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ {questions.length}</span>
                        </div>
                        <div style={{ marginTop: '0.5rem', fontWeight: '600', color: score / questions.length >= 0.7 ? 'var(--success)' : 'var(--accent-secondary)' }}>
                            {Math.round((score / questions.length) * 100)}% Accuracy
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '1px', marginBottom: '0.5rem' }}>Coins Earned</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Coins size={32} color="#f59e0b" />
                            <div style={{ fontSize: '3rem', fontWeight: '800', color: '#f59e0b' }}>+{score * 10}</div>
                        </div>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Already {currentTotalCoins + (score * 10)} total coins in wallet
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <History size={22} color="var(--accent-primary)" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Question Review</h2>
                    </div>

                    {questions.map((q, idx) => {
                        const correctAnswer = q.answer || q.Answer || q.correct_answer || q.correctOption;
                        const isCorrect = selectedAnswers[idx] === correctAnswer;
                        const citation = q.citation || q.Citation;

                        return (
                            <div key={idx} className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', borderLeft: `6px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}` }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: isCorrect ? 'var(--success)' : 'var(--error)',
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                    </div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: '600', lineHeight: '1.4' }}>
                                        {q.question || q.text}
                                    </h3>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
                                        <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '600' }}>Your Answer</p>
                                        <p style={{ color: isCorrect ? 'var(--success)' : 'var(--error)', fontWeight: '500' }}>{selectedAnswers[idx] || 'No answer selected'}</p>
                                    </div>
                                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                        <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '600' }}>Correct Answer</p>
                                        <p style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>{correctAnswer}</p>
                                    </div>
                                </div>

                                {citation && (
                                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '1rem' }}>
                                        <button
                                            onClick={() => toggleCitation(idx)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: 'var(--accent-primary)',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                fontSize: '0.95rem',
                                                padding: 0
                                            }}
                                        >
                                            <Info size={16} />
                                            {expandedCitations[idx] ? 'Hide Citation' : 'View AI Explanation & Citation'}
                                            {expandedCitations[idx] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>

                                        {expandedCitations[idx] && (
                                            <div className="animate-fade-in" style={{ marginTop: '1rem', padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                                                    {q.explanation || "The transcript discusses this topic to provide evidence for the correct answer."}
                                                </p>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-secondary)', background: 'rgba(236, 72, 153, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                                                            SECTION: {citation.section || citation.timestamp || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--accent-secondary)', paddingLeft: '1rem' }}>
                                                        "{citation.evidence || "Evidence from the transcript confirms the validity of the selected answer."}"
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{ textAlign: 'center', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setShowResults(false);
                            setQuestions([]);
                            setYoutubeUrl('');
                            setSelectedAnswers({});
                        }}
                        style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                    >
                        Try Another Video
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setShowResults(false);
                            setSelectedAnswers({});
                        }}
                        style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
                    >
                        Retake Test
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
            <div className="page-header" style={{ textAlign: 'center' }}>
                <h1 className="page-title" style={{
                    background: 'var(--accent-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem'
                }}>
                    Video Quiz Test
                </h1>
                <p className="page-description">Paste any YouTube URL below to instantly generate an MCQ quiz using AI.</p>
            </div>

            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <form onSubmit={handleTranscribe} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                        <div style={{ position: 'relative' }}>
                            <Youtube
                                size={20}
                                className="hide-mobile"
                                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
                            />
                            <input
                                type="url"
                                className="input-field"
                                value={youtubeUrl}
                                onChange={(e) => {
                                    setYoutubeUrl(e.target.value);
                                    setTranscribed(false);
                                    setQuestions([]);
                                }}
                                required
                                placeholder="https://www.youtube.com/watch?v=..."
                                disabled={loading || transcribing}
                                style={{ padding: '1rem', paddingLeft: '3rem', fontSize: '1.1rem' }}
                            />
                        </div>
                    </div>
                    {!transcribed ? (
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ padding: '1rem 2rem', fontSize: '1.1rem', height: '54px' }}
                            disabled={transcribing || !youtubeUrl}
                        >
                            {transcribing ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" style={{ marginRight: '0.5rem' }} />
                                    Transcribing...
                                </>
                            ) : 'Transcribe Video'}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleGenerateQuiz}
                            className="btn btn-primary"
                            style={{ padding: '1rem 2rem', fontSize: '1.1rem', height: '54px', background: 'var(--success)' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" style={{ marginRight: '0.5rem' }} />
                                    Generating...
                                </>
                            ) : 'Generate Quiz'}
                        </button>
                    )}
                </form>

                {transcribed && !loading && questions.length === 0 && (
                    <div className="badge badge-green" style={{ width: '100%', padding: '0.75rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                        <CheckCircle2 size={18} style={{ marginRight: '0.5rem' }} />
                        Transcription ready! You can now generate the quiz.
                    </div>
                )}

                {error && (
                    <div className="badge badge-red" style={{ width: '100%', padding: '0.75rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                        <AlertCircle size={18} style={{ marginRight: '0.5rem' }} />
                        {error}
                    </div>
                )}
            </div>

            {transcribing && (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <p style={{ color: 'var(--accent-primary)', fontWeight: '600', fontSize: '1.1rem' }}>AI is transcribing video content...</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>This takes about 30-45 seconds. Please wait.</p>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '10px', overflow: 'hidden', marginTop: '1rem' }}>
                        <div style={{ width: '40%', height: '100%', background: 'var(--accent-gradient)', borderRadius: '10px', animation: 'slideRight 2s infinite ease-in-out' }}></div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <p style={{ color: 'var(--accent-primary)', fontWeight: '600', fontSize: '1.1rem' }}>AI is generating MCQ quiz...</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>We're extracting the best questions from the transcript. This takes 10-20 seconds.</p>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '10px', overflow: 'hidden', marginTop: '1rem' }}>
                        <div style={{ width: '60%', height: '100%', background: 'var(--accent-gradient)', borderRadius: '10px', animation: 'slideRight 1.5s infinite ease-in-out' }}></div>
                    </div>
                </div>
            )}

            {questions.length > 0 && !loading && (
                <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.6rem', borderRadius: '50%', display: 'flex' }}>
                            <CheckCircle2 size={24} />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Assessment Generated</h2>
                    </div>

                    {questions.map((q, qIdx) => (
                        <div key={qIdx} className="glass-card" style={{ padding: '2.5rem 2rem', marginBottom: '2rem', borderLeft: '4px solid var(--accent-primary)' }}>
                            <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem' }}>
                                <div style={{
                                    background: 'var(--accent-primary)',
                                    color: 'white',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    flexShrink: 0,
                                    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
                                }}>
                                    {qIdx + 1}
                                </div>
                                <h3 style={{ fontSize: '1.3rem', lineHeight: '1.5', fontWeight: '600' }}>
                                    {q.question || q.Question || q.text || 'Question'}
                                </h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {(q.options || q.Options || [q.option1, q.option2, q.option3, q.option4] || []).filter(Boolean).map((option, oIdx) => (
                                    <label
                                        key={oIdx}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1.25rem',
                                            padding: '1.25rem',
                                            borderRadius: 'var(--radius-lg)',
                                            background: selectedAnswers[qIdx] === option ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-tertiary)',
                                            border: selectedAnswers[qIdx] === option ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                                            cursor: 'pointer',
                                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: selectedAnswers[qIdx] === option ? 'var(--shadow-md)' : 'none'
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${qIdx}`}
                                            className="quiz-radio"
                                            checked={selectedAnswers[qIdx] === option}
                                            onChange={() => handleOptionChange(qIdx, option)}
                                            style={{
                                                width: '22px',
                                                height: '22px',
                                                accentColor: 'var(--accent-primary)',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <span style={{
                                            fontSize: '1.1rem',
                                            color: selectedAnswers[qIdx] === option ? 'var(--text-primary)' : 'var(--text-secondary)',
                                            fontWeight: selectedAnswers[qIdx] === option ? '500' : '400'
                                        }}>
                                            {option}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div style={{ textAlign: 'center', marginTop: '4rem', paddingBottom: '2rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleCompleteQuiz}
                            style={{ padding: '1.25rem 4rem', fontSize: '1.2rem', borderRadius: 'var(--radius-lg)' }}
                            disabled={Object.keys(selectedAnswers).length < questions.length}
                        >
                            Complete Quiz
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
