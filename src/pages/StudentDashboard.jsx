import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { getQuizzes, getResults } from '../utils/storage';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  useEffect(() => {
    setQuizzes(getQuizzes().filter((quiz) => quiz.published));
    setResults(getResults().filter((result) => result.studentId === user.id));
  }, [user.id]);
  const average = results.length ? Math.round(results.reduce((sum, item) => sum + item.percentage, 0) / results.length) : 0;

  return (
    <>
      <div className="welcome-banner"><div><div className="eyebrow eyebrow-light">STUDENT WORKSPACE</div><h1>Hello, {user.name.split(' ')[0]} 👋</h1><p>Ready to test what you know? Choose a quiz below and give it your best.</p></div><div className="welcome-graphic">✦</div></div>
      <section className="stats-grid student-stats"><StatCard label="Available quizzes" value={quizzes.length} helper="Ready to attempt" icon="▤"/><StatCard label="Quizzes attempted" value={results.length} helper="Your submissions" icon="✓"/><StatCard label="Average score" value={`${average}%`} helper="Across your attempts" icon="↗"/></section>
      <section className="section-block"><div className="section-heading"><div><h2>Available quizzes</h2><p className="muted">Select a quiz to view its details and begin.</p></div></div>
        {quizzes.length === 0 ? <div className="empty-state"><div className="empty-icon">▤</div><h3>No published quizzes</h3><p>There are no quizzes available right now. Please check again later.</p></div> : <div className="quiz-grid">{quizzes.map((quiz) => {
          const attempted = results.some((result) => result.quizId === quiz.id);
          return <article className="quiz-card student-quiz-card" key={quiz.id}><div className="quiz-card-top"><span className="status-pill status-published">Available</span><span className="quiz-card-symbol">✦</span></div><h3>{quiz.title}</h3><p>{quiz.description || 'Test your knowledge with this quiz.'}</p><div className="quiz-meta"><span>◷ {quiz.duration} min</span><span>▧ {quiz.questions.length} questions</span><span>★ {quiz.questions.reduce((sum, q) => sum + Number(q.marks || 0), 0)} marks</span></div><div className="quiz-card-actions"><Link className="button button-primary button-small" to={`/quiz/${quiz.id}`}>Start quiz →</Link>{attempted && <span className="tiny muted">Attempted before</span>}</div></article>;
        })}</div>}
      </section>
    </>
  );
}
