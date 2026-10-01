import {
  Beneficiary,
  ComplaintTicket,
  RefundRequest,
  Transaction,
  UserAccount,
  AuditLog,
  SystemSettings,
} from '../types';

export interface RegisteredAccount {
  accountNumber: string;
  fullName: string;
  fullNameEn: string;
  phoneNumber: string;
  bankName: string;
  tier: string;
  status: 'active' | 'frozen';
}

export const INITIAL_USER: UserAccount = {
  name: 'عثمان إبراهيم التوم',
  nameEn: 'Osman Ibrahim El-Tom',
  phoneNumber: '0912345678',
  accountNumber: 'SH-882194',
  balance: 1450000,
  currency: 'جنيه سوداني',
  currencyEn: 'SDG',
  tier: 'الحساب الموثق — الهوية الوطنية',
  dailyLimit: 3000000,
  dailyUsed: 125000,
  biometricEnabled: true,
  notificationsEnabled: true,
  isKycVerified: true,
  status: 'active',
};

export const REGISTERED_ACCOUNTS: RegisteredAccount[] = [
  {
    accountNumber: 'SH-992011',
    fullName: 'أحمد محمد عثمان البدوي',
    fullNameEn: 'Ahmed Mohammed Osman El-Badawi',
    phoneNumber: '0961234567',
    bankName: 'ساهل — الحساب المعتمد',
    tier: 'حساب شخصي موثق',
    status: 'active',
  },
  {
    accountNumber: 'SH-102938',
    fullName: 'محمد أحمد عبد الرحيم سليمان',
    fullNameEn: 'Mohammed Ahmed Abdelrahim Suleiman',
    phoneNumber: '0912987654',
    bankName: 'ساهل — الحساب المعتمد',
    tier: 'حساب شخصي موثق',
    status: 'active',
  },
  {
    accountNumber: 'SH-772910',
    fullName: 'عثمان السر بشير التوم',
    fullNameEn: 'Osman El-Sir Bashir El-Tom',
    phoneNumber: '0918765432',
    bankName: 'ساهل — الحساب المعتمد',
    tier: 'حساب شخصي موثق',
    status: 'active',
  },
  {
    accountNumber: 'SH-551029',
    fullName: 'إبراهيم التوم الفكي علي',
    fullNameEn: 'Ibrahim El-Tom El-Faki Ali',
    phoneNumber: '0901239876',
    bankName: 'ساهل — الحساب المعتمد',
    tier: 'حساب عائلي موثق',
    status: 'active',
  },
  {
    accountNumber: 'SH-332190',
    fullName: 'فاطمة عثمان إبراهيم حسن',
    fullNameEn: 'Fatima Osman Ibrahim Hassan',
    phoneNumber: '0923456789',
    bankName: 'ساهل — الحساب المعتمد',
    tier: 'حساب شخصي موثق',
    status: 'active',
  },
  {
    accountNumber: 'SH-449102',
    fullName: 'صديق عبد الله محمد صالح (متجر البركة)',
    fullNameEn: 'Siddig Abdallah Mohammed Saleh (Al Baraka)',
    phoneNumber: '0998877665',
    bankName: 'ساهل — نقطة خدمة معتمدة',
    tier: 'حساب تاجر معتمد',
    status: 'active',
  },
];

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

  // 2. Deterministic resolver for arbitrary valid account numbers
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

    const randomSuffix = Math.floor(1000000 + (Math.abs(hash) % 8999999));

    return {
      accountNumber: normalized,
      fullName: `${f} ${m} ${g} ${fam}`,
      fullNameEn: `${f} ${m} ${fam}`,
      phoneNumber: `09${randomSuffix.toString().slice(0, 8)}`,
      bankName: 'ساهل — الحساب المعتمد',
      tier: 'حساب شخصي موثق',
      status: 'active',
    };
  }

  return null;
}

