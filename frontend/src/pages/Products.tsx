import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductCard from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Products = () => {
  const location = useLocation();
  const { id } = useParams();
  function getCategoryFromQuery() {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "all";
  }
  const [selectedCategory, setSelectedCategory] = useState(
    getCategoryFromQuery()
  );
  const [sortBy, setSortBy] = useState("name");
  const [products, setProducts] = useState([]);
  // No categories API, use static categories only
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

  useEffect(() => {
    setSelectedCategory(getCategoryFromQuery());
    // eslint-disable-next-line
  }, [location.search]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const productsRes = await fetch(`${baseUrl}/api/products`).then((res) =>
          res.json()
        );
        setProducts(productsRes.products || []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`${baseUrl}/api/products/${id}`);
      // ... handle response
    }
    fetchProduct();
  }, [id]);

  const cats = fallbackCategories;
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-gray-600 text-lg">
            Discover our complete collection of premium men's fashion
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={
                selectedCategory === "all" ? "btn-primary" : "btn-secondary"
              }
            >
              All Products
            </Button>
            {cats.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.id)}
                className={
                  selectedCategory === category.id
                    ? "btn-primary"
                    : "btn-secondary"
                }
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
              {selectedCategory === "all"
                ? "All Products"
                : cats.find((cat) => cat.id === selectedCategory)?.name ||
                  "Products"}
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
        {selectedCategory !== "all" && (
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              {cats.find((cat) => cat.id === selectedCategory)?.description}
            </p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              pId={product._id}
            />
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
