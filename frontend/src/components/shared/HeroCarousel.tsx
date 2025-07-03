
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    title: 'New Collection',
    subtitle: 'Premium Men\'s Fashion',
    description: 'Discover our latest collection of premium shirts, pants, and accessories',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop',
    cta: 'Shop Now',
    link: '/shop'
  },
  {
    id: 2,
    title: 'Classic Shirts',
    subtitle: 'Timeless Style',
    description: 'Crafted from the finest materials for unparalleled comfort and style',
    image: 'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=1920&h=800&fit=crop',
    cta: 'View Shirts',
    link: '/shop/shirts'
  },
  {
    id: 3,
    title: 'Modern Fits',
    subtitle: 'Contemporary Design',
    description: 'Perfect fits for the modern gentleman. Elevate your everyday style',
    image: 'https://images.unsplash.com/photo-1506629905607-e7ff3833d066?w=1920&h=800&fit=crop',
    cta: 'Shop Pants',
    link: '/shop/pants'
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="relative h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-2xl px-6">
                <h2 className="text-sm font-medium mb-2 tracking-wider">
                  {slide.subtitle}
                </h2>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg mb-8 opacity-90">
                  {slide.description}
                </p>
                <Button
                  className="btn-primary text-lg px-8 py-3"
                  onClick={() => window.location.href = slide.link}
                >
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
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
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
