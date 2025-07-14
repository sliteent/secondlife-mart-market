import { ShoppingCart, Heart, Star, ImageOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  condition: 'New' | 'Used';
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onToggleWishlist }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted);
    onToggleWishlist?.(product);
  };

  return (
    <Card className="group product-card-hover h-full border border-border/50 overflow-hidden">
      <CardContent className="p-0">
        {/* Image and badges */}
        <div className="relative">
          <div className="aspect-square bg-muted rounded-none overflow-hidden">
            {imageError ? (
              <div className="image-fallback w-full h-full">
                <ImageOff className="h-12 w-12" />
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            )}
          </div>
          
          {/* Condition badge */}
          <Badge 
            variant={product.condition === 'New' ? 'default' : 'secondary'}
            className="absolute top-3 left-3 text-xs font-medium"
          >
            {product.condition}
          </Badge>
          
          {/* Discount badge */}
          {discountPercentage > 0 && (
            <Badge 
              variant="destructive"
              className="absolute top-3 right-3 text-xs font-medium"
            >
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-3 right-3 h-9 w-9 bg-background/90 hover:bg-background shadow-md"
            onClick={handleWishlistClick}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
          </Button>
        </div>

        {/* Product info */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 h-10">{product.name}</h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-primary">
              KSh {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                KSh {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock status and Add to cart */}
          <div className="space-y-2">
            <div className="text-xs">
              {product.inStock ? (
                <span className="text-success font-medium">✓ In Stock</span>
              ) : (
                <span className="text-destructive font-medium">✗ Out of Stock</span>
              )}
            </div>

            <Button
              className="w-full h-10 font-medium"
              disabled={!product.inStock}
              onClick={() => onAddToCart?.(product)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}