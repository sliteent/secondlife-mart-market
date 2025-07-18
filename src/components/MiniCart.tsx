import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MiniCartProps {
  itemCount: number;
  total: number;
  onClick: () => void;
}

export const MiniCart = ({ itemCount, total, onClick }: MiniCartProps) => {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 animate-fade-in">
      <Button
        onClick={onClick}
        className="relative bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-full p-4 h-auto min-w-[120px]"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-background text-foreground"
            >
              {itemCount}
            </Badge>
          </div>
          <div className="text-left">
            <div className="text-xs opacity-90">Cart</div>
            <div className="text-sm font-semibold">KSh {total.toLocaleString()}</div>
          </div>
        </div>
      </Button>
    </div>
  );
};