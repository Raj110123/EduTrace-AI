'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import Link from 'next/link';

// Register ChartJS modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AnalyticsDashboard() {
  const { classId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock analytics fetch
    setData({
      className: 'CS101: Intro to React',
      averageScore: 78,
      totalStudents: 24,
      completionRate: 85,
      studentScores: [
        { name: 'Alice', avgScore: 92, completedQuizzes: 4 },
        { name: 'Bob', avgScore: 65, completedQuizzes: 3 },
        { name: 'Charlie', avgScore: 88, completedQuizzes: 4 },
        { name: 'Diana', avgScore: 45, completedQuizzes: 1 },
      ],
      quizAverages: [
        { label: 'React State', avg: 82 },
        { label: 'Hooks Deep Dive', avg: 71 },
        { label: 'Context API', avg: 65 },
        { label: 'Next.js Routing', avg: 90 }
      ]
    });
    setLoading(false);
  }, [classId]);

  if (loading || !data) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading Analytics...</div>;

  const barChartData = {
    labels: data.quizAverages.map(q => q.label),
    datasets: [
      {
        label: 'Average Score (%)',
        data: data.quizAverages.map(q => q.avg),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 4
      }
    ]
  };

  const doughnutData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [data.completionRate, 100 - data.completionRate],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(55, 65, 81, 0.5)'],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#a1a1aa' } }
    },
    scales: {
      y: { ticks: { color: '#a1a1aa' }, grid: { color: 'rgba(255, 255, 255, 0.05)' }, max: 100 },
      x: { ticks: { color: '#a1a1aa' }, grid: { display: false } }
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link href={`/college/instructor`} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
        <h1 className="page-title" style={{ fontSize: '2rem' }}>Analytics: {data.className}</h1>
        <p className="page-description">Actionable insights into student performance and material difficulty.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.25rem' }}>{data.averageScore}%</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Class Average Score</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>{data.totalStudents}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Students Enrolled</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--coin-gold)', marginBottom: '0.25rem' }}>{data.completionRate}%</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Assignment Completion</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem', alignItems: 'start' }}>
        
        {/* Bar Chart */}
        <div className="glass-card" style={{ height: '350px' }}>
           <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Quiz Performance Trend</h3>
           <div style={{ position: 'relative', height: '80%' }}>
              <Bar data={barChartData} options={chartOptions} />
           </div>
        </div>

        {/* Doughnut Chart */}
        <div className="glass-card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', textAlign: 'center' }}>Completion Rate</h3>
           <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#a1a1aa' } } } }} />
           </div>
        </div>

      </div>

      {/* Student List */}
      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Student Performance Breakdown</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Student Name</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Completed Quizzes</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Average Score</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.studentScores.map((student, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>{student.name}</td>
                <td style={{ padding: '1rem' }}>{student.completedQuizzes} / 4</td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: student.avgScore >= 70 ? 'var(--success)' : 'var(--danger)' }}>
                   {student.avgScore}%
                </td>
                <td style={{ padding: '1rem' }}>
                   {student.avgScore < 60 ? (
                      <span className="badge badge-red">Needs Attention</span>
                   ) : (
                      <span className="badge badge-green">On Track</span>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
