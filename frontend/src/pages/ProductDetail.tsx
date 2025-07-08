import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/shared/ProductCard";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Star, Tag } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api";

const ProductDetail = () => {
  const { id } = useParams();

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

  // Image gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Buy Now functionality states
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Address book state
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<
    number | null
  >(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [addressLoading, setAddressLoading] = useState(false);

  const imgPlaceholderUrl =
    "https://res.cloudinary.com/dk6rrrwum/image/upload/v1751738007/placeholder_szfmym.svg";

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.PRODUCT_DETAIL(id)}`
        );
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        // Fetch related products by category
        if (data.category) {
          const relRes = await fetch(
            `${API_BASE_URL}/api/products/category/${data.category}`
          );
          if (relRes.ok) {
            const relData = await relRes.json();

            setRelatedProducts(
              (relData.products || [])
                .filter((p) => (p.id || p._id) !== (data.id || data._id))
                .slice(0, 4)
            );
          }
        }

        // Fetch product reviews
        const reviewsRes = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.REVIEW_DETAIL(id)}`
        );
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setProductReviews(reviewsData.reviews || []);
        }

        // Fetch user's review if authenticated
        if (isAuthenticated && token) {
          const userReviewRes = await fetch(
            `${API_BASE_URL}/api/reviews/${id}/user`,
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

  // Handle image selection
  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
    setImageError(false);
  };

  // Handle main image error
  const handleMainImageError = () => {
    setImageError(true);
  };

  // Get current image source
  const getCurrentImageSrc = () => {
    if (imageError || !product?.images || product.images.length === 0) {
      return imgPlaceholderUrl;
    }
    return product.images[selectedImageIndex] || product.images[0];
  };

  // Buy Now functions
  const handleBlur = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const createOrder = async (paymentMethod: string) => {
    if (!token) {
      toast({
        title: "Please sign in to place an order",
        variant: "destructive",
      });
      return false;
    }

    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select size and color",
        variant: "destructive",
      });
      return false;
    }

    setOrderLoading(true);
    try {
      console.log(product._id);

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ORDERS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id || product.id,
          price: product.price * quantity,
          quantity: quantity,
          shippingAddress: {
            name: form.name,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
            email: form.email,
            phone: form.phone,
          },
          paymentMethod,
          notes: form.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to create order");
      }

      const orderData = await response.json();

      toast({
        title: "Order placed successfully!",
        description: `Your order has been created. Order ID: ${orderData.order?.orderId}`,
      });

      return true;
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Failed to place order",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setOrderLoading(false);
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError("");
    setCheckoutSuccess("");
    setCheckoutLoading(true);
    if (
      !form.name ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.zip ||
      !form.country ||
      !form.email ||
      !form.phone
    ) {
      setCheckoutError("Please fill in all required fields.");
      setCheckoutLoading(false);
      return;
    }
    setTimeout(() => {
      setCheckoutSuccess("Checkout info submitted!");
      setCheckoutLoading(false);
      setCheckoutOpen(false);
      setPaymentDialogOpen(true);
    }, 1200);
  };

  const handleRazorpay = async () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = async () => {
      const options = {
        key: import.meta.env.VITE_RAZOR_PAY_KEY, // Razorpay test key
        amount: Math.round(product.price * quantity * 100),
        currency: "INR",
        name: "PK Trends",
        description: `Order for ${product.name}`,
        handler: async function (response: any) {
          // Create order after successful payment
          const success = await createOrder("razorpay");
          if (success) {
            setPaymentSuccess(true);
            setPaymentDialogOpen(false);
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#111" },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    };
  };

  const handleCOD = async () => {
    const success = await createOrder("cod");
    if (success) {
      setPaymentSuccess(true);
      setPaymentDialogOpen(false);
    }
  };

  const applyCoupon = () => {
    // Implement coupon application logic here
    setCouponApplied(true);
    setCouponSuccess("Coupon applied successfully!");
  };

  // Fetch address book when dialog opens
  useEffect(() => {
    if (checkoutOpen && token) {
      fetch(`${API_BASE_URL}${API_ENDPOINTS.USER_PROFILE}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setAddresses(data.addressBook || []);
          setSelectedAddressIndex(
            data.addressBook && data.addressBook.length > 0 ? 0 : null
          );
        });
    }
  }, [checkoutOpen, token]);

  const handleSelectAddress = (idx: number) => {
    setSelectedAddressIndex(idx);
    setShowAddressForm(false);
  };

  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddressFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressLoading(true);
    try {
      if (!addressForm.street || !addressForm.city || !addressForm.country) {
        toast({
          title: "Street, city, and country are required",
          variant: "destructive",
        });
        setAddressLoading(false);
        return;
      }
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER_ADDRESS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });
      if (!res.ok) {
        const data = await res.json();
        toast({
          title: data.msg || "Failed to add address",
          variant: "destructive",
        });
        setAddressLoading(false);
        return;
      }
      const data = await res.json();
      setAddresses(data.addressBook || []);
      setSelectedAddressIndex((data.addressBook || []).length - 1);
      setShowAddressForm(false);
      setAddressForm({
        label: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      });
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Error adding address",
        variant: "destructive",
      });
    } finally {
      setAddressLoading(false);
    }
  };
  const selectedAddress =
    selectedAddressIndex !== null ? addresses[selectedAddressIndex] : null;

  useEffect(() => {
    if (selectedAddress) {
      setForm((f) => ({
        ...f,
        name: selectedAddress.label || "",
        address: selectedAddress.street || "",
        city: selectedAddress.city || "",
        state: selectedAddress.state || "",
        zip: selectedAddress.zip || "",
        country: selectedAddress.country || "",
      }));
    }
  }, [selectedAddressIndex]);

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
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={getCurrentImageSrc()}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
                onError={handleMainImageError}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square bg-gray-100 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? "border-black ring-2 ring-black/20"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => handleImageSelect(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = imgPlaceholderUrl;
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.originalPrice}
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
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={() => {
                addToCart({
                  id: product._id || product.id,
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

            {/* Buy Now */}
            <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                  disabled={!selectedColor || !selectedSize}
                >
                  Buy Now
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Checkout</DialogTitle>
                  <DialogDescription>
                    Enter your shipping address and contact details.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleCheckout}
                  className="space-y-6 bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  {/* Order Summary */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold mb-3">Order Summary</h3>
                    <div className="flex items-center space-x-4 mb-3">
                      <img
                        src={getCurrentImageSrc()}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          Size: {selectedSize} | Color: {selectedColor}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{product.price * quantity}
                        </p>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{product.price * quantity}</span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {addresses.length > 0 && !showAddressForm && (
                    <div className="mb-6">
                      <h3 className="font-bold text-lg mb-3 text-black">
                        Choose Shipping Address
                      </h3>
                      <div className="space-y-3">
                        {addresses.map((addr, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md bg-white ${selectedAddressIndex === idx ? "border-blue-600 bg-blue-50 shadow" : "border-gray-200"}`}
                            onClick={() => handleSelectAddress(idx)}
                          >
                            <div>
                              <div className="font-semibold text-base flex items-center gap-2">
                                <span className="w-5 h-5 text-blue-600">
                                  🏠
                                </span>
                                {addr.label || "Address"}
                              </div>
                              <div className="text-gray-700 text-sm mt-1">
                                {addr.street}, {addr.city}, {addr.state},{" "}
                                {addr.zip}, {addr.country}
                              </div>
                            </div>
                            {selectedAddressIndex === idx && (
                              <span className="w-6 h-6 text-blue-600">✔️</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition-all"
                        onClick={() => setShowAddressForm(true)}
                      >
                        + Add New Address
                      </Button>
                    </div>
                  )}
                  {showAddressForm && (
                    <form
                      onSubmit={handleAddressFormSubmit}
                      className="space-y-4 p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200 animate-fade-in"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-black">
                          Add New Address
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="text-gray-500 hover:text-black"
                        >
                          ✖️
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          name="label"
                          placeholder="Label (e.g. Home, Work)"
                          value={addressForm.label}
                          onChange={handleAddressFormChange}
                        />
                        <Input
                          name="street"
                          placeholder="Street"
                          value={addressForm.street}
                          onChange={handleAddressFormChange}
                          required
                        />
                        <Input
                          name="city"
                          placeholder="City"
                          value={addressForm.city}
                          onChange={handleAddressFormChange}
                          required
                        />
                        <Input
                          name="state"
                          placeholder="State"
                          value={addressForm.state}
                          onChange={handleAddressFormChange}
                        />
                        <Input
                          name="zip"
                          placeholder="ZIP Code"
                          value={addressForm.zip}
                          onChange={handleAddressFormChange}
                        />
                        <Input
                          name="country"
                          placeholder="Country"
                          value={addressForm.country}
                          onChange={handleAddressFormChange}
                          required
                        />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          type="submit"
                          disabled={addressLoading}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition-all"
                        >
                          {addressLoading ? "Saving..." : "Save Address"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAddressForm(false)}
                          className="border-gray-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                  {addresses.length === 0 && !showAddressForm && (
                    <Button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition-all"
                    >
                      + Add Shipping Address
                    </Button>
                  )}

                  {/* Contact Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-black">
                      Contact Info
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Input
                          placeholder="Email"
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                          }
                          onBlur={() => handleBlur("email")}
                          className={
                            touched.email && !form.email ? "border-red-500" : ""
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <Input
                          placeholder="Phone Number"
                          value={form.phone}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, phone: e.target.value }))
                          }
                          onBlur={() => handleBlur("phone")}
                          className={
                            touched.phone && !form.phone ? "border-red-500" : ""
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (optional)
                    </label>
                    <Input
                      placeholder="Any special instructions..."
                      value={form.notes}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, notes: e.target.value }))
                      }
                    />
                  </div>
                  {/* Coupon Code */}
                  <div className="mb-6">
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <Input
                          type="text"
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="pl-3 border-gray-300 focus:border-black"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={applyCoupon}
                        variant="outline"
                        className="border-black text-black hover:bg-black hover:text-white"
                        disabled={couponApplied}
                      >
                        {couponApplied ? "Applied" : "Apply"}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-600 mt-2">{couponError}</p>
                    )}
                    {couponSuccess && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {couponSuccess}
                      </p>
                    )}
                  </div>
                  {checkoutError && (
                    <div className="text-red-500 text-sm text-center font-medium">
                      {checkoutError}
                    </div>
                  )}
                  {checkoutSuccess && (
                    <div className="text-green-600 text-sm text-center font-medium">
                      {checkoutSuccess}
                    </div>
                  )}
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="w-full bg-black text-white hover:bg-gray-800 text-lg font-semibold"
                      disabled={checkoutLoading}
                    >
                      {checkoutLoading
                        ? "Submitting..."
                        : "Continue to Payment"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Payment Dialog */}
            <Dialog
              open={paymentDialogOpen}
              onOpenChange={setPaymentDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Payment</DialogTitle>
                  <DialogDescription>
                    Select your payment method and complete your order.
                  </DialogDescription>
                </DialogHeader>
                {!paymentSuccess ? (
                  <>
                    <h3 className="font-semibold text-lg mb-4 text-black">
                      Select Payment Method
                    </h3>
                    <div className="flex flex-col gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={paymentMethod === "razorpay"}
                          onChange={() => setPaymentMethod("razorpay")}
                        />
                        <span>UPI / Cards / Netbanking (Razorpay)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                        />
                        <span>Cash on Delivery</span>
                      </label>
                    </div>
                    <DialogFooter>
                      <Button
                        className="w-full bg-black text-white hover:bg-gray-800 text-lg font-semibold mt-4"
                        onClick={
                          paymentMethod === "razorpay"
                            ? handleRazorpay
                            : handleCOD
                        }
                        disabled={orderLoading}
                      >
                        {orderLoading
                          ? "Processing..."
                          : paymentMethod === "razorpay"
                            ? "Pay Now"
                            : "Place Order"}
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <div className="mt-6 text-center">
                    <h3 className="text-2xl font-bold text-green-600 mb-2">
                      Order Placed Successfully!
                    </h3>
                    <p className="text-gray-700">
                      Thank you for your order. You will receive a confirmation
                      email soon.
                    </p>
                    <Button
                      className="mt-4 bg-black text-white hover:bg-gray-800"
                      onClick={() => {
                        setPaymentDialogOpen(false);
                        setPaymentSuccess(false);
                        window.location.href = "/profile";
                      }}
                    >
                      View My Orders
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

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
                              `${API_BASE_URL}${API_ENDPOINTS.REVIEW_DETAIL(review._id)}`,
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
                              `${API_BASE_URL}${API_ENDPOINTS.REVIEW_DETAIL(id)}`
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
                                    `${API_BASE_URL}${API_ENDPOINTS.REVIEW_DETAIL(review._id)}`,
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
                                    `${API_BASE_URL}${API_ENDPOINTS.REVIEW_DETAIL(id)}`
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
                  const response = await fetch(
                    `${API_BASE_URL}${API_ENDPOINTS.REVIEWS}`,
                    {
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
                    }
                  );

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(data.msg || "Failed to submit review");
                  }

                  // Refresh product data to get updated rating
                  const productRes = await fetch(
                    `${API_BASE_URL}${API_ENDPOINTS.PRODUCT_DETAIL(id)}`
                  );
                  if (productRes.ok) {
                    const updatedProduct = await productRes.json();
                    setProduct(updatedProduct);
                  }

                  // Refresh reviews
                  const reviewsRes = await fetch(
                    `${API_BASE_URL}${API_ENDPOINTS.REVIEW_DETAIL(id)}`
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
