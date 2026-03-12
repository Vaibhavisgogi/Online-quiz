import React, { useEffect, useState, useRef } from 'react';
import { LogOut, Play, BookOpen, Clock, Activity, Coins, User, ChevronDown, Settings, CreditCard, Award, Bell, X, Megaphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Load seen notification IDs from localStorage
  const getSeenIds = () => {
    try {
      return JSON.parse(localStorage.getItem('seenAnnouncements') || '[]');
    } catch { return []; }
  };

  const [seenIds, setSeenIds] = useState(getSeenIds);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [quizRes, announceRes] = await Promise.all([
          api.get('/quizzes'),
          api.get('/announcements')
        ]);
        setQuizzes(quizRes.data);
        setAnnouncements(announceRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = announcements.filter(a => !seenIds.includes(a._id)).length;

  const handleOpenNotifications = () => {
    setShowNotifications(prev => !prev);
    // Mark all current announcements as seen
    if (!showNotifications) {
      const allIds = announcements.map(a => a._id);
      const merged = [...new Set([...seenIds, ...allIds])];
      setSeenIds(merged);
      localStorage.setItem('seenAnnouncements', JSON.stringify(merged));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { state: { fromButton: true } });
  };

  return (
    <div className="dashboard-container">
      <Link to="/" state={{ fromButton: true }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '1rem', transition: 'color 0.3s ease' }} className="hover-underline">
          <Play size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Home
      </Link>
      <header className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative', zIndex: 100 }}>
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem', 
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '12px',
              transition: 'background 0.3s ease',
              background: showProfileMenu ? 'rgba(255,255,255,0.05)' : 'transparent'
            }}
            className="profile-trigger"
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' }}>
               <User size={28} color="white" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.4rem' }}>
                  {user?.name}
                </h2>
                <ChevronDown size={16} color="var(--text-secondary)" style={{ transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '1rem', fontWeight: 'bold', background: 'rgba(251, 191, 36, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    <Coins size={16} /> <span>{user?.coins || 0}</span>
                 </div>
                 <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="glass-panel animate-fade-in" style={{ 
              position: 'absolute', 
              top: '120%', 
              left: 0, 
              width: '240px', 
              zIndex: 1000, 
              padding: '0.75rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              border: '1px solid var(--glass-border)',
              background: 'rgba(15, 15, 25, 0.95)',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ padding: '0.5rem 1rem 1rem 1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.5rem' }}>
                 <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Logged in as</p>
                 <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Link to="/profile" state={{ fromButton: true }} className="menu-item" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s' }}>
                  <Settings size={18} color="var(--accent-blue)" /> Account Settings
                </Link>
                <Link to="/achievements" state={{ fromButton: true }} className="menu-item" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s' }}>
                  <Award size={18} color="var(--accent-purple)" /> Achievements
                </Link>
                <Link to="/redeem" state={{ fromButton: true }} className="menu-item" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s' }}>
                  <CreditCard size={18} color="#fbbf24" /> Redeem Coins
                </Link>
                <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />
                <button 
                  onClick={handleLogout}
                  className="menu-item logout" 
                  style={{ background: 'transparent', border: 'none', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s' }}
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          
          {/* 🔔 Notification Bell */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={handleOpenNotifications}
              style={{
                position: 'relative',
                background: showNotifications ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${showNotifications ? 'rgba(56,189,248,0.4)' : 'var(--glass-border)'}`,
                borderRadius: '12px',
                padding: '0.75rem',
                cursor: 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <Bell size={20} color={unreadCount > 0 ? '#38bdf8' : 'var(--text-secondary)'} 
                style={{ 
                  animation: unreadCount > 0 ? 'bell-ring 1.5s ease infinite' : 'none'
                }} 
              />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  boxShadow: '0 0 10px rgba(239,68,68,0.5)',
                  animation: 'pulse 2s ease infinite'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="glass-panel animate-fade-in" style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                right: 0,
                width: '360px',
                zIndex: 1000,
                padding: 0,
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                border: '1px solid rgba(56,189,248,0.2)',
                background: 'rgba(10, 10, 20, 0.97)',
                backdropFilter: 'blur(30px)',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {/* Header */}
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(56,189,248,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Megaphone size={18} color="#38bdf8" />
                    <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>Announcements</span>
                  </div>
                  <button onClick={() => setShowNotifications(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}>
                    <X size={18} />
                  </button>
                </div>

                {/* Notification List */}
                <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                  {announcements.length === 0 ? (
                    <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <Bell size={36} style={{ opacity: 0.3, marginBottom: '0.75rem', display: 'block', margin: '0 auto 0.75rem auto' }} />
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>No announcements yet.</p>
                    </div>
                  ) : (
                    announcements.map((announce, idx) => (
                      <div key={announce._id} style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: idx < announcements.length - 1 ? '1px solid var(--glass-border)' : 'none',
                        background: 'transparent',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          <div style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '0.5rem', borderRadius: '8px', flexShrink: 0 }}>
                            <Activity size={16} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 'bold' }}>{announce.title}</h4>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{announce.content}</p>
                            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.4rem', display: 'block' }}>
                              {new Date(announce.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Link to="/my-results" state={{ fromButton: true }} className="glass-panel" style={{ textDecoration: 'none', padding: '0.75rem 1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} /> My Results
          </Link>
          <Link to="/leaderboard" state={{ fromButton: true }} className="glass-panel" style={{ textDecoration: 'none', padding: '0.75rem 1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} /> Global Ranks
          </Link>
        </div>
      </header>
      
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
             <h3 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <BookOpen size={24} color="var(--accent-purple)" /> Available Quizzes
             </h3>
          </div>

          {loading ? (
             <div className="spinner" style={{ margin: '3rem auto' }}></div>
          ) : quizzes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                  <BookOpen size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                  <h4 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>No Quizzes Available</h4>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Check back later for new tests.</p>
              </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {quizzes.map((quiz, index) => (
                 <div key={quiz._id} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', transition: 'transform 0.3s ease', animation: `fadeInScale 0.5s ease forwards ${index * 0.1}s`, opacity: 0, transform: 'scale(0.95)' }}>
                     <div style={{ display: 'inline-block', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                         {quiz.topic || 'General'}
                     </div>
                     <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>{quiz.title}</h4>
                     <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                         {quiz.description || 'Test your knowledge on this topic.'}
                     </p>
                     
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: 'auto' }}>
                         <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{quiz.questions?.length || 0} Questions</span>
                         <Link to={`/quiz/${quiz._id}/take`} state={{ fromButton: true }} className="btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px', margin: 0 }}>
                             Start Quiz <Play size={14} />
                         </Link>
                     </div>
                 </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
