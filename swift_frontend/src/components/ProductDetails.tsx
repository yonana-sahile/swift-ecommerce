import React, { useState, useEffect } from "react";
import { X, Star, ShoppingBag, Check, Award, ShieldAlert, Sparkles, AlertCircle, Heart } from "lucide-react";
import { Product, Review } from "../types";

interface Props {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor?: string) => void;
  logAPI: (method: "GET" | "POST" | "PUT" | "DELETE", url: string, status: number, payload?: any, response?: any) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: number) => void;
}

export default function ProductDetails({
  product,
  onClose,
  onAddToCart,
  logAPI,
  isWishlisted,
  onToggleWishlist
}: Props) {
  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colorOptions[0]?.name || "");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // Review Form States
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch reviews for the current product
  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const url = `/api/products/${product.id}/reviews`;
      const response = await fetch(url);
      const data = await response.json();
      setReviews(data);
      logAPI("GET", url, response.status, undefined, data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    setActiveImage(product.image);
    setSelectedColor(product.colorOptions[0]?.name || "");
    setFormSuccess(false);
    setFormError("");
  }, [product]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) {
      setFormError("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    const payload = { author, rating, comment };
    const url = `/api/products/${product.id}/reviews`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      logAPI("POST", url, response.status, payload, data);

      if (response.ok) {
        setReviews((prev) => [data, ...prev]);
        setFormSuccess(true);
        setAuthor("");
        setComment("");
        setRating(5);
        // Refresh product parameters dynamically by mutating local view if needed,
        // or let user know the backend updated
        product.rating = parseFloat(((reviews.reduce((acc, r) => acc + r.rating, 0) + rating) / (reviews.length + 1)).toFixed(1));
        product.reviewsCount = reviews.length + 1;
      } else {
        setFormError(data.detail || "Failed to submit review.");
      }
    } catch (err) {
      setFormError("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="product-details-modal">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-6 lg:p-8">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all w-full max-w-5xl border border-neutral-100 flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 text-neutral-400 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-all cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Left: Interactive Media Gallery */}
          <div className="w-full md:w-1/2 bg-neutral-50 p-6 sm:p-8 flex flex-col justify-between md:max-h-[90vh] md:overflow-y-auto">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white border border-neutral-100 flex items-center justify-center">
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain p-4 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setActiveImage(product.image)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-white flex items-center justify-center p-2 cursor-pointer transition-all ${
                  activeImage === product.image ? "border-neutral-950 scale-105" : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <img src={product.image} alt="Primary" className="object-contain" referrerPolicy="no-referrer" />
              </button>
              <button
                onClick={() => setActiveImage(product.secondaryImage)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-white flex items-center justify-center p-2 cursor-pointer transition-all ${
                  activeImage === product.secondaryImage ? "border-neutral-950 scale-105" : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <img src={product.secondaryImage} alt="Secondary" className="object-contain" referrerPolicy="no-referrer" />
              </button>
            </div>

            {/* Specifications Box */}
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-1.5">
                <Award size={14} className="text-neutral-400" /> Technical Blueprint
              </h4>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="border-b border-neutral-100 pb-2">
                    <dt className="font-medium text-neutral-400 font-mono text-[10px] uppercase">{key}</dt>
                    <dd className="font-semibold text-neutral-800 mt-0.5">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right: Premium Buying Interface & Interactive Reviews */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col h-full md:max-h-[90vh] md:overflow-y-auto">
            {/* Header Product Info */}
            <div className="border-b border-neutral-100 pb-6 mb-6">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest bg-neutral-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-3 tracking-tight">
                {product.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl font-bold text-neutral-900">
                  ${product.price.toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                        className={i < Math.floor(product.rating) ? "text-amber-400" : "text-neutral-200"}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono font-semibold text-neutral-500">
                    {product.rating} ({product.reviewsCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-sm text-neutral-500 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Premium Features List */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 mb-6">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">Core Features</h4>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 leading-snug">
                    <span className="p-0.5 bg-emerald-100 text-emerald-600 rounded-full mt-0.5">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customizer Option (Colors) */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">
                Selected Atelier Finish: <span className="font-semibold text-neutral-500 font-mono text-[11px]">{selectedColor}</span>
              </h4>
              <div className="flex gap-3">
                {product.colorOptions.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-9 h-9 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                      selectedColor === color.name
                        ? "ring-2 ring-offset-2 ring-neutral-950 border-transparent scale-105"
                        : "border-neutral-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <span className={`w-2 h-2 rounded-full ${color.hex === "#E3E4E5" || color.hex === "#F7FAFC" ? "bg-black" : "bg-white"}`}></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart button */}
            <div className="mb-8 flex gap-4">
              <button
                onClick={() => onAddToCart(product, selectedColor)}
                disabled={product.stock === 0}
                className={`flex-1 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  product.stock === 0
                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none border border-neutral-200"
                    : "bg-neutral-900 text-white hover:bg-neutral-800 hover:scale-[1.01] active:scale-95 shadow-neutral-950/10"
                }`}
              >
                <ShoppingBag size={18} />
                {product.stock === 0 ? "Out of Stock" : "Add Artisan Piece to Bag"}
              </button>

              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`p-4 border rounded-xl flex items-center justify-center transition-all ${
                  isWishlisted
                    ? "border-red-200 bg-red-50 text-red-500 shadow-inner"
                    : "border-neutral-200 hover:border-neutral-400 text-neutral-500 hover:text-neutral-950"
                }`}
                title={isWishlisted ? "Remove from Saved" : "Save Piece"}
              >
                <Heart size={20} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>

            {/* REVIEWS SEGMENT */}
            <div className="border-t border-neutral-200 pt-8 mt-4">
              <h3 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Reviews & Experiences</h3>

              {/* Submit a New Review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 mb-6 space-y-4">
                <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={14} className="text-neutral-500" /> Share your feedback
                </h4>

                {formError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{formError}</span>
                  </div>
                )}

                {formSuccess ? (
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-xs flex items-center gap-2">
                    <Check size={14} />
                    <span>Review processed successfully on backend API!</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-neutral-400 font-semibold mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          placeholder="e.g. Liam Vance"
                          className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-neutral-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-neutral-400 font-semibold mb-1">Rating</label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-neutral-400"
                        >
                          <option value={5}>5 Stars - Perfection</option>
                          <option value={4}>4 Stars - Great Piece</option>
                          <option value={3}>3 Stars - Average</option>
                          <option value={2}>2 Stars - Needs Improvement</option>
                          <option value={1}>1 Star - Poor Experience</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 font-semibold mb-1">Comments</label>
                      <textarea
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write down your aesthetic experience with this piece..."
                        rows={3}
                        className="w-full bg-white border border-neutral-200 rounded-lg p-3 text-xs text-neutral-800 focus:outline-none focus:border-neutral-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 px-4 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer"
                    >
                      {isSubmitting ? "Processing on DRF API..." : "Submit Review"}
                    </button>
                  </>
                )}
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {isLoadingReviews ? (
                  <div className="py-6 text-center text-xs text-neutral-400 animate-pulse font-mono">
                    Loading experiences from backend...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="py-6 text-center text-xs text-neutral-400">
                    Be the first to share an experience with this product.
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-neutral-100 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-800 text-xs">{review.author}</span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 my-1">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              fill={i < review.rating ? "currentColor" : "none"}
                              className={i < review.rating ? "text-amber-400" : "text-neutral-200"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 italic mt-1 leading-normal">
                        "{review.comment}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
