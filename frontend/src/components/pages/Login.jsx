import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../services/ticketApi';

export default function Login() {
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(userId, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-container-padding">
        {/* Logo Header */}
        <div className="text-center mb-stack-lg flex flex-col items-center">
          {/* Datastraw Logo */}
          <div className="bg-white p-2 rounded-xl mb-stack-md shadow-sm border border-outline-variant/30">
            <img src="/image.png" alt="Datastraw Logo" className="h-16 object-contain" />
          </div>
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">Datastraw CRM</h1>
          <p className="font-body-lg text-body-lg text-secondary mt-base">Enterprise Support</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)] border border-outline-variant/30 p-container-padding">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-lg">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-stack-md">

            {/* User ID Field */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="userid">User ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">person</span>
                </div>
                <input
                  type="text"
                  id="userid"
                  name="userid"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg text-on-surface placeholder-outline-variant font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow bg-surface-bright"
                  placeholder="Enter your User ID"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-base">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
                <a href="#" className="font-label-sm text-label-sm text-primary hover:text-primary-fixed-variant transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">lock</span>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-outline-variant rounded-lg text-on-surface placeholder-outline-variant font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow bg-surface-bright"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-error font-body-md text-sm mt-2">{error}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-stack-sm">
              <input type="checkbox" id="remember-me" className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded rounded-sm bg-surface-bright" />
              <label htmlFor="remember-me" className="ml-2 block font-body-md text-body-md text-on-surface-variant">
                Remember me on this device
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-stack-sm">
              <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary-container hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
