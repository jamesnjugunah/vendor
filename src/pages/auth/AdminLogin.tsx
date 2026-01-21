import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Shield } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock admin login (in real app, validate admin credentials)
    if (formData.email === 'admin@freshmart.co.ke' && formData.password === 'admin123') {
      login({
        id: 'admin-1',
        name: 'Admin',
        email: formData.email,
        phone: '+254700000000',
        role: 'admin',
      });
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } else {
      toast.error('Invalid admin credentials');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="text-center">
            <div className="h-16 w-16 rounded-full bg-sidebar flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-sidebar-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Portal</CardTitle>
            <CardDescription>Sign in to manage FreshMart</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@freshmart.co.ke"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In as Admin'
                )}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Demo Credentials:</strong><br />
                Email: admin@freshmart.co.ke<br />
                Password: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
