import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Package, User, Lock } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/hooks/use-toast.js';
import pb from '@/lib/pocketbaseClient.js';

const UserAccountPage = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      
      try {
        const records = await pb.collection('orders').getList(1, 50, {
          filter: `customer_id = "${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setOrders(records.items);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Password change coming soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <>
      <Helmet>
        <title>My Account - FashionHub</title>
        <meta name="description" content="Manage your FashionHub account, view orders, and update your profile" />
      </Helmet>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Account</h1>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="bg-white p-1 rounded-lg shadow">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Orders</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 font-medium">Name</Label>
                    <p className="text-lg text-gray-900 mt-1">{currentUser?.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">Email</Label>
                    <p className="text-lg text-gray-900 mt-1">{currentUser?.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">Member Since</Label>
                    <p className="text-lg text-gray-900 mt-1">
                      {new Date(currentUser?.created).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                
                {loadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">No orders yet</p>
                    <p className="text-gray-500 mt-2">Start shopping to see your orders here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              ${order.total_price.toFixed(2)}
                            </p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
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
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                
                <form onSubmit={handlePasswordChange} className="space-y-6 mb-8">
                  <div>
                    <Label htmlFor="currentPassword" className="text-gray-700 font-medium">
                      Current Password
                    </Label>
                    <input
                      id="currentPassword"
                      type="password"
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                      New Password
                    </Label>
                    <input
                      id="newPassword"
                      type="password"
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                      Confirm New Password
                    </Label>
                    <input
                      id="confirmPassword"
                      type="password"
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
                    />
                  </div>
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                    Change Password
                  </Button>
                </form>

                <div className="border-t pt-6">
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserAccountPage;
