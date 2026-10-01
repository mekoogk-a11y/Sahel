import { Beneficiary, Transaction, UserAccount } from '../types';

export interface RegisteredAccount {
  accountNumber: string;
  fullName: string;
  fullNameEn: string;
  bankName: string;
  tier: string;
}

export const REGISTERED_ACCOUNTS: RegisteredAccount[] = [
  {
    accountNumber: 'SH-992011',
    fullName: 'أحمد محمد عثمان البدوي',
    fullNameEn: 'Ahmed Mohammed Osman El-Badawi',
    bankName: 'ساهل — الحساب الموثق',
    tier: 'حساب شخصي معتمد',
  },
  {
    accountNumber: 'SH-102938',
    fullName: 'محمد أحمد عبد الرحيم سليمان',
    fullNameEn: 'Mohammed Ahmed Abdelrahim Suleiman',
    bankName: 'ساهل — الحساب الموثق',
    tier: 'حساب شخصي معتمد',
  },
  {
    accountNumber: 'SH-772910',
    fullName: 'عثمان السر بشير التوم',
    fullNameEn: 'Osman El-Sir Bashir El-Tom',
    bankName: 'ساهل — الحساب الموثق',
    tier: 'حساب شخصي معتمد',
  },
  {
    accountNumber: 'SH-551029',
    fullName: 'إبراهيم التوم الفكي علي',
    fullNameEn: 'Ibrahim El-Tom El-Faki Ali',
    bankName: 'ساهل — الحساب الموثق',
    tier: 'حساب عائلي موثق',
  },
  {
    accountNumber: 'SH-332190',
    fullName: 'فاطمة عثمان إبراهيم حسن',
    fullNameEn: 'Fatima Osman Ibrahim Hassan',
    bankName: 'ساهل — الحساب الموثق',
    tier: 'حساب شخصي موثق',
  },
  {
    accountNumber: 'SH-774411',
    fullName: 'مكتب الخرطوم للخدمات التجارية المحدودة',
    fullNameEn: 'Khartoum Commercial Services Ltd',
    bankName: 'ساهل — حساب أعمال',
    tier: 'حساب شركات معتمد',
  },
  {
    accountNumber: 'SH-449102',
    fullName: 'صديق عبد الله محمد صالح (متجر البركة)',
    fullNameEn: 'Siddig Abdallah Mohammed Saleh (Al Baraka Store)',
    bankName: 'ساهل — وكيل معتمد',
    tier: 'نقطة بيع معتمدة',
  },
  {
    accountNumber: 'SH-661829',
    fullName: 'مروة عبد العظيم بابكر دفع الله',
    fullNameEn: 'Marwa Abdelazim Babiker Dafallah',
    bankName: 'ساهل — الحساب الموثق',
    tier: 'حساب شخصي معتمد',
  },
  {
    accountNumber: 'SH-884920',
    fullName: 'طارق صلاح الدين أحمد المجذوب',
    fullNameEn: 'Tariq Salah Eldin Ahmed El-Majzoub',
    bankName: 'ساهل — الحساب الموثق',
    tier: 'حساب شخصي معتمد',
  },
];

/**
 * Automatically looks up the recipient's full name by account number.
 * Never requires manual recipient name entry.
 */
