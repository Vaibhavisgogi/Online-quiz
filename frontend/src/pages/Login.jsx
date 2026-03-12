import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin', { state: { fromButton: true } });
      } else {
        navigate('/dashboard', { state: { fromButton: true } });
      }
    } else {
      setError(result.message || 'Login failed.');
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" state={{ fromButton: true }} className="back-to-home" style={{ position: 'fixed', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none', zIndex: 100, background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '99px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <ArrowLeft size={18} /> Back to Home
      </Link>
      {/* Animated background elements */}
      <div className="auth-bg-shape shape-1" />
      <div className="auth-bg-shape shape-2" />
      <div className="auth-bg-shape shape-3" />

      <div className="glass-panel auth-card animate-fade-in">
        <div className="auth-header">
          <h1 className="text-gradient">Welcome Back</h1>
          <p>Enter your details to access your dashboard.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
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

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <Link to="/forgot-password" size={14} className="forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup" state={{ fromButton: true }} className="text-gradient hover-underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
