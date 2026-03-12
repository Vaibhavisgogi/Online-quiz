import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Shield, Coins, BookOpen, Calendar, ChevronRight, Award } from 'lucide-react';
import api from '../../services/api';

export default function UserReport() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/admin/user-report/${id}`);
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch user report", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return <div className="dashboard-container"><div className="spinner" style={{ margin: '4rem auto' }}></div></div>;
  if (!data) return <div className="dashboard-container"><h2>User report not found</h2></div>;

  const { user, results } = data;

  return (
    <div className="dashboard-container">
      <Link to="/admin/users" state={{ fromButton: true }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }} className="hover-underline">
        <ArrowLeft size={16} /> Back to User Management
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
        
        {/* User Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--gradient-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                    <User size={40} color="white" />
                </div>
                <h2 className="text-gradient" style={{ margin: '0 0 0.25rem 0' }}>{user.name}</h2>
                <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.email}</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Shield size={14} /> {user.role.toUpperCase()}
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <div>
                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Coins</p>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#fbbf24', fontSize: '1.2rem' }}>{user.coins} 🪙</p>
                    </div>
                    <div>
                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Quizzes</p>
                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem' }}>{results.length}</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel animate-fade-in" style={{ padding: '20px', animationDelay: '0.1s' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={18} color="var(--accent-purple)" /> Achievements
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {user.coins >= 1000 && <span style={{ padding: '4px 10px', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid rgba(251, 191, 36, 0.2)' }}>Coin Master</span>}
                    {results.length >= 5 && <span style={{ padding: '4px 10px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>Persistent Learner</span>}
                    <span style={{ padding: '4px 10px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>Verified Member</span>
                </div>
            </div>
        </div>

        {/* Results List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Quiz History</h2>
            {results.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No quiz attempts found for this user.
                </div>
            ) : (
                results.map((result, idx) => (
                    <div key={result._id} className="glass-panel animate-fade-in" style={{ padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animationDelay: `${idx * 0.05 + 0.2}s` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <BookOpen size={20} color="var(--accent-blue)" />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 0.25rem 0' }}>{result.quiz?.title || 'Unknown Quiz'}</h4>
                                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} /> {new Date(result.date).toLocaleDateString()}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Award size={12} /> {result.score}/{result.totalQuestions}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: result.percentage >= 80 ? 'var(--accent-green)' : (result.percentage >= 50 ? '#fbbf24' : '#f87171') }}>
                                    {Math.round(result.percentage)}%
                                </div>
                            </div>
                            <ChevronRight size={20} color="var(--text-secondary)" />
                        </div>
                    </div>
                ))
            )}
        </div>

      </div>
    </div>
  );
}
