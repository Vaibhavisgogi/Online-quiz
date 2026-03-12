import React from 'react';
import { CreditCard, ArrowLeft, Coins, Gift, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RedeemCoins() {
  const { user } = useAuth();

  const rewards = [
    { id: 1, title: 'Bonus Life', desc: 'Get an extra chance in high-stakes quizzes', price: 50, icon: Sparkles, color: '#ec4899' },
    { id: 2, title: 'Secret Topic', desc: 'Unlock a hidden category for 24 hours', price: 100, icon: Gift, color: '#8b5cf6' },
    { id: 3, title: 'Profile Badge', desc: 'Exclusive "Scholar" badge on your profile', price: 250, icon: ShoppingBag, color: '#3b82f6' },
  ];

  const handleRedeem = (reward) => {
    if ((user?.coins || 0) < reward.price) {
      alert("Not enough coins! Keep taking quizzes to earn more.");
      return;
    }
    alert(`Success! You have redeemed: ${reward.title}. (Feature coming soon)`);
  };

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/dashboard" state={{ fromButton: true }} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-underline">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </div>

      <div className="glass-panel animate-fade-in" style={{ padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
         <div>
            <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Reward Shop</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Use your hard-earned coins to unlock special perks</p>
         </div>
         <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Current Balance</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fbbf24', fontSize: '2rem', fontWeight: '800' }}>
               <Coins size={36} /> {user?.coins || 0}
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {rewards.map((reward, index) => (
          <div key={reward.id} className="glass-panel animate-fade-in" style={{ 
            padding: '2rem', 
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            animationDelay: `${index * 0.15}s`
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '16px', 
              background: `rgba(${parseInt(reward.color.slice(1,3), 16)}, ${parseInt(reward.color.slice(3,5), 16)}, ${parseInt(reward.color.slice(5,7), 16)}, 0.2)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: reward.color
            }}>
              <reward.icon size={32} />
            </div>
            
            <div>
               <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{reward.title}</h3>
               <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>{reward.desc}</p>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <Coins size={18} /> {reward.price}
               </div>
               <button 
                onClick={() => handleRedeem(reward)}
                className="btn-primary"
                style={{ 
                  margin: 0, 
                  padding: '0.6rem 1.2rem', 
                  fontSize: '0.9rem', 
                  borderRadius: '10px',
                  opacity: (user?.coins || 0) < reward.price ? 0.5 : 1,
                  cursor: (user?.coins || 0) < reward.price ? 'not-allowed' : 'pointer'
                }}
               >
                  Redeem Now
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
