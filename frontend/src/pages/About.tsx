
const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About PK Trends</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Crafting premium men's fashion with timeless style and exceptional quality since 2024
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                PK Trends was born from a simple belief: every man deserves to feel confident 
                in what he wears. We set out to create a brand that combines timeless style 
                with modern comfort, using only the finest materials and craftsmanship.
              </p>
              <p className="text-gray-600">
                From our carefully curated collection of shirts and pants to our thoughtfully 
                designed accessories, every piece tells a story of quality and attention to detail.
              </p>
            </div>
            <div className="aspect-square bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop"
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-square bg-gray-100 order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=600&h=600&fit=crop"
                alt="Our Mission"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                To redefine men's fashion by creating pieces that seamlessly blend classic 
                sophistication with contemporary comfort. We believe that great style shouldn't 
                compromise on quality or comfort.
              </p>
              <p className="text-gray-600">
                Every garment we create is designed to be a lasting investment in your wardrobe, 
                crafted to maintain its beauty and integrity through years of wear.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-16 py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Quality First</h3>
                <p className="text-gray-600">
                  We source only the finest materials and work with skilled craftsmen 
                  to ensure every piece meets our exacting standards.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Timeless Design</h3>
                <p className="text-gray-600">
                  Our designs transcend trends, focusing on classic silhouettes 
                  and details that will look great for years to come.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Customer Focus</h3>
                <p className="text-gray-600">
                  Your satisfaction is our priority. We're committed to providing 
                  exceptional service and products that exceed expectations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
