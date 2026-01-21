import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useStore, branches } from '@/lib/store';
import { ArrowLeft, Minus, Plus, Trash2, Phone, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    selectedBranch,
    addOrder,
  } = useStore();

  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'cart' | 'payment' | 'success'>('cart');
  const [mpesaCode, setMpesaCode] = useState('');

  const currentBranch = branches.find((b) => b.id === selectedBranch);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid M-Pesa phone number');
      return;
    }

    setIsProcessing(true);
    setPaymentStep('payment');

    // Simulate M-Pesa STK Push
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate mock M-Pesa confirmation code
    const code = 'QK' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setMpesaCode(code);

    // Create order
    const order = {
      id: Date.now().toString(),
      customerId: user!.id,
      customerName: user!.name,
      branch: selectedBranch,
      items: cart,
      total: getCartTotal(),
      status: 'paid' as const,
      mpesaCode: code,
      createdAt: new Date(),
    };

    addOrder(order);
    clearCart();
    setPaymentStep('success');
    setIsProcessing(false);
  };

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center animate-fade-in">
          <CardContent className="pt-8 pb-8">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your order has been placed successfully.
            </p>
            <div className="bg-secondary rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">M-Pesa Confirmation Code</p>
              <p className="text-2xl font-bold font-mono">{mpesaCode}</p>
            </div>
            <div className="text-left bg-muted rounded-lg p-4 mb-6">
              <p className="text-sm font-medium mb-2">Order Details:</p>
              <p className="text-sm text-muted-foreground">Branch: {currentBranch?.name}</p>
              <p className="text-sm text-muted-foreground">Total: KES {getCartTotal()}</p>
            </div>
            <Button className="w-full" onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'payment') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
            <p className="text-muted-foreground mb-4">
              Please check your phone for the M-Pesa prompt
            </p>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Sending to</p>
              <p className="font-bold">{phoneNumber}</p>
              <p className="text-2xl font-bold text-primary mt-2">KES {getCartTotal()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/shop')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
        <p className="text-muted-foreground mb-8">
          Shopping at {currentBranch?.name}
        </p>

        {cart.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items ({cart.reduce((sum, i) => sum + i.quantity, 0)})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center text-3xl">
                      {item.product.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-primary font-bold">
                        KES {item.product.price * item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  M-Pesa Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">M-Pesa Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    You'll receive an STK push to complete payment
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>KES {getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">KES {getCartTotal()}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  Pay with M-Pesa
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