export const INITIAL_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'b-1',
    name: 'أحمد محمد عثمان البدوي',
    nameEn: 'Ahmed Mohammed Osman',
    accountNumber: 'SH-992011',
    phoneNumber: '0961234567',
    avatarColor: 'bg-black text-amber-400',
    initials: 'أ',
    isFavorite: true,
    relationship: 'زميل عمل',
  },
  {
    id: 'b-2',
    name: 'محمد أحمد عبد الرحيم',
    nameEn: 'Mohammed Ahmed Abdelrahim',
    accountNumber: 'SH-102938',
    phoneNumber: '0912987654',
    avatarColor: 'bg-black text-amber-400',
    initials: 'م',
    isFavorite: true,
    relationship: 'صديق',
  },
  {
    id: 'b-3',
    name: 'إبراهيم التوم الفكي علي',
    nameEn: 'Ibrahim El-Tom Ali',
    accountNumber: 'SH-551029',
    phoneNumber: '0901239876',
    avatarColor: 'bg-black text-amber-400',
    initials: 'إ',
    isFavorite: true,
    relationship: 'الأهل',
  },
  {
    id: 'b-4',
    name: 'فاطمة عثمان إبراهيم',
    nameEn: 'Fatima Osman Ibrahim',
    accountNumber: 'SH-332190',
    phoneNumber: '0923456789',
    avatarColor: 'bg-black text-amber-400',
    initials: 'ف',
    isFavorite: false,
    relationship: 'العائلة',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    referenceNo: 'TXN-9021-SD',
    type: 'transfer_out',
    title: 'تحويل مالي إلى حساب ساهل',
    titleEn: 'Transfer to Sahel Account',
    recipientName: 'أحمد محمد عثمان البدوي',
    recipientAccount: 'SH-992011',
    recipientPhone: '0961234567',
    senderName: 'عثمان إبراهيم التوم',
    senderAccount: 'SH-882194',
    senderPhone: '0912345678',
    amount: -50000,
    fee: 0,
    date: 'اليوم',
    time: '11:42 ص',
    timestamp: Date.now() - 3600000 * 2,
    status: 'completed',
    category: 'transfer',
    note: 'مصاريف شخصية',
    refundStatus: 'none',
  },
  {
    id: 'tx-102',
    referenceNo: 'TXN-8812-SD',
    type: 'recharge',
    title: 'شحن رصيد شبكة زين (Zain)',
    titleEn: 'Mobile Recharge — Zain',
    recipientName: 'شبكة زين السودان',
    recipientAccount: 'ZAIN-TOPUP',
    recipientPhone: '0912345678',
    senderName: 'عثمان إبراهيم التوم',
    senderAccount: 'SH-882194',
    senderPhone: '0912345678',
    amount: -10000,
    fee: 0,
    date: 'اليوم',
    time: '09:15 ص',
    timestamp: Date.now() - 3600000 * 5,
    status: 'completed',
    category: 'recharge',
    note: 'شحن رصيد خط الهاتف',
    refundStatus: 'none',
  },
  {
    id: 'tx-103',
    referenceNo: 'TXN-7641-SD',
    type: 'bill_payment',
    title: 'سداد فاتورة الكهرباء القومية',
    titleEn: 'Electricity Bill Payment',
    recipientName: 'الشركة السودانية لتوزيع الكهرباء',
    recipientAccount: 'عداد: 14209881',
    recipientPhone: '14209881',
    senderName: 'عثمان إبراهيم التوم',
    senderAccount: 'SH-882194',
    senderPhone: '0912345678',
    amount: -25000,
    fee: 0,
    date: 'أمس',
    time: '04:30 م',
    timestamp: Date.now() - 3600000 * 24,
    status: 'completed',
    category: 'bill',
    note: 'شراء كهرباء منزلية',
    refundStatus: 'none',
  },
  {
    id: 'tx-104',
    referenceNo: 'TXN-5519-SD',
    type: 'transfer_in',
    title: 'استلام تحويل مالي',
    titleEn: 'Received Transfer',
    recipientName: 'عثمان إبراهيم التوم',
    recipientAccount: 'SH-882194',
    recipientPhone: '0912345678',
    senderName: 'محمد أحمد عبد الرحيم سليمان',
    senderAccount: 'SH-102938',
    senderPhone: '0912987654',
    amount: 150000,
    fee: 0,
    date: 'أمس',
    time: '01:10 م',
    timestamp: Date.now() - 3600000 * 27,
    status: 'completed',
    category: 'transfer',
    note: 'سداد مستحقات',
    refundStatus: 'none',
  },
  {
    id: 'tx-105',
    referenceNo: 'TXN-4190-SD',
    type: 'transfer_out',
    title: 'تحويل مالي إلى حساب ساهل',
    titleEn: 'Transfer to Sahel Account',
    recipientName: 'عثمان السر بشير التوم',
    recipientAccount: 'SH-772910',
    recipientPhone: '0918765432',
    senderName: 'عثمان إبراهيم التوم',
    senderAccount: 'SH-882194',
    senderPhone: '0912345678',
    amount: -35000,
    fee: 0,
    date: '28 سبتمبر 2026',
    time: '06:15 م',
    timestamp: Date.now() - 3600000 * 72,
    status: 'completed',
    category: 'transfer',
    note: 'تحويل خاطئ بحاجة لاسترداد',
    refundStatus: 'requested',
    refundRequestId: 'ref-req-101',
  },
];

