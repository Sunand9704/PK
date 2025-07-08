import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { SearchResults } from "./SearchResults";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  soldCount: number;
  colors: string[];
  sizes: string[];
}

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/products?search=${encodeURIComponent(term)}&limit=12`
        );
        const data = await response.json();
        setSearchResults(data.products || []);
      } catch (error) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  // Debounce utility function
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    navigate("/products");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.trim().length >= 2);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
    setShowResults(false);
    setSearchResults([]);
  };

  const handleCloseResults = () => {
    setShowResults(false);
  };

  // Determine navbar style based on route
  const isHome = location.pathname === "/";
  const headerClass = "sticky top-0 z-50 w-full border-b bg-black text-white";

  return (
    <>
      <header className={headerClass}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="mt-6 space-y-6">
                    <Link to="/" className="text-2xl font-bold">
                      PK TRENDS
                    </Link>
                    <nav className="space-y-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.href}
                          className="block text-lg font-medium hover:text-gray-600 transition-colors"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>
                    {/* Mobile Auth Buttons */}
                    <div className="flex flex-col gap-2 pt-6">
                      {!isAuthenticated ? (
                        <>
                          <Link to="/signin">
                            <Button
                              variant="outline"
                              className="w-full px-5 py-2 rounded-lg font-semibold border-gray-300 hover:bg-gray-100"
                            >
                              Sign In
                            </Button>
                          </Link>
                          <Link to="/signup">
                            <Button className="w-full px-5 py-2 rounded-lg font-semibold bg-black text-white hover:bg-gray-800">
                              Sign Up
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <Button
                          onClick={logout}
                          variant="outline"
                          className="w-full px-5 py-2 rounded-lg font-semibold border-gray-300 hover:bg-gray-100 text-black"
                        >
                          Logout
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold tracking-wider flex items-center"
            >
              <img
                src="https://res.cloudinary.com/dnbqgzh4t/image/upload/v1750854725/ChatGPT_Image_Jun_24_2025_02_41_19_PM_mds73y.png"
                alt="PK Trends Logo"
                className="h-14 w-auto transition-transform duration-300 hover:scale-105"
              />
              <span className="text-xl font-bold text-white ml-3 tracking-wider hidden md:inline">
                PK TRENDS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium hover:text-gray-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Icons and Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={handleSearchClick}>
                <Search className="h-5 w-5" />
              </Button>

              {/* Profile Icon */}
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/cart")}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
              {/* Auth Buttons */}
              <div className="hidden md:flex items-center space-x-2 ml-4">
                {!isAuthenticated ? (
                  <>
                    <Link to="/signin">
                      <Button
                        variant="outline"
                        className="px-5 py-2 rounded-lg font-semibold border-gray-300 bg-gray-100 text-black"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="px-5 py-2 rounded-lg font-semibold bg-black text-white hover:bg-gray-800">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="px-5 py-2 rounded-lg font-semibold border-gray-300 hover:bg-gray-100 text-black"
                  >
                    Logout
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="border-t bg-black py-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products by name, category, or description..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-white bg-black text-white placeholder-gray-400"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={handleCloseSearch}
                >
                  <X className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search Results Modal */}
      {showResults && (
        <SearchResults
          products={searchResults}
          loading={isSearching}
          searchTerm={searchTerm}
          onClose={handleCloseResults}
        />
      )}
    </>
  );
};

export default Navbar;
