import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HeroCarousel from "@/components/shared/HeroCarousel";
import ProductCard from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

// Fallback static categories in case API is not available
const fallbackCategories = [
  {
    id: "shirts",
    name: "Shirts",
    image:
      "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=600&h=400&fit=crop",
    description: "Premium shirts for every occasion",
  },
  {
    id: "pants",
    name: "Pants",
    image:
      "https://images.unsplash.com/photo-1696889450800-e94ec7a32206?q=80&w=848&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Comfortable and stylish pants",
  },
  {
    id: "accessories",
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=400&fit=crop",
    description: "Complete your look with our accessories",
  },
];
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [productsRes, categoriesRes, reviewsRes] = await Promise.all([
          fetch(`${baseUrl}/api/products`).then((res) => res.json()),
          fetch(`${baseUrl}/api/categories/with-top-products`).then((res) =>
            res.json()
          ),
          fetch(`${baseUrl}/api/reviews/top`).then((res) => res.json()),
        ]);

        setProducts(productsRes.products || []);
        setCategories(categoriesRes.categories || fallbackCategories);
        setReviews(reviewsRes.reviews || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setProducts([]);
        setCategories(fallbackCategories);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const featuredProducts = products.slice(0, 4);
  const cats = categories;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen scroll-smooth">
      {/* Hero Carousel */}
      <HeroCarousel />
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our curated collections of premium men's fashion
              essentials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cats.map((category) => (
              <a
                key={category.id}
                href={`#category-${category.id}`}
                className="group cursor-pointer block"
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
                      <h3 className="text-2xl font-bold mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm opacity-90">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Category Feature Sections */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid gap-16">
          {cats.map((category) => {
            // Filter products for this category and sort by soldCount (highest first)
            const categoryProducts = products
              .filter((product) => product.category === category.id)
              .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
              .slice(0, 4);
            return (
              <div
                key={category.id}
                id={`category-${category.id}`}
                className="p-0 scroll-mt-24 min-h-screen flex flex-col justify-center"
              >
                <h2 className="text-3xl font-bold mb-6 text-center">
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
                  {categoryProducts.map((product, idx) => (
                    <div
                      key={product._id}
                      className={
                        idx > 1
                          ? "hidden md:block" // Only show 3rd/4th on md+
                          : "block"
                      }
                    >
                      <ProductCard product={product} pId={product._id} />
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <Link to={`/products?category=${category.id}`}>
                    <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg">
                      Shop All
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      {/* <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Products
              </h2>
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
              <ProductCard
                key={product._id}
                product={product}
                pId={product._id}
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600">
              Real reviews from satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500">
                No reviews yet.
              </div>
            ) : (
              reviews.map((testimonial, index) => (
                <div
                  key={testimonial._id || index}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.review}"</p>
                  <p className="font-semibold">{testimonial.userName}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new
            collections, exclusive offers, and styling tips.
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
      </section> */}
    </div>
  );
};

export default Home;
