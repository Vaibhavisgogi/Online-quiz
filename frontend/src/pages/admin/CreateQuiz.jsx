import React, { useState } from 'react';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);

  const handleAutoGenerate = async () => {
    if (!title || !topic) {
        alert("Please enter a Title and Topic first to auto-generate questions.");
        return;
    }
    
    setIsGenerating(true);
    try {
        const res = await api.post('/quizzes/auto-generate', {
            title,
            topic,
            questionCount
        });
        
        if (res.data.questions) {
            setQuestions(res.data.questions);
        }
    } catch (error) {
        console.error("Failed to auto-generate questions", error);
        alert("Failed to auto-generate questions. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/quizzes', {
        title,
        description,
        subject,
        topic,
        questions
      });
      navigate('/admin', { state: { fromButton: true } });
    } catch (error) {
        console.error('Failure creating quiz', error);
        alert('Failed to create quiz.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
       <Link to="/admin" state={{ fromButton: true }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem', transition: 'color 0.3s ease' }} className="hover-underline">
           <ArrowLeft size={16} /> Back to Dashboard
       </Link>

       <div className="glass-panel animate-fade-in" style={{ padding: '2rem 3rem' }}>
           <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Create New Quiz</h2>

           <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               
               {/* Metadata Section */}
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Quiz Title</label>
                       <input 
                           type="text" 
                           value={title} 
                           onChange={(e) => setTitle(e.target.value)} 
                           required 
                           style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'white', outline: 'none' }}
                       />
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Topic</label>
                       <input 
                           type="text" 
                           value={topic} 
                           onChange={(e) => setTopic(e.target.value)} 
                           style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'white', outline: 'none' }}
                       />
                   </div>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                   <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Description</label>
                   <textarea 
                       value={description} 
                       onChange={(e) => setDescription(e.target.value)} 
                       rows={3}
                       style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '8px', color: 'white', outline: 'none', resize: 'vertical' }}
                   />
               </div>

               <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />

               {/* Questions Section */}
               <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <h3 style={{ fontSize: '1.4rem' }}>Questions</h3>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Count:</label>
                                <input 
                                    type="number" 
                                    value={questionCount} 
                                    onChange={(e) => setQuestionCount(e.target.value)}
                                    min="1" max="50"
                                    style={{ width: '50px', background: 'transparent', border: 'none', color: 'white', outline: 'none', fontWeight: 'bold' }}
                                />
                                <button 
                                    type="button" 
                                    onClick={handleAutoGenerate} 
                                    disabled={isGenerating}
                                    style={{ background: 'var(--gradient-primary)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                                >
                                    {isGenerating ? "..." : "Auto-Generate"}
                                </button>
                            </div>
                            <button type="button" onClick={handleAddQuestion} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', border: '1px solid rgba(59, 130, 246, 0.4)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                                <Plus size={16} /> Add 
                            </button>
                        </div>
                    </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                       {questions.map((q, qIndex) => (
                           <div key={qIndex} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', position: 'relative' }}>
                               
                               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                   <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>Question {qIndex + 1}</span>
                                   {questions.length > 1 && (
                                       <button type="button" onClick={() => handleRemoveQuestion(qIndex)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                           <Trash2 size={18} />
                                       </button>
                                   )}
                               </div>

                               <input 
                                   type="text" 
                                   placeholder="Enter question text here..."
                                   value={q.questionText}
                                   onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                   required
                                   style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '8px', color: 'white', outline: 'none', marginBottom: '1.5rem', fontSize: '1.1rem' }}
                               />

                               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                   {q.options.map((opt, oIndex) => (
                                       <div key={oIndex} style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.5rem' }}>
                                           <span style={{ padding: '0 0.5rem', color: 'var(--text-secondary)' }}>{String.fromCharCode(65 + oIndex)}.</span>
                                           <input 
                                               type="text" 
                                               value={opt}
                                               onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                               required
                                               placeholder={`Option ${oIndex + 1}`}
                                               style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
                                           />
                                       </div>
                                   ))}
                               </div>

                               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                   <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Solution / Explanation:</label>
                                   <textarea 
                                       placeholder="Provide an explanation for the correct answer..."
                                       value={q.solution || ''}
                                       onChange={(e) => handleQuestionChange(qIndex, 'solution', e.target.value)}
                                       style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'white', outline: 'none', resize: 'vertical' }}
                                   />
                               </div>

                               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                   <label style={{ color: 'var(--accent-green)' }}>Correct Answer:</label>
                                   <select 
                                       value={q.correctAnswer}
                                       onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                                       required
                                       style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent-green)', padding: '0.5rem 1rem', borderRadius: '8px', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                                   >
                                       <option value="" disabled style={{ background: 'var(--bg-secondary)', color: 'white' }}>Select Correct Option</option>
                                       {q.options.map((opt, oIndex) => (
                                           <option key={oIndex} value={opt} style={{ background: 'var(--bg-secondary)', color: 'white' }}>
                                               {opt || `Option ${oIndex + 1}`}
                                           </option>
                                       ))}
                                   </select>
                               </div>

                           </div>
                       ))}
                   </div>
               </div>

               <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                   <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '99px' }}>
                       {isSubmitting ? <div className="spinner"></div> : (
                           <><Save size={20} /> Save Quiz</>
                       )}
                   </button>
               </div>
           </form>
       </div>
    </div>
  );
}
