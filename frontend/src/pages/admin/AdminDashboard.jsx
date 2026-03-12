import React, { useEffect, useState } from 'react';
import { LogOut, PlusCircle, BookOpen, Users, Trophy, ChevronDown, User, Settings, Shield, Edit3, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalQuizzes: 0 });
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, statsRes] = await Promise.all([
          api.get('/quizzes'),
          api.get('/admin/stats')
        ]);
        setQuizzes(quizRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      try {
        await api.delete(`/quizzes/${quizId}`);
        setQuizzes(quizzes.filter(q => q._id !== quizId));
        setStats(prev => ({ ...prev, totalQuizzes: prev.totalQuizzes - 1 }));
      } catch (error) {
        alert("Failed to delete quiz");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { state: { fromButton: true } });
  };

  return (
    <div className="dashboard-container">
      <Link to="/" state={{ fromButton: true }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '1rem', transition: 'color 0.3s ease' }} className="hover-underline">
          <Shield size={16} style={{ opacity: 0.7 }} /> Back to Home
      </Link>
      <header className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative', zIndex: 100 }}>
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.25rem', 
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '12px',
              transition: 'background 0.3s ease',
              background: showProfileMenu ? 'rgba(255,255,255,0.05)' : 'transparent'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--gradient-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}>
               <Shield size={24} color="white" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.2rem' }}>
                  {user?.name}
                </h2>
                <ChevronDown size={14} color="var(--text-secondary)" style={{ transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Administrator</p>
            </div>
          </div>

          {showProfileMenu && (
            <div className="glass-panel animate-dropdown" style={{ 
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
                 <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Admin Control Panel</p>
                 <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>{user?.email}</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Link to="/admin/settings" state={{ fromButton: true }} className="menu-item" style={{ textDecoration: 'none', background: 'transparent', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <Settings size={18} color="var(--accent-blue)" /> System Settings
                </Link>
                <Link to="/admin/users" state={{ fromButton: true }} className="menu-item" style={{ textDecoration: 'none', background: 'transparent', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <Users size={18} color="var(--accent-purple)" /> Manage Users
                </Link>
                <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }} />
                <button 
                  onClick={handleLogout}
                  className="menu-item logout" 
                  style={{ background: 'transparent', border: 'none', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/admin/create-quiz" state={{ fromButton: true }} className="btn-primary" style={{ textDecoration: 'none', padding: '0.75rem 1.5rem', marginTop: 0 }}>
            <PlusCircle size={18} /> Create Quiz
          </Link>
        </div>
      </header>
      
      <div className="admin-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: 'var(--gradient-primary)', padding: '1rem', borderRadius: '12px' }}>
                    <BookOpen size={24} color="white" />
                </div>
                <div>
                   <h3 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Quizzes</h3>
                   <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalQuizzes}</p>
                </div>
            </div>
        </div>

        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: 'var(--gradient-secondary)', padding: '1rem', borderRadius: '12px' }}>
                    <Trophy size={24} color="white" />
                </div>
                <div>
                   <h3 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Hunters</h3>
                   <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalUsers}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="glass-panel animate-fade-in" style={{ marginTop: '2rem', padding: '2rem', animationDelay: '0.2s' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Recent Quizzes</h3>
          {loading ? (
             <div className="spinner" style={{ margin: '2rem auto' }}></div>
          ) : quizzes.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No quizzes created yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {quizzes.map(quiz => (
                 <div key={quiz._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--glass-border)', transition: 'all 0.3s ease' }} className="hover-glow">
                     <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-purple)' }}></div>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{quiz.title}</h4>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{quiz.questions?.length || 0} Questions • Topic: {quiz.topic || 'General'}</p>
                        </div>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link to={`/admin/edit-quiz/${quiz._id}`} state={{ fromButton: true }} title="Edit Quiz" style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', transition: 'all 0.3s ease' }}>
                                <Edit3 size={18} />
                            </Link>
                            <button onClick={() => handleDeleteQuiz(quiz._id)} title="Delete Quiz" style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.03)', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>
                            {new Date(quiz.createdAt).toLocaleDateString()}
                        </span>
                     </div>
                 </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

