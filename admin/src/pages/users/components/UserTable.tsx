
import React from 'react';
import { Edit, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data
const users = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    role: 'customer',
    status: 'active',
    joinDate: '2024-01-15',
    orders: 12
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'customer',
    status: 'active',
    joinDate: '2024-01-10',
    orders: 8
  },
  {
    id: 3,
    name: 'Mike Davis',
    email: 'mike@example.com',
    role: 'admin',
    status: 'active',
    joinDate: '2023-12-01',
    orders: 0
  },
  {
    id: 4,
    name: 'Emily Wilson',
    email: 'emily@example.com',
    role: 'customer',
    status: 'inactive',
    joinDate: '2024-01-05',
    orders: 3
  },
];

interface UserTableProps {
  searchTerm: string;
}

export const UserTable: React.FC<UserTableProps> = ({ searchTerm }) => {
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case 'customer':
        return <Badge className="bg-blue-100 text-blue-800">Customer</Badge>;
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
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{user.joinDate}</TableCell>
                <TableCell>{user.orders}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Shield className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
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
