import { Smartphone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">SecondLife Mart</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted marketplace for quality new and pre-owned products. 
              Find amazing deals on electronics, clothing, home appliances, and more.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#track" className="text-muted-foreground hover:text-primary transition-colors">Track Order</a></li>
              <li><Link to="/return-policy" className="text-muted-foreground hover:text-primary transition-colors">Return Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Electronics</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Clothing & Fashion</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Home Appliances</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Books & Media</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Accessories</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">+254 711471130</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">info@secondlifemart.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-muted-foreground">
                  Nairobi, Kenya<br />
                  Mon-Sat: 8AM-6PM
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © Samuel Theuri 2025. All rights reserved.
            </p>
            <div className="text-sm text-muted-foreground">
              <span>M-Pesa Send money: </span>
              <span className="font-mono font-medium text-primary">0110299083</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}