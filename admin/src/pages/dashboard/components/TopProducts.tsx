
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const topProducts = [
  { id: 1, name: 'Wireless Earbuds Pro', sales: 1247, revenue: '$62,350', trend: 'up' },
  { id: 2, name: 'Smart Fitness Watch', sales: 956, revenue: '$47,800', trend: 'up' },
  { id: 3, name: 'Gaming Mechanical Keyboard', sales: 743, revenue: '$37,150', trend: 'down' },
  { id: 4, name: 'Premium Laptop Stand', sales: 621, revenue: '$31,050', trend: 'up' },
  { id: 5, name: 'Wireless Charging Pad', sales: 543, revenue: '$27,150', trend: 'up' },
];

export const TopProducts: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} sales</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{product.revenue}</p>
                <Badge variant={product.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                  {product.trend === 'up' ? '↗' : '↘'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
