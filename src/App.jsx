import React, { useState, useEffect } from 'react'; 
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import CreateListingPage from './pages/CreateListingPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import { useAuth } from './context/AuthContext.jsx'; 
import { account, databases, storage } from './appwriteConfig.js'; 
import { Query } from 'appwrite'; 

// --- Homepage Component ---
function HomePage() {
  const { user } = useAuth(); 
  const [listings, setListings] = useState([]); 
  const [loading, setLoading] = useState(true);

  const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID; 
  const BUCKET_ID = '6906f3bd0022212a86a9';
  const DATABASE_ID = '6904d1d5001176c35074';
  const TABLE_ID = 'products';

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          TABLE_ID,
          [Query.orderDesc('$createdAt')] 
        );
        setListings(response.documents); 
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      }
      setLoading(false);
    };

    fetchListings();
  }, []);

  const buildImageUrl = (imageId) => {
    return `https://nyc.cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${imageId}/view?project=${PROJECT_ID}`;
  };

  return (
    // Add Tailwind classes for homepage styling
    <div className="homepage max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Items for Sale</h1>
      {user && <p className="text-center mb-6">Welcome, {user.name}!</p>}

      {loading && <p className="text-center">Loading items...</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <Link 
            key={listing.$id} 
            to={`/product/${listing.$id}`}
            className="product-card-link" 
          >
            {/* Product Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-xl hover:-translate-y-1">
              <img 
                src={buildImageUrl(listing.imageId)} 
                alt={listing.title} 
                className="w-full h-48 object-cover" // Image styling
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">{listing.title}</h3>
                <p className="text-xl font-bold text-blue-600 my-2">₹{listing.price}</p>
                <p className="text-sm text-gray-500 truncate">Sold by: {listing.sellerEmail}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// --- Main App Component ---
function App() {
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await account.deleteSession('current'); 
      setUser(null); 
      alert('You have been logged out.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert(`Failed to logout: ${error.message}`);
    }
  };

  return (
    // Add Tailwind classes for basic layout and background
    <div className="app-container bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <nav className="w-full bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo/Brand */}
          <Link to="/" className="text-2xl font-bold text-gray-800">UniTrade</Link>
          
          {/* Nav Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              // If user IS logged in:
              <>
                <Link 
                  to="/create-listing" 
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sell Item
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              // If user IS NOT logged in:
              <>
                <Link 
                  to="/login"
                  className="text-gray-600 font-semibold hover:text-blue-600"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- PAGE CONTENT --- */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/create-listing" element={<CreateListingPage />} /> 
          <Route path="/product/:productId" element={<ProductDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;