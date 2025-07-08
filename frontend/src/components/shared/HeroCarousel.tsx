import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActiveSlides, HeroCarouselSlide } from "@/lib/heroCarouselApi";

// Add custom CSS for object-inherit
const customStyles = `
  @media (min-width: 768px) {
    .md\\:object-inherit {
      object-fit: inherit !important;
    }
  }
`;

// Inject the styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}

const HeroCarousel = () => {
  const [slides, setSlides] = useState<HeroCarouselSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const data = await getActiveSlides();
        setSlides(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching hero carousel slides:", err);
        setError("Failed to load carousel slides");
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="relative h-[70vh] overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading carousel...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="relative h-[70vh] overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Show empty state
  if (slides.length === 0) {
    return (
      <div className="relative h-[70vh] overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">No slides available</div>
      </div>
    );
  }

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-transform duration-3000 ease-in-out ${
            index === currentSlide
              ? "translate-x-0"
              : index < currentSlide
                ? "-translate-x-full"
                : "translate-x-full"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover md:object-contain"
            style={{
              objectFit: window.innerWidth >= 768 ? "inherit" : "cover",
            }}
          />

          {/* Custom Content Overlay for first slide */}
          {slide.customContent && (
            <div className="absolute inset-0 flex items-end justify-center pb-8">
              <div className="bg-gradient-to-r from-purple-600/80 via-blue-600/80 to-indigo-600/80 backdrop-blur-sm rounded-xl p-4 mx-4 max-w-xs md:max-w-lg text-center shadow-xl border border-white/20">
                <h2 className="text-lg md:text-3xl font-bold text-white mb-2 tracking-wide">
                  {slide.customContent}
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