export function lookupAccountByNumber(input: string): RegisteredAccount | null {
  if (!input || input.trim().length === 0) return null;
  const cleanInput = input.trim().toUpperCase();
  const digitsOnly = cleanInput.replace(/[^0-9]/g, '');
  const normalized = cleanInput.startsWith('SH-') ? cleanInput : `SH-${cleanInput}`;

  // 1. Direct match with registered accounts
  const found = REGISTERED_ACCOUNTS.find(
    (a) =>
      a.accountNumber.toUpperCase() === normalized ||
      a.accountNumber.replace('SH-', '') === cleanInput.replace('SH-', '') ||
      (digitsOnly.length >= 4 && a.accountNumber.includes(digitsOnly))
  );
  if (found) return found;

  // 2. If it's a valid account number (has at least 3 digits or characters), resolve deterministically
  if (digitsOnly.length >= 3 || cleanInput.length >= 4) {
    const firstNames = ['عبد الله', 'ياسر', 'السر', 'خالد', 'مصطفى', 'عمار', 'إسماعيل', 'جعفر', 'سيف الدين', 'الفاتح'];
    const midNames = ['محمد', 'أحمد', 'إبراهيم', 'عثمان', 'صالح', 'حسن', 'عبد الرحمن', 'الطيب'];
    const grandNames = ['علي', 'بشير', 'النور', 'المبارك', 'الصادق', 'الزين', 'المهدي', 'بابكر'];
    const familyNames = ['البدوي', 'الدامر', 'البربري', 'الأنصاري', 'الجعفري', 'الشايقي', 'الدنقلاوي', 'الكباشي'];

    let hash = 0;
    for (let i = 0; i < cleanInput.length; i++) {
      hash = (hash * 31 + cleanInput.charCodeAt(i)) & 0xffffff;
    }
    const f = firstNames[Math.abs(hash) % firstNames.length];
    const m = midNames[Math.abs(hash >> 2) % midNames.length];
    const g = grandNames[Math.abs(hash >> 4) % grandNames.length];
    const fam = familyNames[Math.abs(hash >> 6) % familyNames.length];

    return {
      accountNumber: normalized,
      fullName: `${f} ${m} ${g} ${fam}`,
      fullNameEn: `${f} ${m} ${fam}`,
      bankName: 'ساهل — حساب موثق',
      tier: 'حساب شخصي معتمد',
    };
  }

  return null;
}

export const INITIAL_USER: UserAccount = {
  name: 'عثمان إبراهيم التوم',
  nameEn: 'Osman Ibrahim El-Tom',
  phoneNumber: '0912345678',
  accountNumber: 'SH-882194',
  balance: 1250000,
  currency: 'جنيه سوداني',
  currencyEn: 'SDG',
  tier: 'الحساب الفضي الموثق',
  dailyLimit: 3000000,
  dailyUsed: 145000,
  biometricEnabled: true,
  notificationsEnabled: true,
};

