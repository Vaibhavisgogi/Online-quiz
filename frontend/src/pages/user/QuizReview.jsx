import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Info, Trophy, Target } from 'lucide-react';
import api from '../../services/api';

export default function QuizReview() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/results/${id}`);
        setResult(res.data);
      } catch (error) {
        console.error("Failed to fetch result detail", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) return <div className="dashboard-container"><div className="spinner" style={{ margin: '4rem auto' }}></div></div>;
  if (!result) return <div className="dashboard-container"><h2>Result not found</h2></div>;

  const quiz = result.quiz;

  return (
    <div className="dashboard-container" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Link to="/my-results" state={{ fromButton: true }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover-underline">
          <ArrowLeft size={16} /> Back to My Results
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <span style={{ color: 'var(--text-secondary)' }}>Score:</span>
           <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: result.percentage >= 50 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
             {result.score} / {result.totalQuestions}
           </span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          <h1 className="text-gradient" style={{ margin: '0 0 0.5rem 0' }}>{quiz?.title} Review</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Completed on {new Date(result.date).toLocaleString()}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {quiz?.questions.map((q, idx) => {
          const userAns = result.userAnswers.find(a => a.questionId === q._id);
          const isCorrect = userAns?.selectedOption === q.correctAnswer;

          return (
            <div key={q._id} className="glass-panel animate-fade-in" style={{ padding: '2rem', borderLeft: `6px solid ${isCorrect ? '#10b981' : '#ef4444'}`, animationDelay: `${idx * 0.1}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', lineHeight: 1.5 }}>{idx + 1}. {q.questionText}</h3>
                {isCorrect ? <CheckCircle2 color="#10b981" /> : <XCircle color="#ef4444" />}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {q.options.map(opt => {
                  const isUserSelection = userAns?.selectedOption === opt;
                  const isCorrectOption = q.correctAnswer === opt;
                  
                  let bgColor = 'rgba(255,255,255,0.03)';
                  let borderColor = 'var(--glass-border)';
                  let textColor = 'var(--text-secondary)';

                  if (isCorrectOption) {
                    bgColor = 'rgba(16, 185, 129, 0.1)';
                    borderColor = 'rgba(16, 185, 129, 0.4)';
                    textColor = '#10b981';
                  } else if (isUserSelection && !isCorrectOption) {
                    bgColor = 'rgba(239, 68, 68, 0.1)';
                    borderColor = 'rgba(239, 68, 68, 0.4)';
                    textColor = '#f87171';
                  }

                  return (
                    <div key={opt} style={{ 
                      padding: '1rem', 
                      borderRadius: '10px', 
                      background: bgColor, 
                      border: `1px solid ${borderColor}`,
                      color: textColor,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontWeight: isUserSelection || isCorrectOption ? 'bold' : 'normal'
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: textColor }}></div>
                      {opt}
                      {isUserSelection && <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>(Your Answer)</span>}
                    </div>
                  );
                })}
              </div>

              {q.solution && (
                <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    <Info size={16} /> Solution / Explanation
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{q.solution}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
