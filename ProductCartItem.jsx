import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import pb from '@/lib/pocketbaseClient.js';

const ProductCartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrement = () => {
    onUpdateQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1);
    }
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow border border-gray-200">
      <img
        src={item.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-lg"
      />
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="text-lg font-bold text-amber-600 mt-1">${item.price}</p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          onClick={handleDecrement}
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-12 text-center font-semibold text-gray-900">{item.quantity}</span>
        <Button
          onClick={handleIncrement}
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">${subtotal.toFixed(2)}</p>
      </div>

      <Button
        onClick={() => onRemove(item.productId)}
        variant="ghost"
        size="sm"
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default ProductCartItem;