export const INITIAL_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'b-1',
    name: 'الأسرة',
    nameEn: 'The Family',
    nickname: 'البيت',
    phoneNumber: '0918765432',
    accountNumber: 'SH-551029',
    avatarColor: 'bg-amber-500 text-black',
    initials: 'أ',
    isFavorite: true,
    relationship: 'الأهل والمنزل',
  },
  {
    id: 'b-2',
    name: 'محمد أحمد',
    nameEn: 'Mohammed Ahmed',
    nickname: 'محمد ود خالي',
    phoneNumber: '0912987654',
    accountNumber: 'SH-102938',
    avatarColor: 'bg-stone-800 text-amber-400',
    initials: 'م',
    isFavorite: true,
    relationship: 'صديق وقريب',
  },
  {
    id: 'b-3',
    name: 'أحمد محمد',
    nameEn: 'Ahmed Mohammed',
    nickname: 'أحمد زميل العمل',
    phoneNumber: '0961234567',
    accountNumber: 'SH-992011',
    avatarColor: 'bg-yellow-400 text-stone-900',
    initials: 'أ',
    isFavorite: true,
    relationship: 'زميل عمل',
  },
  {
    id: 'b-4',
    name: 'العمل',
    nameEn: 'Work Office',
    nickname: 'مكتب الخرطوم',
    phoneNumber: '0901112233',
    accountNumber: 'SH-774411',
    avatarColor: 'bg-stone-700 text-white',
    initials: 'ع',
    isFavorite: true,
    relationship: 'إدارة العمل',
  },
  {
    id: 'b-5',
    name: 'فاطمة عثمان',
    nameEn: 'Fatima Osman',
    nickname: 'أختي فاطمة',
    phoneNumber: '0923456789',
    accountNumber: 'SH-332190',
    avatarColor: 'bg-amber-600 text-white',
    initials: 'ف',
    isFavorite: false,
    relationship: 'أخت',
  },
  {
    id: 'b-6',
    name: 'دكان الحي (عمّك صديق)',
    nameEn: 'Neighborhood Store',
    nickname: 'بقالة صديق',
    phoneNumber: '0998877665',
    accountNumber: 'SH-449102',
    avatarColor: 'bg-stone-900 text-amber-300',
    initials: 'د',
    isFavorite: false,
    relationship: 'متجر محلي',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    type: 'transfer_in',
    title: 'استلام تحويل مالي',
    titleEn: 'Received Transfer',
    recipientOrSender: 'محمد أحمد',
    phoneOrAccount: '0912987654',
    amount: 100000,
    date: 'اليوم',
    time: '11:42 ص',
    status: 'completed',
    referenceNo: 'TXN-9021-SD',
    fee: 0,
    category: 'transfer',
  },
  {
    id: 'tx-102',
    type: 'transfer_out',
    title: 'إرسال تحويل مالي',
    titleEn: 'Sent Transfer',
    recipientOrSender: 'أحمد محمد',
    phoneOrAccount: '0961234567',
    amount: -50000,
    date: 'اليوم',
    time: '09:15 ص',
    status: 'completed',
    referenceNo: 'TXN-8812-SD',
    fee: 0,
    category: 'transfer',
  },
  {
    id: 'tx-103',
    type: 'bill_payment',
    title: 'سداد فاتورة كهرباء',
    titleEn: 'Electricity Bill Payment',
    recipientOrSender: 'شركة الكهرباء القومية',
    phoneOrAccount: 'عداد رقم: 14209881',
    amount: -25000,
    date: 'أمس',
    time: '04:30 م',
    status: 'completed',
    referenceNo: 'TXN-7641-SD',
    fee: 0,
    category: 'payment',
  },
  {
    id: 'tx-104',
    type: 'atm_withdraw',
    title: 'سحب نقدي بدون بطاقة',
    titleEn: 'Cardless ATM Withdrawal',
    recipientOrSender: 'صراف آلي معتمد',
    phoneOrAccount: 'كود سحب: 749201',
    amount: -20000,
    date: '28 سبتمبر',
    time: '02:10 م',
    status: 'completed',
    referenceNo: 'TXN-6519-SD',
    fee: 0,
    category: 'cash',
  },
  {
    id: 'tx-105',
    type: 'transfer_in',
    title: 'استلام تحويل مالي',
    titleEn: 'Received Transfer',
    recipientOrSender: 'فاطمة عثمان',
    phoneOrAccount: '0923456789',
    amount: 35000,
    date: '26 سبتمبر',
    time: '08:20 م',
    status: 'completed',
    referenceNo: 'TXN-5401-SD',
    fee: 0,
    category: 'transfer',
  },
  {
    id: 'tx-106',
    type: 'merchant_pay',
    title: 'دفع مشتريات بالـ QR',
    titleEn: 'QR Merchant Payment',
    recipientOrSender: 'دكان الحي (عمّك صديق)',
    phoneOrAccount: 'نقطة بيع ساهل #4491',
    amount: -12000,
    date: '25 سبتمبر',
    time: '07:45 م',
    status: 'completed',
    referenceNo: 'TXN-4310-SD',
    fee: 0,
    category: 'payment',
  },
  {
    id: 'tx-107',
    type: 'transfer_out',
    title: 'تحويل مالي عائلي',
    titleEn: 'Family Support Transfer',
    recipientOrSender: 'الأسرة',
    phoneOrAccount: '0918765432',
    amount: -75000,
    date: '22 سبتمبر',
    time: '01:15 م',
    status: 'completed',
    referenceNo: 'TXN-3298-SD',
    fee: 0,
    category: 'transfer',
  },
];
