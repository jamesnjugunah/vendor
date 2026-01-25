import { useState } from 'react';
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
  Search,
  PackageX,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SearchBar } from '@/components/SearchBar';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { TableDensityToggle, useTableDensity } from '@/components/TableDensityToggle';

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { density, setDensity, getRowClass, getCellPadding } = useTableDensity();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, orders, inventory } = useStore();

  // Redirect if not admin
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
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header with Search */}
      <header className="border-b bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white font-bold"><img src="/images/logo.png" alt="" className="rounded-full" /></span>
            </div>
            <div>
              <span className="font-bold text-lg">FreshMart Admin</span>
              <p className="text-xs text-gray-400">Management Portal</p>
            </div>
          </div>
          
          {/* Global Search Bar */}
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar 
              placeholder="Search products, orders, branches..." 
              onSearch={setSearchQuery}
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:block text-gray-300">{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800 transition-smooth"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <SearchBar 
            placeholder="Search..." 
            onSearch={setSearchQuery}
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Dashboard' }]} />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Overview Cards - with consistent border radius and hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white rounded-consistent transition-smooth hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">KES {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center transition-smooth group-hover:scale-110">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-consistent transition-smooth hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center transition-smooth">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-consistent transition-smooth hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Branches</p>
                  <p className="text-3xl font-bold text-gray-900">{branches.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center transition-smooth">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-consistent transition-smooth hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Products</p>
                  <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center transition-smooth">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="bg-white">
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
            <Card className="bg-white rounded-consistent">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <TrendingUp className="h-5 w-5" />
                  Sales by Product
                </CardTitle>
                <TableDensityToggle onDensityChange={setDensity} />
              </CardHeader>
              <CardContent>
                {productStats.length > 0 ? (
                  <div className="overflow-x-auto">
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
                          <TableRow 
                            key={product.id}
                            className={`table-row-hover ${getRowClass()}`}
                          >
                            <TableCell className={`font-medium ${getCellPadding()}`}>
                              <div className="flex items-center gap-3">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="h-10 w-10 rounded-consistent object-cover"
                                />
                                {product.name}
                              </div>
                            </TableCell>
                            <TableCell className={`text-right ${getCellPadding()}`}>
                              {product.totalQuantity}
                            </TableCell>
                            <TableCell className={`text-right font-bold ${getCellPadding()}`}>
                              {product.totalAmount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-gray-50 font-bold">
                          <TableCell className={getCellPadding()}>Grand Total</TableCell>
                          <TableCell className={`text-right ${getCellPadding()}`}>
                            {productStats.reduce((sum, p) => sum + p.totalQuantity, 0)}
                          </TableCell>
                          <TableCell className={`text-right text-green-600 ${getCellPadding()}`}>
                            {totalRevenue.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <EmptyState
                    icon={<PackageX size={64} />}
                    title="No Sales Data"
                    description="There are no sales recorded yet. Sales will appear here once customers make purchases."
                  />
                )}
              </CardContent>
            </Card>

            {/* Per-Branch Sales */}
            <Card className="bg-white rounded-consistent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <MapPin className="h-5 w-5" />
                  Sales by Branch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
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
                        <TableRow 
                          key={branch.id}
                          className={`table-row-hover ${getRowClass()}`}
                        >
                          <TableCell className={`font-medium ${getCellPadding()}`}>
                            {branch.name}
                          </TableCell>
                          <TableCell className={`text-gray-600 ${getCellPadding()}`}>
                            {branch.location}
                          </TableCell>
                          <TableCell className={`text-right ${getCellPadding()}`}>
                            {branch.orderCount}
                          </TableCell>
                          <TableCell className={`text-right font-bold ${getCellPadding()}`}>
                            {branch.revenue.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card className="bg-white rounded-consistent">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900">Branch Inventory</CardTitle>
                <Button 
                  onClick={() => navigate('/admin/restock')} 
                  className="bg-green-600 hover:bg-green-700 transition-smooth rounded-consistent"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Restock Branches
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Branch</TableHead>
                        {products.map((p) => (
                          <TableHead key={p.id} className="text-center min-w-[100px]">
                            <div className="flex flex-col items-center gap-1">
                              <img 
                                src={p.image} 
                                alt={p.name}
                                className="h-8 w-8 rounded-consistent object-cover"
                              />
                              <span className="text-xs">{p.name}</span>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.map((inv) => {
                        const branch = branches.find((b) => b.id === inv.branch);
                        return (
                          <TableRow 
                            key={inv.branch}
                            className={`table-row-hover ${getRowClass()}`}
                          >
                            <TableCell className={`font-medium ${getCellPadding()}`}>
                              {branch?.name}
                              {inv.branch === 'nairobi' && (
                                <Badge variant="outline" className="ml-2 rounded-consistent">HQ</Badge>
                              )}
                            </TableCell>
                            {products.map((p) => {
                              const stock = inv.products[p.id] || 0;
                              const statusType = stock === 0 ? 'danger' : stock < 20 ? 'warning' : 'success';
                              return (
                                <TableCell key={p.id} className={`text-center ${getCellPadding()}`}>
                                  <StatusBadge
                                    status={statusType}
                                    label={stock.toString()}
                                    className="rounded-consistent"
                                  />
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-white rounded-consistent">
              <CardHeader>
                <CardTitle className="text-gray-900">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Branch</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Delivery Address</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>M-Pesa Code</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.slice(0, 20).map((order) => (
                          <TableRow 
                            key={order.id}
                            className={`table-row-hover ${getRowClass()}`}
                          >
                            <TableCell className={`font-mono text-xs ${getCellPadding()}`}>
                              #{order.id}
                            </TableCell>
                            <TableCell className={getCellPadding()}>
                              {order.customerName}
                            </TableCell>
                            <TableCell className={getCellPadding()}>
                              {branches.find((b) => b.id === order.branch)?.name}
                            </TableCell>
                            <TableCell className={getCellPadding()}>
                              <div className="max-w-xs truncate">
                                {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                              </div>
                            </TableCell>
                            <TableCell className={getCellPadding()}>
                              <div className="max-w-xs">
                                {order.deliveryAddress ? (
                                  <div className="text-xs text-gray-600 truncate" title={order.deliveryAddress}>
                                    {order.deliveryAddress.split('\n')[0]}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className={`text-right font-bold ${getCellPadding()}`}>
                              KES {order.total}
                            </TableCell>
                            <TableCell className={getCellPadding()}>
                              <StatusBadge
                                status={order.status}
                                label={order.status.toUpperCase()}
                              />
                            </TableCell>
                            <TableCell className={`font-mono text-xs ${getCellPadding()}`}>
                              {order.mpesaCode || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <EmptyState
                    icon={<ShoppingCart size={64} />}
                    title="No Orders Yet"
                    description="Orders will appear here once customers complete their purchases."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
