
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  {
    title: 'Total Revenue',
    value: '$124,563',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
  },
  {
    title: 'Total Orders',
    value: '2,847',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'Total Users',
    value: '12,426',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
    color: 'from-purple-500 to-violet-600',
  },
  {
    title: 'Total Products',
    value: '847',
    change: '-2.1%',
    trend: 'down',
    icon: Package,
    color: 'from-orange-500 to-red-600',
  },
];

export const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center mt-2">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
