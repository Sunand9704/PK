import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Heart, Heart as HeartFilled } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import React from "react";

interface ProductCardProps {
  product: Product;
  pId: string;
}

const ProductCard = ({ product, pId }: ProductCardProps) => {
  const { token } = useAuth();
  const [wishlisted, setWishlisted] = React.useState(false);

  React.useEffect(() => {
    if (!token) return;
    const fetchWishlist = async () => {
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
          if (Array.isArray(data.wishlist)) {
            setWishlisted(
              data.wishlist.some((item: any) => (item._id || item.id) === pId)
            );
          }
        }
      } catch {}
    };
    fetchWishlist();
  }, [token, pId]);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (!token) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add to wishlist.",
        variant: "destructive",
      });
      return;
    }
    try {
      if (!wishlisted) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/user/wishlist`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: pId }),
          }
        );
        const data = await res.json();
        if (res.ok) {
          toast({
            title: "Added to wishlist!",
            description: `${product.name} has been added to your wishlist.`,
          });
          setWishlisted(true);
        } else {
          toast({
            title: "Failed to add to wishlist",
            description: data.msg || "Failed to add to wishlist.",
            variant: "destructive",
          });
        }
      } else {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/user/wishlist`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: pId }),
          }
        );
        const data = await res.json();
        if (res.ok) {
          toast({
            title: "Removed from wishlist",
            description: `${product.name} has been removed from your wishlist.`,
          });
          setWishlisted(false);
        } else {
          toast({
            title: "Failed to remove from wishlist",
            description: data.msg || "Failed to remove from wishlist.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Error updating wishlist.",
        variant: "destructive",
      });
    }
  };

  return (
    <Link
      to={`/products/${pId}`}
      className="group cursor-pointer bg-white rounded-xl shadow-md p-4 transition-transform duration-300 hover:scale-105 block"
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-square mb-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          className={`absolute top-3 right-3 z-10 bg-white/80 rounded-full p-1 transition-colors ${wishlisted ? "bg-red-100" : "hover:bg-red-100"}`}
          aria-label="Add to wishlist"
          onClick={handleWishlist}
        >
          {wishlisted ? (
            <HeartFilled className="h-5 w-5 text-red-500 fill-red-500" />
          ) : (
            <Heart className="h-5 w-5 text-gray-500 hover:text-red-500" />
          )}
        </button>
        {product.originalPrice && (
          <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-medium">
            SALE
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm">{product.name}</h3>
        <div className="flex items-center space-x-2">
          <span className="font-semibold">${product.price}</span>

          {product.originalPrice && (
            <span className="text-gray-500 line-through text-sm">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <span>★ {product.rating}</span>
          <span>({product.reviews})</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
