import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useCart } from '@/contexts/CartContext.jsx';
import { useToast } from '@/hooks/use-toast.js';
import pb from '@/lib/pocketbaseClient.js';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`
    });
  };

  const imageUrl = product.images?.[0] 
    ? pb.files.getUrl(product, product.images[0])
    : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400';

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-1 mb-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-700">{product.rating?.toFixed(1) || '4.5'}</span>
            <span className="text-sm text-gray-500">({product.reviews_count || 0})</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
