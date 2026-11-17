export type FoodCategory =
  | 'all'
  | 'pizza'
  | 'pakoras'
  | 'chaat'
  | 'samosas'
  | 'rolls'
  | 'kababs'
  | 'deals'
  | 'beverages';

export interface SizeOption {
  name: string;
  priceDelta: number;
  inches?: string;
  serves?: string;
}

export interface CrustOption {
  name: string;
  priceDelta: number;
}

export interface PortionOption {
  label: string;
  priceDelta: number;
}

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: Exclude<FoodCategory, 'all'>;
  basePrice: number;
  image: string;
  isPopular?: boolean;
  isChefSpecial?: boolean;
  isNew?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy Hot';
  sizes?: SizeOption[];
  crusts?: CrustOption[];
  portions?: PortionOption[];
  availableAddOns?: AddOnOption[];
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  name: string;
  basePrice: number;
  selectedSize?: string;
  selectedCrust?: string;
  selectedPortion?: string;
  selectedSpice?: string;
  selectedAddOns: { id: string; name: string; price: number }[];
  instructions?: string;
  unitPrice: number;
  quantity: number;
  itemTotal: number;
  image: string;
}

export type OrderStatus = 'confirmed' | 'kitchen' | 'out_for_delivery' | 'delivered';

export interface CustomerDetails {
  fullName: string;
  phone: string;
  address: string;
  landmark: string;
  notes: string;
  orderType: 'delivery' | 'pickup';
  areaName?: string;
  distanceKm?: number;
}

export interface Order {
  orderId: string;
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cash_on_delivery' | 'online_transfer';
  status: OrderStatus;
  estimatedMinutes: number;
  deliveryMinutesRemaining: number;
}

export interface DeliveryLocation {
  name: string;
  address: string;
  distanceKm: number;
  deliveryFee: number;
  lat?: number;
  lng?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  rewardPoints: number;
  savedAddresses: {
    id: string;
    label: string;
    address: string;
    landmark?: string;
    distanceKm: number;
    deliveryFee: number;
  }[];
}

export interface FlyingItem {
  id: string;
  imageUrl: string;
  startX: number;
  startY: number;
}
