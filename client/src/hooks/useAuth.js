import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logout, registerUser } from '../features/auth/authSlice';

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogin = useCallback(
    (email, password) => {
      return dispatch(loginUser({ email, password }));
    },
    [dispatch],
  );

  const handleRegister = useCallback(
    (data) => {
      return dispatch(registerUser(data));
    },
    [dispatch],
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};

export default useAuth;
