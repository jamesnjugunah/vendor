import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useStore, branches } from '@/lib/store';
import { ArrowLeft, Minus, Plus, Trash2, Phone, Loader2, CheckCircle, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import DeliveryAddressInput from '@/components/DeliveryAddressInput';
import { ordersApi, paymentsApi } from '@/lib/api';

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
    setBranch,
    addOrder,
    deliveryAddress,
    setDeliveryAddress,
  } = useStore();

  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'cart' | 'payment' | 'success'>('cart');
  const [mpesaCode, setMpesaCode] = useState('');
  const [isLocationValid, setIsLocationValid] = useState(false);

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

    if (!deliveryAddress || deliveryAddress.trim() === '') {
      toast.error('Please enter your delivery address');
      return;
    }

    // Check if location validation is required (if location-based input was used)
    const hasCoordinates = deliveryAddress.includes('📍 Coordinates:');
    if (hasCoordinates && !isLocationValid) {
      toast.error('Please choose a location within the delivery range or select a closer branch');
      return;
    }

    setIsProcessing(true);
    setPaymentStep('payment');

    try {
      // Create order in backend
      const orderData = {
        branch: selectedBranch,
        delivery_address: deliveryAddress,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      const { order } = await ordersApi.create(orderData);

      // Initiate M-Pesa STK Push
      const { checkoutRequestId, merchantRequestId } = await paymentsApi.initiateSTKPush(
        order.id,
        phoneNumber
      );

      toast.success('Check your phone for M-Pesa prompt');

      // Poll for payment status (check every 3 seconds for up to 60 seconds)
      let attempts = 0;
      const maxAttempts = 20;
      const pollInterval = 3000;

      const checkPaymentStatus = async (): Promise<boolean> => {
        try {
          const response = await paymentsApi.queryTransaction(checkoutRequestId);
          const result = response.result;
          
          if (result.ResultCode === '0') {
            // Payment successful
            setMpesaCode(result.MpesaReceiptNumber || checkoutRequestId);
            return true;
          } else if (result.ResultCode) {
            // Payment failed
            throw new Error(result.ResultDesc || 'Payment failed');
          }
          // Still pending, continue polling
          return false;
        } catch (error) {
          console.error('Payment status check error:', error);
          return false;
        }
      };

      // Poll for status
      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        
        const isComplete = await checkPaymentStatus();
        if (isComplete) {
          // Fetch updated order from backend
          const { order: updatedOrder } = await ordersApi.getById(order.id);
          
          // Add order to local state
          const localOrder = {
            id: updatedOrder.id,
            customerId: updatedOrder.user_id,
            customerName: user!.name,
            branch: updatedOrder.branch,
            deliveryAddress: updatedOrder.delivery_address,
            deliveryLocation: updatedOrder.delivery_location,
            items: cart,
            total: updatedOrder.total,
            status: 'paid' as const,
            mpesaCode: updatedOrder.mpesa_code,
            createdAt: new Date(updatedOrder.created_at),
          };
          
          addOrder(localOrder);
          clearCart();
          setPaymentStep('success');
          return;
        }
        
        attempts++;
      }

      // Timeout - payment still pending
      throw new Error('Payment timeout. Please check your order status in your profile.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process payment');
      setPaymentStep('cart');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center bg-white">
          <CardContent className="pt-8 pb-8">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-6">
              Your order has been placed successfully.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">M-Pesa Confirmation Code</p>
              <p className="text-2xl font-bold font-mono text-gray-900">{mpesaCode}</p>
            </div>
            <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-900 mb-2">Order Details:</p>
              <p className="text-sm text-gray-600 mb-1">Branch: {currentBranch?.name}</p>
              <div className="text-sm text-gray-600 mt-3">
                <p className="font-medium mb-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Delivery Address:
                </p>
                <p className="text-xs bg-white p-2 rounded border whitespace-pre-wrap">
                  {deliveryAddress}
                </p>
              </div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center bg-white">
          <CardContent className="pt-8 pb-8">
            <Loader2 className="h-16 w-16 text-green-600 mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-500 mb-4">
              Please check your phone for the M-Pesa prompt
            </p>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-500">Sending to</p>
              <p className="font-bold text-gray-900">{phoneNumber}</p>
              <p className="text-2xl font-bold text-green-600 mt-2">KES {getCartTotal()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/shop')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart</h1>
        <p className="text-gray-500 mb-8">
          Shopping at {currentBranch?.name}
        </p>

        {cart.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button onClick={() => navigate('/shop')} className="bg-green-600 hover:bg-green-700">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900">Items ({cart.reduce((sum, i) => sum + i.quantity, 0)})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-green-600 font-bold">
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
                        className="h-8 w-8 text-red-500 hover:text-red-600"
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
            <Card className="bg-white rounded-consistent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Phone className="h-5 w-5" />
                  Checkout Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enhanced Delivery Address Input */}
                <DeliveryAddressInput
                  value={deliveryAddress}
                  onChange={setDeliveryAddress}
                  selectedBranch={currentBranch!.id}
                  onValidationChange={setIsLocationValid}
                  onBranchSwitch={(branch) => {
                    setBranch(branch);
                  }}
                />

                <Separator />

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone">M-Pesa Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-white rounded-consistent"
                  />
                  <p className="text-xs text-gray-500">
                    You'll receive an STK push to complete payment
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">KES {getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-green-600">KES {getCartTotal()}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 rounded-consistent transition-smooth"
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
