const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to handle API requests
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: async (data: { name: string; email: string; phone: string; password: string }) => {
    return fetchApi<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (email: string, password: string) => {
    return fetchApi<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async () => {
    return fetchApi<{ user: any }>('/auth/me');
  },

  updateProfile: async (data: { name?: string; phone?: string }) => {
    return fetchApi<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Products API
export const productsApi = {
  getAll: async (filters?: { category?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<{ products: any[] }>(`/products${query}`);
  },

  getById: async (id: string) => {
    return fetchApi<{ product: any }>(`/products/${id}`);
  },

  create: async (data: any) => {
    return fetchApi<{ product: any }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return fetchApi<{ product: any }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchApi<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersApi = {
  create: async (data: {
    branch: string;
    delivery_address?: string;
    delivery_location?: any;
    items: Array<{ product_id: string; quantity: number; price: number }>;
  }) => {
    return fetchApi<{ order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyOrders: async () => {
    return fetchApi<{ orders: any[] }>('/orders');
  },

  getById: async (id: string) => {
    return fetchApi<{ order: any }>(`/orders/${id}`);
  },

  getAllOrders: async (filters?: { status?: string; branch?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.branch) params.append('branch', filters.branch);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchApi<{ orders: any[] }>(`/orders/admin/all${query}`);
  },

  updateStatus: async (id: string, status: string) => {
    return fetchApi<{ order: any }>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Inventory API
export const inventoryApi = {
  getByBranch: async (branch: string) => {
    return fetchApi<{ inventory: any[] }>(`/inventory/${branch}`);
  },

  restock: async (data: {
    from_branch: string;
    to_branch: string;
    product_id: string;
    quantity: number;
  }) => {
    return fetchApi<{ message: string }>('/inventory/restock', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateQuantity: async (branch: string, product_id: string, quantity: number) => {
    return fetchApi<{ inventory: any }>(`/inventory/${branch}/${product_id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },
};

// Payments API
export const paymentsApi = {
  initiateSTKPush: async (order_id: string, phone: string) => {
    return fetchApi<{
      message: string;
      checkoutRequestId: string;
      merchantRequestId: string;
    }>('/payments/mpesa/stk-push', {
      method: 'POST',
      body: JSON.stringify({ order_id, phone }),
    });
  },

  queryTransaction: async (checkoutRequestId: string) => {
    return fetchApi<{ result: any }>(`/payments/mpesa/query/${checkoutRequestId}`);
  },
};

// Helper to set auth token
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

// Helper to clear auth token
export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};
