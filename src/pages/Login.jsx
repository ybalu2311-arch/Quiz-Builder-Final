import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [error, setError] = useState('');

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;

  function submit(event) {
    event.preventDefault();
    setError('');
    const result = login(form);
    if (!result.success) return setError(result.message);
    navigate(result.user.role === 'admin' ? '/admin' : '/student');
  }

  return (
    <div className="auth-page">
      <div className="auth-decoration"><div className="decoration-orbit orbit-one"/><div className="decoration-orbit orbit-two"/><div className="decoration-card">QB<span>✦</span></div></div>
      <section className="auth-card">
        <div className="eyebrow">YOUR QUIZ WORKSPACE</div>
        <h1>Sign in to Quiz Builder</h1>
        <p className="muted">Use the account you registered to access your dashboard and profile.</p>
        <form className="form-stack" onSubmit={submit}>
          <label>Email address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" autoComplete="username" required /></label>
          <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" autoComplete="current-password" required /></label>
          <label>Sign in as<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="student">Student</option><option value="admin">Admin</option></select></label>
          {error && <div className="alert alert-error">{error}</div>}
          <button className="button button-primary button-full" type="submit">Sign in <span>→</span></button>
        </form>
        <p className="auth-switch">New to Quiz Builder? <Link to="/signup">Create your own account</Link></p>
      </section>
    </div>
  );
}
