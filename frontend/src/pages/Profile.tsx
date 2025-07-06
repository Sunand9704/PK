import React, { useState, useEffect } from "react";
import {
  User,
  Home,
  Box,
  Star,
  Archive,
  ShoppingCart,
  Shield,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/shared/ProductCard";
import { useAuth } from "@/context/AuthContext";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    category: "Account",
    items: [
      { title: "User Information", icon: User, id: "user-info" },
    ],
  },
  {
    category: "Orders & Shopping",
    items: [
      { title: "My Orders", icon: Box, id: "orders" },
      { title: "Wishlist", icon: Star, id: "wishlist" },
    ],
  },
  {
    category: "Account Settings",
    items: [
      { title: "Security Settings", icon: Shield, id: "security" },
      { title: "Reviews & Ratings", icon: Star, id: "reviews" },
      { title: "Coupons & Rewards", icon: Star, id: "coupons" },
    ],
  },
];

const Wishlist: React.FC = () => {
  const { token } = useAuth();
  const [wishlist, setWishlist] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/user/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setWishlist(data.wishlist || []);
        } else {
          toast({ title: "Failed to fetch wishlist", variant: "destructive" });
        }
      } catch {
        toast({ title: "Error fetching wishlist", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchWishlist();
  }, [token]);

  if (!token) {
    return (
      <div className="p-4 md:p-8">Please sign in to view your wishlist.</div>
    );
  }
  if (loading) {
    return <div className="p-4 md:p-8">Loading wishlist...</div>;
  }
  if (wishlist.length === 0) {
    return (
      <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[300px] bg-white rounded shadow">
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 3.75a4.75 4.75 0 0 1 3.5 7.92l-7.5 8.33-7.5-8.33A4.75 4.75 0 1 1 7.5 3.75a4.75 4.75 0 0 1 4.5 2.7 4.75 4.75 0 0 1 4.5-2.7z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
          Your wishlist is empty
        </h3>
        <p className="text-gray-500 mb-6 text-center max-w-xs">
          You haven't added any products to your wishlist yet. Start exploring
          and add your favorite items!
        </p>
        <a href="/products">
          <Button className="bg-black text-white hover:bg-gray-800">
            Browse Products
          </Button>
        </a>
      </div>
    );
  }
  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {wishlist.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            pId={product._id || product.id}
          />
        ))}
      </div>
    </div>
  );
};

