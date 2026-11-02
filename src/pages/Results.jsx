import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuizzes, getResults, getUsers } from '../utils/storage';

function prettyDate(value) {
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function getStudentIdentity(result, users) {
  const account = users.find((item) => item.id === result.studentId);
  return {
    name: result.studentName || account?.name || 'Unknown student',
    studentId: result.rollNumber || account?.studentId || 'ID not available',
  };
}

export function ResultDetail() {
  const { resultId } = useParams();
  const { user } = useAuth();
  const result = useMemo(() => getResults().find((item) => item.id === resultId), [resultId]);
  const student = result ? getStudentIdentity(result, getUsers()) : { name: '', studentId: '' };
  if (!result || (user.role !== 'admin' && result.studentId !== user.id)) return <div className="empty-state"><h2>Result not found</h2><Link className="button button-primary" to={user.role === 'admin' ? '/admin/results' : '/student/results'}>Back to results</Link></div>;
  const passed = result.percentage >= 40;
  return (
    <div className="result-detail-page">
      <Link className="back-link" to={user.role === 'admin' ? '/admin/results' : '/student/results'}>← Back to results</Link>
      <section className="result-hero"><div className="result-check">{passed ? '✓' : '!'}</div><div className="eyebrow">QUIZ SUBMITTED</div><h1>{result.quizTitle}</h1><p>{student.name} <span>•</span> Student ID: {student.studentId} <span>•</span> {prettyDate(result.submittedAt)}</p><div className="score-big">{result.score}<span> / {result.totalMarks}</span></div><div className={`result-status ${passed ? 'pass' : 'fail'}`}>{passed ? 'Good work — Passed' : 'Keep practising — Not passed'} · {result.percentage}%</div>{result.autoSubmitted && <p className="tiny">This attempt was submitted automatically when the timer ended.</p>}</section>
      <div className="section-heading"><div><h2>Answer review</h2><p className="muted">Compare your responses with the correct answers.</p></div></div>
      <div className="questions-list">{result.answers.map((answer, index) => <section className="panel review-question" key={answer.questionId}><div className="attempt-question-heading"><span className="question-number">Question {index + 1}</span><span className={answer.isCorrect ? 'review-correct' : 'review-wrong'}>{answer.isCorrect ? `+${answer.marks} marks` : 'Incorrect'}</span></div><h3>{answer.question}</h3><p className="review-line"><span>Your answer:</span> {answer.response || 'Not answered'}</p>{!answer.isCorrect && <p className="review-answer"><span>Correct answer:</span> {answer.correctAnswer}</p>}</section>)}</div>
    </div>
  );
}

export function ResultsList({ admin = false }) {
  const { user } = useAuth();
  const results = useMemo(() => {
    const all = getResults();
    return (admin ? all : all.filter((item) => item.studentId === user.id)).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [admin, user.id]);
  const quizzes = getQuizzes();
  const users = getUsers();
  return (
    <>
      <div className="page-heading"><div className="eyebrow">{admin ? 'ADMIN WORKSPACE' : 'STUDENT WORKSPACE'}</div><h1>{admin ? 'Student results' : 'My results'}</h1><p className="muted">{admin ? 'Review quiz attempts and student scores.' : 'Track your quiz attempts and performance.'}</p></div>
      <section className="panel table-panel"><div className="table-header"><h2>Submission history</h2><span className="count-badge">{results.length} submissions</span></div>{results.length === 0 ? <div className="empty-state"><div className="empty-icon">✓</div><h3>No results yet</h3><p>Completed quiz submissions will appear here.</p>{!admin && <Link className="button button-primary" to="/student">Browse quizzes</Link>}</div> : <div className="table-scroll"><table><thead><tr>{admin && <th>Student Name &amp; ID</th>}<th>Quiz</th><th>Score</th><th>Percentage</th><th>Submitted</th><th>Result</th><th/></tr></thead><tbody>{results.map((result) => <tr key={result.id}>{admin && <td><strong>{getStudentIdentity(result, users).name}</strong><small>Student ID: {getStudentIdentity(result, users).studentId}</small></td>}<td><strong>{result.quizTitle}</strong><small>{quizzes.find((quiz) => quiz.id === result.quizId)?.questions.length ?? result.answers.length} questions</small></td><td>{result.score} / {result.totalMarks}</td><td><strong>{result.percentage}%</strong></td><td>{prettyDate(result.submittedAt)}</td><td><span className={`status-pill ${result.percentage >= 40 ? 'status-published' : 'status-draft'}`}>{result.percentage >= 40 ? 'Pass' : 'Needs practice'}</span></td><td><Link className="table-link" to={`/result/${result.id}`}>Review →</Link></td></tr>)}</tbody></table></div>}</section>
    </>
  );
}
