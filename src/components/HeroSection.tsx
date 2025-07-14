import { Search, ArrowRight, ShoppingBag, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import heroImage from '@/assets/hero-image.jpg';

interface HeroSectionProps {
  onSearchChange?: (query: string) => void;
  onShopNow?: () => void;
}

export function HeroSection({ onSearchChange, onShopNow }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                Quality Guaranteed Products
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Find Quality Products at 
                <span className="text-primary block"> Amazing Prices</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Discover thousands of new and pre-loved items from electronics to fashion. 
                Quality guaranteed, prices that can't be beaten. Your sustainable shopping destination.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={onShopNow}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-lg border-2 hover:bg-primary/5"
              >
                <Search className="mr-2 h-5 w-5" />
                Browse Categories
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Quality Assured</div>
                  <div className="text-sm text-muted-foreground">100% Authentic</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Fast Delivery</div>
                  <div className="text-sm text-muted-foreground">2-3 Days</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Free Returns</div>
                  <div className="text-sm text-muted-foreground">30 Days</div>
                </div>
              </div>
            </div>

          </div>

          {/* Hero image with enhanced design */}
          <div className="relative lg:order-last">
            <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src={heroImage}
                alt="Quality products showcase"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Stats floating cards */}
            <div className="absolute -top-6 -left-6 bg-background/95 backdrop-blur-sm rounded-xl shadow-lg p-4 hidden lg:block border border-border/50">
              <div className="text-2xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            
            <div className="absolute top-1/2 -right-6 bg-background/95 backdrop-blur-sm rounded-xl shadow-lg p-4 hidden lg:block border border-border/50">
              <div className="text-2xl font-bold text-primary">5K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            
            <div className="absolute -bottom-6 left-1/4 bg-background/95 backdrop-blur-sm rounded-xl shadow-lg p-4 hidden lg:block border border-border/50">
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}