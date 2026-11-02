import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getQuizzes, saveQuizzes } from '../utils/storage';

const makeQuestion = () => ({ id: `q-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`, type: 'mcq', text: '', options: ['', '', '', ''], answer: '', marks: 1 });

export default function QuizEditor() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(quizId);
  const existing = useMemo(() => editing ? getQuizzes().find((item) => item.id === quizId) : null, [editing, quizId]);
  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [duration, setDuration] = useState(existing?.duration || 15);
  const [published, setPublished] = useState(existing?.published ?? false);
  const [questions, setQuestions] = useState(existing?.questions?.length ? existing.questions : [makeQuestion()]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing && !existing) navigate('/admin', { replace: true });
  }, [editing, existing, navigate]);

  function updateQuestion(id, updates) {
    setQuestions((current) => current.map((question) => question.id === id ? { ...question, ...updates } : question));
  }

  function changeType(question, type) {
    updateQuestion(question.id, {
      type,
      options: type === 'mcq' ? ['', '', '', ''] : type === 'tf' ? ['True', 'False'] : [],
      answer: '',
    });
  }

  function updateOption(question, index, value) {
    const options = [...question.options]; options[index] = value;
    updateQuestion(question.id, { options });
  }

  function validate() {
    if (!title.trim()) return 'Please enter a quiz title.';
    if (questions.length === 0) return 'Add at least one question.';
    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index];
      if (!question.text.trim()) return `Enter the question text for Question ${index + 1}.`;
      if (!question.answer.trim()) return `Select or enter the correct answer for Question ${index + 1}.`;
      if (question.type === 'mcq' && question.options.some((option) => !option.trim())) return `Fill all options for Question ${index + 1}.`;
    }
    return '';
  }

  function saveQuiz(event) {
    event.preventDefault();
    const validationMessage = validate();
    if (validationMessage) return setError(validationMessage);
    const quizzes = getQuizzes();
    const quiz = {
      id: existing?.id || `quiz-${Date.now()}`,
      title: title.trim(), description: description.trim(), duration: Math.max(1, Number(duration) || 1),
      published, questions: questions.map((q) => ({ ...q, marks: Math.max(1, Number(q.marks) || 1) })),
      createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    const updated = editing ? quizzes.map((item) => item.id === quiz.id ? quiz : item) : [...quizzes, quiz];
    saveQuizzes(updated);
    navigate('/admin');
  }

  function deleteQuiz() {
    if (!window.confirm('Delete this quiz? This action cannot be undone.')) return;
    saveQuizzes(getQuizzes().filter((item) => item.id !== quizId));
    navigate('/admin');
  }

  if (editing && !existing) return null;
  const totalMarks = questions.reduce((sum, question) => sum + (Number(question.marks) || 0), 0);

  return (
    <>
      <div className="page-heading"><Link to="/admin" className="back-link">← Back to dashboard</Link><div className="eyebrow">QUIZ MANAGEMENT</div><h1>{editing ? 'Edit quiz' : 'Create a quiz'}</h1><p className="muted">Set the quiz details and add questions for your students.</p></div>
      <form onSubmit={saveQuiz} className="editor-layout">
        <div className="editor-main">
          <section className="panel form-stack">
            <div className="panel-heading"><div><h2>Quiz details</h2><p className="muted">Basic information about this assessment.</p></div></div>
            <label>Quiz title<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. React Fundamentals" required /></label>
            <label>Description<textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will students learn or demonstrate?" /></label>
            <div className="form-two-columns"><label>Duration (minutes)<input type="number" min="1" max="300" value={duration} onChange={(e) => setDuration(e.target.value)} required /></label><label>Visibility<select value={published ? 'published' : 'draft'} onChange={(e) => setPublished(e.target.value === 'published')}><option value="draft">Save as draft</option><option value="published">Publish for students</option></select></label></div>
          </section>
          <div className="section-heading question-heading"><div><h2>Questions <span className="count-badge">{questions.length}</span></h2><p className="muted">Add MCQ, True / False or Fill in the Blank questions.</p></div><button type="button" className="button button-secondary button-small" onClick={() => setQuestions([...questions, makeQuestion()])}>＋ Add question</button></div>
          {questions.map((question, index) => <section className="panel question-editor" key={question.id}>
            <div className="question-editor-top"><strong>Question {index + 1}</strong><button className="icon-button danger-text" type="button" title="Remove question" onClick={() => setQuestions(questions.filter((item) => item.id !== question.id))}>✕</button></div>
            <label>Question text<textarea rows="2" value={question.text} onChange={(e) => updateQuestion(question.id, { text: e.target.value })} placeholder="Type your question here..." required /></label>
            <div className="form-two-columns"><label>Question type<select value={question.type} onChange={(e) => changeType(question, e.target.value)}><option value="mcq">Multiple Choice (MCQ)</option><option value="tf">True / False</option><option value="fill">Fill in the Blank</option></select></label><label>Marks<input type="number" min="1" value={question.marks} onChange={(e) => updateQuestion(question.id, { marks: e.target.value })} /></label></div>
            {question.type !== 'fill' && <div className="options-area"><span className="field-title">Options</span>{question.options.map((option, optionIndex) => <label className="option-row" key={`${question.id}-${optionIndex}`}><input type="radio" name={`answer-${question.id}`} checked={question.answer === option && option !== ''} onChange={() => updateQuestion(question.id, { answer: option })} aria-label={`Mark option ${optionIndex + 1} as correct`} /><input value={option} readOnly={question.type === 'tf'} onChange={(e) => updateOption(question, optionIndex, e.target.value)} placeholder={`Option ${optionIndex + 1}`} /></label>)}</div>}
            {question.type === 'fill' && <label>Correct answer<input value={question.answer} onChange={(e) => updateQuestion(question.id, { answer: e.target.value })} placeholder="Enter the expected answer" required /></label>}
            {question.type !== 'fill' && <div className="answer-note">Select the radio button beside the correct option.</div>}
          </section>)}
        </div>
        <aside className="editor-sidebar"><div className="panel sticky-panel"><h3>Quiz summary</h3><div className="summary-row"><span>Questions</span><strong>{questions.length}</strong></div><div className="summary-row"><span>Total marks</span><strong>{totalMarks}</strong></div><div className="summary-row"><span>Duration</span><strong>{duration} min</strong></div><div className="summary-row"><span>Status</span><strong>{published ? 'Published' : 'Draft'}</strong></div><div className="sidebar-divider"/><button className="button button-primary button-full" type="submit">{editing ? 'Save changes' : 'Create quiz'}</button><Link to="/admin" className="button button-ghost button-full">Cancel</Link>{editing && <button type="button" className="button button-danger button-full" onClick={deleteQuiz}>Delete quiz</button>}</div></aside>
      </form>
      {error && <div className="toast-error">{error}</div>}
    </>
  );
}
