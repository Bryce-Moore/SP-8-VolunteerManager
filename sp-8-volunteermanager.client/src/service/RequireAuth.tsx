import { Navigate } from 'react-router-dom';

// @ts-ignore
function RequireAuth({ children }) {
  // fetch auth token from session storage
  const auth = sessionStorage.getItem('auth_token');

  if (!auth) {
    // User not logged in, redirect to landing page
    return <Navigate to="/" />;
  }

  return children;
}

export default RequireAuth;