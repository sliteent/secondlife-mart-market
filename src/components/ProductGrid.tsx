import { useState } from 'react';
import { ProductCard, Product } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

// Sample product data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro Max 256GB',
    price: 89000,
    originalPrice: 120000,
    condition: 'Used',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Samsung Galaxy Buds Pro',
    price: 12500,
    originalPrice: 18000,
    condition: 'New',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Nike Air Max 270',
    price: 8500,
    originalPrice: 12000,
    condition: 'Used',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    category: 'Clothing'
  },
  {
    id: '4',
    name: 'MacBook Air M2',
    price: 125000,
    originalPrice: 150000,
    condition: 'Used',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 203,
    inStock: true,
    category: 'Electronics'
  },
  {
    id: '5',
    name: 'Vintage Leather Jacket',
    price: 4500,
    originalPrice: 8000,
    condition: 'Used',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    rating: 4.4,
    reviewCount: 67,
    inStock: false,
    category: 'Clothing'
  },
  {
    id: '6',
    name: 'Canon EOS R5 Camera',
    price: 280000,
    condition: 'New',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 45,
    inStock: true,
    category: 'Electronics'
  },
  {
    id: '7',
    name: 'Coffee Table - Wooden',
    price: 15000,
    originalPrice: 25000,
    condition: 'Used',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    rating: 4.3,
    reviewCount: 23,
    inStock: true,
    category: 'Home Appliances'
  },
  {
    id: '8',
    name: 'Programming Books Set',
    price: 3500,
    originalPrice: 6000,
    condition: 'Used',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 34,
    inStock: true,
    category: 'Books'
  }
];

interface ProductGridProps {
  onAddToCart?: (product: Product) => void;
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [products] = useState(sampleProducts);
  const [sortBy, setSortBy] = useState('featured');
  const [filterCondition, setFilterCondition] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const conditionMatch = filterCondition === 'all' || product.condition.toLowerCase() === filterCondition;
    const categoryMatch = filterCategory === 'all' || product.category.toLowerCase() === filterCategory.toLowerCase();
    return conditionMatch && categoryMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground">
              {sortedProducts.length} products found
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="home appliances">Home</SelectItem>
                <SelectItem value="books">Books</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCondition} onValueChange={setFilterCondition}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Load more button */}
        {sortedProducts.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}