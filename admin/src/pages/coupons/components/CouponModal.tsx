
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon?: any;
}

export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  coupon,
}) => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount: '',
    type: 'percentage',
    usageLimit: '',
    expiryDate: '',
    minOrderAmount: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || '',
        description: coupon.description || '',
        discount: coupon.discount?.toString() || '',
        type: coupon.type || 'percentage',
        usageLimit: coupon.usageLimit?.toString() || '',
        expiryDate: coupon.expiryDate || '',
        minOrderAmount: coupon.minOrderAmount?.toString() || '',
      });
    } else {
      setFormData({
        code: '',
        description: '',
        discount: '',
        type: 'percentage',
        usageLimit: '',
        expiryDate: '',
        minOrderAmount: '',
      });
    }
  }, [coupon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const payload = {
      code: formData.code,
      description: formData.description,
      discountValue: Number(formData.discount),
      discountType: formData.type,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      expiryDate: formData.expiryDate,
      minOrderValue: formData.minOrderAmount ? Number(formData.minOrderAmount) : 0,
      active: true,
    };
    try {
      let res, data;
      if (coupon && coupon._id) {
        res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/admin/coupons/${coupon._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to update coupon');
        toast({ title: 'Coupon updated', description: `${formData.code} has been updated successfully.` });
      } else {
        res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/admin/coupons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to create coupon');
        toast({ title: 'Coupon created', description: `${formData.code} has been created successfully.` });
      }
      onClose();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {coupon ? 'Edit Coupon' : 'Create New Coupon'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="SAVE20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Discount Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">
                Discount Value {formData.type === 'percentage' ? '(%)' : '($)'}
              </Label>
              <Input
                id="discount"
                type="number"
                value={formData.discount}
                onChange={(e) => handleInputChange('discount', e.target.value)}
                placeholder={formData.type === 'percentage' ? '20' : '50'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderAmount">Minimum Order Amount ($)</Label>
              <Input
                id="minOrderAmount"
                type="number"
                step="0.01"
                value={formData.minOrderAmount}
                onChange={(e) => handleInputChange('minOrderAmount', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Coupon description..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {coupon ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
