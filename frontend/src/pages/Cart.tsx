
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Cart = () => {
  const [cartItems] = useState([]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
            <p className="text-gray-600 mb-8">Your cart is currently empty</p>
            <Button className="btn-primary" onClick={() => window.location.href = '/shop'}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {/* Cart implementation will go here */}
        <div className="text-center py-16">
          <p className="text-gray-600">Cart functionality coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
