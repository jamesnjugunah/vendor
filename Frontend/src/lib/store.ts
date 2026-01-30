import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clearAuthToken, productsApi, ordersApi } from './api';

// Types
export type Branch = 'nairobi' | 'kisumu' | 'mombasa' | 'nakuru' | 'eldoret';

export type ProductCategory = 'sodas' | 'energy' | 'juice' | 'water';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  description?: string;
  ingredients?: string;
  nutritionalInfo?: {
    servingSize: string;
    calories: number;
    sugar: string;
    sodium: string;
  };
  volume?: string;
  brand?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  branch: Branch;
  deliveryAddress?: string;
  deliveryLocation?: {
    latitude: number;
    longitude: number;
    buildingNumber?: string;
    instructions?: string;
    imageUrl?: string;
  };
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'failed';
  mpesaCode?: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
}

export interface Inventory {
  branch: Branch;
  products: { [productId: string]: number };
}

export const productCategories: { id: ProductCategory; name: string }[] = [
  { id: 'sodas', name: 'Sodas' },
  { id: 'energy', name: 'Energy Drinks' },
  { id: 'juice', name: 'Juices' },
  { id: 'water', name: 'Water & Sports' },
];

export const branches: { id: Branch; name: string; location: string }[] = [
  { id: 'nairobi', name: 'Nairobi HQ', location: 'Central Business District' },
  { id: 'kisumu', name: 'Kisumu Branch', location: 'Oginga Odinga Street' },
  { id: 'mombasa', name: 'Mombasa Branch', location: 'Moi Avenue' },
  { id: 'nakuru', name: 'Nakuru Branch', location: 'Kenyatta Avenue' },
  { id: 'eldoret', name: 'Eldoret Branch', location: 'Uganda Road' },
];

// Initial mock inventory
const createInitialInventory = (products: Product[]): Inventory[] => {
  return branches.map(branch => ({
    branch: branch.id,
    products: products.reduce((acc, product) => {
      acc[product.id] = branch.id === 'nairobi' ? 1000 : 100;
      return acc;
    }, {} as { [key: string]: number }),
  }));
};

// Helper to transform backend order to frontend format
const transformOrder = (backendOrder: any): Order => {
  return {
    id: backendOrder.id,
    customerId: backendOrder.user_id,
    customerName: backendOrder.users?.name || 'Unknown',
    branch: backendOrder.branch,
    deliveryAddress: backendOrder.delivery_address,
    deliveryLocation: backendOrder.delivery_location,
    items: backendOrder.order_items?.map((item: any) => ({
      product: {
        id: item.products.id,
        name: item.products.name,
        category: item.products.category,
        price: item.products.price,
        image: item.products.image,
        description: item.products.description,
        ingredients: item.products.ingredients,
        nutritionalInfo: item.products.nutritional_info,
        volume: item.products.volume,
        brand: item.products.brand,
      },
      quantity: item.quantity,
    })) || [],
    total: backendOrder.total,
    status: backendOrder.status,
    mpesaCode: backendOrder.mpesa_code,
    createdAt: new Date(backendOrder.created_at),
  };
};

// Store
interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;

  // Products
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;

  // Branch
  selectedBranch: Branch;
  setBranch: (branch: Branch) => void;

  // Delivery
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Orders
  orders: Order[];
  ordersLoading: boolean;
  ordersError: string | null;
  fetchOrders: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  addOrder: (order: Order) => void;

  // Inventory (mock data for frontend)
  inventory: Inventory[];
  restockBranch: (branch: Branch, productId: string, quantity: number) => void;

  // Redirect state for auth flow
  redirectAfterLogin: string | null;
  setRedirectAfterLogin: (path: string | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        clearAuthToken();
        set({ user: null, isAuthenticated: false, cart: [], deliveryAddress: '' });
      },
      updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      // Products
      products: [],
      productsLoading: false,
      productsError: null,
      fetchProducts: async () => {
        set({ productsLoading: true, productsError: null });
        try {
          const response = await productsApi.getAll();
          const products = response.products;
          set({ 
            products, 
            productsLoading: false,
            // Initialize inventory when products are loaded
            inventory: createInitialInventory(products)
          });
        } catch (error) {
          set({ 
            productsError: error instanceof Error ? error.message : 'Failed to fetch products',
            productsLoading: false 
          });
        }
      },
      getProductById: (id: string) => {
        return get().products.find(p => p.id === id);
      },

      // Branch
      selectedBranch: 'nairobi',
      setBranch: (branch) => set({ selectedBranch: branch }),

      // Delivery
      deliveryAddress: '',
      setDeliveryAddress: (address) => set({ deliveryAddress: address }),

      // Cart
      cart: [],
      addToCart: (product) => {
        const cart = get().cart;
        const existing = cart.find(item => item.product.id === product.id);
        if (existing) {
          set({
            cart: cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.product.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
        } else {
          set({
            cart: get().cart.map(item =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          });
        }
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      // Orders
      orders: [],
      ordersLoading: false,
      ordersError: null,
      fetchOrders: async () => {
        set({ ordersLoading: true, ordersError: null });
        try {
          const response = await ordersApi.getMyOrders();
          const orders = response.orders.map(transformOrder);
          set({ orders, ordersLoading: false });
        } catch (error) {
          set({ 
            ordersError: error instanceof Error ? error.message : 'Failed to fetch orders',
            ordersLoading: false 
          });
        }
      },
      fetchAllOrders: async () => {
        set({ ordersLoading: true, ordersError: null });
        try {
          const response = await ordersApi.getAllOrders();
          const orders = response.orders.map(transformOrder);
          set({ orders, ordersLoading: false });
        } catch (error) {
          set({ 
            ordersError: error instanceof Error ? error.message : 'Failed to fetch orders',
            ordersLoading: false 
          });
        }
      },
      addOrder: (order) => set({ orders: [order, ...get().orders] }),

      // Inventory
      inventory: [],
      restockBranch: (branch, productId, quantity) => {
        const inventory = get().inventory;
        const hqInventory = inventory.find(i => i.branch === 'nairobi');
        const branchInventory = inventory.find(i => i.branch === branch);

        if (hqInventory && branchInventory && hqInventory.products[productId] >= quantity) {
          set({
            inventory: inventory.map(inv => {
              if (inv.branch === 'nairobi') {
                return {
                  ...inv,
                  products: {
                    ...inv.products,
                    [productId]: inv.products[productId] - quantity,
                  },
                };
              }
              if (inv.branch === branch) {
                return {
                  ...inv,
                  products: {
                    ...inv.products,
                    [productId]: inv.products[productId] + quantity,
                  },
                };
              }
              return inv;
            }),
          });
        }
      },

      // Redirect
      redirectAfterLogin: null,
      setRedirectAfterLogin: (path) => set({ redirectAfterLogin: path }),
    }),
    {
      name: 'supermarket-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        selectedBranch: state.selectedBranch,
        deliveryAddress: state.deliveryAddress,
      }),
    }
  )
);
