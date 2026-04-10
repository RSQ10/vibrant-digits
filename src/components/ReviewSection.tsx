import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase, type Review } from '@/lib/supabase';
import { toast } from 'sonner';

interface Props {
  productHandle: string;
  productTitle: string;
}

function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${cls} ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </div>
  );
}

export const ReviewSection = ({ productHandle, productTitle }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [productHandle]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_handle', productHandle)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error('Please enter your name.'); return; }
    if (!rating) { toast.error('Please select a rating.'); return; }
    if (!comment.trim()) { toast.error('Please write a comment.'); return; }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        product_handle: productHandle,
        product_title: productTitle,
        reviewer_name: name.trim(),
        rating,
        comment: comment.trim(),
        is_approved: false,
      });
      if (error) throw error;
      setSubmitted(true);
      setShowForm(false);
      setName(''); setRating(0); setComment('');
      toast.success('Review submitted! It will appear after approval.');
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  return (
    <div className="pt-8 mt-4 border-t border-border">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-heading">Customer Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarRow rating={Math.round(avgRating)} size="sm" />
              <span className="text-sm font-semibold text-heading">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
        {!submitted && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex-shrink-0 px-4 py-2 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all duration-200"
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {/* Rating breakdown */}
      {reviews.length > 0 && (
        <div className="bg-blue-soft rounded-2xl p-5 mb-6 border border-border">
          <div className="flex items-center gap-8">
            <div className="text-center flex-shrink-0">
              <div className="text-5xl font-bold text-heading">{avgRating.toFixed(1)}</div>
              <div className="mt-1"><StarRow rating={Math.round(avgRating)} size="sm" /></div>
              <div className="text-xs text-muted-foreground mt-1.5">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4 text-right">{star}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  <div className="flex-1 bg-white rounded-full h-2 overflow-hidden border border-border">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-4">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Success banner */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <div>
            <p className="text-sm font-semibold text-green-800">Thank you for your review!</p>
            <p className="text-xs text-green-600 mt-0.5">It will appear here after approval.</p>
          </div>
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <div className="bg-blue-soft border border-border rounded-2xl p-5 mb-6">
          <p className="text-sm font-bold text-heading mb-5">Write your review</p>

          <div className="mb-5">
            <p className="text-xs font-medium text-muted-foreground mb-2">Your rating</p>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      i <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-xs text-muted-foreground ml-2">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Your name</p>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Rahul S."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-border bg-white text-heading placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="mb-5">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Your review</p>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-border bg-white text-heading placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : 'Submit Review'}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="bg-blue-soft rounded-2xl h-24 shimmer" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && reviews.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Star className="w-10 h-10 mx-auto mb-3 fill-gray-200 text-gray-200" />
          <p className="text-sm font-medium">No reviews yet</p>
          <p className="text-xs mt-1">Be the first to review this product!</p>
        </div>
      )}

      {/* Reviews list */}
      {!loading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-white border border-border rounded-2xl p-5 hover:shadow-default transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    {r.reviewer_name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-heading">{r.reviewer_name}</p>
                    <StarRow rating={r.rating} size="sm" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {new Date(r.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm text-body mt-3 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
