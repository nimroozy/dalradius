import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const success = await login(email, password);
      
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error("Login error:", err);
    }
  };

  // Demo account information
  const demoAccounts = [
    { role: "Admin", email: "admin@isphome.com" },
    { role: "Sales", email: "sales@isphome.com" },
    { role: "Tech Manager", email: "tech@isphome.com" },
    { role: "Technician", email: "technician@isphome.com" },
    { role: "Finance", email: "finance@isphome.com" }
  ];

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Haroon Net Admin</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Business Management System
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Logging in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
              
              <div className="pt-4 w-full">
                <p className="text-center text-sm text-muted-foreground mb-2">
                  Demo Accounts (Password: "password")
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {demoAccounts.map((account) => (
                    <Button
                      key={account.email}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoLogin(account.email)}
                      className="text-xs"
                    >
                      {account.role}
                    </Button>
                  ))}
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}