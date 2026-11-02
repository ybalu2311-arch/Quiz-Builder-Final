import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuizzes, saveResults, getResults } from '../utils/storage';

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remaining = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
}

export default function QuizAttempt() {
  const { quizId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const quiz = useMemo(() => getQuizzes().find((item) => item.id === quizId && item.published), [quizId]);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState((quiz?.duration || 1) * 60);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!quiz) navigate('/student', { replace: true });
  }, [quiz, navigate]);

  useEffect(() => {
    if (!quiz || submitted) return undefined;
    if (secondsLeft <= 0) { submitQuiz(true); return undefined; }
    const timer = window.setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
    // submitQuiz intentionally uses the latest answers through the functional state closure below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, submitted, quiz]);

  function submitQuiz(autoSubmitted = false) {
    if (submitted || !quiz) return;
    if (!autoSubmitted && !window.confirm('Submit your quiz now? You cannot change your answers after submission.')) return;
    setSubmitted(true);
    const totalMarks = quiz.questions.reduce((sum, question) => sum + Number(question.marks || 0), 0);
    let score = 0;
    const reviewedAnswers = quiz.questions.map((question) => {
      const response = String(answers[question.id] ?? '').trim();
      const correct = String(question.answer).trim();
      const isCorrect = question.type === 'fill'
        ? response.toLowerCase() === correct.toLowerCase()
        : response === correct;
      if (isCorrect) score += Number(question.marks || 0);
      return { questionId: question.id, question: question.text, response, correctAnswer: correct, isCorrect, marks: Number(question.marks || 0) };
    });
    const result = {
      id: `result-${Date.now()}`, quizId: quiz.id, quizTitle: quiz.title,
      studentId: user.id, studentName: user.name, studentEmail: user.email, rollNumber: user.studentId || '',
      score, totalMarks, percentage: totalMarks ? Math.round((score / totalMarks) * 100) : 0,
      submittedAt: new Date().toISOString(), autoSubmitted, answers: reviewedAnswers,
    };
    saveResults([...getResults(), result]);
    navigate(`/result/${result.id}`, { replace: true });
  }

  if (!quiz) return null;
  return (
    <div className="attempt-page">
      <div className="attempt-top"><Link to="/student" className="back-link">← Exit quiz</Link><div className={`timer ${secondsLeft <= 60 ? 'timer-warning' : ''}`}>◷ <span>{formatTime(Math.max(0, secondsLeft))}</span></div></div>
      <div className="attempt-title"><div className="eyebrow">ASSESSMENT IN PROGRESS</div><h1>{quiz.title}</h1><p className="muted">{quiz.questions.length} questions <span>•</span> {quiz.duration} minutes <span>•</span> {quiz.questions.reduce((sum, q) => sum + Number(q.marks || 0), 0)} marks</p></div>
      <div className="progress-track"><div className="progress-fill" style={{ width: `${(Object.keys(answers).filter((id) => String(answers[id]).trim()).length / quiz.questions.length) * 100}%` }}/></div>
      <div className="attempt-layout"><div className="questions-list">{quiz.questions.map((question, index) => <section className="panel attempt-question" key={question.id}><div className="attempt-question-heading"><span className="question-number">Question {index + 1}</span><span className="marks-tag">{question.marks} marks</span></div><h3>{question.text}</h3>{question.type === 'fill' ? <input value={answers[question.id] || ''} onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })} placeholder="Type your answer here"/> : <div className="answer-options">{question.options.map((option) => <label className={`answer-option ${answers[question.id] === option ? 'answer-selected' : ''}`} key={option}><input type="radio" name={question.id} value={option} checked={answers[question.id] === option} onChange={() => setAnswers({ ...answers, [question.id]: option })}/><span>{option}</span></label>)}</div>}</section>)}</div><aside className="panel attempt-sidebar"><h3>Quiz progress</h3><div className="progress-number">{Object.keys(answers).filter((id) => String(answers[id]).trim()).length}<span> / {quiz.questions.length} answered</span></div><p className="muted tiny">Your answers are saved while this page remains open.</p><div className="sidebar-divider"/><button className="button button-primary button-full" onClick={() => submitQuiz(false)}>Submit quiz</button><p className="tiny muted">The quiz will be submitted automatically when the timer reaches 00:00.</p></aside></div>
    </div>
  );
}
