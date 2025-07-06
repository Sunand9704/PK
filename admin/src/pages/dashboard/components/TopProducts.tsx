import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  _id: string;
  name: string;
  price: number;
  soldCount: number;
  category: string;
}

const topProducts = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    sales: 1247,
    revenue: "$62,350",
    trend: "up",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    sales: 956,
    revenue: "$47,800",
    trend: "up",
  },
  {
    id: 3,
    name: "Gaming Mechanical Keyboard",
    sales: 743,
    revenue: "$37,150",
    trend: "down",
  },
  {
    id: 4,
    name: "Premium Laptop Stand",
    sales: 621,
    revenue: "$31,050",
    trend: "up",
  },
  {
    id: 5,
    name: "Wireless Charging Pad",
    sales: 543,
    revenue: "$27,150",
    trend: "up",
  },
];

export const TopProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(
          "http://localhost:8000/api/products?sort=soldCount_desc&limit=5",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch top products");
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching top products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

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

  const getTopProductsWithRealData = () => {
    return products.map((product, index) => {
      const revenue = product.price * product.soldCount;
      return {
        id: product._id,
        name: product.name,
        sales: product.soldCount,
        revenue: formatCurrency(revenue),
        trend: "up", // Keep dummy trend data as requested
      };
    });
  };

  const currentTopProducts = getTopProductsWithRealData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-8"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : currentTopProducts.length > 0 ? (
            currentTopProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatNumber(product.sales)} sales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{product.revenue}</p>
                  <Badge
                    variant={product.trend === "up" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {product.trend === "up" ? "↗" : "↘"}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No products found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
