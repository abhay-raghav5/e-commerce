import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useToast } from '@/hooks/use-toast.js';

const HomePage = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const records = await pb.collection('products').getList(1, 6, {
          sort: '-reviews_count',
          $autoCancel: false
        });
        setTrendingProducts(records.items);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    };

    fetchTrendingProducts();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "🚧 Newsletter signup coming soon!",
        description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
      });
      setEmail('');
    }
  };

  const categories = [
    {
      name: "Men's Clothing",
      image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600",
      description: "Sophisticated styles for the modern gentleman"
    },
    {
      name: "Women's Clothing",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
      description: "Elegant fashion for every occasion"
    },
    {
      name: "Accessories",
      image: "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=600",
      description: "Complete your look with premium accessories"
    }
  ];

  return (
    <>
      <Helmet>
        <title>FashionHub - Elevate Your Style</title>
        <meta name="description" content="Discover premium fashion collections. Shop the latest trends in men's and women's clothing and accessories." />
      </Helmet>
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1583530738247-444ce8342b9a)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              Elevate Your Style
            </h1>
            <p className="text-2xl md:text-3xl text-gray-200 mb-12 font-light">
              Discover Premium Fashion Collections
            </p>
            <Link to="/shop">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-8 text-xl font-semibold rounded-xl shadow-2xl hover:shadow-amber-500/50 transition-all transform hover:scale-105">
                Shop Now
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Collections
            </h2>
            <p className="text-xl text-gray-600">
              Explore our curated selection of premium fashion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/shop?category=${encodeURIComponent(category.name)}`}>
                  <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                      <p className="text-gray-200 mb-4">{category.description}</p>
                      <div className="flex items-center text-amber-400 font-semibold">
                        <span>Explore Collection</span>
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-8 h-8 text-amber-600" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Trending Now
              </h2>
            </div>
            <p className="text-xl text-gray-600">
              Most popular items this season
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg font-semibold rounded-xl">
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-amber-600 to-amber-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Stay in Style
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Subscribe to our newsletter for exclusive offers and style tips
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-amber-300"
            />
            <Button
              type="submit"
              className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
