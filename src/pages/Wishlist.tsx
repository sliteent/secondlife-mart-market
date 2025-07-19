import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

export default function Wishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { products } = useProducts();
  const { toast } = useToast();

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistIds(wishlist);
  }, []);

  const wishlistProducts = products.filter(product => wishlistIds.includes(product.id));

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlistIds.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setWishlistIds(newWishlist);
    toast({
      title: "Removed from wishlist",
      description: "Item removed from your wishlist",
    });
  };

  const clearWishlist = () => {
    localStorage.removeItem('wishlist');
    setWishlistIds([]);
    toast({
      title: "Wishlist cleared",
      description: "All items removed from your wishlist",
    });
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Start adding items to your wishlist by clicking the heart icon on products
          </p>
          <Button asChild>
            <a href="/">Browse Products</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <Button variant="outline" onClick={clearWishlist}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted mb-4">
                <img
                  src={product.images[0] || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background text-red-500"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">KSh {product.price.toLocaleString()}</span>
                  <Badge variant={product.condition === 'new' ? 'default' : 'secondary'}>
                    {product.condition === 'new' ? 'New' : 'Used'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>
            </CardContent>
            <div className="p-4 pt-0">
              <Button className="w-full">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}