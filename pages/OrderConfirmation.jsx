import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle, Package } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import pb from '@/lib/pocketbaseClient.js';

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const record = await pb.collection('orders').getOne(id, { $autoCancel: false });
          setOrder(record);
        } catch (error) {
          console.error('Error fetching order:', error);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmation - FashionHub</title>
        <meta name="description" content="Your order has been confirmed" />
      </Helmet>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for your purchase, {order.customer_name}!
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Package className="w-6 h-6 text-amber-600" />
                <span className="text-lg font-semibold text-gray-900">Order Number</span>
              </div>
              <p className="text-3xl font-bold text-amber-600">{order.id}</p>
            </div>

            <div className="text-left space-y-4 mb-8">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-900">{order.customer_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold text-gray-900">{order.customer_phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold text-gray-900">${order.total_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-amber-600 capitalize">{order.status}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Shipping Address:</h3>
                <p className="text-gray-700">{order.shipping_address}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Items Ordered:</h3>
                <div className="space-y-2">
                  {order.products?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-800">
                📧 A confirmation email has been sent to <strong>{order.customer_email}</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="flex-1">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 py-6 text-lg">
                  Continue Shopping
                </Button>
              </Link>
              <Link to="/account" className="flex-1">
                <Button variant="outline" className="w-full py-6 text-lg">
                  View Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
