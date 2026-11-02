const KEYS = {
  users: 'quizBuilder_users',
  quizzes: 'quizBuilder_quizzes',
  results: 'quizBuilder_results',
  session: 'quizBuilder_session',
};

export function readData(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Could not read ${key} from Local Storage`, error);
    return fallback;
  }
}

export function writeData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() { return readData(KEYS.users, []); }
export function saveUsers(value) { writeData(KEYS.users, value); }
export function getQuizzes() { return readData(KEYS.quizzes, []); }
export function saveQuizzes(value) { writeData(KEYS.quizzes, value); }
export function getResults() { return readData(KEYS.results, []); }
export function saveResults(value) { writeData(KEYS.results, value); }
export function getSession() { return readData(KEYS.session, null); }
export function saveSession(value) { writeData(KEYS.session, value); }
export function clearSession() { localStorage.removeItem(KEYS.session); }

// Remove only the sample accounts/results that were created by older demo builds.
// Real accounts, quizzes, and submissions are kept.
export function removeOldDemoData() {
  const oldDemoIds = new Set(['admin-demo', 'student-demo']);
  const users = getUsers();
  const realUsers = users.filter((user) => (
    !oldDemoIds.has(user.id)
    && !['admin@quizbuilder.com', 'student@quizbuilder.com'].includes(String(user.email || '').toLowerCase())
  ));
  if (realUsers.length !== users.length) saveUsers(realUsers);

  const results = getResults();
  const realResults = results.filter((result) => (
    !oldDemoIds.has(result.studentId)
    && String(result.studentEmail || '').toLowerCase() !== 'student@quizbuilder.com'
  ));
  if (realResults.length !== results.length) saveResults(realResults);

  const quizzes = getQuizzes();
  const realQuizzes = quizzes.filter((quiz) => quiz.id !== 'sample-quiz-101');
  if (realQuizzes.length !== quizzes.length) saveQuizzes(realQuizzes);

  const session = getSession();
  if (session && oldDemoIds.has(session.id)) clearSession();
}
