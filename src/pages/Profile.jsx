import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'U';
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user.name || '', email: user.email || '', phone: user.phone || '',
    studentId: user.studentId || '', department: user.department || '',
    year: user.year || '', designation: user.designation || 'Administrator',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      name: user.name || '', email: user.email || '', phone: user.phone || '',
      studentId: user.studentId || '', department: user.department || '',
      year: user.year || '', designation: user.designation || 'Administrator',
    });
  }, [user]);

  function update(field, value) { setForm((current) => ({ ...current, [field]: value })); }

  function submit(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    if (user.role === 'student' && !form.studentId.trim()) return setError('Student ID is required.');
    const result = updateProfile(form);
    if (!result.success) return setError(result.message);
    setMessage('Your profile has been updated and saved.');
  }

  return (
    <>
      <div className="page-heading"><div className="eyebrow">ACCOUNT SETTINGS</div><h1>My profile</h1><p className="muted">View and update the personal details connected to your account.</p></div>
      <div className="profile-layout">
        <section className="panel profile-summary">
          <div className="profile-avatar profile-avatar-large">{initials(user.name)}</div>
          <span className={`role-badge role-${user.role}`}>{user.role}</span>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <div className="profile-summary-details">
            <div><span>Account type</span><strong>{user.role === 'admin' ? 'Administrator' : 'Student'}</strong></div>
            {user.role === 'student' ? <div><span>Student ID</span><strong>{user.studentId || 'Not added'}</strong></div> : <div><span>Designation</span><strong>{user.designation || 'Administrator'}</strong></div>}
            <div><span>Department</span><strong>{user.department || 'Not added'}</strong></div>
          </div>
          {user.role === 'admin' && <Link className="button button-secondary button-full" to="/admin/profiles">View all registered profiles</Link>}
        </section>

        <section className="panel profile-edit-panel">
          <div className="panel-heading"><h2>Edit profile details</h2><p className="muted">Changes are saved to this browser's Local Storage.</p></div>
          <form className="form-stack" onSubmit={submit}>
            <label>Full name<input value={form.name} onChange={(e) => update('name', e.target.value)} required /></label>
            <div className="form-two-columns"><label>Email address<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required /></label><label>Phone number<input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Optional" /></label></div>
            {user.role === 'student' ? (
              <div className="form-two-columns"><label>Student ID / Roll number<input value={form.studentId} onChange={(e) => update('studentId', e.target.value)} required /></label><label>Department<input value={form.department} onChange={(e) => update('department', e.target.value)} placeholder="e.g. CSE" /></label><label>Year / Section<input value={form.year} onChange={(e) => update('year', e.target.value)} placeholder="e.g. 2nd Year - A" /></label></div>
            ) : (
              <div className="form-two-columns"><label>Designation<input value={form.designation} onChange={(e) => update('designation', e.target.value)} /></label><label>Department<input value={form.department} onChange={(e) => update('department', e.target.value)} placeholder="e.g. CSE Department" /></label></div>
            )}
            {error && <div className="alert alert-error">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            <button type="submit" className="button button-primary">Save profile changes</button>
          </form>
        </section>
      </div>
    </>
  );
}
