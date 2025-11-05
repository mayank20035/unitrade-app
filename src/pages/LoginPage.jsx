import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- Import Link
import { account } from '../appwriteConfig'; 

function LoginPage() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // <-- Add loading state

  const handleLogin = async (e) => { 
    e.preventDefault(); 
    setLoading(true); // <-- Set loading
    
    try {
      await account.createEmailPasswordSession(email, password);
      alert('Login successful!');
      window.location.href = "/"; // <-- Force a full refresh to update auth state
    } catch (error) {
      console.error(error); 
      alert(`Error logging in: ${error.message}`);
      setLoading(false); // <-- Stop loading on error
    }
  };

  return (
    // Main container, centers the content
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      
      {/* Form Card */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Login to UniTrade
        </h2>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          
          {/* Email Input */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Password Input */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Submit Button */}
          <div>
            <button 
              type="submit"
              disabled={loading} // <-- Disable button when loading
              className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Link to Sign Up */}
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;