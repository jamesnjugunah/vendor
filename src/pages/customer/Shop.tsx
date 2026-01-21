import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore, products, branches, Branch } from '@/lib/store';
import { ShoppingCart, Plus, Minus, MapPin, LogOut, User } from 'lucide-react';

const Shop = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    logout,
    selectedBranch,
    setBranch,
    cart,
    addToCart,
    updateQuantity,
    getCartTotal,
    inventory,
  } = useStore();

  const currentBranch = branches.find((b) => b.id === selectedBranch);
  const branchInventory = inventory.find((i) => i.branch === selectedBranch);

  const getItemQuantity = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    return item?.quantity || 0;
  };

  const getStock = (productId: string) => {
    return branchInventory?.products[productId] || 0;
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full gradient-kenya flex items-center justify-center">
              <span className="text-xl">🛒</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">FreshMart</span>
          </div>

          {/* Branch Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedBranch} onValueChange={(v) => setBranch(v as Branch)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* User & Cart */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              {user?.name}
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/cart')} className="relative">
              <ShoppingCart className="h-4 w-4" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Branch Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground">
            Shopping at <strong>{currentBranch?.name}</strong> • {currentBranch?.location}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => {
            const quantity = getItemQuantity(product.id);
            const stock = getStock(product.id);
            const colorClass =
              product.id === 'coke'
                ? 'bg-coke'
                : product.id === 'fanta'
                ? 'bg-fanta'
                : 'bg-sprite';

            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all">
                <div className={`h-40 ${colorClass} flex items-center justify-center relative`}>
                  <span className="text-7xl">{product.image}</span>
                  <Badge className="absolute top-3 right-3 bg-card text-card-foreground">
                    Stock: {stock}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl">{product.name}</h3>
                      <p className="text-2xl font-bold text-primary">KES {product.price}</p>
                    </div>
                  </div>

                  {quantity === 0 ? (
                    <Button
                      className="w-full"
                      onClick={() => addToCart(product)}
                      disabled={stock === 0}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="flex items-center justify-between bg-secondary rounded-lg p-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-bold text-lg">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items in cart
                </p>
                <p className="text-2xl font-bold">KES {getCartTotal()}</p>
              </div>
              <Button size="lg" onClick={() => navigate('/cart')}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                View Cart & Pay
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
