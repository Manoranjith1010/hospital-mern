import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { Input, Button, Card, CardBody } from '../components';
import { AuthLayout } from '../layouts/MainLayout';
import { validateEmail, validatePassword } from '../utils/validators';

/**
 * Login page
 */
export const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, isLoading } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      notify('Login successful!', 'success');
      navigate('/dashboard');
    } catch (error) {
      notify(error.message || 'Login failed', 'error');
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 font-semibold hover:underline">
          Sign up
        </a>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
