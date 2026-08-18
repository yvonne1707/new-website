export interface Product {
  id: string;
  name: string;
  partNumber?: string;
  category: 'Tires' | 'Gaskets & Seals' | 'Oils & Fluids' | 'Brakes' | 'Suspension' | 'Filters' | 'Electrical & Batteries' | 'Engine & Cooling';
  price: number; // in KES
  originalPrice?: number;
  image: string;
  stock: number;
  isPopular?: boolean;
  isGenuine: boolean;
  brand: string;
  warranty: string;
  description: string;
  compatibleVehicles: string[]; // e.g. ["Toyota Hilux (2005-2023)", "Toyota Fortuner", "Toyota Prado 150"]
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BranchLocation {
  id: string;
  name: string;
  shortName: string;
  address: string;
  city: string;
  coords: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl: string;
  phones: string[];
  emails?: string[];
  whatsapp: string;
  hours: string;
  manager: string;
  services: string[];
  image: string;
  isLivePinned?: boolean;
}

export interface TransportDetails {
  saccoOrCourier: string; // e.g. "2NK Sacco", "Guardian Coach", "EasyCoach Logistics", "Boda Boda Rider", "Speedex Courier"
  vehiclePlate?: string; // e.g. "KDL 429P" or "Parcel Waybill #8932"
  driverOrOfficePhone?: string; // e.g. "0722123456"
  destinationStage?: string; // e.g. "Nakuru Town Main Stage", "Kisumu EasyCoach Parcel Counter"
  estimatedArrivalTime?: string; // e.g. "Today at 4:30 PM", "Tomorrow at 10:00 AM"
  dispatchNotes?: string;
  dispatchedAt?: string;
  status: 'Awaiting Dispatch' | 'In Transit' | 'Ready for Collection at Stage' | 'Delivered';
}

export type PaymentMethodType = 'send_money' | 'paybill' | 'till_number' | 'bank_transfer';

export interface PaymentMethodItem {
  id: string;
  type: PaymentMethodType;
  name: string; // e.g. "M-Pesa Send Money", "M-Pesa Paybill", "M-Pesa Buy Goods Till", "KCB Bank Transfer"
  isActive: boolean;
  description?: string;
  // Specific fields:
  phoneNumber?: string; // for Send Money (seller's phone)
  recipientName?: string; // for Send Money & Bank Account Name
  paybillNumber?: string; // for Paybill
  accountNumber?: string; // for Paybill & Bank
  accountName?: string; // for Bank & Paybill
  tillNumber?: string; // for Till
  tillName?: string; // for Till
  bankName?: string; // for Bank Transfer
  branchName?: string; // for Bank Transfer
  instructions?: string; // Optional custom instructions
}

export interface PaymentSubmissionData {
  paymentMethod: PaymentMethodType | string;
  paymentMethodName: string;
  transactionReference?: string;
  paidFromPhone?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: 'pickup_kirinyaga' | 'pickup_umoja' | 'nairobi_courier' | 'upcountry_parcel' | string;
  deliveryAddress?: string;
  paymentMethod: PaymentMethodType | 'mpesa_stk' | 'mpesa_manual' | 'cash_on_delivery' | string;
  paymentMethodName?: string;
  mpesaReceipt?: string; // Transaction code / reference entered by customer
  paidFromPhone?: string; // Customer's phone if paid via Send Money
  status: 'Payment Pending Verification' | 'Pending' | 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered' | 'Completed' | 'Cancelled';
  transportDetails?: TransportDetails;
  emailNotificationSent?: boolean;
  emailNotificationTimestamp?: string;
  notes?: string;
}

export interface BusinessProfile {
  name: string;
  tagline: string;
  subTagline: string;
  profilePicture?: string; // Admin / Business owner profile photo displayed on storefront
  phones: string[];
  emails: string[];
  whatsapp: string;
  tillNumber: string;
  paybillNumber?: string;
  paybillAccount?: string;
  sendMoneyPhone?: string;
  sendMoneyName?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankBranch?: string;
  paymentMethods?: PaymentMethodItem[];
  instagram: string;
  tiktok: string;
  adminPin: string;
  workingHours: string;
  kraPin?: string;
}

export interface VehicleSelection {
  make: string;
  model: string;
  year?: string;
  engine?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
