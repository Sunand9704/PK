// API configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",

  // Products
  PRODUCTS: "/api/products",
  PRODUCT_DETAIL: (id: string) => `/api/products/${id}`,
  PRODUCT_SEARCH: (query: string) =>
    `/api/products?search=${encodeURIComponent(query)}`,

  // Categories
  CATEGORIES: "/api/categories",
  CATEGORIES_WITH_TOP_PRODUCTS: "/api/categories/with-top-products",

  // User
  USER_PROFILE: "/api/user/profile",
  USER_WISHLIST: "/api/user/wishlist",
  USER_ORDERS: "/api/user/orders",
  USER_ADDRESS: "/api/user/address",

  // Orders
  ORDERS: "/api/orders",
  ORDER_DETAIL: (id: string) => `/api/orders/${id}`,
  ORDER_CANCEL: (id: string) => `/api/orders/${id}/cancel`,

  // Reviews
  REVIEWS: "/api/reviews",
  TOP_REVIEWS: "/api/reviews/top",
  USER_REVIEWS: "/api/reviews/user",
  REVIEW_DETAIL: (id: string) => `/api/reviews/${id}`,

  // Coupons
  COUPONS: "/api/coupons",
  COUPONS_AVAILABLE: "/api/coupons/available",
  COUPONS_APPLY: "/api/coupons/apply",

  // Contact
  CONTACT: "/api/contact",

  // Upload
  UPLOAD: "/api/upload",
} as const;
