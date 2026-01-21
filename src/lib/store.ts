import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type Branch = 'nairobi' | 'kisumu' | 'mombasa' | 'nakuru' | 'eldoret';

export interface Product {
  id: string;
  name: 'Coke' | 'Fanta' | 'Sprite';
  price: number;
  image: string;
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

// Store
interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // Branch
  selectedBranch: Branch;
  setBranch: (branch: Branch) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Orders (mock data for frontend)
  orders: Order[];
  addOrder: (order: Order) => void;

  // Inventory (mock data for frontend)
  inventory: Inventory[];
  restockBranch: (branch: Branch, productId: string, quantity: number) => void;
}

// Products data
export const products: Product[] = [
  { id: 'coke', name: 'Coke', price: 50, image: '🥤' },
  { id: 'fanta', name: 'Fanta', price: 50, image: '🧃' },
  { id: 'sprite', name: 'Sprite', price: 50, image: '🥤' },
];

export const branches: { id: Branch; name: string; location: string }[] = [
  { id: 'nairobi', name: 'Nairobi HQ', location: 'Central Business District' },
  { id: 'kisumu', name: 'Kisumu Branch', location: 'Oginga Odinga Street' },
  { id: 'mombasa', name: 'Mombasa Branch', location: 'Moi Avenue' },
  { id: 'nakuru', name: 'Nakuru Branch', location: 'Kenyatta Avenue' },
  { id: 'eldoret', name: 'Eldoret Branch', location: 'Uganda Road' },
];

// Initial mock inventory
const initialInventory: Inventory[] = branches.map(branch => ({
  branch: branch.id,
  products: {
    coke: branch.id === 'nairobi' ? 1000 : 100,
    fanta: branch.id === 'nairobi' ? 1000 : 100,
    sprite: branch.id === 'nairobi' ? 1000 : 100,
  },
}));

// Mock orders for demo
const mockOrders: Order[] = [
  {
    id: '1',
    customerId: 'c1',
    customerName: 'John Kamau',
    branch: 'nairobi',
    items: [{ product: products[0], quantity: 5 }],
    total: 250,
    status: 'paid',
    mpesaCode: 'QK7B3N9P2M',
    createdAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: '2',
    customerId: 'c2',
    customerName: 'Mary Wanjiku',
    branch: 'kisumu',
    items: [{ product: products[1], quantity: 3 }, { product: products[2], quantity: 2 }],
    total: 250,
    status: 'paid',
    mpesaCode: 'QK7B3N9P2N',
    createdAt: new Date('2024-01-15T14:45:00'),
  },
  {
    id: '3',
    customerId: 'c3',
    customerName: 'Peter Odhiambo',
    branch: 'mombasa',
    items: [{ product: products[0], quantity: 10 }],
    total: 500,
    status: 'paid',
    mpesaCode: 'QK7B3N9P2O',
    createdAt: new Date('2024-01-16T09:15:00'),
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, cart: [] }),

      // Branch
      selectedBranch: 'nairobi',
      setBranch: (branch) => set({ selectedBranch: branch }),

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
      orders: mockOrders,
      addOrder: (order) => set({ orders: [order, ...get().orders] }),

      // Inventory
      inventory: initialInventory,
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
    }),
    {
      name: 'supermarket-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        selectedBranch: state.selectedBranch,
      }),
    }
  )
);
