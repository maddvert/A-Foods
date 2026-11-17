import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  CustomerDetails,
  MenuItem,
  Order,
  OrderStatus,
  DeliveryLocation,
  UserProfile,
  FlyingItem,
} from '../types/restaurant';
import { RESTAURANT_INFO, POPULAR_DELIVERY_AREAS, calculateDistanceAndFee } from '../data/menuData';

interface RestaurantContextType {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Cart & items
  cart: CartItem[];
  addToCart: (item: CartItem, sourceElement?: HTMLElement | null) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  itemCount: number;

  // Fly to cart animation
  flyingItem: FlyingItem | null;
  cartIconRef: React.RefObject<HTMLButtonElement | null>;
  isCartBouncing: boolean;

  // Customization
  customizingItem: MenuItem | null;
  setCustomizingItem: (item: MenuItem | null) => void;

  // Orders & Tracking
  activeOrder: Order | null;
  allOrders: Order[];
  placeOrder: (
    customer: CustomerDetails,
    paymentMethod: 'cash_on_delivery' | 'online_transfer'
  ) => Order;
  refreshOrdersFromStorage: () => Order[];
  deleteOrderFromHistory: (orderId: string) => void;
  clearOrderHistory: () => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  quickReorder: (order: Order) => void;

  // Location & Distance Delivery
  deliveryLocation: DeliveryLocation;
  setDeliveryLocation: (location: DeliveryLocation) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  orderType: 'delivery' | 'pickup';
  setOrderType: (type: 'delivery' | 'pickup') => void;

