import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../utils/storage';

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'U';
}

function joinedDate(value) {
  if (!value) return 'Date not recorded';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date not recorded' : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminProfiles() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const users = getUsers().slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  const students = users.filter((account) => account.role === 'student');
  const admins = users.filter((account) => account.role === 'admin');
  const visibleUsers = useMemo(() => users.filter((account) => {
    const matchesRole = roleFilter === 'all' || account.role === roleFilter;
    const searchable = [account.name, account.email, account.studentId, account.department, account.designation].join(' ').toLowerCase();
    return matchesRole && searchable.includes(search.toLowerCase().trim());
  }), [users, roleFilter, search]);

  return (
    <>
      <div className="page-heading heading-with-action">
        <div><div className="eyebrow">ADMIN WORKSPACE</div><h1>Registered profiles</h1><p className="muted">View the student and admin accounts registered in this Quiz Builder browser.</p></div>
        <Link className="button button-secondary" to="/admin">← Dashboard</Link>
      </div>
      <section className="stats-grid profile-stats">
        <article className="stat-card"><div className="stat-top"><span>Total accounts</span><span className="stat-icon">◉</span></div><div className="stat-value">{users.length}</div><div className="stat-helper">All registered profiles</div></article>
        <article className="stat-card"><div className="stat-top"><span>Students</span><span className="stat-icon">♙</span></div><div className="stat-value">{students.length}</div><div className="stat-helper">Student accounts</div></article>
        <article className="stat-card"><div className="stat-top"><span>Admins</span><span className="stat-icon">⚙</span></div><div className="stat-value">{admins.length}</div><div className="stat-helper">Administrator accounts</div></article>
      </section>

      <section className="panel profile-directory-panel">
        <div className="directory-toolbar">
          <div><h2>People and profiles</h2><p className="muted">Search by name, email, Student ID or department.</p></div>
          <div className="directory-filters"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search profiles..." aria-label="Search profiles"/><select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} aria-label="Filter by account type"><option value="all">All accounts</option><option value="student">Students</option><option value="admin">Admins</option></select></div>
        </div>
        {visibleUsers.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">♙</div><h3>{users.length ? 'No matching profiles' : 'No registered accounts yet'}</h3><p>{users.length ? 'Try changing the search text or account filter.' : 'When students and admins complete signup, their profiles will appear here.'}</p></div>
        ) : (
          <div className="profile-directory-grid">
            {visibleUsers.map((account) => (
              <article className="directory-card" key={account.id}>
                <div className="directory-card-top"><div className="profile-avatar">{initials(account.name)}</div><span className={`role-badge role-${account.role}`}>{account.role === 'admin' ? 'Admin' : 'Student'}</span></div>
                <h3>{account.name || 'Name not provided'}</h3>
                <p className="directory-email">{account.email}</p>
                <div className="directory-info">
                  {account.role === 'student' ? <div><span>Student ID</span><strong>{account.studentId || 'Not provided'}</strong></div> : <div><span>Designation</span><strong>{account.designation || 'Administrator'}</strong></div>}
                  <div><span>Department</span><strong>{account.department || 'Not provided'}</strong></div>
                  {account.role === 'student' && <div><span>Year / Section</span><strong>{account.year || 'Not provided'}</strong></div>}
                  {account.phone && <div><span>Phone</span><strong>{account.phone}</strong></div>}
                </div>
                <div className="directory-card-footer"><span>Joined {joinedDate(account.createdAt)}</span><span className="account-id">{account.role.toUpperCase()}</span></div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
