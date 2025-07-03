
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroCarousel from '@/components/shared/HeroCarousel';
import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockProducts, categories } from '@/data/products';

const Home = () => {
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our curated collections of premium men's fashion essentials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop/${category.id}`}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-gray-100 mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
              <p className="text-gray-600">
                Handpicked selections from our latest collection
              </p>
            </div>
            <Link to="/shop">
              <Button variant="outline" className="btn-secondary">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">
              Real reviews from satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'David Miller',
                review: 'Outstanding quality and perfect fit. The attention to detail is remarkable.',
                rating: 5
              },
              {
                name: 'James Wilson',
                review: 'Fast shipping and excellent customer service. Will definitely order again.',
                rating: 5
              },
              {
                name: 'Michael Brown',
                review: 'Premium materials and craftsmanship. Worth every penny.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.review}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new collections, 
            exclusive offers, and styling tips.
          </p>
          
          <div className="max-w-md mx-auto flex space-x-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white text-black border-0"
            />
            <Button className="bg-white text-black hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
