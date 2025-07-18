import { Helmet } from "react-helmet-async";
import { ArrowLeft, Clock, Shield, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ReturnPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Return & Refund Policy - SecondLife Mart Market</title>
        <meta name="description" content="Learn about our return and refund policy for SecondLife Mart Market purchases." />
        <meta property="og:title" content="Return & Refund Policy - SecondLife Mart Market" />
        <link rel="canonical" href="https://secondlifemartmarket.com/return-policy" />
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
            <h1 className="text-4xl font-bold mb-8">Return & Refund Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 18, 2025</p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card p-6 rounded-lg text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">7-Day Return</h3>
                <p className="text-muted-foreground text-sm">Return items within 7 days of delivery</p>
              </div>
              <div className="bg-card p-6 rounded-lg text-center">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Quality Guarantee</h3>
                <p className="text-muted-foreground text-sm">Full refund for defective items</p>
              </div>
              <div className="bg-card p-6 rounded-lg text-center">
                <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Easy Process</h3>
                <p className="text-muted-foreground text-sm">Simple return process</p>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Return Eligibility</h2>
                <p className="text-muted-foreground mb-4">You may return items within 7 days of delivery if they meet the following conditions:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Item is in original condition with all original packaging</li>
                  <li>Item has not been damaged due to misuse</li>
                  <li>All accessories and parts are included</li>
                  <li>Item is not on our non-returnable items list</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Non-Returnable Items</h2>
                <p className="text-muted-foreground mb-4">The following items cannot be returned:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Personal care items and hygiene products</li>
                  <li>Perishable goods</li>
                  <li>Custom or personalized items</li>
                  <li>Items marked as "Final Sale"</li>
                  <li>Digital products and downloads</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">How to Return an Item</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h4 className="font-medium">Contact Us</h4>
                      <p className="text-muted-foreground">Email us at returns@secondlifemartmarket.com or call +254 700 000 000</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h4 className="font-medium">Get Return Authorization</h4>
                      <p className="text-muted-foreground">We'll provide you with a return authorization number and instructions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h4 className="font-medium">Package and Send</h4>
                      <p className="text-muted-foreground">Pack the item securely and send it to our return address</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">4</div>
                    <div>
                      <h4 className="font-medium">Receive Refund</h4>
                      <p className="text-muted-foreground">Once we receive and inspect the item, we'll process your refund</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
                <p className="text-muted-foreground mb-4">
                  Refunds will be processed within 5-7 business days after we receive and inspect your returned item. The refund will be issued to your original payment method.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Important Note</h4>
                    <p className="text-yellow-700 text-sm">Return shipping costs are the responsibility of the customer unless the item was defective or incorrectly shipped.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
                <p className="text-muted-foreground">
                  We currently do not offer direct exchanges. If you need a different size or color, please return the original item and place a new order for the desired item.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Damaged or Defective Items</h2>
                <p className="text-muted-foreground mb-4">
                  If you receive a damaged or defective item, please contact us immediately. We will:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide a prepaid return label</li>
                  <li>Expedite the replacement or refund process</li>
                  <li>Cover all return shipping costs</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  For any questions about returns or refunds, please contact us:
                </p>
                <div className="bg-card p-4 rounded-lg">
                  <p className="text-muted-foreground">Email: returns@secondlifemartmarket.com</p>
                  <p className="text-muted-foreground">Phone: +254 700 000 000</p>
                  <p className="text-muted-foreground">Hours: Monday - Friday, 9 AM - 6 PM EAT</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnPolicy;