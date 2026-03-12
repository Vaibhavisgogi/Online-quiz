import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Sparkles, HelpCircle, Lightbulb, CheckCircle2, Star, Brain, Book, Coins } from 'lucide-react';

export default function Home() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${(i / 25) * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${15 + Math.random() * 15}s`,
      size: 20 + Math.random() * 30,
      type: [HelpCircle, Lightbulb, CheckCircle2, Star, Brain, Book][Math.floor(Math.random() * 6)],
      direction: Math.random() > 0.5 ? 'float-up' : 'float-down'
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="landing-container">
      <div className="grid-bg" />
      
      {/* Background Particles */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        {particles.map((p) => (
          <div 
            key={p.id}
            className={`quiz-particle ${p.direction}`}
            style={{ 
              left: p.left, 
              top: p.direction === 'float-down' ? '-50px' : 'auto',
              bottom: p.direction === 'float-up' ? '-50px' : 'auto',
              animationDelay: p.delay, 
              animationDuration: p.duration,
              color: 'rgba(139, 92, 246, 0.15)'
            }}
          >
            <p.type size={p.size} />
          </div>
        ))}
      </div>
      
      <nav style={{ padding: '1.5rem 10%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--gradient-primary)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy color="white" size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quiz<span className="text-gradient">Hunter</span></h2>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/login" state={{ fromButton: true }} className="glass-panel" style={{ padding: '0.6rem 2rem', textDecoration: 'none', color: 'white' }}>Login</Link>
          <Link to="/signup" className="btn-primary hero-btn" state={{ fromButton: true }} style={{ padding: '0.6rem 2rem', textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 10%', position: 'relative', zIndex: 10 }}>
        <div style={{ flex: 1.2 }}>
          <div className="reveal-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', padding: '0.4rem 1rem', borderRadius: '99px', color: 'var(--accent-purple)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <Sparkles size={16} /> Gamified AI Quiz Experience
          </div>
          
          <h1 className="hero-title-gradient typewriter" style={{ fontSize: '5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem', width: 'fit-content' }}>
            Learn. Play. Earn.
          </h1>
          
          <p className="reveal-text" style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '550px', animationDelay: '0.5s' }}>
            The next generation of online testing. Challenging quizzes, real-time leaderboards, and a coin-based reward system all in one place.
          </p>
          
          <div className="reveal-text" style={{ display: 'flex', gap: '1.5rem', animationDelay: '0.8s' }}>
            <Link to="/signup" className="btn-primary hero-btn" state={{ fromButton: true }} style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', textDecoration: 'none', borderRadius: '16px' }}>
              Get Started Free <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* REPLACED IMAGE WITH 3D INTERACTIVE MOCKUP */}
        <div style={{ flex: 1, position: 'relative', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Decorative Glow */}
          <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'var(--gradient-primary)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%' }}></div>
          
          {/* 3D Quiz Stack Mockup */}
          {/* Card 1: Question */}
          <div className="mockup-card" style={{ width: '320px', zIndex: 3, top: '10%' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontWeight: 700, marginBottom: '0.5rem' }}>QUESTION 05/10</p>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>Which language is used for web behavior?</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>Python</div>
              <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'var(--gradient-primary)', border: 'none', color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>JavaScript</div>
            </div>
          </div>

          {/* Card 2: Success Notification */}
          <div className="mockup-card success-pulse" style={{ width: '220px', zIndex: 4, right: '0', bottom: '15%', animationDelay: '1s', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#10b981', padding: '0.5rem', borderRadius: '10px' }}>
                <CheckCircle2 color="white" size={20} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>CORRECT!</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24', fontWeight: 800 }}>
                  <Coins size={14} /> +10 Coins
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Mini Leaderboard */}
          <div className="mockup-card" style={{ width: '200px', zIndex: 2, left: '0', bottom: '5%', animationDelay: '2s', opacity: 0.8 }}>
             <h5 style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', opacity: 0.7 }}>LEADERBOARD</h5>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span>1. Pooja P.</span><span style={{ color: '#fbbf24' }}>1,250 🪙</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span>2. Rahul S.</span><span style={{ color: '#fbbf24' }}>980 🪙</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.5 }}><span>3. Arjun K.</span><span style={{ color: '#fbbf24' }}>850 🪙</span></div>
             </div>
          </div>
        </div>
      </main>

      {/* Trust Badges */}
      <div style={{ padding: '3rem 10%', display: 'flex', gap: '5rem', background: 'rgba(0,0,0,0.2)', position: 'relative', zIndex: 10 }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Star size={20} color="#fbbf24" fill="#fbbf24" /> <strong>4.9/5</strong> Rating</div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Trophy size={20} color="var(--accent-purple)" /> <strong>500+</strong> Quizzes</div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Sparkles size={20} color="var(--accent-blue)" /> <strong>AI</strong> Powered</div>
      </div>
    </div>
  );
}