  // User Profile & Google Login
  currentUser: UserProfile | null;
  isGoogleLoginOpen: boolean;
  setIsGoogleLoginOpen: (open: boolean) => void;
  isDashboardOpen: boolean;
  setIsDashboardOpen: (open: boolean) => void;
  loginWithGoogle: (customData?: Partial<UserProfile>) => void;
  logout: () => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const STORAGE_THEME_KEY = 'a_foods_theme_v2';
export const STORAGE_CART_KEY = 'a_foods_cart_v2';
export const STORAGE_ORDERS_KEY = 'a_foods_orders_v2';
export const STORAGE_USER_KEY = 'a_foods_user_v2';
export const STORAGE_LOCATION_KEY = 'a_foods_loc_v2';
export const STORAGE_LOCATION_ASKED_KEY = 'a_foods_loc_asked_v2';

export function readOrdersFromLocalStorage(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark'; // Default dark theme as initially requested
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Delivery Location (default: 4K Chowrangi benchmark)
  const [deliveryLocation, setDeliveryLocationState] = useState<DeliveryLocation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOCATION_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return POPULAR_DELIVERY_AREAS[0]; // 4K Chowrangi
  });

  // Website opens with location modal popup by default as requested
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(true);

  const setDeliveryLocation = (loc: DeliveryLocation) => {
    setDeliveryLocationState(loc);
    try {
      localStorage.setItem(STORAGE_LOCATION_KEY, JSON.stringify(loc));
    } catch (e) {
      console.error(e);
    }
  };

  // Google User Auth
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isGoogleLoginOpen, setIsGoogleLoginOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const loginWithGoogle = (customData?: Partial<UserProfile>) => {
    const defaultUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: customData?.name || 'Usama Khan',
      email: customData?.email || 'usama.khan@gmail.com',
      avatar:
        customData?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      phone: customData?.phone || '0300-1234567',
      rewardPoints: 340,
      savedAddresses: [
        {
          id: 'addr-1',
          label: 'Home',
          address: 'House B-42, Sector 5-J, Near 4K Chowrangi, North Karachi',
          landmark: 'Near Farooq-e-Azam Masjid',
          distanceKm: 2.2,
          deliveryFee: 100,
        },
        {
          id: 'addr-2',
          label: 'Office',
          address: 'Office 304, Commercial Avenue, Powerhouse Chowrangi, North Karachi',
          landmark: 'Opposite Shell Pump',
          distanceKm: 3.5,
          deliveryFee: 150,
        },
      ],
    };

    const userToSave = { ...defaultUser, ...customData };
    setCurrentUser(userToSave);
    setIsGoogleLoginOpen(false);
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userToSave));
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_USER_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [allOrders, setAllOrders] = useState<Order[]>(() => readOrdersFromLocalStorage());

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    const initialOrders = readOrdersFromLocalStorage();
    return initialOrders.length > 0 ? initialOrders[0] : null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Animation Refs & State
  const cartIconRef = React.useRef<HTMLButtonElement | null>(null);
  const [flyingItem, setFlyingItem] = useState<FlyingItem | null>(null);
  const [isCartBouncing, setIsCartBouncing] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(allOrders));
    } catch (e) {
      console.error(e);
    }
  }, [allOrders]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_ORDERS_KEY) {
        const latest = readOrdersFromLocalStorage();
        setAllOrders(latest);
        setActiveOrder((prev) => {
          if (!prev) return latest[0] || null;
          return latest.find((o) => o.orderId === prev.orderId) || latest[0] || null;
        });
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Order progression timer
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'delivered') return;

    const interval = setInterval(() => {
      setActiveOrder((prev) => {
        if (!prev) return null;
        let nextStatus: OrderStatus = prev.status;
        let remaining = Math.max(0, prev.deliveryMinutesRemaining - 1);

        if (prev.status === 'confirmed' && remaining <= 32) {
          nextStatus = 'kitchen';
        } else if (prev.status === 'kitchen' && remaining <= 18) {
          nextStatus = 'out_for_delivery';
        } else if (prev.status === 'out_for_delivery' && remaining <= 0) {
          nextStatus = 'delivered';
        }

        const updated = {
          ...prev,
          status: nextStatus,
          deliveryMinutesRemaining: remaining,
        };

        setAllOrders((orders) =>
          orders.map((o) => (o.orderId === prev.orderId ? updated : o))
        );

        return updated;
      });
    }, 12000);

    return () => clearInterval(interval);
  }, [activeOrder]);

  const addToCart = (newItem: CartItem, sourceElement?: HTMLElement | null) => {
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (sourceElement) {
      const rect = sourceElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        startX = rect.left + rect.width / 2;
        startY = rect.top + rect.height / 2;
      }
    }

    setFlyingItem({
      id: `fly-${Date.now()}`,
      imageUrl: newItem.image,
      startX,
      startY,
    });

    setTimeout(() => {
      setFlyingItem(null);
      setIsCartBouncing(true);
      setTimeout(() => setIsCartBouncing(false), 500);
    }, 700);

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.menuItemId === newItem.menuItemId &&
          i.selectedSize === newItem.selectedSize &&
          i.selectedCrust === newItem.selectedCrust &&
          i.selectedPortion === newItem.selectedPortion &&
          i.selectedSpice === newItem.selectedSpice &&
          JSON.stringify(i.selectedAddOns) === JSON.stringify(newItem.selectedAddOns) &&
          i.instructions === newItem.instructions
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        const existing = copy[existingIdx];
        const newQty = existing.quantity + newItem.quantity;
        copy[existingIdx] = {
          ...existing,
          quantity: newQty,
          itemTotal: existing.unitPrice * newQty,
        };
        return copy;
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.cartItemId === cartItemId) {
            const newQty = i.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...i,
              quantity: newQty,
              itemTotal: i.unitPrice * newQty,
            };
          }
          return i;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((acc, curr) => acc + curr.itemTotal, 0);

  // Distance-based delivery fee
  const deliveryFee =
    orderType === 'pickup'
      ? 0
      : subtotal >= RESTAURANT_INFO.freeDeliveryThreshold
      ? 0
      : subtotal > 0
      ? deliveryLocation.deliveryFee
      : 0;

  const discount = 0;
  const total = subtotal + deliveryFee - discount;
  const itemCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const placeOrder = (
    customer: CustomerDetails,
    paymentMethod: 'cash_on_delivery' | 'online_transfer'
  ): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `AF-${randomSuffix}`;

    const newOrder: Order = {
      orderId: newOrderId,
      createdAt: new Date().toISOString(),
      customer: {
        ...customer,
        areaName: deliveryLocation.name,
        distanceKm: deliveryLocation.distanceKm,
      },
      items: [...cart],
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      status: 'confirmed',
      estimatedMinutes: 35,
      deliveryMinutesRemaining: 35,
    };

    setAllOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setTrackingOrderId(newOrderId);
    clearCart();
    setIsCartOpen(false);
    setIsTrackingOpen(true);

    return newOrder;
  };

  const quickReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart({
        ...item,
        cartItemId: `reorder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      });
    });
    setIsCartOpen(true);
  };

  const refreshOrdersFromStorage = React.useCallback((): Order[] => {
    const storedOrders = readOrdersFromLocalStorage();
    setAllOrders(storedOrders);
    setActiveOrder((prev) => {
      if (storedOrders.length === 0) return null;
      if (!prev) return storedOrders[0];
      return storedOrders.find((o) => o.orderId === prev.orderId) || storedOrders[0];
    });
    return storedOrders;
  }, []);

  const deleteOrderFromHistory = React.useCallback((orderId: string) => {
    setAllOrders((prev) => {
      const updated = prev.filter((o) => o.orderId !== orderId);
      try {
        localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setActiveOrder((prev) => (prev?.orderId === orderId ? null : prev));
  }, []);

  const clearOrderHistory = React.useCallback(() => {
    setAllOrders([]);
    setActiveOrder(null);
    setTrackingOrderId(null);
    try {
      localStorage.removeItem(STORAGE_ORDERS_KEY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <RestaurantContext.Provider
      value={{
        theme,
        toggleTheme,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        deliveryFee,
        discount,
        total,
        itemCount,
        flyingItem,
        cartIconRef,
        isCartBouncing,
        customizingItem,
        setCustomizingItem,
        activeOrder,
        allOrders,
        placeOrder,
        refreshOrdersFromStorage,
        deleteOrderFromHistory,
        clearOrderHistory,
        isTrackingOpen,
        setIsTrackingOpen,
        trackingOrderId,
        setTrackingOrderId,
        quickReorder,
        deliveryLocation,
        setDeliveryLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        orderType,
        setOrderType,
        currentUser,
        isGoogleLoginOpen,
        setIsGoogleLoginOpen,
        isDashboardOpen,
        setIsDashboardOpen,
        loginWithGoogle,
        logout,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
