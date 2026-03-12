import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.msg);
      // For demo purposes, we automatically navigate to reset page with email in state
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-shape shape-1" />
      <div className="auth-bg-shape shape-2" />
      <div className="auth-bg-shape shape-3" />

      <div className="glass-panel auth-card animate-fade-in">
        <div className="auth-header">
          <h1 className="text-gradient">Reset Password</h1>
          <p>Enter your email and we'll help you reset your password.</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message" style={{ color: 'var(--accent-green)', textAlign: 'center', marginBottom: '1rem' }}>{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : (
              <>
                Send Instructions <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login" className="text-gradient hover-underline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
