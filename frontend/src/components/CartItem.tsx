import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    color: string;
    size: string;
  };
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-black mb-2">{item.name}</h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
            <span>Color: <span className="font-medium text-black">{item.color}</span></span>
            <span>Size: <span className="font-medium text-black">{item.size}</span></span>
          </div>
          <div className="text-xl font-bold text-black">
            ${item.price.toFixed(2)}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="h-10 w-10 p-0 hover:bg-gray-100"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-medium text-black">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="h-10 w-10 p-0 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="h-10 w-10 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Item Total */}
        <div className="text-right">
          <div className="text-xl font-bold text-black">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 