import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface DashboardStatsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
}

const stats = [
  {
    title: "Total Revenue",
    value: "$0",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "from-green-500 to-emerald-600",
    key: "totalRevenue" as keyof DashboardStatsData,
    route: null, // Revenue doesn't have a specific page
  },
  {
    title: "Total Orders",
    value: "0",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "from-blue-500 to-cyan-600",
    key: "totalOrders" as keyof DashboardStatsData,
    route: "/orders",
  },
  {
    title: "Total Users",
    value: "0",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "from-purple-500 to-violet-600",
    key: "totalUsers" as keyof DashboardStatsData,
    route: "/users",
  },
  {
    title: "Total Products",
    value: "0",
    change: "-2.1%",
    trend: "down",
    icon: Package,
    color: "from-orange-500 to-red-600",
    key: "totalProducts" as keyof DashboardStatsData,
    route: "/products",
  },
];

export const DashboardStats: React.FC = () => {
  const [statsData, setStatsData] = useState<DashboardStatsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(
          "http://localhost:8000/api/dashboard/stats",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();
        setStatsData(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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

  const getStatsWithRealData = () => {
    return stats.map((stat) => ({
      ...stat,
      value:
        stat.key === "totalRevenue"
          ? formatCurrency(statsData[stat.key])
          : formatNumber(statsData[stat.key]),
    }));
  };

  const handleCardClick = (route: string | null) => {
    if (route) {
      navigate(route);
    }
  };

  const currentStats = getStatsWithRealData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {currentStats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card
            className={`relative overflow-hidden ${
              stat.route
                ? "cursor-pointer hover:shadow-lg transition-shadow duration-200"
                : ""
            }`}
            onClick={() => handleCardClick(stat.route)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? "Loading..." : stat.value}
              </div>
              <div className="flex items-center mt-2">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  vs last month
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
