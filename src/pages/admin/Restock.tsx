import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStore, products, branches, Branch } from '@/lib/store';
import { ArrowLeft, Package, Truck, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Restock = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, inventory, restockBranch } = useStore();
  const [selectedBranch, setSelectedBranch] = useState<Branch | ''>('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [restockHistory, setRestockHistory] = useState<
    { branch: string; product: string; quantity: number; time: Date }[]
  >([]);

  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/admin/login');
    return null;
  }

  const hqInventory = inventory.find((i) => i.branch === 'nairobi');
  const maxQuantity = selectedProduct ? hqInventory?.products[selectedProduct] || 0 : 0;

  const handleRestock = () => {
    if (!selectedBranch || !selectedProduct || !quantity) {
      toast.error('Please fill in all fields');
      return;
    }

    const qty = parseInt(quantity);
    if (qty <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    if (qty > maxQuantity) {
      toast.error(`Not enough stock at HQ. Available: ${maxQuantity}`);
      return;
    }

    if (selectedBranch === 'nairobi') {
      toast.error('Cannot restock headquarters from itself');
      return;
    }

    restockBranch(selectedBranch, selectedProduct, qty);
    
    const productName = products.find((p) => p.id === selectedProduct)?.name;
    const branchName = branches.find((b) => b.id === selectedBranch)?.name;

    setRestockHistory([
      {
        branch: branchName || '',
        product: productName || '',
        quantity: qty,
        time: new Date(),
      },
      ...restockHistory,
    ]);

    toast.success(`Restocked ${qty} ${productName} to ${branchName}`);
    setQuantity('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Restock Branches</h1>
            <p className="text-muted-foreground">Transfer inventory from Nairobi HQ to branches</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Restock Form */}
          <Card>
            <CardHeader>
              <CardTitle>Transfer Stock</CardTitle>
              <CardDescription>
                Move inventory from headquarters to a branch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Destination Branch</Label>
                <Select
                  value={selectedBranch}
                  onValueChange={(v) => setSelectedBranch(v as Branch)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches
                      .filter((b) => b.id !== 'nairobi')
                      .map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex items-center gap-2">
                          <span>{product.image}</span>
                          {product.name}
                          <Badge variant="secondary" className="ml-2">
                            HQ: {hqInventory?.products[product.id] || 0}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                {selectedProduct && (
                  <p className="text-xs text-muted-foreground">
                    Available at HQ: {maxQuantity} units
                  </p>
                )}
              </div>

              <Button className="w-full" onClick={handleRestock}>
                <Package className="mr-2 h-4 w-4" />
                Transfer Stock
              </Button>
            </CardContent>
          </Card>

          {/* HQ Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Nairobi HQ Inventory</CardTitle>
              <CardDescription>Current stock at headquarters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => {
                  const stock = hqInventory?.products[product.id] || 0;
                  const isLow = stock < 100;

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{product.image}</span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <Badge variant={isLow ? 'destructive' : 'default'}>
                        {stock} units
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Restock History */}
        {restockHistory.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Restocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {restockHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary"
                  >
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.quantity} {item.product} → {item.branch}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.time.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Restock;
