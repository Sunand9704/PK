export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: "shirts" | "pants" | "accessories";
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  description: string;
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Cotton Shirt",
    price: 79,
    originalPrice: 99,
    category: "shirts",
    image:
      "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1564566350775-0a2c1b3e3763?w=800&h=800&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Navy"],
    description:
      "Crafted from premium 100% cotton, this shirt offers unparalleled comfort and style.",
    features: [
      "100% Premium Cotton",
      "Wrinkle Resistant",
      "Classic Fit",
      "Machine Washable",
    ],
    inStock: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "Slim Fit Chinos",
    price: 89,
    category: "pants",
    image:
      "https://images.unsplash.com/photo-1506629905607-e7ff3833d066?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506629905607-e7ff3833d066?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop",
    ],
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Khaki", "Navy", "Black"],
    description:
      "Modern slim-fit chinos that combine comfort with contemporary style.",
    features: ["Slim Fit", "Stretch Fabric", "Side Pockets", "Versatile Style"],
    inStock: true,
    rating: 4.6,
    reviews: 89,
  },
  {
    id: "3",
    name: "Leather Wallet",
    price: 45,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
    ],
    sizes: ["One Size"],
    colors: ["Black", "Brown"],
    description: "Handcrafted genuine leather wallet with RFID protection.",
    features: [
      "Genuine Leather",
      "RFID Protection",
      "8 Card Slots",
      "Compact Design",
    ],
    inStock: true,
    rating: 4.9,
    reviews: 67,
  },
  {
    id: "4",
    name: "Oxford Dress Shirt",
    price: 95,
    category: "shirts",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=800&h=800&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue"],
    description:
      "Classic Oxford dress shirt perfect for professional settings.",
    features: [
      "Oxford Cotton",
      "Button-Down Collar",
      "Classic Fit",
      "French Seams",
    ],
    inStock: true,
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "5",
    name: "Classic Denim Jeans",
    price: 99,
    originalPrice: 120,
    category: "pants",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=800&fit=crop",
    ],
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Blue", "Black"],
    description:
      "Timeless denim jeans with a comfortable fit and durable fabric.",
    features: [
      "100% Cotton",
      "Classic Fit",
      "Machine Washable",
      "Durable Stitching",
    ],
    inStock: true,
    rating: 4.5,
    reviews: 102,
  },
  {
    id: "6",
    name: "Minimalist Leather Belt",
    price: 35,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&h=800&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Brown", "Black"],
    description: "Elegant minimalist belt crafted from genuine leather.",
    features: [
      "Genuine Leather",
      "Adjustable",
      "Minimalist Buckle",
      "Handcrafted",
    ],
    inStock: true,
    rating: 4.4,
    reviews: 41,
  },
  {
    id: "7",
    name: "Performance Polo Shirt",
    price: 65,
    originalPrice: 80,
    category: "shirts",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&h=800&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Navy", "White"],
    description:
      "Breathable polo shirt designed for all-day comfort and style.",
    features: [
      "Moisture Wicking",
      "Breathable Fabric",
      "Modern Fit",
      "Easy Care",
    ],
    inStock: true,
    rating: 4.3,
    reviews: 58,
  },
  {
    id: "8",
    name: "Canvas Backpack",
    price: 59,
    category: "accessories",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1465101178521-c3a6088edb41?w=800&h=800&fit=crop",
    ],
    sizes: ["One Size"],
    colors: ["Olive", "Black"],
    description:
      "Durable canvas backpack with multiple compartments for daily use.",
    features: [
      "Heavy Duty Canvas",
      "Adjustable Straps",
      "Laptop Sleeve",
      "Water Resistant",
    ],
    inStock: true,
    rating: 4.7,
    reviews: 73,
  },
  {
    id: "9",
    name: "Linen Summer Shirt",
    price: 85,
    category: "shirts",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=800&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beige", "White", "Sky Blue"],
    description: "Lightweight linen shirt perfect for warm weather.",
    features: ["100% Linen", "Breathable", "Relaxed Fit", "Button Closure"],
    inStock: true,
    rating: 4.2,
    reviews: 34,
  },
  {
    id: "10",
    name: "Stretch Jogger Pants",
    price: 75,
    category: "pants",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=800&fit=crop",
    ],
    sizes: ["30", "32", "34", "36"],
    colors: ["Gray", "Black"],
    description:
      "Comfortable jogger pants with stretch fabric for active lifestyles.",
    features: [
      "Stretch Fabric",
      "Elastic Waist",
      "Tapered Leg",
      "Side Pockets",
    ],
    inStock: true,
    rating: 4.6,
    reviews: 61,
  },
];

export const categories = [
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
      "https://images.unsplash.com/photo-1506629905607-e7ff3833d066?w=600&h=400&fit=crop",
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
