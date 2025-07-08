import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tag, MapPin, CheckCircle, Plus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const OrderSummary = ({
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) => {
  const { token } = useAuth();
  const { cart, clearCart } = useCart();
  const [promoCode, setPromoCode] = React.useState("");
  const [promoApplied, setPromoApplied] = React.useState(false);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState("");
  const [checkoutSuccess, setCheckoutSuccess] = React.useState("");
  const [form, setForm] = React.useState({
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
  const [touched, setTouched] = React.useState<{ [k: string]: boolean }>({});
  const [showPayment, setShowPayment] = React.useState(false);
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState("razorpay");
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [orderLoading, setOrderLoading] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState("");
  const [couponApplied, setCouponApplied] = React.useState(false);
  const [couponError, setCouponError] = React.useState("");
  const [couponSuccess, setCouponSuccess] = React.useState("");
  const [couponDiscount, setCouponDiscount] = React.useState(0);
  const [appliedCoupon, setAppliedCoupon] = React.useState<any>(null);
  const [addresses, setAddresses] = React.useState<any[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = React.useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = React.useState(false);
  const [addressForm, setAddressForm] = React.useState({
    label: '', street: '', city: '', state: '', zip: '', country: ''
  });
  const [addressLoading, setAddressLoading] = React.useState(false);

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setPromoApplied(true);
    }
  };

  const applyCoupon = async () => {
    setCouponError("");
    setCouponSuccess("");
    if (!couponCode) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/coupons/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: couponCode, orderValue: total }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.msg || "Invalid coupon");
        setCouponApplied(false);
        setCouponDiscount(0);
        setAppliedCoupon(null);
        return;
      }
      setCouponSuccess(data.msg || "Coupon applied!");
      setCouponApplied(true);
      setCouponDiscount(data.discount || 0);
      setAppliedCoupon(data.coupon);
    } catch (err) {
      setCouponError("Network error. Please try again.");
      setCouponApplied(false);
      setCouponDiscount(0);
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    setCouponError("");
    setCouponSuccess("");
    setCouponDiscount(0);
    setAppliedCoupon(null);
  };

  const discount = promoApplied ? subtotal * 0.1 : 0;
  const finalTotal = total - discount - couponDiscount;

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

    setOrderLoading(true);
    try {
      // Create orders for each cart item
      const orderPromises = cart.map(async (item) => {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: item.id,
              price: item.price * item.quantity,
              quantity: item.quantity,
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
              couponCode: couponApplied ? couponCode : undefined,
              discount: couponApplied ? couponDiscount : 0,
              finalPrice: couponApplied ? finalTotal : item.price * item.quantity,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Failed to create order");
        }

        return response.json();
      });

      const orders = await Promise.all(orderPromises);

      // Clear cart after successful order creation
      clearCart();

      toast({
        title: "Order placed successfully!",
        description: `Your order has been created. Order ID: ${orders[0]?.order?.orderId}`,
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
    console.log("camed to razorpay function");
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = async () => {
      console.log("came to razorpay function key send section");
      const options = {

        key: import.meta.env.VITE_RAZOR_PAY_KEY, // Razorpay test key
        amount: Math.round(finalTotal * 100),
        currency: "INR",
        name: "PK Trends",
        description: "Order Payment",
        handler: async function (response: any) {
          // Create order after successful payment
          const success = await createOrder("razorpay");
          console.log(success);
          
          if (success) {
            setPaymentSuccess(true);
            setShowPayment(false);
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
      setShowPayment(false);
      setPaymentDialogOpen(false);
    }
  };

  React.useEffect(() => {
    if (checkoutOpen && token) {
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setAddresses(data.addressBook || []);
          setSelectedAddressIndex(data.addressBook && data.addressBook.length > 0 ? 0 : null);
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
        toast({ title: 'Street, city, and country are required', variant: 'destructive' });
        setAddressLoading(false);
        return;
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/user/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(addressForm),
      });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: data.msg || 'Failed to add address', variant: 'destructive' });
        setAddressLoading(false);
        return;
      }
      const data = await res.json();
      setAddresses(data.addressBook || []);
      setSelectedAddressIndex((data.addressBook || []).length - 1);
      setShowAddressForm(false);
      setAddressForm({ label: '', street: '', city: '', state: '', zip: '', country: '' });
    } catch (err) {
      toast({ title: err instanceof Error ? err.message : 'Error adding address', variant: 'destructive' });
    } finally {
      setAddressLoading(false);
    }
  };

  const selectedAddress = selectedAddressIndex !== null ? addresses[selectedAddressIndex] : null;

  React.useEffect(() => {
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

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
      <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>

      {/* Coupon Code */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="pl-10 border-gray-300 focus:border-black"
              disabled={couponApplied}
            />
          </div>
          {!couponApplied ? (
            <Button
              onClick={applyCoupon}
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white"
            >
              Apply
            </Button>
          ) : (
            <Button
              onClick={removeCoupon}
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white"
            >
              Remove
            </Button>
          )}
        </div>
        {couponError && (
          <p className="text-sm text-red-600 mt-2">{couponError}</p>
        )}
        {couponSuccess && (
          <p className="text-sm text-green-600 mt-2">✓ {couponSuccess}</p>
        )}
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="pl-10 border-gray-300 focus:border-black"
            />
          </div>
          <Button
            onClick={applyPromoCode}
            variant="outline"
            className="border-black text-black hover:bg-black hover:text-white"
            disabled={promoApplied}
          >
            {promoApplied ? "Applied" : "Apply"}
          </Button>
        </div>
        {promoApplied && (
          <p className="text-sm text-green-600 mt-2">
            ✓ Promo code applied! You saved 10%
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>

        {couponApplied && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({appliedCoupon?.discountType === "percentage" ? `${appliedCoupon.discountValue}%` : `₹${appliedCoupon.discountValue}`})</span>
            <span>-₹{couponDiscount.toFixed(2)}</span>
          </div>
        )}
        {couponApplied && appliedCoupon && (
          <div className="text-xs text-gray-500 mt-1">
            {appliedCoupon.expiryDate && (
              <div>Expires: {new Date(appliedCoupon.expiryDate).toLocaleDateString()}</div>
            )}
            {appliedCoupon.minOrderValue > 0 && (
              <div>Min order: ₹{appliedCoupon.minOrderValue}</div>
            )}
            {appliedCoupon.usageLimit && (
              <div>Usage left: {appliedCoupon.usageLimit - (appliedCoupon.usedBy?.length || 0)}</div>
            )}
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex justify-between text-xl font-bold text-black">
          <span>Total</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button & Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full mt-6 bg-black text-white hover:bg-gray-800 py-3 text-lg font-semibold"
            size="lg"
            disabled={!token}
          >
            {!token ? "Sign in to Checkout" : "Proceed to Checkout"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Select your shipping address or add a new one.
            </DialogDescription>
          </DialogHeader>
          {addresses.length > 0 && !showAddressForm && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 text-black">Choose Shipping Address</h3>
              <div className="space-y-3">
                {addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md bg-white ${selectedAddressIndex === idx ? 'border-blue-600 bg-blue-50 shadow' : 'border-gray-200'}`}
                    onClick={() => handleSelectAddress(idx)}
                  >
                    <div>
                      <div className="font-semibold text-base flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        {addr.label || 'Address'}
                      </div>
                      <div className="text-gray-700 text-sm mt-1">
                        {addr.street}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
                      </div>
                    </div>
                    {selectedAddressIndex === idx && (
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
              <Button type="button" className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition-all" onClick={() => setShowAddressForm(true)}>
                <Plus className="w-4 h-4" /> Add New Address
              </Button>
            </div>
          )}
          {showAddressForm && (
            <form onSubmit={handleAddressFormSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-black">Add New Address</h3>
                <button type="button" onClick={() => setShowAddressForm(false)} className="text-gray-500 hover:text-black"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="label" placeholder="Label (e.g. Home, Work)" value={addressForm.label} onChange={handleAddressFormChange} />
                <Input name="street" placeholder="Street" value={addressForm.street} onChange={handleAddressFormChange} required />
                <Input name="city" placeholder="City" value={addressForm.city} onChange={handleAddressFormChange} required />
                <Input name="state" placeholder="State" value={addressForm.state} onChange={handleAddressFormChange} />
                <Input name="zip" placeholder="ZIP Code" value={addressForm.zip} onChange={handleAddressFormChange} />
                <Input name="country" placeholder="Country" value={addressForm.country} onChange={handleAddressFormChange} required />
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={addressLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition-all">{addressLoading ? 'Saving...' : 'Save Address'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)} className="border-gray-300">Cancel</Button>
              </div>
            </form>
          )}
          {addresses.length === 0 && !showAddressForm && (
            <Button type="button" onClick={() => setShowAddressForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition-all">
              <Plus className="w-4 h-4" /> Add Shipping Address
            </Button>
          )}
          <form onSubmit={handleCheckout} className="space-y-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {selectedAddress && (
              <div>
                <h3 className="font-semibold text-lg mb-2 text-black">Contact Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} onBlur={() => handleBlur("email")} className={touched.email && !form.email ? "border-red-500" : ""} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <Input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} onBlur={() => handleBlur("phone")} className={touched.phone && !form.phone ? "border-red-500" : ""} required />
                  </div>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promo code or notes (optional)</label>
              <Input placeholder="Promo code or notes (optional)" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
            {checkoutError && (<div className="text-red-500 text-sm text-center font-medium">{checkoutError}</div>)}
            {checkoutSuccess && (<div className="text-green-600 text-sm text-center font-medium">{checkoutSuccess}</div>)}
            <DialogFooter>
              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 text-lg font-semibold" disabled={checkoutLoading || !selectedAddress}>
                {checkoutLoading ? "Submitting..." : "Continue to Payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
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
                    paymentMethod === "razorpay" ? handleRazorpay : handleCOD
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
                Thank you for your order. You will receive a confirmation email
                soon.
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

      {/* Security Notice */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Secure checkout powered by SSL encryption
        </p>
      </div>

      {/* Payment Methods */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3 text-center">We accept</p>
        <div className="flex justify-center space-x-3">
          <div className="w-8 h-5 bg-black rounded text-white text-xs flex items-center justify-center font-bold">
            VISA
          </div>
          <div className="w-8 h-5 bg-black rounded text-white text-xs flex items-center justify-center font-bold">
            MC
          </div>
          <div className="w-8 h-5 bg-black rounded text-white text-xs flex items-center justify-center font-bold">
            AMEX
          </div>
          <div className="w-8 h-5 bg-black rounded text-white text-xs flex items-center justify-center font-bold">
            PP
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
