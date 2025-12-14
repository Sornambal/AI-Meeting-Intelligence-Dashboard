import { useEffect, useState } from 'react';
import { isAuthenticated } from '../utils/auth';

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setLoading(false);
  }, []);

  return { isAuth, loading };
};
