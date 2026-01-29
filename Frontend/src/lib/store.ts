import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clearAuthToken } from './api';

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

// Products data with real details
export const products: Product[] = [
  // Sodas
  { 
    id: 'coke', 
    name: 'Coca-Cola', 
    category: 'sodas', 
    price: 50, 
    image: '/images/coke.jpg',
    description: 'The iconic Coca-Cola taste - a refreshing cola drink that has been bringing people together for over 130 years. Perfectly carbonated with a unique blend of natural flavors.',
    ingredients: 'Carbonated water, sugar, color (caramel E150d), phosphoric acid, natural flavors including caffeine',
    nutritionalInfo: {
      servingSize: '330ml',
      calories: 139,
      sugar: '35g',
      sodium: '15mg'
    },
    volume: '330ml',
    brand: 'The Coca-Cola Company'
  },
  { 
    id: 'fanta', 
    name: 'Fanta Orange', 
    category: 'sodas', 
    price: 50, 
    image: '/images/fanta.jpg',
    description: 'Bright, bubbly, and instantly refreshing. Fanta Orange is made with 100% natural flavors and delivers a bold, fruity taste that will make you feel like you\'re biting into a juicy orange.',
    ingredients: 'Carbonated water, sugar, orange fruit from concentrate (5%), citric acid, natural orange flavoring with other natural flavorings, preservative (potassium sorbate)',
    nutritionalInfo: {
      servingSize: '330ml',
      calories: 144,
      sugar: '36g',
      sodium: '12mg'
    },
    volume: '330ml',
    brand: 'The Coca-Cola Company'
  },
  { 
    id: 'sprite', 
    name: 'Sprite', 
    category: 'sodas', 
    price: 50, 
    image: '/images/sprite.jpg',
    description: 'Obey Your Thirst! Sprite is a perfectly clear lemon-lime sparkling drink with 100% natural flavors and no caffeine. Crisp, clean taste that really quenches your thirst.',
    ingredients: 'Carbonated water, sugar, citric acid, natural lemon and lime flavoring, acidity regulator (sodium citrate)',
    nutritionalInfo: {
      servingSize: '330ml',
      calories: 140,
      sugar: '35g',
      sodium: '33mg'
    },
    volume: '330ml',
    brand: 'The Coca-Cola Company'
  },
  { 
    id: 'pepsi', 
    name: 'Pepsi', 
    category: 'sodas', 
    price: 50, 
    image: '/images/pepsi.jpg',
    description: 'Bold cola taste with a perfect balance of sweet and refreshing. Pepsi delivers that crisp, satisfying taste that cuts through and complements any meal perfectly.',
    ingredients: 'Carbonated water, sugar, color (caramel E150d), acid (phosphoric acid), flavorings (including caffeine)',
    nutritionalInfo: {
      servingSize: '330ml',
      calories: 150,
      sugar: '36g',
      sodium: '18mg'
    },
    volume: '330ml',
    brand: 'PepsiCo'
  },
  
  // Energy Drinks
  { 
    id: 'monster', 
    name: 'Monster Energy', 
    category: 'energy', 
    price: 150, 
    image: '/images/monster.jpg',
    description: 'Unleash The Beast! Monster Energy packs a powerful punch of energy with a smooth, easy drinking flavor. Perfect blend of the right ingredients in the right proportion to deliver the big bad buzz.',
    ingredients: 'Carbonated water, sucrose, glucose, citric acid, natural flavors, taurine, sodium citrate, color added, panax ginseng extract, L-carnitine, caffeine, sorbic acid, benzoic acid, niacinamide, sodium chloride, Glycine max glucuronolactone, inositol, guarana extract, pyridoxine hydrochloride, riboflavin, maltodextrin, cyanocobalamin',
    nutritionalInfo: {
      servingSize: '500ml',
      calories: 240,
      sugar: '54g',
      sodium: '370mg'
    },
    volume: '500ml',
    brand: 'Monster Beverage Corporation'
  },
  { 
    id: 'redbull', 
    name: 'Red Bull', 
    category: 'energy', 
    price: 200, 
    image: '/images/redbull.jpg',
    description: 'Red Bull Energy Drink gives you wings! Appreciated worldwide by top athletes, busy professionals, college students and travelers on long journeys. Vitalizes body and mind.',
    ingredients: 'Carbonated water, sucrose, glucose, citric acid, taurine (0.4%), sodium bicarbonate, magnesium carbonate, caffeine (0.03%), niacin, calcium pantothenate, pyridoxine HCl, vitamin B12, natural and artificial flavors, colors',
    nutritionalInfo: {
      servingSize: '250ml',
      calories: 110,
      sugar: '27g',
      sodium: '105mg'
    },
    volume: '250ml',
    brand: 'Red Bull GmbH'
  },
  
  // Juices
  { 
    id: 'orange-juice', 
    name: 'Minute Maid Orange', 
    category: 'juice', 
    price: 80, 
    image: '/images/orange-juice.jpg',
    description: 'Fresh-squeezed taste with no added sugar. Made from 100% pure orange juice with the natural goodness of real oranges. Rich in Vitamin C for a healthy immune system.',
    ingredients: 'Orange juice from concentrate, water, natural flavors, vitamin C (ascorbic acid)',
    nutritionalInfo: {
      servingSize: '300ml',
      calories: 120,
      sugar: '22g (naturally occurring)',
      sodium: '5mg'
    },
    volume: '300ml',
    brand: 'The Coca-Cola Company'
  },
  { 
    id: 'apple-juice', 
    name: 'Apple Juice', 
    category: 'juice', 
    price: 80, 
    image: '/images/apple-juice.jpg',
    description: '100% pure apple juice made from fresh handpicked apples. No added sugar, no artificial flavors - just the pure, crisp taste of real apples. Great source of antioxidants.',
    ingredients: 'Apple juice from concentrate, water, vitamin C (ascorbic acid)',
    nutritionalInfo: {
      servingSize: '300ml',
      calories: 130,
      sugar: '24g (naturally occurring)',
      sodium: '10mg'
    },
    volume: '300ml',
    brand: 'Fresh Harvest'
  },
  { 
    id: 'lemonade', 
    name: 'Fresh Lemonade', 
    category: 'juice', 
    price: 70, 
    image: '/images/lemonade.jpg',
    description: 'Refreshingly tangy and sweet homemade-style lemonade. Made with real lemon juice and just the right amount of sweetness. Perfect for hot Kenyan afternoons!',
    ingredients: 'Water, lemon juice from concentrate (10%), sugar, natural lemon flavoring, citric acid, preservatives (sodium benzoate)',
    nutritionalInfo: {
      servingSize: '330ml',
      calories: 100,
      sugar: '25g',
      sodium: '20mg'
    },
    volume: '330ml',
    brand: 'Tropical Fresh'
  },
  { 
    id: 'iced-tea', 
    name: 'Iced Tea', 
    category: 'juice', 
    price: 60, 
    image: '/images/iced-tea.jpg',
    description: 'Smooth, refreshing iced tea with a hint of lemon. Brewed from real tea leaves and lightly sweetened for a perfectly balanced taste. Contains natural antioxidants.',
    ingredients: 'Water, sugar, black tea extract, citric acid, natural lemon flavor, sodium benzoate (preservative)',
    nutritionalInfo: {
      servingSize: '330ml',
      calories: 80,
      sugar: '20g',
      sodium: '25mg'
    },
    volume: '330ml',
    brand: 'Lipton'
  },
  
  // Water
  { 
    id: 'water', 
    name: 'Mineral Water', 
    category: 'water', 
    price: 30, 
    image: '/images/water.jpg',
    description: 'Pure, crisp natural mineral water sourced from protected underground springs. Naturally filtered through layers of rock for purity. Essential minerals for optimal hydration.',
    ingredients: 'Natural mineral water with naturally occurring minerals: calcium, magnesium, potassium',
    nutritionalInfo: {
      servingSize: '500ml',
      calories: 0,
      sugar: '0g',
      sodium: '5mg'
    },
    volume: '500ml',
    brand: 'Keringet'
  },
  { 
    id: 'gatorade', 
    name: 'Gatorade', 
    category: 'water', 
    price: 120, 
    image: '/images/gatorade.jpg',
    description: 'Scientifically formulated sports drink that helps you rehydrate, replenish and refuel. Contains critical electrolytes to help replace what you lose in sweat during athletic performance.',
    ingredients: 'Water, sucrose, dextrose, citric acid, natural and artificial flavor, salt, sodium citrate, monopotassium phosphate, modified food starch, red 40',
    nutritionalInfo: {
      servingSize: '500ml',
      calories: 140,
      sugar: '34g',
      sodium: '275mg'
    },
    volume: '500ml',
    brand: 'PepsiCo'
  },
];

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
const createInitialInventory = (): Inventory[] => {
  return branches.map(branch => ({
    branch: branch.id,
    products: products.reduce((acc, product) => {
      acc[product.id] = branch.id === 'nairobi' ? 1000 : 100;
      return acc;
    }, {} as { [key: string]: number }),
  }));
};

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

// Store
interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;

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

  // Orders (mock data for frontend)
  orders: Order[];
  addOrder: (order: Order) => void;

  // Inventory (mock data for frontend)
  inventory: Inventory[];
  restockBranch: (branch: Branch, productId: string, quantity: number) => void;

  // Redirect state for auth flow
  redirectAfterLogin: string | null;
  setRedirectAfterLogin: (path: string | null) => void;
}

// Helper function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

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
      orders: mockOrders,
      addOrder: (order) => set({ orders: [order, ...get().orders] }),

      // Inventory
      inventory: createInitialInventory(),
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
