import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { checkAuth } from './store/slices/authSlice';
import AuthLayout from './components/Auth/AuthLayout';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Dashboard from './components/Dashboard';

function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthLayout>
        {isSignUp ? (
          <SignUp onToggleForm={() => setIsSignUp(false)} />
        ) : (
          <SignIn onToggleForm={() => setIsSignUp(true)} />
        )}
      </AuthLayout>
    );
  }

  return <Dashboard />;
}

export default App;