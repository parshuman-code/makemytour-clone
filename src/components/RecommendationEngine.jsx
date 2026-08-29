import React, { useState, useEffect } from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, Plane, Hotel, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecommendationEngine({ user }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user._id) {
      setLoading(false);
      return;
    }
    
    fetch(`/api/recommendations?userId=${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecommendations(data);
        }
      })
      .catch(err => console.error("Error fetching recommendations", err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleFeedback = async (itemId, itemType, feedbackType) => {
    try {
      await fetch(`/api/recommendations/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          itemId,
          itemType,
          feedback: feedbackType
        })
      });

      // Optimistically remove irrelevant items
      if (feedbackType === 'irrelevant') {
        setRecommendations(prev => prev.filter(r => r._id !== itemId));
      } else {
        alert("Thanks for the feedback! We'll show you more like this.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = (item) => {
    if (item.itemType === 'flight') {
      navigate(`/book-flight/${item._id}`);
    } else {
      navigate(`/book-hotel/${item._id}`);
    }
  };

  if (!user || loading || recommendations.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 rounded-2xl shadow-xl p-6 border border-indigo-500/20 my-8 max-w-7xl mx-auto overflow-visible relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Recommended for You</h2>
          <p className="text-xs text-indigo-200/70 font-medium">Based on your past bookings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {recommendations.map((item) => (
          <div key={item._id} className="group relative bg-white rounded-xl overflow-visible shadow-sm border border-slate-200 flex flex-col hover:shadow-xl transition-all">
            
            {/* Tooltip Wrapper */}
            <div className="absolute -top-3 -right-3 z-50">
              <div className="relative flex flex-col items-center group/tooltip">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-help shadow-lg border-2 border-white transition-transform hover:scale-110">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="absolute bottom-full mb-2 w-48 p-3 bg-slate-900 text-white text-xs font-medium rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-xl border border-slate-700 z-50">
                  <p className="font-bold text-indigo-400 mb-1">Why this?</p>
                  {item.reason}
                  <div className="absolute top-full right-3 border-4 border-transparent border-t-slate-900"></div>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 text-[10px] font-black uppercase rounded ${
                  item.itemType === 'flight' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {item.itemType === 'flight' ? <Plane className="w-3 h-3 inline mr-1" /> : <Hotel className="w-3 h-3 inline mr-1" />}
                  {item.itemType}
                </span>
              </div>
              
              <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">
                {item.itemType === 'flight' ? `${item.from} to ${item.to}` : item.hotelName}
              </h3>
              
              <p className="text-xs text-slate-500 font-semibold mb-4 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.itemType === 'flight' ? item.airline : item.location}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Price</p>
                  <p className="font-black text-slate-900">₹{Number(item.price || item.pricePerNight).toLocaleString('en-IN')}</p>
                </div>
                <button 
                  onClick={() => handleBook(item)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Book Now
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-2 border-t border-slate-200 flex rounded-b-xl overflow-hidden">
              <button 
                onClick={() => handleFeedback(item._id, item.itemType, 'helpful')}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors border-r border-slate-200"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Helpful
              </button>
              <button 
                onClick={() => handleFeedback(item._id, item.itemType, 'irrelevant')}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Hide
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
