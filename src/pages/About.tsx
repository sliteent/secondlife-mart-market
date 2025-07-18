import { Helmet } from "react-helmet-async";
import { ArrowLeft, CheckCircle, Users, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>About Us - SecondLife Mart Market</title>
        <meta name="description" content="Learn about SecondLife Mart Market's mission to provide quality pre-owned and new products at unbeatable prices across Kenya." />
        <meta property="og:title" content="About Us - SecondLife Mart Market" />
        <meta property="og:description" content="Learn about SecondLife Mart Market's mission to provide quality pre-owned and new products at unbeatable prices across Kenya." />
        <link rel="canonical" href="https://secondlifemartmarket.com/about" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">About SecondLife Mart Market</h1>
            
            <div className="prose prose-lg max-w-none">
              <div className="bg-card rounded-lg p-8 shadow-sm mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Heart className="mr-3 h-6 w-6 text-primary" />
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  At SecondLife Mart Market, we believe in giving products a second chance while providing our customers with exceptional value. Our mission is to create a sustainable marketplace where quality pre-owned and new items find their perfect match with customers who appreciate both value and quality.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                    Quality Guaranteed
                  </h3>
                  <p className="text-muted-foreground">
                    Every item in our marketplace is carefully inspected and verified to ensure it meets our high standards of quality and functionality.
                  </p>
                </div>

                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Users className="mr-3 h-5 w-5 text-blue-500" />
                    Community Focused
                  </h3>
                  <p className="text-muted-foreground">
                    We're more than a marketplace - we're a community of conscious consumers making sustainable choices for a better future.
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-lg p-8 shadow-sm mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Shield className="mr-3 h-6 w-6 text-primary" />
                  Why Choose Us?
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Verified Quality:</strong> All products undergo strict quality checks before listing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Secure Payments:</strong> Safe and secure payment options including M-Pesa</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Fast Delivery:</strong> Quick and reliable delivery across Kenya</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Customer Support:</strong> Dedicated support team ready to help</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Sustainability:</strong> Contributing to a circular economy and reducing waste</span>
                  </li>
                </ul>
              </div>

              <div className="text-center bg-primary/5 rounded-lg p-8">
                <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
                <p className="text-muted-foreground mb-6">
                  Ready to discover amazing deals on quality products? Start shopping today and experience the difference.
                </p>
                <Button onClick={() => navigate("/")} size="lg">
                  Start Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;