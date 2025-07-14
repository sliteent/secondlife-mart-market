import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrderStatus {
  id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  customerName: string;
  items: string[];
  total: number;
  estimatedDelivery: string;
  trackingSteps: {
    step: string;
    status: 'completed' | 'current' | 'pending';
    timestamp?: string;
  }[];
}

export function OrderTrackingSection() {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock order data for demo
  const mockOrderData: OrderStatus = {
    id: 'SLM123456',
    status: 'shipped',
    customerName: 'John Doe',
    items: ['Samsung Galaxy S21', 'Wireless Earbuds', 'Phone Case'],
    total: 85000,
    estimatedDelivery: '2025-07-16',
    trackingSteps: [
      { step: 'Order Placed', status: 'completed', timestamp: '2025-07-14 10:30 AM' },
      { step: 'Order Confirmed', status: 'completed', timestamp: '2025-07-14 11:15 AM' },
      { step: 'Package Shipped', status: 'current', timestamp: '2025-07-14 2:45 PM' },
      { step: 'Out for Delivery', status: 'pending' },
      { step: 'Delivered', status: 'pending' },
    ]
  };

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter a valid order ID');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (orderId.toUpperCase() === 'SLM123456') {
        setOrderData(mockOrderData);
      } else {
        setError('Order not found. Please check your order ID and try again.');
        setOrderData(null);
      }
      setIsLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Track Your Order
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your order ID to get real-time updates on your package delivery status.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Order ID Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Search className="h-5 w-5" />
                Track Your Package
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Enter Order ID (e.g., SLM123456)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button 
                  onClick={handleTrackOrder} 
                  disabled={isLoading}
                  size="lg"
                  className="h-12 px-8"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Track Order
                </Button>
              </div>
              
              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}
              
              <p className="text-sm text-muted-foreground">
                💡 Try demo order ID: <span className="font-mono font-medium">SLM123456</span>
              </p>
            </CardContent>
          </Card>

          {/* Order Results */}
          {orderData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Order Details</CardTitle>
                  <Badge className={getStatusColor(orderData.status)}>
                    {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono font-medium">{orderData.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{orderData.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-medium">KSh {orderData.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium">{orderData.estimatedDelivery}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-semibold mb-3">Items Ordered</h4>
                  <div className="space-y-2">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking Steps */}
                <div>
                  <h4 className="font-semibold mb-4">Tracking Progress</h4>
                  <div className="space-y-4">
                    {orderData.trackingSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${
                          step.status === 'completed' ? 'bg-green-100' :
                          step.status === 'current' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {step.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : step.status === 'current' ? (
                            <Clock className="h-4 w-4 text-blue-600" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            step.status === 'completed' ? 'text-green-600' :
                            step.status === 'current' ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {step.step}
                          </p>
                          {step.timestamp && (
                            <p className="text-sm text-muted-foreground">{step.timestamp}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h5 className="font-medium text-primary">Delivery Information</h5>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your package will be delivered to your specified address. 
                        You'll receive an SMS notification when it's out for delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}