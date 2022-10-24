import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

export default function AuthRoute({ children }) {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.user) {
      navigate('/');
    }
  }, [auth.user]);

  return <div>{children}</div>;
}
