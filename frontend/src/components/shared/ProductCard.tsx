
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group cursor-pointer">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden bg-gray-100 aspect-square mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.originalPrice && (
            <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-medium">
              SALE
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-sm">{product.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-sm">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <span>★ {product.rating}</span>
            <span>({product.reviews})</span>
          </div>
        </div>
      </Link>
      
      <Button 
        className="w-full mt-3 btn-secondary"
        onClick={() => console.log('Add to cart:', product.id)}
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductCard;
