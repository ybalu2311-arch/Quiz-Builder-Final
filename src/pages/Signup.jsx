import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  name: '', email: '', role: 'student', studentId: '', department: '',
  year: '', designation: 'Administrator', phone: '', password: '', confirmPassword: '',
};

export default function Signup() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;

  function update(field, value) { setForm((current) => ({ ...current, [field]: value })); }

  function submit(event) {
    event.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must contain at least 6 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (form.role === 'student' && !form.studentId.trim()) return setError('Please enter your Student ID.');
    const result = signup(form);
    if (!result.success) return setError(result.message);
    navigate(result.user.role === 'admin' ? '/admin' : '/student');
  }

  return (
    <div className="auth-page auth-page-signup">
      <section className="auth-card auth-card-wide">
        <div className="eyebrow">CREATE YOUR PROFILE</div>
        <h1>Register an account</h1>
        <p className="muted">Enter your real details. Your profile will appear in the admin directory.</p>
        <form className="form-stack" onSubmit={submit}>
          <label>Full name<input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Enter your full name" autoComplete="name" required /></label>
          <div className="form-two-columns">
            <label>Email address<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
            <label>Phone number <span className="optional-label">(optional)</span><input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Mobile number" autoComplete="tel" /></label>
          </div>
          <label>Account type<select value={form.role} onChange={(e) => update('role', e.target.value)}><option value="student">Student</option><option value="admin">Admin</option></select></label>
          {form.role === 'student' ? (
            <div className="form-two-columns">
              <label>Student ID / Roll number<input value={form.studentId} onChange={(e) => update('studentId', e.target.value)} placeholder="e.g. 25CS1001" required /></label>
              <label>Department<input value={form.department} onChange={(e) => update('department', e.target.value)} placeholder="e.g. CSE" /></label>
              <label>Year / Section<input value={form.year} onChange={(e) => update('year', e.target.value)} placeholder="e.g. 2nd Year - A" /></label>
            </div>
          ) : (
            <div className="form-two-columns">
              <label>Designation<input value={form.designation} onChange={(e) => update('designation', e.target.value)} placeholder="e.g. Faculty / Administrator" required /></label>
              <label>Department<input value={form.department} onChange={(e) => update('department', e.target.value)} placeholder="e.g. CSE Department" /></label>
            </div>
          )}
          <div className="form-two-columns">
            <label>Password<input type="password" minLength="6" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Minimum 6 characters" autoComplete="new-password" required /></label>
            <label>Confirm password<input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Re-enter password" autoComplete="new-password" required /></label>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button className="button button-primary button-full" type="submit">Create account <span>→</span></button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
        <p className="tiny-note">Project demo note: accounts are stored in this browser's Local Storage. This is not production-grade authentication.</p>
      </section>
    </div>
  );
}