export const INITIAL_REFUND_REQUESTS: RefundRequest[] = [
  // An active refund request where current user received money by mistake and sender asks for return:
  {
    id: 'ref-req-201',
    transactionId: 'tx-104',
    referenceNo: 'TXN-5519-SD',
    senderName: 'محمد أحمد عبد الرحيم سليمان',
    senderAccount: 'SH-102938',
    senderPhone: '0912987654',
    recipientName: 'عثمان إبراهيم التوم',
    recipientAccount: 'SH-882194',
    recipientPhone: '0912345678',
    amount: 15000,
    reason: 'تم إدخال رقم الحساب عن طريق الخطأ بدلاً من حساب آخر',
    status: 'pending',
    createdAt: 'اليوم · 10:20 ص',
    timestamp: Date.now() - 3600000 * 3,
  },
  // An outgoing request created by current user to another account:
  {
    id: 'ref-req-101',
    transactionId: 'tx-105',
    referenceNo: 'TXN-4190-SD',
    senderName: 'عثمان إبراهيم التوم',
    senderAccount: 'SH-882194',
    senderPhone: '0912345678',
    recipientName: 'عثمان السر بشير التوم',
    recipientAccount: 'SH-772910',
    recipientPhone: '0918765432',
    amount: 35000,
    reason: 'تحويل مالي إلى رقم حساب غير مقصود عن طريق الخطأ',
    status: 'pending',
    createdAt: '28 سبتمبر 2026 · 06:20 م',
    timestamp: Date.now() - 3600000 * 71,
  },
];

export const INITIAL_COMPLAINT_TICKETS: ComplaintTicket[] = [
  {
    id: 'CMP-8812-SD',
    transactionId: 'tx-105',
    referenceNo: 'TXN-4190-SD',
    senderName: 'عثمان إبراهيم التوم',
    senderAccount: 'SH-882194',
    recipientName: 'عثمان السر بشير التوم',
    recipientAccount: 'SH-772910',
    amount: 35000,
    date: '29 سبتمبر 2026',
    reason: 'المستفيد لم يستجب لطلب الاسترداد الودي بعد تحويل المبلغ إلى حسابه بالخطأ',
    status: 'under_review',
    createdAt: '29 سبتمبر 2026 · 11:00 ص',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'عثمان إبراهيم التوم',
        text: 'السلام عليكم، قمت بتحويل مبلغ 35,000 جنيه إلى حساب SH-772910 بالخطأ، وقمت بإرسال طلب استرداد ولم أتلق رداً حتى الآن.',
        timestamp: '29 سبتمبر 2026 · 11:00 ص',
      },
      {
        id: 'msg-2',
        sender: 'support',
        senderName: 'فريق الالتزام والمطابقة — ساهل',
        text: 'وعليكم السلام، تم استلام تذكرتك وإحالتها إلى قسم النزاعات المالية. تم إشعار صاحب الحساب رسمياً بضرورة الإفادة خلال 24 ساعة وفق الإجراءات النظامية.',
        timestamp: '29 سبتمبر 2026 · 12:30 م',
      },
    ],
    adminNotes: [
      'تم إرسال إشعار تذكيري للطرف المستلم عبر الهاتف المسجل.',
      'الحساب المستلم بحالة نشطة وجار مراجعة الحركة المالية.',
    ],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    timestamp: 'اليوم · 11:45 ص',
    actor: 'admin@sahel.sd',
    action: 'مراجعة تذكرة نزاع مالي',
    actionEn: 'Dispute Ticket Review',
    target: 'CMP-8812-SD',
    details: 'فحص تفاصيل التحويل والتواصل مع الطرف المستفيد',
    ipAddress: '197.251.14.88',
    status: 'success',
  },
  {
    id: 'log-02',
    timestamp: 'اليوم · 10:15 ص',
    actor: 'system',
    action: 'التحقق الدوري من حدود العمليات',
    actionEn: 'Daily Limits Verification',
    target: 'System Engine',
    details: 'فحص مطابقة سقف التحويل اليومي للمستخدمين النشطين',
    ipAddress: '10.0.4.12',
    status: 'success',
  },
  {
    id: 'log-03',
    timestamp: 'أمس · 04:31 م',
    actor: 'payment-gateway',
    action: 'تأكيد سداد فاتورة كهرباء',
    actionEn: 'Bill Settlement Confirmation',
    target: 'TXN-7641-SD',
    details: 'مطابقة إيصال الشراء مع خوادم شركة التوزيع بنجاح',
    ipAddress: '196.29.182.5',
    status: 'success',
  },
  {
    id: 'log-04',
    timestamp: '28 سبتمبر · 06:22 م',
    actor: 'user:SH-882194',
    action: 'تسجيل طلب استرداد تحويل خاطئ',
    actionEn: 'Wrong Transfer Refund Submission',
    target: 'TXN-4190-SD',
    details: 'إرسال إشعار ودي للمستفيد لإرجاع مبلغ 35,000 جنيه',
    ipAddress: '41.208.77.104',
    status: 'warning',
  },
];

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  dailyTransferLimit: 3000000,
  singleTransactionLimit: 1000000,
  allowRefundRequests: true,
  maintenanceMode: false,
  apiReadiness: true,
};
