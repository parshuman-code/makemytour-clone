import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, ThumbsUp, Flag, Image as ImageIcon, CornerDownRight, X, ShieldAlert } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export default function ReviewSection({ targetId = "IndiGo 6E-204", user }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  // For replies
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchReviews = () => {
    fetch(`/api/reviews?targetId=${encodeURIComponent(targetId)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReviews(data.filter(r => !r.isFlagged)); // Don't show flagged reviews to regular users
        }
      })
      .catch(err => console.log('Fetch error:', err.message));
  };

  useEffect(() => {
    fetchReviews();
  }, [targetId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    const newReviewObj = {
      targetId,
      targetType: 'flight',
      userName: user ? `${user.firstName} ${user.lastName}` : 'Verified Traveler',
      userAvatar: user?.profilePic || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      rating,
      comment,
      photos: photoUrl.trim() ? [photoUrl.trim()] : [],
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReviewObj)
      });
      if (res.ok) {
        fetchReviews(); // Re-fetch to apply sorting logic correctly from DB
      }
    } catch (err) {
      console.error(err);
    } finally {
      setComment('');
      setPhotoUrl('');
      setRating(5);
      setIsSubmitting(false);
    }
  };

  const handleAction = async (id, action, replyContent = null) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reply: replyContent ? { 
            userName: user ? `${user.firstName} ${user.lastName}` : 'Traveler',
            text: replyContent 
          } : null
        })
      });

      if (res.ok) {
        if (action === 'flag') {
          // Remove locally if flagged
          setReviews(reviews.filter(r => r._id !== id));
        } else {
          const updated = await res.json();
          setReviews(reviews.map(r => r._id === id ? updated : r));
        }
        
        if (action === 'reply') {
          setReplyingTo(null);
          setReplyText('');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'highest_rated') return b.rating - a.rating;
    if (sortBy === 'helpful') return (b.helpfulCount || 0) - (a.helpfulCount || 0);
    return 0;
  });

  return (
    <div className="mt-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-red-600" />
            Verified Customer Reviews
          </h3>
          <p className="text-xs text-slate-500 mt-1">Real feedback from travelers who booked this flight route.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="highest_rated">Sort by: Highest Rated</option>
            <option value="helpful">Sort by: Most Helpful</option>
          </select>
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-extrabold text-slate-800">
              {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0'} / 5.0
            </span>
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      <Card className="p-6 bg-slate-50/50">
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Rate Your Experience</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <Input
            placeholder="Share your travel experience, seat comfort, staff hospitality..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <div className="flex items-center gap-3">
             <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <ImageIcon className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  placeholder="Attach photo URL (Optional)"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="pl-9"
                />
             </div>
             <Button 
                type="submit" 
                variant="default" 
                disabled={isSubmitting}
                className="flex-shrink-0 flex items-center gap-2"
             >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Posting...' : 'Submit Review'}
             </Button>
          </div>
        </form>
      </Card>

      {/* Review Cards Grid */}
      <div className="space-y-4">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 font-medium">
             No reviews yet. Be the first to share your experience!
          </div>
        ) : (
          sortedReviews.map((rev) => (
            <Card key={rev._id} className="p-5 flex flex-col sm:flex-row gap-5">
              <div className="flex-shrink-0">
                 <img 
                   src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'} 
                   alt={rev.userName}
                   className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                 />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-sm font-extrabold text-slate-900">{rev.userName}</h5>
                    <span className="text-[11px] text-slate-400 font-semibold">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-medium">{rev.comment}</p>
                
                {rev.photos && rev.photos.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {rev.photos.map((url, i) => (
                      <img key={i} src={url} alt="Review attachment" className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-sm" />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                   <button 
                     onClick={() => handleAction(rev._id, 'helpful')}
                     className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
                   >
                     <ThumbsUp className="w-3.5 h-3.5" />
                     Helpful ({rev.helpfulCount || 0})
                   </button>
                   <button 
                     onClick={() => setReplyingTo(replyingTo === rev._id ? null : rev._id)}
                     className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                   >
                     <MessageSquare className="w-3.5 h-3.5" />
                     Reply ({(rev.replies || []).length})
                   </button>
                   <button 
                     onClick={() => {
                        if (window.confirm("Flag this review as inappropriate for moderator review?")) {
                           handleAction(rev._id, 'flag');
                        }
                     }}
                     className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors ml-auto"
                   >
                     <Flag className="w-3.5 h-3.5" />
                     Flag
                   </button>
                </div>

                {/* Replies Section */}
                {((rev.replies && rev.replies.length > 0) || replyingTo === rev._id) && (
                  <div className="mt-4 pl-4 border-l-2 border-slate-200 space-y-3">
                    {rev.replies?.map((reply, i) => (
                       <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                               <CornerDownRight className="w-3 h-3 text-slate-400" />
                               {reply.userName}
                            </span>
                            <span className="text-[10px] text-slate-400">{reply.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium ml-4">{reply.text}</p>
                       </div>
                    ))}

                    {replyingTo === rev._id && (
                       <div className="flex items-center gap-2 mt-2">
                         <Input 
                           size="sm"
                           placeholder="Write a reply..."
                           value={replyText}
                           onChange={(e) => setReplyText(e.target.value)}
                           className="text-xs py-1.5"
                         />
                         <Button 
                           size="sm"
                           className="py-1.5 text-xs"
                           disabled={!replyText.trim()}
                           onClick={() => handleAction(rev._id, 'reply', replyText)}
                         >
                           Post
                         </Button>
                       </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
