'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Signup() {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signup(formData);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="page-title" style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>Create Account</h2>
        <p className="page-description" style={{ textAlign: 'center', marginBottom: '2rem' }}>Start your learning journey today</p>
        
        {error && <div className="badge badge-red" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', justifyContent: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input 
              type="text" 
              name="name"
              className="input-field" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="John Doe"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input 
              type="email" 
              name="email"
              className="input-field" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="you@example.com"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              name="password"
              className="input-field" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="Min 8 characters"
              minLength="8"
            />
          </div>
          <div className="input-group">
            <label className="input-label">I am a...</label>
            <select 
              name="role" 
              className="input-field" 
              value={formData.role} 
              onChange={handleChange}
              style={{ padding: '0.75rem', cursor: 'pointer' }}
            >
              <option value="student">Student (Learn & Earn Coins)</option>
              <option value="instructor">Instructor (Create Classes)</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/auth/login" style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
