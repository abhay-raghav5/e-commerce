import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Star, ShoppingCart, ExternalLink, Plus, Minus } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ReviewSection from '@/components/ReviewSection.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useCart } from '@/contexts/CartContext.jsx';
import { useToast } from '@/hooks/use-toast.js';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const record = await pb.collection('products').getOne(id, { $autoCancel: false });
        setProduct(record);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Added to cart!",
        description: `${quantity} × ${product.name} added to your cart.`
      });
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
            <Link to="/shop">
              <Button className="bg-amber-600 hover:bg-amber-700">Back to Shop</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage] 
    ? pb.files.getUrl(product, images[selectedImage])
    : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800';

  return (
    <>
      <Helmet>
        <title>{`${product.name} - FashionHub`}</title>
        <meta name="description" content={product.description || `Shop ${product.name} at FashionHub`} />
      </Helmet>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-amber-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={pb.files.getUrl(product, img)}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold mb-4">
                {product.category}
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= (product.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating?.toFixed(1) || '4.5'} ({product.reviews_count || 0} reviews)
                </span>
              </div>

              <p className="text-5xl font-bold text-gray-900 mb-6">${product.price}</p>

              <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Availability:</p>
                {product.stock > 0 ? (
                  <p className="text-green-600 font-semibold">
                    In Stock ({product.stock} available)
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-5 h-5 text-gray-700" />
                  </button>
                  <span className="px-6 py-3 font-semibold text-gray-900 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg font-semibold disabled:bg-gray-300"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {product.affiliate_link && (
                <a
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full py-6 text-lg font-semibold">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View on Amazon
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <ReviewSection productId={product.id} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
