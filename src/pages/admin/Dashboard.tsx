import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore, products, branches } from '@/lib/store';
import {
  LogOut,
  Package,
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  MapPin,
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, orders } = useStore();

  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/admin/login');
    return null;
  }

  // Calculate sales statistics
  const paidOrders = orders.filter((o) => o.status === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = paidOrders.length;

  // Calculate per-product stats
  const productStats = products.map((product) => {
    let totalQuantity = 0;
    let totalAmount = 0;

    paidOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.product.id === product.id) {
          totalQuantity += item.quantity;
          totalAmount += item.quantity * item.product.price;
        }
      });
    });

    return {
      ...product,
      totalQuantity,
      totalAmount,
    };
  });

  // Calculate per-branch stats
  const branchStats = branches.map((branch) => {
    const branchOrders = paidOrders.filter((o) => o.branch === branch.id);
    const revenue = branchOrders.reduce((sum, o) => sum + o.total, 0);
    const orderCount = branchOrders.length;

    return {
      ...branch,
      revenue,
      orderCount,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-sidebar text-sidebar-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center">
              <span className="text-xl">🛒</span>
            </div>
            <div>
              <span className="font-bold text-lg">FreshMart Admin</span>
              <p className="text-xs text-sidebar-foreground/70">Management Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:block">{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-primary">KES {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold">{totalOrders}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Branches</p>
                  <p className="text-3xl font-bold">{branches.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <Package className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sales" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Sales Report
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Sales Report Tab */}
          <TabsContent value="sales" className="space-y-6">
            {/* Per-Product Sales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sales by Product
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Units Sold</TableHead>
                      <TableHead className="text-right">Revenue (KES)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productStats.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{product.image}</span>
                            {product.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{product.totalQuantity}</TableCell>
                        <TableCell className="text-right font-bold">
                          {product.totalAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell>Grand Total</TableCell>
                      <TableCell className="text-right">
                        {productStats.reduce((sum, p) => sum + p.totalQuantity, 0)}
                      </TableCell>
                      <TableCell className="text-right text-primary">
                        {totalRevenue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Per-Branch Sales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Sales by Branch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Branch</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                      <TableHead className="text-right">Revenue (KES)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branchStats.map((branch) => (
                      <TableRow key={branch.id}>
                        <TableCell className="font-medium">{branch.name}</TableCell>
                        <TableCell className="text-muted-foreground">{branch.location}</TableCell>
                        <TableCell className="text-right">{branch.orderCount}</TableCell>
                        <TableCell className="text-right font-bold">
                          {branch.revenue.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Branch Inventory</CardTitle>
                <Button onClick={() => navigate('/admin/restock')}>
                  <Package className="mr-2 h-4 w-4" />
                  Restock Branches
                </Button>
              </CardHeader>
              <CardContent>
                <InventoryTable />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>M-Pesa Code</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 20).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">#{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>
                          {branches.find((b) => b.id === order.branch)?.name}
                        </TableCell>
                        <TableCell>
                          {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          KES {order.total}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={order.status === 'paid' ? 'default' : 'secondary'}
                            className={order.status === 'paid' ? 'bg-primary' : ''}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {order.mpesaCode || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Inventory Table Component
const InventoryTable = () => {
  const { inventory } = useStore();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Branch</TableHead>
          {products.map((p) => (
            <TableHead key={p.id} className="text-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl">{p.image}</span>
                {p.name}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventory.map((inv) => {
          const branch = branches.find((b) => b.id === inv.branch);
          return (
            <TableRow key={inv.branch}>
              <TableCell className="font-medium">
                {branch?.name}
                {inv.branch === 'nairobi' && (
                  <Badge variant="outline" className="ml-2">HQ</Badge>
                )}
              </TableCell>
              {products.map((p) => (
                <TableCell key={p.id} className="text-center">
                  <Badge
                    variant={inv.products[p.id] < 20 ? 'destructive' : 'secondary'}
                  >
                    {inv.products[p.id]}
                  </Badge>
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AdminDashboard;
