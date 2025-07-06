import React from "react";
import { Edit, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const coupons = [
  {
    id: 1,
    code: "SAVE20",
    description: "20% off on all products",
    discount: 20,
    type: "percentage",
    status: "active",
    usageCount: 45,
    usageLimit: 100,
    expiryDate: "2024-03-31",
  },
  {
    id: 2,
    code: "FLAT50",
    description: "₹50 off on orders above ₹200",
    discount: 50,
    type: "fixed",
    status: "active",
    usageCount: 23,
    usageLimit: 50,
    expiryDate: "2024-02-28",
  },
  {
    id: 3,
    code: "WELCOME10",
    description: "10% off for new customers",
    discount: 10,
    type: "percentage",
    status: "expired",
    usageCount: 156,
    usageLimit: 200,
    expiryDate: "2024-01-31",
  },
];

interface CouponTableProps {
  searchTerm: string;
  onEditCoupon: (coupon: any) => void;
}

export const CouponTable: React.FC<CouponTableProps> = ({
  searchTerm,
  onEditCoupon,
}) => {
  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case "disabled":
        return <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDiscount = (discount: number, type: string) => {
    return type === "percentage" ? `${discount}%` : `₹${discount}`;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                      {coupon.code}
                    </code>
                  </div>
                </TableCell>
                <TableCell>{coupon.description}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {formatDiscount(coupon.discount, coupon.type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {coupon.usageCount}/{coupon.usageLimit}
                </TableCell>
                <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                <TableCell>{coupon.expiryDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditCoupon(coupon)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                    >
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
