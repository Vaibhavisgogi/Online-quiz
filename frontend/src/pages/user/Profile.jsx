import React, { useState } from 'react';
import { User, Mail, Shield, Coins, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    // In a real app, we would call an API here
    setIsEditing(false);
    alert('Profile updated locally! (Mockup)');
  };

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/dashboard" state={{ fromButton: true }} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-underline">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </div>

      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'var(--gradient-primary)', 
            margin: '0 auto 1.5rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)'
          }}>
            <User size={48} color="white" />
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Profile</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your account settings and preferences</p>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Coins color="#fbbf24" size={24} />
                <h3 style={{ margin: 0 }}>Coin Balance</h3>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: '#fbbf24' }}>
                {user?.coins || 0} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Coins</span>
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Shield color="var(--accent-blue)" size={24} />
                <h3 style={{ margin: 0 }}>Account Tier</h3>
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', color: 'var(--accent-blue)' }}>
                {user?.role || 'User'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Full Name</label>
              <div className="input-group" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                background: 'rgba(0,0,0,0.2)', 
                border: '1px solid var(--glass-border)',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px'
              }}>
                <User size={18} color="var(--text-secondary)" />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={!isEditing}
                  style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Address</label>
              <div className="input-group" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                background: 'rgba(0,0,0,0.2)', 
                border: '1px solid var(--glass-border)',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                opacity: 0.7
              }}>
                <Mail size={18} color="var(--text-secondary)" />
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            {!isEditing ? (
              <button 
                type="button" 
                onClick={() => setIsEditing(true)}
                className="btn-primary"
                style={{ padding: '0.75rem 2rem', borderRadius: '12px' }}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', padding: '0.75rem 2rem', borderRadius: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ padding: '0.75rem 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Save size={18} /> Save Changes
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
