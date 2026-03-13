'use client';

import { useAuth } from '@/context/AuthContext';
import { useCoins } from '@/context/CoinsContext';
import { User, Mail, Shield, BookOpen, Clock, Activity, Award } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { coins } = useCoins();

  if (!user) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading user profile...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-description">Manage your account and view learning statistics</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: ID Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={14} /> {user.email}
          </p>
          <div className={`badge ${user.role === 'instructor' ? 'badge-yellow' : 'badge-green'}`} style={{ textTransform: 'uppercase' }}>
            {user.role} Account
          </div>
        </div>

        {/* Right Column: Lifetime Stats & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <Activity size={18} color="var(--accent-primary)" /> Lifetime Statistics
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={14} /> Total Coins Earned
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--coin-gold)' }}>{user.totalCoinsEarned || coins}</p>
              </div>
              
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={14} /> Quizzes Completed
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{user.quizzesTaken || 0}</p>
              </div>
              
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={14} /> Average Accuracy
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{(user.averageScore || 0).toFixed(0)}%</p>
              </div>

              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={14} /> Member Since
                </p>
                <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <User size={18} color="var(--accent-primary)" /> Account Details
            </h3>
            <div className="input-group">
                <label className="input-label">Display Name</label>
                <input type="text" className="input-field" defaultValue={user.name} disabled style={{ opacity: 0.7 }} />
            </div>
            <div className="input-group">
                <label className="input-label">Email Address</label>
                <input type="email" className="input-field" defaultValue={user.email} disabled style={{ opacity: 0.7 }} />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Contact support to change your account email or role.</p>
          </div>
          
        </div>

      </div>
    </div>
  );
}
