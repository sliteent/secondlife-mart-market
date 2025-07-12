import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrderTracking } from '@/hooks/useSupabaseData';

interface OrderStatus {
  id: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
  estimatedDelivery: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  customerName: string;
  deliveryAddress: string;
}

// Sample order data
const sampleOrders: Record<string, OrderStatus> = {
  'SL123456': {
    id: 'SL123456',
    status: 'Shipped',
    estimatedDelivery: '2024-01-20',
    orderDate: '2024-01-15',
    items: [
      { name: 'iPhone 13 Pro Max 256GB', quantity: 1, price: 89000 },
      { name: 'Samsung Galaxy Buds Pro', quantity: 1, price: 12500 }
    ],
    total: 101500,
    customerName: 'John Doe',
    deliveryAddress: 'Westlands, Nairobi'
  },
  'SL789012': {
    id: 'SL789012',
    status: 'Confirmed',
    estimatedDelivery: '2024-01-18',
    orderDate: '2024-01-14',
    items: [
      { name: 'MacBook Air M2', quantity: 1, price: 125000 }
    ],
    total: 125000,
    customerName: 'Jane Smith',
    deliveryAddress: 'Karen, Nairobi'
  }
};

export function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { order, orderItems, loading, error, trackOrder } = useOrderTracking(orderId, phoneNumber);

  const handleSearch = () => {
    if (!orderId || !phoneNumber) return;
    trackOrder();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Confirmed':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'Shipped':
        return <Truck className="h-5 w-5 text-orange-500" />;
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-orange-100 text-orange-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusSteps = ['pending', 'confirmed', 'shipped', 'delivered'];
  const statusLabels = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your order details to check the status and estimated delivery
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderId">Order ID *</Label>
                <Input
                  id="orderId"
                  placeholder="e.g., SL123456"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="e.g., 0722123456"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              onClick={handleSearch}
              disabled={!orderId || !phoneNumber || loading}
              className="w-full md:w-auto"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Track Order'}
            </Button>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order #{order.order_id}</CardTitle>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label className="text-sm text-muted-foreground">Order Date</Label>
                    <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Estimated Delivery</Label>
                    <p className="font-medium">
                      {order.estimated_delivery_date ? new Date(order.estimated_delivery_date).toLocaleDateString() : 'TBD'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Total Amount</Label>
                    <p className="font-medium">KSh {order.total_amount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    {statusLabels.map((label, index) => (
                      <div key={label} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                            index <= currentStepIndex
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'bg-background border-muted-foreground text-muted-foreground'
                          }`}
                        >
                          {index < currentStepIndex ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        <span className="text-xs mt-2 text-center">{label}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Progress Line */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted -z-10">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{
                        width: currentStepIndex >= 0 ? `${(currentStepIndex / (statusLabels.length - 1)) * 100}%` : '0%'
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">KSh {item.total_price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Customer Name</Label>
                    <p className="font-medium">{order.customer_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Delivery Address</Label>
                    <p className="font-medium">{order.delivery_address}, {order.town}, {order.county}</p>
                  </div>
                  {order.mpesa_transaction_code && (
                    <div>
                      <Label className="text-sm text-muted-foreground">M-Pesa Code</Label>
                      <p className="font-medium">{order.mpesa_transaction_code}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sample Order IDs for testing */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-sm">For Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Try these sample Order IDs: <span className="font-mono font-medium">SL123456</span> or{' '}
              <span className="font-mono font-medium">SL789012</span> with any phone number.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}