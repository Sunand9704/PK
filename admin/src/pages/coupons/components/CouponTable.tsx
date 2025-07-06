
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

  };

  return (
    <Card>
      <CardContent className="p-0">
        

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
