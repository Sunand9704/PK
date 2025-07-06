
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,


interface CouponTableProps {
  searchTerm: string;
  onEditCoupon: (coupon: any) => void;
}

export const CouponTable: React.FC<CouponTableProps> = ({
  searchTerm,
  onEditCoupon,
}) => {
  
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
