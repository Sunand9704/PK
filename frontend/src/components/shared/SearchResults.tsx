import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/shared/ProductCard";
import { Product as ProductType } from "@/data/products";

const imgPlaceholderUrl =
  "https://res.cloudinary.com/dk6rrrwum/image/upload/v1751738007/placeholder_szfmym.svg";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  soldCount: number;
  colors: string[];
  sizes: string[];
}

interface SearchResultsProps {
  products: Product[];
  loading: boolean;
  searchTerm: string;
  onClose: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  loading,
  searchTerm,
  onClose,
}) => {
  const { addToCart } = useCart();
  const [imageErrors, setImageErrors] = React.useState<{
    [key: string]: boolean;
  }>({});

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      color: product.colors?.[0] || "",
      size: product.sizes?.[0] || "",
    });
  };

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const getImageSrc = (product: Product) => {
    if (
      imageErrors[product._id] ||
      !product.images ||
      product.images.length === 0
    ) {
      return imgPlaceholderUrl;
    }
    return product.images[0];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Search Results</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              ×
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index}>
                <Skeleton className="bg-gray-200 h-48 rounded-lg mb-2" />
                <Skeleton className="h-4 bg-gray-200 rounded mb-2" />
                <Skeleton className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Search Results for "{searchTerm}"
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="fixed top-4 right-4 z-50 bg-gray-200 hover:bg-gray-300 text-black rounded-full shadow"
          aria-label="Close search results"
        >
          ×
        </Button>
        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No products found for "{searchTerm}"
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try searching with different keywords or browse our categories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {products.map((product) => {
              // Ensure category is one of the allowed values
              const allowedCategories = ["shirts", "pants", "accessories"];
              const safeCategory = allowedCategories.includes(product.category)
                ? (product.category as "shirts" | "pants" | "accessories")
                : "shirts";
              const mappedProduct: ProductType = {
                id: product._id || "",
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                category: safeCategory,
                image:
                  (product as any).image ||
                  (product.images && product.images[0]) ||
                  "/placeholder.svg",
                images:
                  product.images && product.images.length > 0
                    ? product.images
                    : [(product as any).image || "/placeholder.svg"],
                sizes: product.sizes || [],
                colors: product.colors || [],
                description: product.description || "",
                features: (product as any).features || [],
                inStock: product.inStock,
                rating: product.rating,
                reviews: product.reviews,
                soldCount: product.soldCount,
              };
              return (
                <ProductCard
                  key={mappedProduct.id}
                  product={mappedProduct}
                  pId={mappedProduct.id}
                />
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
};
