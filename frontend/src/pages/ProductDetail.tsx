import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/shared/ProductCard";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { token, isAuthenticated, userId } = useAuth();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        console.log(data.category);
        // Fetch related products by category
        if (data.category) {
          const relRes = await fetch(
            `${baseUrl}/api/products/category/${data.category}`
          );
          if (relRes.ok) {
            const relData = await relRes.json();
            console.log(relData);

            setRelatedProducts(
              (relData.products || [])
                .filter((p) => (p.id || p._id) !== (data.id || data._id))
                .slice(0, 4)
            );
          }
        }

        // Fetch product reviews
        const reviewsRes = await fetch(`${baseUrl}/api/reviews/${id}`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setProductReviews(reviewsData.reviews || []);
        }

        // Fetch user's review if authenticated
        if (isAuthenticated && token) {
          const userReviewRes = await fetch(
            `${baseUrl}/api/reviews/${id}/user`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (userReviewRes.ok) {
            const userReviewData = await userReviewRes.json();
            setUserReview(userReviewData.review);
            setReviewRating(userReviewData.review.rating);
            setReviewText(userReviewData.review.review);
          }
        }
      } catch (err) {
        setError(err.message);
        setProduct(null);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id, isAuthenticated, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <span>★ {product.rating}</span>
                  <span className="text-gray-500">
                    ({product.reviews} reviews)
                  </span>
                </div>
              </div>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    className={
                      selectedSize === size ? "btn-primary" : "btn-secondary"
                    }
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    className={
                      selectedColor === color ? "btn-primary" : "btn-secondary"
                    }
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              className="mt-6 w-full bg-black text-white hover:bg-gray-800"
              onClick={() => {
                addToCart({
                  id: Number(product.id),
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  color: selectedColor || product.colors[0],
                  size: selectedSize || product.sizes[0],
                  quantity,
                });
                toast({
                  title: "Item added to cart",
                  description: `${product.name} has been added to your cart.`,
                });
              }}
              disabled={!selectedColor || !selectedSize}
            >
              Add to Cart
            </Button>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-600">
                    • {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-4xl mx-auto mt-12">
          {/* Display Existing Reviews */}
          {productReviews.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Customer Reviews ({productReviews.length})
              </h2>
              <div className="space-y-6">
                {productReviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white rounded-lg border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                review.rating >= star
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-gray-900">
                          {review.userName}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {editingReviewId === review._id ? (
                      <form
                        className="space-y-3"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!editReviewRating) {
                            toast({
                              title: "Please select a rating.",
                              variant: "destructive",
                            });
                            return;
                          }
                          if (!editReviewText.trim()) {
                            toast({
                              title: "Please write a review.",
                              variant: "destructive",
                            });
                            return;
                          }
                          try {
                            const res = await fetch(
                              `${baseUrl}/api/reviews/${review._id}`,
                              {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                  rating: editReviewRating,
                                  review: editReviewText.trim(),
                                }),
                              }
                            );
                            const data = await res.json();
                            if (!res.ok)
                              throw new Error(
                                data.msg || "Failed to update review"
                              );
                            toast({ title: "Review updated!" });
                            setEditingReviewId(null);
                            // Refresh reviews
                            const reviewsRes = await fetch(
                              `${baseUrl}/api/reviews/${id}`
                            );
                            if (reviewsRes.ok) {
                              const reviewsData = await reviewsRes.json();
                              setProductReviews(reviewsData.reviews || []);
                            }
                          } catch (err) {
                            toast({
                              title: "Failed to update review",
                              description: err.message,
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setEditReviewRating(star)}
                              className="focus:outline-none"
                              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                            >
                              <Star
                                className={`h-7 w-7 transition-colors ${editReviewRating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                fill={
                                  editReviewRating >= star ? "#facc15" : "none"
                                }
                              />
                            </button>
                          ))}
                        </div>
                        <textarea
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-900 text-base resize-none transition-shadow"
                          value={editReviewText}
                          onChange={(e) => setEditReviewText(e.target.value)}
                          maxLength={500}
                          required
                        />
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 rounded"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="bg-gray-200 px-4 py-2 rounded"
                            onClick={() => setEditingReviewId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <p className="text-gray-700">{review.review}</p>
                        {userId && review.userId === userId && (
                          <div className="flex space-x-2 mt-2">
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => {
                                setEditingReviewId(review._id);
                                setEditReviewText(review.review);
                                setEditReviewRating(review.rating);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:underline"
                              onClick={async () => {
                                if (
                                  !window.confirm(
                                    "Are you sure you want to delete this review?"
                                  )
                                )
                                  return;
                                try {
                                  const res = await fetch(
                                    `${baseUrl}/api/reviews/${review._id}`,
                                    {
                                      method: "DELETE",
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    }
                                  );
                                  const data = await res.json();
                                  if (!res.ok)
                                    throw new Error(
                                      data.msg || "Failed to delete review"
                                    );
                                  toast({ title: "Review deleted!" });
                                  // Refresh reviews
                                  const reviewsRes = await fetch(
                                    `${baseUrl}/api/reviews/${id}`
                                  );
                                  if (reviewsRes.ok) {
                                    const reviewsData = await reviewsRes.json();
                                    setProductReviews(
                                      reviewsData.reviews || []
                                    );
                                  }
                                } catch (err) {
                                  toast({
                                    title: "Failed to delete review",
                                    description: err.message,
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Review Section */}
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              {userReview ? "Edit Your Review" : "Add a Review"}
            </h2>
            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  Please sign in to leave a review.
                </p>
              </div>
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (!isAuthenticated) {
                  toast({
                    title: "Please sign in to leave a review.",
                    variant: "destructive",
                  });
                  return;
                }

                if (!reviewRating) {
                  toast({
                    title: "Please select a rating.",
                    variant: "destructive",
                  });
                  return;
                }
                if (!reviewText.trim()) {
                  toast({
                    title: "Please write a review.",
                    variant: "destructive",
                  });
                  return;
                }

                setSubmittingReview(true);

                try {
                  const response = await fetch(`${baseUrl}/api/reviews`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      productId: id,
                      rating: reviewRating,
                      review: reviewText.trim(),
                    }),
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(data.msg || "Failed to submit review");
                  }

                  // Refresh product data to get updated rating
                  const productRes = await fetch(
                    `${baseUrl}/api/products/${id}`
                  );
                  if (productRes.ok) {
                    const updatedProduct = await productRes.json();
                    setProduct(updatedProduct);
                  }

                  // Refresh reviews
                  const reviewsRes = await fetch(
                    `${baseUrl}/api/reviews/${id}`
                  );
                  if (reviewsRes.ok) {
                    const reviewsData = await reviewsRes.json();
                    setProductReviews(reviewsData.reviews || []);
                  }

                  setUserReview(data.review);
                  toast({
                    title: "Review submitted successfully!",
                    description: "Thank you for your feedback.",
                  });
                } catch (error) {
                  toast({
                    title: "Failed to submit review",
                    description: error.message,
                    variant: "destructive",
                  });
                } finally {
                  setSubmittingReview(false);
                }
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${reviewRating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        fill={reviewRating >= star ? "#facc15" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="review"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="review"
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-900 text-base resize-none transition-shadow"
                  placeholder="Share your experience with this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  maxLength={500}
                  required
                />
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {reviewText.length}/500
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors disabled:opacity-60"
                disabled={submittingReview}
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id || relProduct._id}
                  product={relProduct}
                  pId={relProduct._id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
