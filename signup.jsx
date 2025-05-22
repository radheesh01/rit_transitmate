import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import { PuffLoader } from 'react-spinners';

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setSuccess('Signup successful! Please verify your email before logging in.');
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 2500);
    } catch (error) {
      console.error('Signup failed:', error.code, error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white text-gray-900 flex items-center justify-center">
      <div className="bg-[#7494ec] p-10 rounded-xl w-full max-w-md shadow-lg text-white">
        <h1 className="text-white text-3xl font-semibold text-center mb-2">RIT TRANSITMATE</h1>
        <p className="text-white text-center mb-6">Create a new account</p>

        <form onSubmit={onSignup}>
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

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded transform transition duration-300 hover:scale-105 hover:shadow-lg"
            disabled={loading}
          >
            {loading ? <PuffLoader color="#ffffff" size={20} /> : 'Sign Up'}
          </button>
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
          Already have an account? <NavLink to="/" className="underline text-white font-semibold">Login</NavLink>
        </p>
      </div>
    </div>
  );
}