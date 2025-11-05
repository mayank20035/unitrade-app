import { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../appwriteConfig'; // Import your Appwrite account service

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
// This component will wrap our entire app
export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // This will hold the logged-in user's data

  // useEffect runs when the component first loads
  useEffect(() => {
    // We ask Appwrite "is anyone logged in?"
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      // The .get() method returns the current user's data if they have a session
      const currentUser = await account.get();
      setUser(currentUser); // If successful, store the user data in our state
    } catch (error) {
      // If it fails (no user logged in), we set the user to null
      setUser(null);
    }
    // No matter what, we are done loading
    setLoading(false);
  };

  // This is what the provider gives to all its children
  const contextData = {
    user,
    setUser,
    loading,
  };

  // We render the children (our app) only *after* we are done loading
  // This prevents the app from "flickering" between login/logout states
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
}

// 3. Create a Custom Hook
// This is a simple function that makes it easy for other components to get the user data
export function useAuth() {
  return useContext(AuthContext);
}