import { useState } from 'react';
import { useLocation } from 'wouter';
import { DEFAULT_EMAIL, DEFAULT_PASSWORD } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import type { LoginFormData } from '@/lib/types';

export function LoginForm() {
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [, setLocation] = useLocation();
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return apiRequest('POST', '/api/auth/login', data)
        .then(res => res.json());
    },
    onSuccess: (data) => {
      console.log('Login success data:', data); // <-- optional, for debugging
      localStorage.setItem('token', data.token); // <-- save token now
      setLocation('/'); // redirect to dashboard
    },
    onError: (error: Error) => {
      setError(error.message || 'Login failed. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      <form id="login-form" onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <span className="flex items-center justify-center">
              <i className="ri-loader-4-line animate-spin mr-2"></i>
              Signing In...
            </span>
          ) : 'Sign In'}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Demo Credentials:</p>
        <p>Email: {DEFAULT_EMAIL}</p>
        <p>Password: {DEFAULT_PASSWORD}</p>
      </div>
    </div>
  );
}
