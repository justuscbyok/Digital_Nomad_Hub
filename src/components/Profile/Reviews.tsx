import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { 
  fetchUserReviews, 
  addReview, 
  deleteReview,
  Review
} from '../../store/slices/reviewsSlice';
import { Star, Edit, Trash2, X, Plus } from 'lucide-react';

interface ReviewsProps {
  onClose?: () => void;
}

const Reviews: React.FC<ReviewsProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { reviews, loading } = useAppSelector((state) => state.reviews);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReview, setNewReview] = useState({
    title: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    rating: 5,
    content: '',
    images: ''
  });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchUserReviews());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    }));
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!newReview.title || !newReview.location || !newReview.content) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      await dispatch(addReview({
        ...newReview,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }));
      
      setSuccessMessage('Review added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset form
      setNewReview({
        title: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        rating: 5,
        content: '',
        images: ''
      });
      
      setShowAddForm(false);
    } catch (error) {
      setFormError('Failed to add review. Please try again.');
    }
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview(id));
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Travel Reviews</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Review
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      {/* Add Review Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Add New Review</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {formError && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{formError}</p>
            </div>
          )}

          <form onSubmit={handleAddReview} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newReview.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={newReview.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Visit Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={newReview.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex items-center">
                <select
                  id="rating"
                  name="rating"
                  value={newReview.rating}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <div className="flex ml-2">
                  {renderStars(newReview.rating)}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Review*
              </label>
              <textarea
                id="content"
                name="content"
                value={newReview.content}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                Image URLs (comma separated)
              </label>
              <input
                type="text"
                id="images"
                name="images"
                value={newReview.images}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="http://example.com/image1.jpg, http://example.com/image2.jpg"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {loading && <p className="text-center text-gray-500">Loading reviews...</p>}
        
        {!loading && reviews.length === 0 && !showAddForm && (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">You haven't added any reviews yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Your First Review
            </button>
          </div>
        )}

        {reviews.map((review: Review) => (
          <div key={review.id} className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{review.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{review.location} • {new Date(review.date).toLocaleDateString()}</p>
                <div className="flex mt-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              <div className="flex space-x-1">
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => handleDeleteReview(review.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-700 whitespace-pre-line">{review.content}</p>
            </div>
            
            {review.images && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                {review.images.split(',').map((url: string, index: number) => (
                  <div key={index} className="h-32 overflow-hidden rounded-md">
                    <img 
                      src={url.trim()} 
                      alt={`Review image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews; 