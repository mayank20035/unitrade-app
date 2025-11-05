import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- Import Link
import { account } from '../appwriteConfig';
import { ID } from 'appwrite';

function SignupPage() {
  const navigate = useNavigate(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // <-- Add loading state

  const handleSignup = async (e) => {
    e.preventDefault(); 
    
    if (!email.endsWith('@iimtu.edu.in')) {
      alert("Error: You must use a valid IIMT University email address (e.g., ...@iimtu.edu.in)");
      return; 
    }
    
    setLoading(true); // <-- Set loading

    try {
      await account.create(
        ID.unique(),
        email,      
        password,   
        name        
      );
      
      alert('Signup successful! Please log in.');
      navigate('/login'); 

    } catch (error) {
      console.error(error); 
      alert(`Error signing up: ${error.message}`);
      setLoading(false); // <-- Stop loading on error
    }
  };

  return (
    // Main container, centers the content
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      
      {/* Form Card */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Create your UniTrade Account
        </h2>
        
        <form className="space-y-6" onSubmit={handleSignup}>
          
          {/* Name Input */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input 
              type="text" 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email Input */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              College Email (@iimtu.edu.in)
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
              Password (min. 8 characters)
            </label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="8" 
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Link to Login */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default SignupPage;