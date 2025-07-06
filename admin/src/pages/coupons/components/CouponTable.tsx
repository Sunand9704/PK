
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
        


              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
