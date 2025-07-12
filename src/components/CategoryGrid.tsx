import { Smartphone, Shirt, Home, BookOpen, Laptop, Watch } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    name: 'Electronics',
    icon: Smartphone,
    itemCount: '2,400+ items',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    name: 'Clothing',
    icon: Shirt,
    itemCount: '1,800+ items',
    color: 'text-pink-600 bg-pink-100'
  },
  {
    name: 'Home Appliances',
    icon: Home,
    itemCount: '950+ items',
    color: 'text-green-600 bg-green-100'
  },
  {
    name: 'Books',
    icon: BookOpen,
    itemCount: '1,200+ items',
    color: 'text-purple-600 bg-purple-100'
  },
  {
    name: 'Computers',
    icon: Laptop,
    itemCount: '650+ items',
    color: 'text-gray-600 bg-gray-100'
  },
  {
    name: 'Accessories',
    icon: Watch,
    itemCount: '2,100+ items',
    color: 'text-orange-600 bg-orange-100'
  }
];

export function CategoryGrid() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-md transition-shadow cursor-pointer group"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.itemCount}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}