
import { useState } from 'react';
import ProductCard from '@/components/shared/ProductCard';
import { mockProducts, categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  const filteredProducts = selectedCategory === 'all' 
    ? mockProducts
    : mockProducts.filter(product => product.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-gray-600 text-lg">Discover our complete collection of premium men's fashion</p>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'btn-primary' : 'btn-secondary'}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {selectedCategory === 'all' 
                ? 'All Products' 
                : categories.find(cat => cat.id === selectedCategory)?.name || 'Products'
              }
            </h2>
            <p className="text-gray-600">
              {sortedProducts.length} products found
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Description */}
        {selectedCategory !== 'all' && (
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              {categories.find(cat => cat.id === selectedCategory)?.description}
            </p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" className="btn-secondary">
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Products;
