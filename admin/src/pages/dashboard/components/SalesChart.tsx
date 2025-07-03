
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', sales: 4000, orders: 240 },
  { name: 'Feb', sales: 3000, orders: 198 },
  { name: 'Mar', sales: 5000, orders: 320 },
  { name: 'Apr', sales: 4500, orders: 290 },
  { name: 'May', sales: 6000, orders: 380 },
  { name: 'Jun', sales: 5500, orders: 360 },
  { name: 'Jul', sales: 7000, orders: 420 },
];

export const SalesChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
