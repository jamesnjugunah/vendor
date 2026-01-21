import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { branches } from '@/lib/store';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full gradient-kenya flex items-center justify-center">
              <span className="text-xl">🛒</span>
            </div>
            <span className="font-bold text-xl text-foreground">FreshMart Kenya</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
            Serving Kenya Since 2010
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your Favorite Drinks,
            <span className="block gradient-kenya bg-clip-text text-transparent">
              Delivered Fresh
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Shop from our 5 branches across Kenya. Coke, Fanta, Sprite – all at KES 50. 
            Pay seamlessly with M-Pesa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
              <Link to="/register">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Start Shopping
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link to="/admin/login">Admin Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Coke', emoji: '🥤', color: 'bg-coke', desc: 'Classic Coca-Cola' },
              { name: 'Fanta', emoji: '🧃', color: 'bg-fanta', desc: 'Orange Fanta' },
              { name: 'Sprite', emoji: '🥤', color: 'bg-sprite', desc: 'Lemon-Lime Sprite' },
            ].map((product) => (
              <Card key={product.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-32 ${product.color} flex items-center justify-center`}>
                  <span className="text-6xl">{product.emoji}</span>
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-3">{product.desc}</p>
                  <p className="text-2xl font-bold text-primary">KES 50</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Our Branches</h2>
          <p className="text-center text-muted-foreground mb-12">Visit any of our 5 locations across Kenya</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {branches.map((branch) => (
              <Card key={branch.id} className="hover:border-primary transition-colors">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold">{branch.name}</h3>
                  <p className="text-sm text-muted-foreground">{branch.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Easy Ordering</h3>
              <p className="text-muted-foreground">Simple checkout with M-Pesa integration</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Multi-Branch</h3>
              <p className="text-muted-foreground">Shop from any of our 5 locations</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Real-time Reports</h3>
              <p className="text-muted-foreground">Track sales across all branches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 FreshMart Kenya. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
