import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases, storage, account } from '../appwriteConfig';
import { ID } from 'appwrite';
import { useAuth } from '../context/AuthContext'; 

function CreateListingPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null); 
  const [loading, setLoading] = useState(false); 

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create a listing.');
      return;
    }
    if (!image) {
      alert('Please upload an image for your item.');
      return;
    }

    setLoading(true);

    try {
      const imageFile = await storage.createFile(
        '6906f3bd0022212a86a9', // Your REAL Bucket ID
        ID.unique(), 
        image
      );

      const imageId = imageFile.$id;

      await databases.createDocument(
        '6904d1d5001176c35074', // Your REAL Database ID
        'products', // Your REAL Table ID
        ID.unique(),
        {
          title: title,
          description: description,
          price: Number(price),
          imageId: imageId, 
          sellerId: user.$id,
          sellerEmail: user.email,
        }
      );

      setLoading(false);
      alert('Listing created successfully!');
      navigate('/'); 
    } catch (error) {
      console.error(error);
      alert(`Error creating listing: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    // Main container, centers the content
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      
      {/* Form Card */}
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Create a New Listing
        </h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Title Input */}
          <div>
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input 
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description Input */}
          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Price Input */}
          <div>
            <label 
              htmlFor="price" 
              className="block text-sm font-medium text-gray-700"
            >
              Price (₹)
            </label>
            <input 
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Image Upload Input */}
          <div>
            <label 
              htmlFor="image" 
              className="block text-sm font-medium text-gray-700"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/png, image/jpeg" 
              onChange={handleImageChange}
              required
              className="w-full px-3 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          {/* Submit Button */}
          <div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
            >
              {loading ? 'Posting...' : 'Post Your Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateListingPage;