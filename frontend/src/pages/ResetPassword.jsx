import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return setError('Password must meet all complexity requirements');
    }

    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', { email, newPassword });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not reset password. Please try again.');
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
          <h1 className="text-gradient">Choose New Password</h1>
          <p>Resetting password for: <br/><strong>{email}</strong></p>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle size={60} color="var(--accent-green)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ marginBottom: '1rem' }}>Success!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Your password has been reset. Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="password-requirements" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0 0.5rem', marginBottom: '1rem' }}>
              <p style={{ margin: '0.2rem 0', color: newPassword.length >= 8 ? '#10b981' : 'inherit' }}>• At least 8 characters</p>
              <p style={{ margin: '0.2rem 0', color: /[A-Z]/.test(newPassword) ? '#10b981' : 'inherit' }}>• One uppercase letter</p>
              <p style={{ margin: '0.2rem 0', color: /[0-9]/.test(newPassword) ? '#10b981' : 'inherit' }}>• One number</p>
              <p style={{ margin: '0.2rem 0', color: /[@$!%*?&]/.test(newPassword) ? '#10b981' : 'inherit' }}>• One special character (@$!%*?&)</p>
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : (
                <>
                  Update Password <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {!success && (
          <p className="auth-footer">
            Wait, I remembered it! <Link to="/login" className="text-gradient hover-underline">Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
