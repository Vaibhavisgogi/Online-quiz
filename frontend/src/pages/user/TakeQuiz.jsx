import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const { updateCoins } = useAuth();
  
  // State for quiz taking
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { 0: 'Option A', 1: 'Option B' }
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data);
      } catch (error) {
        console.error('Failed to load quiz', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleSelectOption = (option) => {
    setAnswers({ ...answers, [currentQuestionIndex]: option });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Backend expects { answers: [{ questionId: '...', selectedOption: '...' }, ...] }
      // Transform our state format to backend format
      const formattedAnswers = quiz.questions.map((q, index) => ({
        questionId: q._id,
        selectedOption: answers[index] || ''
      }));

      const res = await api.post(`/quizzes/${id}/take`, { answers: formattedAnswers });
      
      // Update coins in global state
      if (res.data.result && res.data.result.totalCoins !== undefined) {
          updateCoins(res.data.result.totalCoins);
      }
      
      const resultId = res.data.result._id;
      navigate(`/quiz-review/${resultId}`, { state: { fromButton: true } });
      
    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="spinner"></div></div>;
  }

  if (!quiz) {
    return <div className="dashboard-container" style={{ textAlign: 'center', padding: '4rem' }}><h2 className="text-gradient">Quiz Not Found</h2><Link to="/dashboard" style={{ color: 'var(--accent-purple)' }}>Go back</Link></div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const allAnswered = Object.keys(answers).length === quiz.questions.length;

  return (
    <div className="dashboard-container" style={{ maxWidth: '800px' }}>
       <Link to="/dashboard" state={{ fromButton: true }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem', transition: 'color 0.3s ease' }} className="hover-underline">
           <ArrowLeft size={16} /> Exit Quiz
       </Link>

       <div className="glass-panel animate-fade-in" style={{ padding: '2rem 3rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
               <h2 className="text-gradient" style={{ margin: 0 }}>{quiz.title}</h2>
               <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', padding: '0.5rem 1rem', borderRadius: '99px', fontWeight: 'bold' }}>
                   Question {currentQuestionIndex + 1} of {quiz.questions.length}
               </div>
           </div>

           {/* Progress Bar */}
           <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '99px', marginBottom: '3rem', overflow: 'hidden' }}>
               <div style={{ height: '100%', width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`, background: 'var(--gradient-primary)', transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
           </div>

           {/* Question Content */}
           <div style={{ marginBottom: '3rem' }}>
               <h3 style={{ fontSize: '1.5rem', lineHeight: 1.6, marginBottom: '2rem' }}>{currentQuestion.questionText}</h3>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {currentQuestion.options.map((option, idx) => {
                       const isSelected = answers[currentQuestionIndex] === option;
                       return (
                           <div 
                               key={idx}
                               onClick={() => handleSelectOption(option)}
                               style={{ 
                                   display: 'flex', 
                                   alignItems: 'center', 
                                   gap: '1rem', 
                                   padding: '1.25rem 1.5rem', 
                                   background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(0,0,0,0.2)', 
                                   border: `1px solid ${isSelected ? 'var(--accent-purple)' : 'var(--glass-border)'}`, 
                                   borderRadius: '12px', 
                                   cursor: 'pointer',
                                   transition: 'all 0.2s ease',
                                   transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                   boxShadow: isSelected ? '0 4px 15px rgba(139, 92, 246, 0.15)' : 'none'
                               }}
                           >
                               <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--accent-purple)' : 'var(--text-secondary)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                   {isSelected && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-purple)' }} />}
                               </div>
                               <span style={{ fontSize: '1.1rem', color: isSelected ? 'white' : 'var(--text-secondary)' }}>{option}</span>
                           </div>
                       )
                   })}
               </div>
           </div>

           {/* Navigation Controls */}
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
               <button 
                   onClick={handlePrevious} 
                   disabled={currentQuestionIndex === 0}
                   className="btn-primary"
                   style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
               >
                   <ArrowLeft size={18} /> Previous
               </button>

               {currentQuestionIndex < quiz.questions.length - 1 ? (
                   <button 
                       onClick={handleNext}
                       className="btn-primary"
                       disabled={!answers[currentQuestionIndex]}
                   >
                       Next <ArrowRight size={18} />
                   </button>
               ) : (
                   <button 
                       onClick={handleSubmit}
                       className="btn-primary"
                       disabled={!allAnswered || isSubmitting}
                       style={{ background: 'var(--gradient-secondary)' }}
                   >
                       {isSubmitting ? <div className="spinner"></div> : (
                           <>Submit Quiz <CheckCircle size={18} /></>
                       )}
                   </button>
               )}
           </div>

       </div>
    </div>
  );
}
