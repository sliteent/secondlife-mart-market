import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Terms and Conditions - SecondLife Mart Market</title>
        <meta name="description" content="Read our terms and conditions for using SecondLife Mart Market platform." />
        <meta property="og:title" content="Terms and Conditions - SecondLife Mart Market" />
        <link rel="canonical" href="https://secondlifemartmarket.com/terms" />
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
            <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 18, 2025</p>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using SecondLife Mart Market, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
                <p className="text-muted-foreground mb-4">
                  Permission is granted to temporarily download one copy of the materials on SecondLife Mart Market for personal, non-commercial transitory viewing only.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Product Information</h2>
                <p className="text-muted-foreground">
                  We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
                <p className="text-muted-foreground">
                  We accept various payment methods including M-Pesa. All payments must be completed before order processing. Prices are subject to change without notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Shipping and Delivery</h2>
                <p className="text-muted-foreground">
                  We will make every effort to deliver products within the estimated timeframe. However, delivery times are not guaranteed and may vary due to circumstances beyond our control.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Returns and Refunds</h2>
                <p className="text-muted-foreground">
                  Please refer to our Return & Refund Policy for detailed information about returns, exchanges, and refunds.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. User Accounts</h2>
                <p className="text-muted-foreground">
                  You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Prohibited Uses</h2>
                <p className="text-muted-foreground mb-4">You may not use our service:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Disclaimer</h2>
                <p className="text-muted-foreground">
                  The materials on SecondLife Mart Market are provided on an 'as is' basis. SecondLife Mart Market makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <div className="bg-card p-4 rounded-lg mt-4">
                  <p className="text-muted-foreground">Email: support@secondlifemartmarket.com</p>
                  <p className="text-muted-foreground">Phone: +254 700 000 000</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;