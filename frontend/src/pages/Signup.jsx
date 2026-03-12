import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Shield, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); 
  const [adminSecretKey, setAdminSecretKey] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await register(name, email, password, role, adminSecretKey);
    setIsLoading(false);
    
    if (result.success) {
      if (role === 'admin') {
        navigate('/admin', { state: { fromButton: true } });
      } else {
        navigate('/dashboard', { state: { fromButton: true } });
      }
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" state={{ fromButton: true }} className="back-to-home" style={{ position: 'fixed', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', textDecoration: 'none', zIndex: 100, background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '99px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <ArrowLeft size={18} /> Back to Home
      </Link>
      <div className="auth-bg-shape shape-1" />
      <div className="auth-bg-shape shape-2" />
      <div className="auth-bg-shape shape-3" />

      <div className="glass-panel auth-card animate-fade-in" style={{ padding: '2rem 2.5rem' }}>
        <div className="auth-header">
          <h1 className="text-gradient">Create Account</h1>
          <p>Join us to start your quiz journey today.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSignup} className="auth-form" style={{ gap: '1rem' }}>
          <div className="role-selector">
            <label className={`role-option ${role === 'user' ? 'active' : ''}`}>
              <input 
                type="radio" 
                name="role" 
                value="user" 
                checked={role === 'user'} 
                onChange={(e) => setRole(e.target.value)} 
                className="hidden-radio"
              />
              <UserIcon size={18} />
              User
            </label>
            <label className={`role-option ${role === 'admin' ? 'active' : ''}`}>
              <input 
                type="radio" 
                name="role" 
                value="admin" 
                checked={role === 'admin'} 
                onChange={(e) => setRole(e.target.value)} 
                className="hidden-radio"
              />
              <Shield size={18} />
              Admin
            </label>
          </div>

          <div className="input-group">
            <UserIcon className="input-icon" size={20} />
            <input 
              type="text" 
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="password-requirements" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
            <p style={{ margin: '0.2rem 0', color: password.length >= 8 ? '#10b981' : 'inherit' }}>• At least 8 characters</p>
            <p style={{ margin: '0.2rem 0', color: /[A-Z]/.test(password) ? '#10b981' : 'inherit' }}>• One uppercase letter</p>
            <p style={{ margin: '0.2rem 0', color: /[0-9]/.test(password) ? '#10b981' : 'inherit' }}>• One number</p>
            <p style={{ margin: '0.2rem 0', color: /[@$!%*?&]/.test(password) ? '#10b981' : 'inherit' }}>• One special character (@$!%*?&)</p>
          </div>

          {role === 'admin' && (
            <div className="input-group animate-fade-in" style={{ border: '1px solid var(--accent-purple)' }}>
              <Shield className="input-icon" size={20} color="var(--accent-purple)" />
              <input 
                type="password" 
                placeholder="Secret Admin Key"
                value={adminSecretKey}
                onChange={(e) => setAdminSecretKey(e.target.value)}
                required={role === 'admin'}
              />
            </div>
          )}

          <button type="submit" className="btn-primary mt-4" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/login" state={{ fromButton: true }} className="text-gradient hover-underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
