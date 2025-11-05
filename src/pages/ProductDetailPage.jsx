import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { databases, storage } from '../appwriteConfig'; 

function ProductDetailPage() {
  const { productId } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Get Project IDs ---
  const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  const DATABASE_ID = '6904d1d5001176c35074';
  const TABLE_ID = 'products';
  const BUCKET_ID = '6906f3bd0022212a86a9';

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await databases.getDocument(
          DATABASE_ID,
          TABLE_ID,
          productId // The ID from the URL
        );
        setProduct(response); 
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]); 

  // Function to build the image URL
  const buildImageUrl = (imageId) => {
    return `https://nyc.cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${imageId}/view?project=${PROJECT_ID}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">Product not found.</p>
      </div>
    );
  }

  // --- Display the Details ---
  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      {/* Grid container for image and info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Image Column */}
        <div>
          <img 
            src={buildImageUrl(product.imageId)} 
            alt={product.title} 
            className="w-full h-auto md:h-96 object-cover rounded-lg shadow-lg bg-gray-200"
          />
        </div>
        
        {/* Info Column */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-3xl font-semibold text-blue-600 my-4">
              ₹{product.price}
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mt-6">
              Description
            </h3>
            <p className="text-gray-700 mt-3 whitespace-pre-wrap">
              {product.description || "No description provided."}
            </p>
          </div>
          
          {/* Contact Box */}
          <div className="bg-gray-100 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Contact Seller
            </h3>
            <p className="text-gray-700 mb-4">To buy this item, please contact the seller directly via email:</p>
            <a 
              href={`mailto:${product.sellerEmail}`} 
              className="w-full text-center block px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Contact: {product.sellerEmail}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;