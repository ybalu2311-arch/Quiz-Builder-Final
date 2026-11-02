import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { getQuizzes, getResults, getUsers } from '../utils/storage';

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => { setQuizzes(getQuizzes()); setResults(getResults()); setUsers(getUsers()); }, []);

  return (
    <>
      <div className="page-heading heading-with-action">
        <div><div className="eyebrow">ADMIN WORKSPACE</div><h1>Dashboard</h1><p className="muted">Manage quizzes, publish assessments and review student performance.</p></div>
        <Link className="button button-primary" to="/admin/create">＋ Create new quiz</Link>
      </div>
      <section className="stats-grid">
        <StatCard label="Total quizzes" value={quizzes.length} helper="Created in this browser" icon="▤" />
        <StatCard label="Published quizzes" value={quizzes.filter((quiz) => quiz.published).length} helper="Visible to students" icon="◉" />
        <StatCard label="Submissions" value={results.length} helper="All student attempts" icon="✓" />
        <StatCard label="Registered people" value={users.length} helper="Students and admins" icon="♙" />
        <StatCard label="Average score" value={results.length ? `${Math.round(results.reduce((sum, item) => sum + item.percentage, 0) / results.length)}%` : '—'} helper="Across all attempts" icon="↗" />
      </section>
      <section className="section-block">
        <div className="section-heading"><div><h2>Your quizzes</h2><p className="muted">Create and manage assessments.</p></div><div className="section-actions"><Link to="/admin/profiles" className="text-link">View profiles →</Link><Link to="/admin/results" className="text-link">View all results →</Link></div></div>
        {quizzes.length === 0 ? <div className="empty-state"><div className="empty-icon">▤</div><h3>No quizzes yet</h3><p>Create your first quiz to get started.</p><Link className="button button-primary" to="/admin/create">Create quiz</Link></div> : (
          <div className="quiz-grid">
            {quizzes.map((quiz) => <article className="quiz-card" key={quiz.id}>
              <div className="quiz-card-top"><span className={`status-pill ${quiz.published ? 'status-published' : 'status-draft'}`}>{quiz.published ? 'Published' : 'Draft'}</span><span className="quiz-card-symbol">▤</span></div>
              <h3>{quiz.title}</h3><p>{quiz.description || 'No description provided.'}</p>
              <div className="quiz-meta"><span>◷ {quiz.duration} min</span><span>▧ {quiz.questions.length} questions</span><span>★ {quiz.questions.reduce((sum, q) => sum + Number(q.marks || 0), 0)} marks</span></div>
              <div className="quiz-card-actions"><Link className="button button-secondary button-small" to={`/admin/edit/${quiz.id}`}>Edit quiz</Link><span className="muted tiny">ID: {quiz.id.slice(-6)}</span></div>
            </article>)}
          </div>
        )}
      </section>
    </>
  );
}
