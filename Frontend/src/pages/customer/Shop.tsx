import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import logo from '../../assets/images/logo.png'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore, products, branches, Branch, productCategories, ProductCategory } from '@/lib/store';
import { ShoppingCart, Plus, Minus, MapPin, LogOut, User, Star, Flame, TrendingUp, Tag, Search, X, Moon, Sun } from 'lucide-react';

const Shop = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
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

  // Theme classes
  const theme = {
    bg: isDark ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50',
    header: isDark ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200',
    card: isDark ? 'bg-gray-800 border-gray-700 hover:border-emerald-500' : 'bg-white border-gray-200 hover:border-emerald-500',
    cardBg: isDark ? 'bg-gray-750' : 'bg-gray-50',
    text: isDark ? 'text-gray-100' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    textSubtle: isDark ? 'text-gray-500' : 'text-gray-500',
    input: isDark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-emerald-500' : 'bg-white border-gray-200 text-gray-900 focus:border-emerald-500',
    button: isDark ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50',
    buttonActive: isDark ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white',
    dropdown: isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100',
    floatingCart: isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    productBg: isDark ? 'bg-gray-700' : 'bg-gray-50',
    quantityBg: isDark ? 'bg-gray-700' : 'bg-gray-100',
    quantityHover: isDark ? 'hover:bg-gray-600' : 'hover:bg-white',
    badgeBg: isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-200',
  };

  // Filter products by search and category
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Get search suggestions
  const searchSuggestions = searchQuery.length >= 2
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSuggestionClick = (productId: string) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const getItemQuantity = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    return item?.quantity || 0;
  };

  const getStock = (productId: string) => {
    return branchInventory?.products[productId] || 0;
  };

  // Generate dynamic product metadata
  const getProductMetadata = (product: { id: string; name: string; price: number; image: string; category: string }, stock: number) => {
    type ProductMetadata = {
      discount: number;
      rating: number;
      reviews: number;
      isNew: boolean;
      isBestSeller: boolean;
      isLowStock: boolean;
    };

    const metadata: ProductMetadata = {
      discount: 0,
      rating: 0,
      reviews: 0,
      isNew: false,
      isBestSeller: false,
      isLowStock: false,
    };

    const discounts = [0, 10, 15, 20, 25, 30];
    metadata.discount = discounts[parseInt(product.id.slice(-1), 16) % discounts.length];
    metadata.rating = 4.0 + (parseInt(product.id.slice(-2), 16) % 11) / 10;
    metadata.reviews = 10 + (parseInt(product.id.slice(-3), 16) % 200);
    metadata.isNew = parseInt(product.id.slice(-1), 16) % 5 === 0;
    metadata.isBestSeller = parseInt(product.id.slice(-1), 16) % 4 === 0;
    metadata.isLowStock = stock > 0 && stock <= 5;

    return metadata;
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return Math.round(price * (1 - discount / 100));
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.bg}`}>
      {/* Header */}
      <header className={`${theme.header} border-b sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <img src={logo} alt="FreshMart" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className={`font-bold text-xl ${theme.text}`}>FreshMart</h1>
                <p className={`text-xs ${theme.textSubtle}`}>Fresh drinks delivered</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                className={`rounded-lg ${isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-600 hover:text-gray-700'}`}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <div className={`hidden md:flex items-center gap-2 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} px-4 py-2 rounded-lg transition-colors duration-300`}>
                <MapPin className={`h-4 w-4 ${theme.textMuted}`} />
                <Select value={selectedBranch} onValueChange={(v) => setBranch(v as Branch)}>
                  <SelectTrigger className={`w-36 border-0 bg-transparent shadow-none ${theme.text}`}>
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

              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/profile')}
                className={`hidden sm:flex items-center gap-2 ${theme.text}`}
              >
                <User className="h-4 w-4" />
                <span className="text-sm">{user?.name}</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/cart')}
                className={`relative rounded-lg ${isDark ? 'border-gray-700 hover:bg-gray-700' : ''}`}
              >
                <ShoppingCart className="h-4 w-4" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-emerald-600 hover:bg-emerald-600">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => { logout(); navigate('/'); }}
                className={theme.text}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>
            Welcome back, {user?.name}! 👋
          </h2>
          <p className={`${theme.textMuted} flex items-center gap-2`}>
            <MapPin className="h-4 w-4" />
            Shopping at <span className="font-semibold">{currentBranch?.name}</span> • {currentBranch?.location}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative" ref={searchRef}>
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${theme.textSubtle}`} />
            <Input
              type="text"
              placeholder="Search for drinks... (e.g., Coca-Cola, Fanta, Water)"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
              className={`pl-12 pr-10 h-14 text-base border-2 rounded-xl shadow-sm transition-colors duration-300 ${theme.input}`}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${theme.textSubtle} hover:${theme.textMuted}`}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className={`absolute top-full mt-2 w-full rounded-xl shadow-2xl border-2 overflow-hidden z-50 max-h-96 overflow-y-auto transition-colors duration-300 ${theme.dropdown}`}>
              {searchSuggestions.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product.id)}
                  className={`w-full flex items-center gap-4 p-4 transition-colors ${isDark ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-100'} border-b last:border-0`}
                >
                  <div className={`w-16 h-16 rounded-lg ${theme.productBg} flex-shrink-0 overflow-hidden`}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold ${theme.text}`}>{product.name}</p>
                    {product.brand && <p className={`text-xs ${theme.textSubtle}`}>{product.brand}</p>}
                    <p className="text-sm font-bold text-emerald-600 mt-1">KES {product.price}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {productCategories.find(c => c.id === product.category)?.name || product.category}
                  </Badge>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {showSuggestions && searchQuery.length >= 2 && searchSuggestions.length === 0 && (
            <div className={`absolute top-full mt-2 w-full rounded-xl shadow-xl border-2 p-6 text-center z-50 transition-colors duration-300 ${theme.dropdown}`}>
              <p className={theme.textSubtle}>No drinks found matching "{searchQuery}"</p>
              <button onClick={() => { setSearchQuery(''); setShowSuggestions(false); }} className="text-sm text-emerald-600 hover:text-emerald-700 mt-2">
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all' ? `${theme.buttonActive} shadow-lg shadow-emerald-600/30` : `${theme.button} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`
              }`}
            >
              All Drinks
            </button>
            {productCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id ? `${theme.buttonActive} shadow-lg shadow-emerald-600/30` : `${theme.button} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredProducts.map((product) => {
            const quantity = getItemQuantity(product.id);
            const stock = getStock(product.id);
            const metadata = getProductMetadata(product, stock);
            const discountedPrice = calculateDiscountedPrice(product.price, metadata.discount);

            return (
              <Card 
                key={product.id} 
                className={`group overflow-hidden border hover:shadow-xl transition-all duration-300 cursor-pointer ${theme.card}`}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className={`relative aspect-square p-4 ${theme.productBg}`}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  
                  <div className="absolute top-3 left-3 right-3 flex flex-col gap-2">
                    {metadata.discount > 0 && (
                      <Badge className="bg-red-500 hover:bg-red-500 text-white font-bold text-xs w-fit shadow-lg">
                        {metadata.discount}% OFF
                      </Badge>
                    )}
                    {metadata.isNew && (
                      <Badge className="bg-blue-500 hover:bg-blue-500 text-white font-bold text-xs w-fit">NEW</Badge>
                    )}
                    {metadata.isBestSeller && (
                      <Badge className="bg-orange-500 hover:bg-orange-500 text-white font-bold text-xs w-fit flex items-center gap-1">
                        <Flame className="h-3 w-3" />Best Seller
                      </Badge>
                    )}
                  </div>

                  <Badge className={`absolute bottom-3 right-3 text-xs font-semibold shadow-sm ${
                    metadata.isLowStock ? 'bg-orange-100 text-orange-700 border border-orange-300' : theme.badgeBg
                  }`}>
                    {stock} left
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <h3 className={`font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem] ${theme.text}`}>
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className={`text-xs font-semibold ${theme.text}`}>{metadata.rating.toFixed(1)}</span>
                    <span className={`text-xs ${theme.textSubtle}`}>({metadata.reviews})</span>
                  </div>

                  <div className="mb-3">
                    {metadata.discount > 0 ? (
                      <div className="flex items-center gap-2">
                        <p className={`text-lg font-bold ${theme.text}`}>KES {discountedPrice}</p>
                        <p className={`text-sm line-through ${theme.textSubtle}`}>KES {product.price}</p>
                      </div>
                    ) : (
                      <p className={`text-lg font-bold ${theme.text}`}>KES {product.price}</p>
                    )}
                  </div>

                  {quantity === 0 ? (
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      disabled={stock === 0}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  ) : (
                    <div className={`flex items-center justify-between rounded-lg p-1.5 ${theme.quantityBg}`} onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className={`h-7 w-7 ${theme.quantityHover}`} onClick={() => updateQuantity(product.id, quantity - 1)}>
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className={`font-bold text-sm ${theme.text}`}>{quantity}</span>
                      <Button variant="ghost" size="icon" className={`h-7 w-7 ${theme.quantityHover}`} onClick={() => updateQuantity(product.id, quantity + 1)} disabled={quantity >= stock}>
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {cart.length > 0 && <div className="h-32"></div>}
      </main>

      {/* Floating Cart */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-6">
          <div className={`rounded-2xl shadow-2xl border p-6 transition-colors duration-300 ${theme.floatingCart}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${theme.textSubtle}`}>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                </p>
                <p className={`text-2xl font-bold ${theme.text}`}>KES {getCartTotal()}</p>
              </div>
              <Button 
                size="lg" 
                onClick={() => navigate('/cart')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all px-8 rounded-xl"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;