import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Key, Code, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function ApiDocs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: "key" | "code") => {
    navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    }
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const codeExamples = {
    placeOrder: `// Place an order
const response = await fetch('https://reelboost.app/api/reseller/order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    serviceId: 'service-uuid',
    targetLink: 'https://instagram.com/p/...',
    quantity: 1000
  })
});

const data = await response.json();
console.log(data);`,
    
    checkStatus: `// Check order status
const response = await fetch('https://reelboost.app/api/reseller/order/{orderId}', {
  method: 'GET',
  headers: {
    'X-API-Key': 'YOUR_API_KEY'
  }
});

const order = await response.json();
console.log(order.status);`,

    getServices: `// Get available services
const response = await fetch('https://reelboost.app/api/reseller/services', {
  method: 'GET',
  headers: {
    'X-API-Key': 'YOUR_API_KEY'
  }
});

const services = await response.json();
console.log(services);`,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">API Documentation</h1>
        <p className="text-muted-foreground mt-1">
          Integrate ReelBoost services into your application
        </p>
      </div>

      {/* API Key Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Your API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 p-3 rounded-md bg-muted font-mono text-sm break-all">
              {user?.apiKey || "No API key generated"}
            </div>
            <Button
              onClick={() => user?.apiKey && copyToClipboard(user.apiKey, "key")}
              variant="outline"
              className="flex-shrink-0"
              disabled={!user?.apiKey}
              data-testid="button-copy-api-key"
            >
              {copiedKey ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant={user?.apiKeyEnabled === 1 ? "outline" : "secondary"}>
              {user?.apiKeyEnabled === 1 ? "Active" : "Disabled"}
            </Badge>
          </div>
          {user?.resellerMarkup && parseFloat(user.resellerMarkup) > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Your Markup:</span>
              <Badge variant="outline">{parseFloat(user.resellerMarkup).toFixed(0)}%</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Documentation Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <BookOpen className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="endpoints">
            <Code className="h-4 w-4 mr-2" />
            Endpoints
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  All API requests must include your API key in the header:
                </p>
                <div className="mt-2 p-3 rounded-md bg-muted font-mono text-sm">
                  X-API-Key: YOUR_API_KEY
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Base URL</h3>
                <div className="p-3 rounded-md bg-muted font-mono text-sm">
                  https://reelboost.app/api/reseller
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Response Format</h3>
                <p className="text-sm text-muted-foreground">
                  All responses are in JSON format with the following structure:
                </p>
                <pre className="mt-2 p-3 rounded-md bg-muted text-sm overflow-x-auto">
{`{
  "success": true,
  "data": { ... },
  "message": "Success message"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          {/* Place Order */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>POST /reseller/order</CardTitle>
                <Badge>Place Order</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create a new order for a service
              </p>
              <div>
                <h4 className="text-sm font-medium mb-2">Request Body</h4>
                <pre className="p-3 rounded-md bg-muted text-sm overflow-x-auto">
{`{
  "serviceId": "string (UUID)",
  "targetLink": "string (URL)",
  "quantity": "number"
}`}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Example</h4>
                <div className="relative">
                  <pre className="p-3 rounded-md bg-muted text-sm overflow-x-auto">
                    {codeExamples.placeOrder}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(codeExamples.placeOrder, "code")}
                  >
                    {copiedCode === codeExamples.placeOrder ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Check Order Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>GET /reseller/order/:orderId</CardTitle>
                <Badge variant="secondary">Check Status</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Get the status of an existing order
              </p>
              <div>
                <h4 className="text-sm font-medium mb-2">Example</h4>
                <div className="relative">
                  <pre className="p-3 rounded-md bg-muted text-sm overflow-x-auto">
                    {codeExamples.checkStatus}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(codeExamples.checkStatus, "code")}
                  >
                    {copiedCode === codeExamples.checkStatus ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Get Services */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>GET /reseller/services</CardTitle>
                <Badge variant="outline">Get Services</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Get list of all available services with pricing
              </p>
              <div>
                <h4 className="text-sm font-medium mb-2">Example</h4>
                <div className="relative">
                  <pre className="p-3 rounded-md bg-muted text-sm overflow-x-auto">
                    {codeExamples.getServices}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(codeExamples.getServices, "code")}
                  >
                    {copiedCode === codeExamples.getServices ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
