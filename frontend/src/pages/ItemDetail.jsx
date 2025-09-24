import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemService } from '../services/api';
import { MapPin, Calendar, User, Shield, MessageCircle } from 'lucide-react';

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimDescription, setClaimDescription] = useState('');
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const itemData = await itemService.getItem(id);
      setItem(itemData);
    } catch (error) {
      console.error('Error fetching item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await itemService.claimItem(id, claimDescription);
      setShowClaimForm(false);
      setClaimDescription('');
      fetchItem(); // Refresh item data
    } catch (error) {
      console.error('Error claiming item:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h1>
        <button onClick={() => navigate('/search')} className="btn-primary">
          Back to Search
        </button>
      </div>
    );
  }

  const isOwner = user && item.reporter._id === user.id;
  const hasClaimed = user && item.claims.some(claim => claim.user._id === user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-primary-600 hover:text-primary-700 mb-6"
      >
        ← Back
      </button>

      <div className="card p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                item.type === 'lost' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {item.type.toUpperCase()}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {item.category}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {item.status}
              </span>
            </div>
          </div>
        </div>

        {/* Images */}
        {item.images && item.images.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${image}`}
                  alt={`${item.title} ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Item Details</h3>
            <p className="text-gray-700 mb-4">{item.description}</p>
            
            {item.uniqueMarks && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Unique Identifying Marks:</h4>
                <p className="text-gray-700">{item.uniqueMarks}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Location & Date</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <User className="h-5 w-5 mr-3 text-gray-400" />
                <span>Reported by {item.reporter.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Claim Section */}
        {!isOwner && item.status === 'active' && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Claim This Item
              </h3>
            </div>

            {hasClaimed ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">You have already submitted a claim for this item.</p>
              </div>
            ) : showClaimForm ? (
              <form onSubmit={handleClaim} className="space-y-4">
                <div>
                  <label htmlFor="claimDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you believe this is your item?
                  </label>
                  <textarea
                    id="claimDescription"
                    value={claimDescription}
                    onChange={(e) => setClaimDescription(e.target.value)}
                    required
                    rows={4}
                    className="input-field"
                    placeholder="Provide details that can help verify your ownership, such as unique features, when you lost it, etc."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowClaimForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                  >
                    {submitting ? 'Submitting...' : 'Submit Claim'}
                  </button>
                </div>
              </form>
            ) : user ? (
              <button
                onClick={() => setShowClaimForm(true)}
                className="btn-primary"
              >
                I Think This Is Mine
              </button>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">You need to be logged in to claim this item</p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary"
                >
                  Login to Claim
                </button>
              </div>
            )}
          </div>
        )}

        {/* Claims List (for owner) */}
        {isOwner && item.claims.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Claims ({item.claims.length})
            </h3>
            <div className="space-y-4">
              {item.claims.map((claim) => (
                <div key={claim._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{claim.user.name}</h4>
                      <p className="text-sm text-gray-500">{claim.user.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-gray-700">{claim.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Submitted on {new Date(claim.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;