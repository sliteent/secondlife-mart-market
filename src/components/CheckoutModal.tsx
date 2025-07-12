import { useState } from 'react';
import { X, CreditCard, Phone, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem } from './ShoppingCart';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onConfirmOrder: (orderData: any) => void;
}

export function CheckoutModal({ isOpen, onClose, items, total, onConfirmOrder }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    county: '',
    town: '',
    address: '',
    mpesaCode: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConfirmOrder = async () => {
    try {
      // Create order in database
      const { createOrder } = await import('@/hooks/useSupabaseData');
      
      const orderDataForDB = {
        customer_name: `${orderData.firstName} ${orderData.lastName}`,
        customer_phone: orderData.phone,
        customer_email: orderData.email,
        delivery_address: orderData.address,
        county: orderData.county,
        town: orderData.town,
        total_amount: total,
        delivery_fee: total > 2000 ? 0 : 200,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        }))
      };

      const result = await createOrder(orderDataForDB);
      
      if (result.success && result.order) {
        // Verify M-Pesa transaction if code provided
        if (orderData.mpesaCode) {
          await fetch(`https://bsqiylycebkxliggotxw.supabase.co/functions/v1/mpesa-payment?action=verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: result.order.order_id,
              transactionCode: orderData.mpesaCode
            })
          });
        }

        const finalOrderData = {
          orderId: result.order.order_id,
          items,
          total,
          customerInfo: orderData,
          mpesaTransactionCode: orderData.mpesaCode,
          paymentMethod: 'mpesa'
        };
        
        onConfirmOrder(finalOrderData);
      } else {
        throw new Error(result.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      // Handle error appropriately - you might want to show a toast or error message
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="fixed inset-4 md:inset-8 bg-background rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Checkout</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 p-4 bg-muted/50">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  step > stepNumber ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={orderData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={orderData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="e.g., 0722123456"
                        value={orderData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={orderData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="county">County *</Label>
                        <Input
                          id="county"
                          placeholder="e.g., Nairobi"
                          value={orderData.county}
                          onChange={(e) => handleInputChange('county', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="town">Town/City *</Label>
                        <Input
                          id="town"
                          placeholder="e.g., Westlands"
                          value={orderData.town}
                          onChange={(e) => handleInputChange('town', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Textarea
                        id="address"
                        placeholder="Building name, floor, apartment/office number, street name..."
                        value={orderData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special delivery instructions..."
                        value={orderData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      M-Pesa Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-2">Payment Instructions:</h3>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-green-700">
                        <li>Go to M-Pesa on your phone</li>
                        <li>Select "Lipa na M-Pesa"</li>
                        <li>Select "Buy Goods and Services"</li>
                        <li>Enter Till Number: <strong>0110299083</strong></li>
                        <li>Enter Amount: <strong>KSh {total.toLocaleString()}</strong></li>
                        <li>Enter your M-Pesa PIN and send</li>
                        <li>Copy the M-Pesa transaction code below</li>
                      </ol>
                    </div>
                    
                    <div>
                      <Label htmlFor="mpesaCode">M-Pesa Transaction Code *</Label>
                      <Input
                        id="mpesaCode"
                        placeholder="e.g., QCJ7I5M9NX"
                        value={orderData.mpesaCode}
                        onChange={(e) => handleInputChange('mpesaCode', e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        You'll receive this code via SMS after successful payment
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Your order will be processed once we verify your M-Pesa payment. 
                        You'll receive confirmation via SMS.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>KSh {(total - (total > 2000 ? 0 : 200)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{total > 2000 ? 'FREE' : 'KSh 200'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>KSh {total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-between">
          <Button variant="outline" onClick={step > 1 ? handleBack : onClose}>
            {step > 1 ? 'Back' : 'Cancel'}
          </Button>
          <Button 
            onClick={step < 3 ? handleNext : handleConfirmOrder}
            disabled={
              (step === 1 && (!orderData.firstName || !orderData.lastName || !orderData.phone)) ||
              (step === 2 && (!orderData.county || !orderData.town || !orderData.address)) ||
              (step === 3 && !orderData.mpesaCode)
            }
          >
            {step < 3 ? 'Next' : 'Confirm Order'}
          </Button>
        </div>
      </div>
    </div>
  );
}