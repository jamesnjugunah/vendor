import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useStore, products, branches, Branch, productCategories, ProductCategory } from '@/lib/store';
import { ShoppingCart, Plus, Minus, MapPin, LogOut, User } from 'lucide-react';

const Shop = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
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

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-lg hidden sm:block text-gray-900">FreshMart</span>
          </div>

          {/* Branch Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <Select value={selectedBranch} onValueChange={(v) => setBranch(v as Branch)}>
              <SelectTrigger className="w-40 bg-white">
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/profile')}
              className="hidden sm:flex items-center gap-2 text-gray-600"
            >
              <User className="h-4 w-4" />
              {user?.name}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/cart')} className="relative">
              <ShoppingCart className="h-4 w-4" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-green-600">
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">
            Shopping at <strong>{currentBranch?.name}</strong> • {currentBranch?.location}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            All Drinks
          </Button>
          {productCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={selectedCategory === cat.id ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const quantity = getItemQuantity(product.id);
            const stock = getStock(product.id);

            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all bg-white">
                <div className="relative aspect-square">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-white/90 text-gray-700 text-xs">
                    Stock: {stock}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h3>
                  <p className="text-lg font-bold text-green-600 mb-3">KES {product.price}</p>

                  {quantity === 0 ? (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                      onClick={() => addToCart(product)}
                      disabled={stock === 0}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-bold">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
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
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items in cart
                </p>
                <p className="text-xl font-bold text-gray-900">KES {getCartTotal()}</p>
              </div>
              <Button size="lg" onClick={() => navigate('/cart')} className="bg-green-600 hover:bg-green-700">
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
