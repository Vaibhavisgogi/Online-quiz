import React, { useEffect, useState } from 'react';
import { ArrowLeft, Target, Trophy, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/results/my-results');
        setResults(res.data);
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="dashboard-container">
       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
           <Link to="/dashboard" state={{ fromButton: true }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s ease' }} className="hover-underline">
               <ArrowLeft size={16} /> Back to Dashboard
           </Link>
           <h2 className="text-gradient" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem' }}>
                <Trophy size={28} /> My Performance
           </h2>
       </div>
       
       {loading ? (
             <div className="spinner" style={{ margin: '4rem auto' }}></div>
       ) : results.length === 0 ? (
           <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(0,0,0,0.2)' }}>
               <Target size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
               <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>No Results Yet</h3>
               <p style={{ color: 'var(--text-secondary)', margin: '0 0 2rem 0' }}>Take your first quiz to see your performance here.</p>
               <Link to="/dashboard" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                   Start a Quiz
               </Link>
           </div>
       ) : (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {results.map((result, index) => {
                   // Calculate color based on percentage
                   let scoreColor = 'var(--accent-red)';
                   if (result.percentage >= 80) scoreColor = 'var(--accent-green)';
                   else if (result.percentage >= 50) scoreColor = '#fbbf24'; // yellow

                   return (
                       <div key={result._id} className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animationDelay: `${index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}>
                           
                           <div>
                               <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>{result.quiz?.title || 'Deleted Quiz'}</h3>
                               <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {new Date(result.date).toLocaleString()}</span>
                                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={14} /> {result.score} / {result.totalQuestions} Correct</span>
                               </div>
                           </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <Link to={`/quiz-review/${result._id}`} state={{ fromButton: true }} className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                                    Review Answers
                                </Link>
                                <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', background: `conic-gradient(${scoreColor} ${result.percentage}%, rgba(0,0,0,0.3) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: scoreColor }}>{Math.round(result.percentage)}%</span>
                                    </div>
                                </div>
                            </div>
                       </div>
                   );
               })}
           </div>
       )}
    </div>
  );
}
