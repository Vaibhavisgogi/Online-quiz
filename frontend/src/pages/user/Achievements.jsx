import React from 'react';
import { Award, Trophy, Star, Zap, Target, ArrowLeft, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Achievements() {
  const { user } = useAuth();

  const achievements = [
    { title: 'Early Bird', desc: 'Signed up for the platform', icon: Zap, color: '#3b82f6', earned: true },
    { title: 'Quiz Hunter', desc: 'Score 100% on any quiz', icon: Trophy, color: '#fbbf24', earned: (user?.coins >= 100) },
    { title: 'Coin Collector', desc: 'Earn your first 50 coins', icon: Star, color: '#ef4444', earned: (user?.coins >= 50) },
    { title: 'Sharpshooter', desc: 'Complete 5 quizzes', icon: Target, color: '#10b981', earned: false },
    { title: 'On Fire', desc: '3-day login streak', icon: Flame, color: '#f97316', earned: false },
  ];

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/dashboard" state={{ fromButton: true }} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-underline">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Hall of Fame</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Your journey and milestones reached so far.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {achievements.map((ach, index) => (
          <div key={index} className="glass-panel animate-fade-in" style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            opacity: ach.earned ? 1 : 0.4,
            filter: ach.earned ? 'none' : 'grayscale(1)',
            position: 'relative',
            overflow: 'hidden',
            animationDelay: `${index * 0.1}s`
          }}>
            {!ach.earned && (
               <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', color: 'white' }}>LOCKED</div>
            )}
            <div style={{ 
              width: '70px', 
              height: '70px', 
              borderRadius: '50%', 
              background: `rgba(${parseInt(ach.color.slice(1,3), 16)}, ${parseInt(ach.color.slice(3,5), 16)}, ${parseInt(ach.color.slice(5,7), 16)}, 0.15)`,
              color: ach.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <ach.icon size={32} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>{ach.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.4 }}>{ach.desc}</p>
            {ach.earned && (
               <div style={{ marginTop: '1.5rem', color: '#10b981', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  <Award size={14} /> EARNED
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
