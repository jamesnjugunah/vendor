import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useStore, branches } from '@/lib/store';
import { ArrowLeft, User, Mail, Phone, MapPin, ShoppingBag, Save, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, logout, orders, selectedBranch } = useStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const userOrders = orders.filter(o => o.customerId === user.id);
  const currentBranch = branches.find(b => b.id === selectedBranch);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    
    updateProfile({ name, email, phone });
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleSignOut = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/shop')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleSignOut}
            className="rounded-consistent"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-20 w-20 rounded-full bg-green-600 flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user.name}</p>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user.email}</p>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user.phone || 'Not provided'}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setName(user.name);
                    setEmail(user.email);
                    setPhone(user.phone);
                    setIsEditing(false);
                  }}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preferred Branch */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Preferred Branch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{currentBranch?.name}</p>
                  <p className="text-sm text-gray-500">{currentBranch?.location}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/shop')}>
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order History
              </CardTitle>
              <CardDescription>Your recent purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {userOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No orders yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/shop')}
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-gray-50">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {branches.find(b => b.id === order.branch)?.name} • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">KES {order.total}</p>
                          <p className="text-xs text-gray-500 font-mono">{order.mpesaCode}</p>
                        </div>
                      </div>
                      {order.deliveryAddress && (
                        <div className="px-4 py-3 bg-white border-t">
                          <p className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            Delivery Address:
                          </p>
                          <p className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 p-2 rounded">
                            {order.deliveryAddress}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
