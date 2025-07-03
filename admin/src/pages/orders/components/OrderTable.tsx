
import React from 'react';
import { Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data
const orders = [
  {
    id: '#ORD-001',
    customer: 'John Smith',
    email: 'john@example.com',
    date: '2024-01-15',
    status: 'delivered',
    total: 129.99,
    items: 2
  },
  {
    id: '#ORD-002',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    date: '2024-01-14',
    status: 'shipped',
    total: 89.50,
    items: 1
  },
  {
    id: '#ORD-003',
    customer: 'Mike Davis',
    email: 'mike@example.com',
    date: '2024-01-13',
    status: 'processing',
    total: 256.00,
    items: 3
  },
  {
    id: '#ORD-004',
    customer: 'Emily Wilson',
    email: 'emily@example.com',
    date: '2024-01-12',
    status: 'pending',
    total: 45.99,
    items: 1
  },
];

interface OrderTableProps {
  searchTerm: string;
}

export const OrderTable: React.FC<OrderTableProps> = ({ searchTerm }) => {
  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
