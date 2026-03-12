import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/results/leaderboard');
        setLeaders(res.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="dashboard-container">
       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
           <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} state={{ fromButton: true }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s ease' }} className="hover-underline">
               <ArrowLeft size={16} /> Back to Dashboard
           </Link>
           <h2 className="text-gradient" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem' }}>
                <Trophy size={28} /> Global Leaderboard
           </h2>
       </div>
       
       <div className="glass-panel animate-fade-in" style={{ padding: '2rem 3rem' }}>
           {loading ? (
                 <div className="spinner" style={{ margin: '4rem auto' }}></div>
           ) : leaders.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                   <p style={{ color: 'var(--text-secondary)' }}>No results found to rank.</p>
               </div>
           ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {leaders.map((entry, index) => {
                       let MedalIcon = null;
                       let medalColor = '';
                       
                       if (index === 0) { MedalIcon = Medal; medalColor = '#fbbf24'; } // Gold
                       else if (index === 1) { MedalIcon = Medal; medalColor = '#94a3b8'; } // Silver
                       else if (index === 2) { MedalIcon = Medal; medalColor = '#b45309'; } // Bronze

                       return (
                           <div key={index} style={{ 
                               display: 'flex', 
                               alignItems: 'center', 
                               justifyContent: 'space-between',
                               padding: '1.25rem 2rem',
                               background: index < 3 ? `linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(20,20,30,0.4) 100%)` : 'rgba(0,0,0,0.2)',
                               border: index < 3 ? `1px solid ${medalColor}40` : '1px solid var(--glass-border)',
                               borderRadius: '12px',
                               transform: index === 0 ? 'scale(1.02)' : 'scale(1)'
                           }}>
                               
                               <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                   <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: MedalIcon ? medalColor : 'var(--text-secondary)' }}>
                                       {MedalIcon ? <MedalIcon size={28} color={medalColor} /> : `#${index + 1}`}
                                   </div>
                                   <div>
                                       <h3 style={{ margin: 0, fontSize: '1.2rem', color: user?.name === entry.user?.name ? 'var(--accent-blue)' : 'white' }}>
                                            {entry.user?.name || 'Unknown User'}
                                            {user?.name === entry.user?.name && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', background: 'var(--accent-blue)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>YOU</span>}
                                       </h3>
                                       <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{entry.quiz?.title || 'Quiz'}</span>
                                   </div>
                               </div>

                               <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                   <div style={{ textAlign: 'right' }}>
                                       <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>{Math.round(entry.percentage)}%</div>
                                       <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{entry.score}/{entry.totalQuestions}</div>
                                   </div>
                               </div>

                           </div>
                       )
                   })}
               </div>
           )}
       </div>
    </div>
  );
}
