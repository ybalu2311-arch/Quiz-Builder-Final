import { Link } from 'react-router-dom';
export default function NotFound() {
  return <div className="empty-state not-found"><div className="not-found-code">404</div><h1>Page not found</h1><p>The page you're looking for doesn't exist.</p><Link className="button button-primary" to="/">Go to home</Link></div>;
}
