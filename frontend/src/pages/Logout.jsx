import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeAuthToken } from '../utils/auth';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    removeAuthToken();
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-teal-700 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-white">
          <span className="text-6xl mb-4 block">👋</span>
          <h1 className="text-3xl font-bold mb-2">Logging out...</h1>
          <p className="text-lg opacity-90">Redirecting to login page</p>
        </div>
      </div>
    </div>
  );
}
