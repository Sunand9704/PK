import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4">
      <div className="bg-white/90 rounded-xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </p>
        <p className="text-gray-500 mb-8">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-lg bg-black text-white font-semibold text-lg shadow hover:bg-gray-800 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
