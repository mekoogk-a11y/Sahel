export type Language = 'ar' | 'en';

export type AppView = 'user' | 'admin';

export type TabType = 
  | 'home' 
  | 'transactions' 
  | 'recharge' 
  | 'bills' 
  | 'support' 
  | 'account';

export type ActionModalType = 
  | null 
  | 'send' 
  | 'receive' 
  | 'recharge' 
  | 'bills' 
  | 'refundRequest' 
  | 'reportDispute' 
  | 'security' 
  | 'support' 
  | 'transactionDetail'
  | 'addBeneficiary';

export type TelecomProvider = 'Zain' | 'Sudani' | 'MTN';

export type BillCategory = 
  | 'electricity' 
  | 'water' 
  | 'government_e15' 
  | 'education' 
  | 'telecom_fiber';

export type TransactionType = 
  | 'transfer_out' 
  | 'transfer_in' 
  | 'recharge' 
  | 'bill_payment' 
  | 'refund_reversal';

export type TransactionStatus = 'completed' | 'pending' | 'reversed' | 'disputed';

export type RefundStatus = 'none' | 'requested' | 'accepted' | 'declined' | 'disputed';

export interface Transaction {
  id: string;
  referenceNo: string;
  type: TransactionType;
  title: string;
  titleEn: string;
  recipientName: string;
  recipientAccount: string;
  recipientPhone: string;
  senderName: string;
  senderAccount: string;
  senderPhone: string;
  amount: number;
  fee: number;
  date: string;
  time: string;
  timestamp: number;
  status: TransactionStatus;
  category: 'transfer' | 'recharge' | 'bill' | 'system';
  note?: string;
  refundStatus: RefundStatus;
  refundRequestId?: string;
  disputeId?: string;
}

export interface RefundRequest {
  id: string;
  transactionId: string;
  referenceNo: string;
  senderName: string;
  senderAccount: string;
  senderPhone: string;
  recipientName: string;
  recipientAccount: string;
  recipientPhone: string;
  amount: number;
  reason: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  timestamp: number;
  respondedAt?: string;
  notes?: string;
}

export type DisputeStatus = 
  | 'open' 
  | 'under_review' 
  | 'waiting_user' 
  | 'resolved' 
  | 'closed';

export interface ComplaintMessage {
  id: string;
  sender: 'user' | 'support' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ComplaintTicket {
  id: string; // CMP-XXXX-SD
  transactionId: string;
  referenceNo: string;
  senderName: string;
  senderAccount: string;
  recipientName: string;
  recipientAccount: string;
  amount: number;
  date: string;
  reason: string;
  status: DisputeStatus;
  messages: ComplaintMessage[];
  adminNotes: string[];
  resolution?: string;
  createdAt: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  nameEn: string;
  accountNumber: string;
  phoneNumber: string;
  avatarColor: string;
  initials: string;
  isFavorite: boolean;
  relationship?: string;
}

export interface UserAccount {
  name: string;
  nameEn: string;
  phoneNumber: string;
  accountNumber: string;
  balance: number;
  currency: string;
  currencyEn: string;
  tier: string;
  dailyLimit: number;
  dailyUsed: number;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  isKycVerified: boolean;
  status: 'active' | 'frozen';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  actionEn: string;
  target: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'alert';
}

export interface SystemSettings {
  dailyTransferLimit: number;
  singleTransactionLimit: number;
  allowRefundRequests: boolean;
  maintenanceMode: boolean;
  apiReadiness: boolean;
}
