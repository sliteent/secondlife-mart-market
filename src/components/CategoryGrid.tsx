import { Smartphone, Shirt, Home, BookOpen, Laptop, Watch } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCategories } from '@/hooks/useSupabaseData';

const iconMap: Record<string, any> = {
  'Electronics': Smartphone,
  'Clothing': Shirt,
  'Home Appliances': Home,
  'Books': BookOpen,
  'Sports': Laptop,
  'Beauty': Watch,
};

const colorMap: Record<string, string> = {
  'Electronics': 'text-blue-600 bg-blue-100',
  'Clothing': 'text-pink-600 bg-pink-100',
  'Home Appliances': 'text-green-600 bg-green-100',
  'Books': 'text-purple-600 bg-purple-100',
  'Sports': 'text-gray-600 bg-gray-100',
  'Beauty': 'text-orange-600 bg-orange-100',
};

export function CategoryGrid() {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const IconComponent = iconMap[category.name] || Smartphone;
            const colorClass = colorMap[category.name] || 'text-gray-600 bg-gray-100';
            return (
              <Card 
                key={category.id} 
                className="hover:shadow-md transition-shadow cursor-pointer group"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}