import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-4">
        {/* Image and badges */}
        <div className="relative mb-3">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Condition badge */}
          <Badge 
            variant={product.condition === 'New' ? 'default' : 'secondary'}
            className="absolute top-2 left-2 text-xs"
          >
            {product.condition}
          </Badge>
          
          {/* Discount badge */}
          {discountPercentage > 0 && (
            <Badge 
              variant="destructive"
              className="absolute top-2 right-2 text-xs"
            >
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
            onClick={() => onToggleWishlist?.(product)}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Product info */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm line-clamp-2 h-10">{product.name}</h3>
          
          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-primary">
              KSh {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                KSh {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="text-xs">
            {product.inStock ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          {/* Add to cart button */}
          <Button
            variant="cart"
            size="sm"
            className="w-full mt-3"
            disabled={!product.inStock}
            onClick={() => onAddToCart?.(product)}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}