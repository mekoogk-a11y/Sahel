export type Language = 'ar' | 'en';

export type TabType = 'home' | 'transactions' | 'beneficiaries' | 'account';

export type ActionModalType = 
  | null 
  | 'send' 
  | 'receive' 
  | 'pay' 
  | 'withdraw' 
  | 'ussd' 
  | 'security' 
  | 'help' 
  | 'addBeneficiary';

export interface Transaction {
  id: string;
  type: 'transfer_out' | 'transfer_in' | 'bill_payment' | 'atm_withdraw' | 'merchant_pay' | 'agent_withdraw';
  title: string;
  titleEn: string;
  recipientOrSender: string;
  phoneOrAccount?: string;
  amount: number;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  referenceNo: string;
  fee: number;
  category: 'transfer' | 'payment' | 'cash';
}

export interface Beneficiary {
  id: string;
  name: string;
  nameEn: string;
  nickname?: string;
  phoneNumber: string;
  accountNumber: string;
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
}
