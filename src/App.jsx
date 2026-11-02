import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import QuizEditor from './pages/QuizEditor';
import StudentDashboard from './pages/StudentDashboard';
import QuizAttempt from './pages/QuizAttempt';
import { ResultDetail, ResultsList } from './pages/Results';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import AdminProfiles from './pages/AdminProfiles';

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<QuizEditor />} />
          <Route path="/admin/edit/:quizId" element={<QuizEditor />} />
          <Route path="/admin/results" element={<ResultsList admin />} />
          <Route path="/admin/profiles" element={<AdminProfiles />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute role="student" />}>
        <Route element={<AppLayout />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/results" element={<ResultsList />} />
          <Route path="/quiz/:quizId" element={<QuizAttempt />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/result/:resultId" element={<ResultDetail />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
