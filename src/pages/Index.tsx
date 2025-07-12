import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ProductGrid } from '@/components/ProductGrid';
import { ShoppingCart, CartItem } from '@/components/ShoppingCart';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderTracking } from '@/components/OrderTracking';
import { Footer } from '@/components/Footer';
import { Product } from '@/components/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'track'>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = (orderData: any) => {
    // In a real app, this would send the order to your backend
    console.log('Order confirmed:', orderData);
    
    // Clear cart and close modals
    setCartItems([]);
    setIsCheckoutOpen(false);
    
    toast({
      title: "Order confirmed!",
      description: `Order ${orderData.orderId} has been submitted. Track it using your Order ID.`,
    });
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cartTotal > 2000 ? 0 : 200;
  const totalWithDelivery = cartTotal + deliveryFee;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      {/* Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-center space-x-4">
          <Button
            variant={currentView === 'home' ? 'default' : 'outline'}
            onClick={() => setCurrentView('home')}
          >
            Shop Products
          </Button>
          <Button
            variant={currentView === 'track' ? 'default' : 'outline'}
            onClick={() => setCurrentView('track')}
          >
            <Package className="h-4 w-4 mr-2" />
            Track Order
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'home' ? (
        <>
          <HeroSection />
          <CategoryGrid />
          <ProductGrid onAddToCart={addToCart} />
        </>
      ) : (
        <OrderTracking />
      )}

      <Footer />

      {/* Shopping Cart */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        total={totalWithDelivery}
        onConfirmOrder={handleConfirmOrder}
      />
    </div>
  );
};

export default Index;
