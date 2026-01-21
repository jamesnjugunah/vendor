import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ShoppingCart, Users, TrendingUp, Sparkles, Clock, Shield } from 'lucide-react';
import { branches } from '@/lib/store';
import logo from '../assets/images/logo.png';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center shadow-lg animate-[fadeIn_0.6s_ease-out]">
              <span className="text-xl sm:text-2xl"><img src={logo} alt="FreshMart" className="h-full w-full rounded-full" /></span>
            </div>
            <span className="font-bold text-lg sm:text-xl text-foreground">FreshMart Kenya</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" asChild className="text-sm sm:text-base">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-700 shadow-md text-sm sm:text-base">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5 pointer-events-none"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-[slideDown_0.8s_ease-out] shadow-sm">
            <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
            Serving Kenya Since 2010
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-[fadeInUp_1s_ease-out]">
            Your Favorite Drinks,
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-500 to-yellow-500 leading-tight mt-2">
              Delivered Fresh Daily
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-[fadeInUp_1s_ease-out_0.2s_both] leading-relaxed">
            Shop from our 5 branches across Kenya. Coke, Fanta, Sprite – all at KES 50. 
            Pay seamlessly with M-Pesa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-[fadeInUp_1s_ease-out_0.4s_both]">
            <Button size="lg" asChild className="text-base sm:text-lg px-8 py-6 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto">
              <Link to="/register">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Start Shopping
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base sm:text-lg px-8 py-6 border-2 hover:bg-secondary/50 w-full sm:w-auto">
              <Link to="/admin/login">
                <Shield className="mr-2 h-5 w-5" />
                Admin Portal
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto animate-[fadeInUp_1s_ease-out_0.6s_both]">
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground">Branches</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-[fadeInUp_1s_ease-out]">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Our Products</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Premium Beverages</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Fresh, cold, and ready to refresh your day
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Pepsi', image: '/images/coke.jpg', desc: 'Classic Pepsi', color: 'from-blue-500/20 to-blue-600/20' },
              { name: 'Fanta', image: '/images/fanta.jpg', desc: 'Orange Fanta', color: 'from-orange-500/20 to-orange-600/20' },
              { name: 'Sprite', image: '/images/sprite.jpg', desc: 'Lemon-Lime Sprite', color: 'from-green-500/20 to-green-600/20' },
            ].map((product, index) => (
              <Card
                key={product.name}
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm group"
                style={{ animation: `fadeInUp 0.8s ease-out ${0.2 + index * 0.1}s both` }}
              >
                <div className="h-48 sm:h-56 md:h-64 overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-xl sm:text-2xl mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-muted-foreground mb-4">{product.desc}</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">KES 50</p>
                    <span className="text-sm text-muted-foreground line-through">KES 70</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-[fadeInUp_1s_ease-out]">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Locations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Our Branches</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Visit any of our 5 locations across Kenya</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {branches.map((branch, index) => (
              <Card 
                key={branch.id} 
                className="hover:border-primary transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 bg-gradient-to-br from-card to-card/80 group"
                style={{ animation: `fadeInUp 0.6s ease-out ${0.1 + index * 0.1}s both` }}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-primary/10 to-orange-500/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-1">{branch.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{branch.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                icon: ShoppingCart,
                title: 'Easy Ordering',
                desc: 'Simple checkout with M-Pesa integration',
                color: 'from-blue-500/10 to-blue-600/10'
              },
              {
                icon: Clock,
                title: 'Fast Delivery',
                desc: 'Get your drinks delivered within hours',
                color: 'from-green-500/10 to-green-600/10'
              },
              {
                icon: Users,
                title: 'Multi-Branch',
                desc: 'Shop from any of our 5 locations',
                color: 'from-orange-500/10 to-orange-600/10'
              },
              {
                icon: TrendingUp,
                title: 'Real-time Reports',
                desc: 'Track sales across all branches',
                color: 'from-purple-500/10 to-purple-600/10'
              },
              {
                icon: Shield,
                title: 'Secure Payments',
                desc: 'Safe and encrypted M-Pesa transactions',
                color: 'from-red-500/10 to-red-600/10'
              },
              {
                icon: Sparkles,
                title: 'Quality Products',
                desc: 'Only the freshest beverages delivered',
                color: 'from-yellow-500/10 to-yellow-600/10'
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="text-center group"
                style={{ animation: `fadeInUp 0.6s ease-out ${0.2 + index * 0.1}s both` }}
              >
                <div className={`h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-br from-primary via-orange-600 to-yellow-500 border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
            <CardContent className="p-8 sm:p-12 text-center relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-white/90 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers enjoying fresh drinks delivered right to their doorstep
              </p>
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 shadow-xl text-base sm:text-lg px-8 py-6 transform hover:scale-105 transition-all">
                <Link to="/register">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Start Shopping Now
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t bg-card/50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
              <img src={logo} alt="FreshMart" className="h-full w-full rounded-full" />
            </div>
            <span className="font-bold text-lg">FreshMart Kenya</span>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">© 2024 FreshMart Kenya. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;