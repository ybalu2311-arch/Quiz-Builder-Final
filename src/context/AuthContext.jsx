import { createContext, useContext, useMemo, useState } from 'react';
import {
  clearSession,
  getSession,
  getUsers,
  removeOldDemoData,
  saveSession,
  saveUsers,
} from '../utils/storage';

const AuthContext = createContext(null);

function safeUser(account) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    studentId: account.studentId || '',
    department: account.department || '',
    year: account.year || '',
    designation: account.designation || '',
    phone: account.phone || '',
    createdAt: account.createdAt || '',
  };
}

function getInitialUser() {
  removeOldDemoData();
  const session = getSession();
  if (!session) return null;
  const account = getUsers().find((item) => item.id === session.id);
  if (!account) {
    clearSession();
    return null;
  }
  return safeUser(account);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  function login({ email, password, role }) {
    const found = getUsers().find((item) => (
      item.email.toLowerCase() === email.trim().toLowerCase()
      && item.password === password
      && item.role === role
    ));
    if (!found) return { success: false, message: 'Email, password or account type is incorrect. Please check your details or create an account.' };

    const signedInUser = safeUser(found);
    saveSession(signedInUser);
    setUser(signedInUser);
    return { success: true, user: signedInUser };
  }

  function signup({ name, email, password, role, studentId, department, year, designation, phone }) {
    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedStudentId = (studentId || '').trim().toUpperCase();

    if (users.some((item) => item.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'This email already has an account. Please sign in instead.' };
    }
    if (role === 'student' && users.some((item) => item.role === 'student' && (item.studentId || '').toUpperCase() === normalizedStudentId)) {
      return { success: false, message: 'This Student ID is already registered.' };
    }

    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      studentId: role === 'student' ? normalizedStudentId : '',
      department: (department || '').trim(),
      year: role === 'student' ? (year || '').trim() : '',
      designation: role === 'admin' ? (designation || 'Administrator').trim() : '',
      phone: (phone || '').trim(),
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);
    const signedInUser = safeUser(newUser);
    saveSession(signedInUser);
    setUser(signedInUser);
    return { success: true, user: signedInUser };
  }

  function updateProfile(profileData) {
    const users = getUsers();
    const normalizedEmail = profileData.email.trim().toLowerCase();
    if (users.some((item) => item.id !== user.id && item.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'That email address is already used by another account.' };
    }
    const normalizedStudentId = (profileData.studentId || '').trim().toUpperCase();
    if (user.role === 'student' && users.some((item) => item.id !== user.id && item.role === 'student' && (item.studentId || '').toUpperCase() === normalizedStudentId)) {
      return { success: false, message: 'That Student ID is already used by another student.' };
    }

    const updatedUsers = users.map((item) => item.id === user.id ? {
      ...item,
      name: profileData.name.trim(),
      email: normalizedEmail,
      studentId: user.role === 'student' ? normalizedStudentId : '',
      department: (profileData.department || '').trim(),
      year: user.role === 'student' ? (profileData.year || '').trim() : '',
      designation: user.role === 'admin' ? (profileData.designation || 'Administrator').trim() : '',
      phone: (profileData.phone || '').trim(),
    } : item);
    saveUsers(updatedUsers);
    const updatedUser = safeUser(updatedUsers.find((item) => item.id === user.id));
    saveSession(updatedUser);
    setUser(updatedUser);
    return { success: true, user: updatedUser };
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, signup, updateProfile, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
