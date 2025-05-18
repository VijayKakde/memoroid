import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RATE_LIMIT_SECONDS = 50;

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [lastAttemptTime, setLastAttemptTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  
  const { signUp, error, clearError } = useAuth();

  useEffect(() => {
    let timer: number;
    if (timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeRemaining]);

  const canAttemptSignup = () => {
    if (!lastAttemptTime) return true;
    const secondsSinceLastAttempt = (Date.now() - lastAttemptTime) / 1000;
    return secondsSinceLastAttempt >= RATE_LIMIT_SECONDS;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (!canAttemptSignup()) {
      return;
    }
    
    setPasswordError('');
    setIsSubmitting(true);
    setLastAttemptTime(Date.now());
    setTimeRemaining(RATE_LIMIT_SECONDS);
    
    try {
      await signUp(email, password);
    } catch (err) {
      if (err.message?.includes('rate_limit')) {
        setTimeRemaining(RATE_LIMIT_SECONDS);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isSubmitting || timeRemaining > 0;
  const buttonText = isSubmitting 
    ? 'Creating Account...' 
    : timeRemaining > 0 
      ? `Please wait ${timeRemaining} seconds...`
      : 'Create Account';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 flex items-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
          <path d="M4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V6.5C20 7.60457 19.1046 8.5 18 8.5H6C4.89543 8.5 4 7.60457 4 6.5V4Z" fill="#4F46E5"/>
          <path d="M4 11C4 9.89543 4.89543 9 6 9H18C19.1046 9 20 9.89543 20 11V13.5C20 14.6046 19.1046 15.5 18 15.5H6C4.89543 15.5 4 14.6046 4 13.5V11Z" fill="#10B981"/>
          <path d="M4 18C4 16.8954 4.89543 16 6 16H18C19.1046 16 20 16.8954 20 18V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V18Z" fill="#F59E0B"/>
        </svg>
        <h1 className="text-3xl font-bold text-indigo-600">Memoroid</h1>
      </div>
      
      <div className="w-full max-w-md card">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 relative">
            <span className="block sm:inline">{error}</span>
            <button
              type="button"
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={clearError}
            >
              <span className="text-red-500">×</span>
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              placeholder="Create a password"
              minLength={6}
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              required
              placeholder="Confirm your password"
            />
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>
          
          <button
            type="submit"
            className={`btn-primary w-full mt-6 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isButtonDisabled}
          >
            {buttonText}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;