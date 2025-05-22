import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate, NavLink } from 'react-router-dom';
import { PuffLoader } from 'react-spinners';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        const displayName = user.displayName || user.email;
        localStorage.setItem('userName', displayName);
        setSuccess('Login successful!!! WELCOME to RIT Transitmate');
        setTimeout(() => {
          setLoading(false);
          navigate('/home');
        }, 1500);
      } else {
        setError('Please verify your email address before logging in.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login failed:', error.code, error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white text-gray-900 flex items-center justify-center">
      <div className="bg-[#7494ec] p-10 rounded-xl w-full max-w-md shadow-lg text-white">
        <h1 className="text-white text-3xl font-semibold text-center mb-2">RIT TRANSITMATE</h1>
        <p className="text-white text-center mb-6">Smart Bus Booking and Tracking System</p>

        <form onSubmit={onLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-white">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-white">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="w-1/2 mr-2 bg-blue-900 text-white py-2 rounded transform transition duration-300 hover:scale-105 hover:shadow-lg"
              disabled={loading}
            >
              {loading ? <PuffLoader color="#ffffff" size={20} /> : 'Login'}
            </button>
            <NavLink
              to="/signup"
              className="w-1/2 ml-2 bg-blue-900 text-white py-2 rounded flex items-center justify-center transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              Sign up
            </NavLink>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4" role="alert">
            <strong className="font-bold">Error! </strong>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4" role="alert">
            <strong className="font-bold">Success! </strong>
            <span>{success}</span>
          </div>
        )}

        <p className="text-center text-white mt-6 text-sm">
          Not an existing user? <NavLink to="/signup" className="underline text-white font-semibold">Try Signing in</NavLink>
        </p>
      </div>
    </div>
  );
}