const Orders: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedOrder, setSelectedOrder] = React.useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    email: "",
    phone: "",
  });
  const [editAction, setEditAction] = React.useState<string | null>(null);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  // Refetch orders function
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/orders/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        toast({ title: "Failed to fetch orders", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error fetching orders", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cod":
        return "Cash on Delivery";
      case "razorpay":
        return "Online Payment";
      case "card":
        return "Card Payment";
      default:
        return method;
    }
  };

  // Stepper for order tracking
  const statusSteps = [
    { key: "pending", label: "Pending" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const getCurrentStep = (status: string) => {
    if (status === "cancelled") return 4;
    return statusSteps.findIndex((s) => s.key === status);
  };

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setEditForm({
      name: order.shippingAddress?.name || "",
      address: order.shippingAddress?.address || "",
      city: order.shippingAddress?.city || "",
      state: order.shippingAddress?.state || "",
      zip: order.shippingAddress?.zip || "",
      country: order.shippingAddress?.country || "",
      email: order.shippingAddress?.email || "",
      phone: order.shippingAddress?.phone || "",
    });
    setDialogOpen(true);
  };

  // PATCH order helper
  const patchOrder = async (fields: any) => {
    if (!selectedOrder) return;
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/orders/${selectedOrder._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(fields),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || "Failed to update order");
      }
      setActionSuccess("Order updated successfully!");
      toast({
        title: "Order updated!",
        description: "Your order was updated successfully.",
      });
      setEditAction(null);
      setDialogOpen(false);
      // Refetch orders in place
      fetchOrders();
    } catch (err: any) {
      setActionError(err.message);
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async () => {
    if (!selectedOrder) return;
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/orders/${selectedOrder._id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || "Failed to cancel order");
      }
      setActionSuccess("Order cancelled successfully!");
      toast({
        title: "Order cancelled!",
        description: "Your order was cancelled.",
      });
      setEditAction(null);
      setDialogOpen(false);
      // Refetch orders in place
      fetchOrders();
    } catch (err: any) {
      setActionError(err.message);
      toast({
        title: "Cancel failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="p-4 md:p-8">Please sign in to view your orders.</div>
    );
  }
  if (loading) {
    return <div className="p-4 md:p-8">Loading orders...</div>;
  }
  if (orders.length === 0) {
    return (
      <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[300px] bg-white rounded shadow">
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 3.75a4.75 4.75 0 0 1 3.5 7.92l-7.5 8.33-7.5-8.33A4.75 4.75 0 1 1 7.5 3.75a4.75 4.75 0 0 1 4.5 2.7 4.75 4.75 0 0 1 4.5-2.7z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
          No orders found
        </h3>
        <p className="text-gray-500 mb-6 text-center max-w-xs">
          You haven't placed any orders yet. Start shopping to see your order
          history!
        </p>
        <a href="/products">
          <Button className="bg-black text-white hover:bg-gray-800">
            Start Shopping
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li
            key={order._id}
            className="bg-white p-4 md:p-6 rounded shadow cursor-pointer hover:shadow-lg transition"
            onClick={() => handleOrderClick(order)}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
              <div>
                <div className="font-semibold text-lg">
                  Order #{order.orderId}
                </div>
                <div className="text-gray-500 text-sm">
                  Placed on {formatDate(order.placedAt)}
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="font-bold text-lg">${order.price}</div>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(order.status)}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="font-medium text-gray-700 mb-1">
                  Product Details
                </div>
                <div className="text-gray-600">
                  {order.productId?.name || "Product"}
                  {order.quantity > 1 && ` (${order.quantity} items)`}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-700 mb-1">
                  Payment Method
                </div>
                <div className="text-gray-600">
                  {getPaymentMethodText(order.paymentMethod)}
                </div>
              </div>
            </div>
            {order.shippingAddress && (
              <div className="border-t pt-4">
                <div className="font-medium text-gray-700 mb-2">
                  Shipping Address
                </div>
                <div className="text-gray-600 text-sm">
                  <div>{order.shippingAddress.name}</div>
                  <div>{order.shippingAddress.address}</div>
                  <div>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zip}
                  </div>
                  <div>{order.shippingAddress.country}</div>
                  <div className="mt-1">
                    📧 {order.shippingAddress.email} | 📞{" "}
                    {order.shippingAddress.phone}
                  </div>
                </div>
              </div>
            )}
            {order.notes && (
              <div className="border-t pt-4 mt-4">
                <div className="font-medium text-gray-700 mb-1">Notes</div>
                <div className="text-gray-600 text-sm">{order.notes}</div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Order Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditAction(null);
        }}
      >
        <DialogContent className="max-w-lg w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.orderId}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-8">
              {/* Order Tracking Section */}
              <div>
                <h3 className="font-semibold mb-3">Order Tracking</h3>
                <div className="flex items-center justify-between mb-2">
                  {statusSteps.slice(0, 4).map((step, idx) => (
                    <div
                      key={step.key}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mb-1
                          ${getCurrentStep(selectedOrder.status) >= idx ? "bg-black" : "bg-gray-300"}`}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-xs text-center">{step.label}</span>
                      {idx < 3 && (
                        <div
                          className={`h-1 w-full ${getCurrentStep(selectedOrder.status) > idx ? "bg-black" : "bg-gray-200"}`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
                {selectedOrder.status === "cancelled" && (
                  <div className="text-red-600 font-semibold mt-2">
                    Order Cancelled
                  </div>
                )}
              </div>
              <Separator />
              {/* Edit Order Section - new style */}
              <div>
                <h3 className="font-semibold mb-3">Edit Order</h3>
                <div className="divide-y border rounded-lg overflow-hidden bg-gray-50">
                  <button
                    className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-100 focus:outline-none"
                    onClick={() => setEditAction("phone")}
                    disabled={
                      selectedOrder.status === "delivered" ||
                      selectedOrder.status === "cancelled"
                    }
                  >
                    <span>I want to change my phone number</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-100 focus:outline-none"
                    onClick={() => setEditAction("address")}
                    disabled={
                      selectedOrder.status === "delivered" ||
                      selectedOrder.status === "cancelled"
                    }
                  >
                    <span>I want to change the delivery address</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-100 focus:outline-none"
                    onClick={() => setEditAction("cancel")}
                    disabled={
                      selectedOrder.status === "delivered" ||
                      selectedOrder.status === "cancelled"
                    }
                  >
                    <span>I want to cancel my order</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                {/* Inline forms/dialogs for each action */}
                {editAction === "phone" && (
                  <form
                    className="mt-6 space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      patchOrder({
                        shippingAddress: {
                          ...selectedOrder.shippingAddress,
                          phone: editForm.phone,
                        },
                      });
                    }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Phone Number
                    </label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, phone: e.target.value }))
                      }
                    />
                    {actionError && (
                      <div className="text-red-600 text-sm">{actionError}</div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="bg-black text-white"
                        disabled={actionLoading}
                      >
                        {actionLoading ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditAction(null)}
                        disabled={actionLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
                {editAction === "address" && (
                  <form
                    className="mt-6 space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      patchOrder({ shippingAddress: { ...editForm } });
                    }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <Input
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, address: e.target.value }))
                      }
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <Input
                          value={editForm.city}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, city: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <Input
                          value={editForm.state}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              state: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <Input
                          value={editForm.zip}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, zip: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <Input
                          value={editForm.country}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              country: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, email: e.target.value }))
                      }
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, phone: e.target.value }))
                      }
                    />
                    {actionError && (
                      <div className="text-red-600 text-sm">{actionError}</div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="submit"
                        className="bg-black text-white"
                        disabled={actionLoading}
                      >
                        {actionLoading ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditAction(null)}
                        disabled={actionLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
                {editAction === "cancel" && (
                  <div className="mt-6 space-y-4">
                    <div className="text-red-600 font-medium">
                      Are you sure you want to cancel this order?
                    </div>
                    {actionError && (
                      <div className="text-red-600 text-sm">{actionError}</div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        className="bg-red-600 text-white"
                        onClick={cancelOrder}
                        disabled={actionLoading}
                      >
                        {actionLoading ? "Cancelling..." : "Yes, Cancel Order"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditAction(null)}
                        disabled={actionLoading}
                      >
                        No, Go Back
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function Profile() {
  const [activeSection, setActiveSection] = useState("user-info");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    phone: "",
    dateOfBirth: "",
    gender: "",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressEditIndex, setAddressEditIndex] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingUser(true);
      setUserError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await res.json();
        setUserInfo(data);
        setEditForm({
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
          gender: data.gender || "",
          avatar: data.avatar || "",
        });
        setAvatarPreview(data.avatar || "");
        if (!data.addressBook) data.addressBook = [];
      } catch (err: any) {
        setUserError(err.message || "Error fetching user profile");
      } finally {
        setLoadingUser(false);
      }
    };
    if (token) fetchUserProfile();
  }, [token]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "avatars");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();
      setEditForm((prev) => ({ ...prev, avatar: data.url }));
      setAvatarPreview(data.url);
      toast({ title: "Profile picture uploaded" });
    } catch (err: any) {
      toast({ title: err.message || "Error uploading image", variant: "destructive" });
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: editForm.phone,
          dateOfBirth: editForm.dateOfBirth,
          gender: editForm.gender,
          avatar: editForm.avatar,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      const data = await res.json();
      setUserInfo((prev: any) => ({ ...prev, ...data.user }));
      setEditDialogOpen(false);
      toast({ title: "Profile updated successfully" });
    } catch (err: any) {
      toast({ title: err.message || "Error updating profile", variant: "destructive" });
    } finally {
      setEditLoading(false);
    }
  };

  // Address dialog open for edit
  const openEditAddressDialog = (index: number) => {
    setAddressEditIndex(index);
    const addr = userInfo?.addressBook?.[index];
    setAddressForm({
      label: addr?.label || '',
      street: addr?.street || '',
      city: addr?.city || '',
      state: addr?.state || '',
      zip: addr?.zip || '',
      country: addr?.country || '',
    });
    setAddressDialogOpen(true);
  };
  // Address dialog open for add
  const openAddAddressDialog = () => {
    setAddressEditIndex(null);
    setAddressForm({ label: '', street: '', city: '', state: '', zip: '', country: '' });
    setAddressDialogOpen(true);
  };
  // Address form change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };
  // Address form submit
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressLoading(true);
    try {
      let res;
      if (addressEditIndex !== null) {
        // Edit
        res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/user/address/${addressEditIndex}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(addressForm),
        });
      } else {
        // Add
        res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/user/address`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(addressForm),
        });
      }
      if (!res.ok) throw new Error("Failed to save address");
      const data = await res.json();
      setUserInfo((prev: any) => ({ ...prev, addressBook: data.addressBook }));
      setAddressDialogOpen(false);
      toast({ title: addressEditIndex !== null ? "Address updated" : "Address added" });
    } catch (err: any) {
      toast({ title: err.message || "Error saving address", variant: "destructive" });
    } finally {
      setAddressLoading(false);
    }
  };

  // Address delete
  const handleDeleteAddress = async (index: number) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    setAddressLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/user/address/${index}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete address");
      const data = await res.json();
      setUserInfo((prev: any) => ({ ...prev, addressBook: data.addressBook }));
      toast({ title: "Address deleted" });
    } catch (err: any) {
      toast({ title: err.message || "Error deleting address", variant: "destructive" });
    } finally {
      setAddressLoading(false);
    }
  };

  // Move sectionContent inside the component
  const sectionContent: Record<string, React.ReactNode> = {
    "user-info": (
      <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-8 max-w-5xl">
        {/* User Information Card */}
        <div className="flex-1 max-w-xl">
          <h2 className="text-2xl font-bold mb-4">User Information</h2>
          <div className="bg-white p-4 md:p-6 rounded shadow flex flex-col gap-4">
            {loadingUser ? (
              <div className="text-gray-500">Loading user info...</div>
            ) : userError ? (
              <div className="text-red-500">{userError}</div>
            ) : userInfo ? (
              <>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={userInfo.avatar || "/placeholder.svg"} alt="Profile" />
                    <AvatarFallback className="bg-gray-900 text-white">
                      {(userInfo.firstName?.[0] || '') + (userInfo.lastName?.[0] || '') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg">{`${userInfo.firstName || ''} ${userInfo.lastName || ''}`}</div>
                    <div className="text-gray-500 text-sm">{userInfo.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-xs text-gray-400">Phone</div>
                    <div className="font-medium">{userInfo.phone || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Date of Birth</div>
                    <div className="font-medium">{userInfo.dateOfBirth ? userInfo.dateOfBirth.slice(0, 10) : "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Gender</div>
                    <div className="font-medium">{userInfo.gender || "-"}</div>
                  </div>
                </div>
                <Button className="mt-6 w-32" onClick={() => setEditDialogOpen(true)}>Edit Profile</Button>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>Update your phone, date of birth, and gender.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <Input
                          name="phone"
                          value={editForm.phone}
                          onChange={handleEditChange}
                          placeholder="Phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Date of Birth</label>
                        <Input
                          name="dateOfBirth"
                          type="date"
                          value={editForm.dateOfBirth}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Gender</label>
                        <select
                          name="gender"
                          value={editForm.gender}
                          onChange={handleEditChange}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <label className="block text-sm font-medium mb-1">Profile Picture</label>
                        {avatarPreview && (
                          <img src={avatarPreview} alt="Avatar Preview" className="w-20 h-20 rounded-full object-cover border" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={avatarUploading}
                          className="mt-2"
                        />
                        {avatarUploading && <span className="text-xs text-gray-500">Uploading...</span>}
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</Button>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <div className="text-gray-500">No user info available.</div>
            )}
          </div>
        </div>
        {/* Address Book Card (static for now, can be made dynamic similarly) */}
        <div className="flex-1 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Address Book</h2>
          <ul className="space-y-4">
            {userInfo?.addressBook && userInfo.addressBook.length > 0 ? (
              userInfo.addressBook.map((addr: any, idx: number) => (
                <li key={idx} className="bg-white p-4 md:p-6 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold">{addr.label || "Address"}</div>
                    <div className="text-gray-500 text-sm">
                      {addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button variant="outline" onClick={() => openEditAddressDialog(idx)}>Edit</Button>
                    <Button variant="ghost" onClick={() => handleDeleteAddress(idx)} disabled={addressLoading} title="Delete address">
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No addresses saved.</li>
            )}
          </ul>
          <Button className="mt-6" onClick={openAddAddressDialog}>Add New Address</Button>
          <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{addressEditIndex !== null ? "Edit Address" : "Add Address"}</DialogTitle>
                <DialogDescription>Fill in the address details below.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Label</label>
                  <Input name="label" value={addressForm.label} onChange={handleAddressChange} placeholder="e.g. Home, Office" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Street</label>
                  <Input name="street" value={addressForm.street} onChange={handleAddressChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input name="city" value={addressForm.city} onChange={handleAddressChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <Input name="state" value={addressForm.state} onChange={handleAddressChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP</label>
                  <Input name="zip" value={addressForm.zip} onChange={handleAddressChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <Input name="country" value={addressForm.country} onChange={handleAddressChange} required />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={addressLoading}>{addressLoading ? "Saving..." : "Save"}</Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    ),
    orders: <Orders />,
    wishlist: <Wishlist />,
    security: (
      <div className="p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
        <div className="bg-white p-4 md:p-6 rounded shadow mb-4">
          <div className="font-semibold mb-2">Change Password</div>
          <Button variant="outline">Change</Button>
        </div>
        <div className="bg-white p-4 md:p-6 rounded shadow">
          <div className="font-semibold mb-2">Two-Factor Authentication</div>
          <Button variant="outline">Enable</Button>
        </div>
      </div>
    ),
    reviews: (
      <div className="p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-4">Reviews & Ratings</h2>
        <ul className="space-y-4">
          <li className="bg-white p-4 rounded shadow">
            <div className="font-semibold">Running Shoes</div>
            <div className="text-yellow-500">★★★★☆</div>
            <div className="text-gray-600 text-sm">"Very comfortable and stylish!"</div>
          </li>
          <li className="bg-white p-4 rounded shadow">
            <div className="font-semibold">Smart Watch</div>
            <div className="text-yellow-500">★★★☆☆</div>
            <div className="text-gray-600 text-sm">"Good features but battery life could be better."</div>
          </li>
        </ul>
      </div>
    ),
    coupons: (
      <div className="p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-4">Coupons & Rewards</h2>
        <ul className="space-y-4">
          <li className="bg-white p-4 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold">WELCOME10</div>
              <div className="text-gray-500 text-sm">10% off on your first order</div>
            </div>
            <Button variant="outline" className="mt-2 sm:mt-0">Apply</Button>
          </li>
          {/* ...other coupon items... */}
        </ul>
      </div>
    ),
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {loadingUser ? (
        <div className="w-full flex justify-center items-center h-96 text-gray-500 text-lg">Loading user info...</div>
      ) : userError ? (
        <div className="w-full flex justify-center items-center h-96 text-red-500 text-lg">{userError}</div>
      ) : !userInfo ? (
        <div className="w-full flex justify-center items-center h-96 text-gray-500 text-lg">No user info available.</div>
      ) : (
        <>
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b p-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userInfo.avatar || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback className="bg-gray-900 text-white">
                    {(userInfo.firstName?.[0] || '') + (userInfo.lastName?.[0] || '') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{`${userInfo.firstName || ''} ${userInfo.lastName || ''}`}</h2>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Sidebar */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white border-b shadow-sm">
              <div className="p-4">
                <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Account
                </div>
                <ul className="mb-6">
                  {menuItems[0].items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveSection(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center w-full px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors
                          ${activeSection === item.id ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Orders & Shopping
                </div>
                <ul className="mb-6">
                  {menuItems[1].items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveSection(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center w-full px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors
                          ${activeSection === item.id ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Account Settings
                </div>
                <ul>
                  {menuItems[2].items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveSection(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center w-full px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors
                          ${activeSection === item.id ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-5 w-5 mr-2" /> Logout
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 bg-white border-r flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={userInfo?.avatar || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback className="bg-gray-900 text-white">
                    {(userInfo.firstName?.[0] || '') + (userInfo.lastName?.[0] || '') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {`${userInfo.firstName || ''} ${userInfo.lastName || ''}`}
                  </h2>
                </div>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Account
              </div>
              <ul className="mb-6">
                {menuItems[0].items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center w-full px-6 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors
                        ${activeSection === item.id ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Orders & Shopping
              </div>
              <ul className="mb-6">
                {menuItems[1].items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center w-full px-6 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors
                        ${activeSection === item.id ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Account Settings
              </div>
              <ul>
                {menuItems[2].items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center w-full px-6 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors
                        ${activeSection === item.id ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-6 border-t">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5 mr-2" /> Logout
              </Button>
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {sectionContent[activeSection]}
          </main>
        </>
      )}
    </div>
  );
}
