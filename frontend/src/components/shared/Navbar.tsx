import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
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
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wider">
            PK TRENDS
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            {/* Profile Icon */}
            <Link to="/profile">
              <Button
                variant="ghost"
                size="icon"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
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
                    <Button variant="outline" className="px-5 py-2 rounded-lg font-semibold border-gray-300 hover:bg-gray-100">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="px-5 py-2 rounded-lg font-semibold bg-black text-white hover:bg-gray-800">Sign Up</Button>
                  </Link>
                </>
              ) : (
                <Button onClick={logout} variant="outline" className="px-5 py-2 rounded-lg font-semibold border-gray-300 hover:bg-gray-100">Logout</Button>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t bg-white py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
