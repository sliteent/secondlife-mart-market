import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ProductGrid } from '@/components/ProductGrid';
import { ShoppingCart, CartItem } from '@/components/ShoppingCart';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderTrackingSection } from '@/components/OrderTrackingSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { MiniCart } from '@/components/MiniCart';
import { LegacyProduct } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Package, Settings } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'track' | 'contact' | 'categories'>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const addToCart = (product: LegacyProduct) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        ...product, 
        condition: product.condition === 'new' ? 'New' : 'Used',
        quantity: 1,
        rating: 4.5,
        reviewCount: 0,
        inStock: product.stock > 0
      } as CartItem];
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SecondLife Mart Market",
    "description": "Kenya's premier marketplace for quality pre-owned and new products",
    "url": "https://secondlifemartmarket.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://secondlifemartmarket.com/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SecondLife Mart Market",
      "logo": {
        "@type": "ImageObject",
        "url": "https://secondlifemartmarket.com/src/assets/logo.png"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>SecondLife Mart Market - Quality Pre-owned & New Products in Kenya</title>
        <meta name="description" content="Discover thousands of quality new and pre-loved items from electronics to fashion at SecondLife Mart Market. Quality guaranteed, prices that can't be beaten. Free delivery on orders over KSh 2,000." />
        <meta name="keywords" content="second hand, marketplace, electronics, fashion, quality products, affordable prices, Kenya, Nairobi, online shopping, pre-owned, refurbished" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://secondlifemartmarket.com/" />
        <meta property="og:title" content="SecondLife Mart Market - Quality Pre-owned & New Products" />
        <meta property="og:description" content="Discover thousands of quality new and pre-loved items from electronics to fashion. Quality guaranteed, prices that can't be beaten." />
        <meta property="og:image" content="https://secondlifemartmarket.com/src/assets/hero-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_KE" />
        <meta property="og:site_name" content="SecondLife Mart Market" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://secondlifemartmarket.com/" />
        <meta property="twitter:title" content="SecondLife Mart Market - Quality Pre-owned & New Products" />
        <meta property="twitter:description" content="Discover thousands of quality new and pre-loved items from electronics to fashion. Quality guaranteed, prices that can't be beaten." />
        <meta property="twitter:image" content="https://secondlifemartmarket.com/src/assets/hero-image.jpg" />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://secondlifemartmarket.com/" />
        <meta name="author" content="Samuel Theuri" />
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Nairobi" />
        <meta name="language" content="English" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header 
          cartItemsCount={cartItemsCount}
          onCartClick={() => setIsCartOpen(true)}
          onSearchChange={setSearchQuery}
          onNavigate={setCurrentView}
          currentSection={currentView}
        />

      {/* Main Content */}
      {currentView === 'home' ? (
        <>
          <HeroSection 
            onSearchChange={setSearchQuery}
            onShopNow={() => setCurrentView('categories')}
          />
          <CategoryGrid />
          <ProductGrid onAddToCart={addToCart} searchQuery={searchQuery} />
        </>
      ) : currentView === 'categories' ? (
        <>
          <CategoryGrid />
          <ProductGrid onAddToCart={addToCart} searchQuery={searchQuery} />
        </>
      ) : currentView === 'track' ? (
        <OrderTrackingSection />
      ) : currentView === 'contact' ? (
        <ContactSection />
      ) : null}

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

      {/* Mini Cart */}
      <MiniCart
        itemCount={cartItemsCount}
        total={cartTotal}
        onClick={() => setIsCartOpen(true)}
      />
      </div>
    </>
  );
};

export default Index;
