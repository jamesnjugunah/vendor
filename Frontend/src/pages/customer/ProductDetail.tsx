import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useStore, getProductById, branches } from '@/lib/store';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Package,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, addToCart, cart, selectedBranch, inventory } = useStore();
  const [quantity, setQuantity] = useState(1);

  const product = id ? getProductById(id) : undefined;
  const currentBranch = branches.find((b) => b.id === selectedBranch);
  const branchInventory = inventory.find((i) => i.branch === selectedBranch);
  const stock = product ? branchInventory?.products[product.id] || 0 : 0;

  const cartItem = product ? cart.find(item => item.product.id === product.id) : null;
  const currentCartQuantity = cartItem?.quantity || 0;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (!product) {
      navigate('/shop');
    }
  }, [isAuthenticated, product, navigate]);

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    if (stock <= 0) {
      toast.error('This product is out of stock at your selected branch');
      return;
    }

    if (currentCartQuantity + quantity > stock) {
      toast.error(`Only ${stock} units available at ${currentBranch?.name}`);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity}x ${product.name} to cart`);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    if (currentCartQuantity + quantity < stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Only ${stock} units available`);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sodas':
        return 'bg-blue-500';
      case 'energy':
        return 'bg-red-500';
      case 'juice':
        return 'bg-orange-500';
      case 'water':
        return 'bg-cyan-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/shop')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart ({cart.length})
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Section */}
          <div className="space-y-6">
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <div className="aspect-square flex items-center justify-center p-8 lg:p-12">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Branch & Stock Info */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Availability</span>
                </div>
                <Badge 
                  className={`${
                    stock > 20 
                      ? 'bg-green-600' 
                      : stock > 0 
                      ? 'bg-yellow-600' 
                      : 'bg-red-600'
                  } text-white`}
                >
                  {stock > 0 ? `${stock} in stock` : 'Out of Stock'}
                </Badge>
              </div>
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-sm text-gray-600">
                  Available at <span className="font-medium text-gray-900">{currentBranch?.name}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{currentBranch?.location}</p>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`${getCategoryColor(product.category)} text-white`}>
                  {product.category.toUpperCase()}
                </Badge>
                {product.brand && (
                  <Badge variant="outline">
                    {product.brand}
                  </Badge>
                )}
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                {product.volume && (
                  <p className="text-gray-600">{product.volume}</p>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  KES {product.price}
                </span>
                <span className="text-gray-500">per unit</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  About This Product
                </h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border rounded-lg p-2 bg-white">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="h-9 w-9"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-2xl font-bold w-12 text-center text-gray-900">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={currentCartQuantity + quantity >= stock}
                      className="h-9 w-9"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12"
                    onClick={handleAddToCart}
                    disabled={stock <= 0}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add - KES {product.price * quantity}
                  </Button>
                </div>
                {currentCartQuantity > 0 && (
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-gray-700">
                      {currentCartQuantity} already in your cart
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            {product.ingredients && (
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  Ingredients
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
