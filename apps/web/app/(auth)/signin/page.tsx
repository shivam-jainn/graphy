import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import AuthButtons from "@/components/AuthButton";

export default function SignIn() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Choose your preferred sign in method
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <AuthButtons />
      </CardContent>
    </Card>
  );
}