import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      price: "$15",
      description: "Perfect for individuals and small projects",
      features: [
        "Basic features",
        "Community support",
        "1 project",
        "Basic analytics"
      ]
    },
    {
      name: "Pro",
      price: "$25",
      description: "Ideal for growing teams and businesses",
      features: [
        "All Basic features",
        "Priority support",
        "5 projects",
        "Advanced analytics",
        "Team collaboration"
      ]
    },
    {
      name: "Organization",
      price: "Custom",
      description: "Custom solutions for large organizations",
      features: [
        "All Pro features",
        "24/7 dedicated support",
        "Unlimited projects",
        "Custom integrations",
        "Enterprise security"
      ]
    }
  ];

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-muted-foreground">Choose the plan that's right for you</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold mb-6">{plan.price}{plan.price !== "Custom" && "/month"}</div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.name === "Organization" ? "secondary" : "default"}>
                {plan.name === "Organization" ? "Contact Sales" : "Get Started"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}