import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowRightLeft,
  RotateCcw,
  ShieldAlert,
  Receipt,
  Smartphone,
  Bell,
  FileBarChart,
  ClipboardList,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Search,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';
import {
  AuditLog,
  ComplaintTicket,
  DisputeStatus,
  Language,
  RefundRequest,
  SystemSettings,
  Transaction,
  UserAccount,
} from '../types';
import { REGISTERED_ACCOUNTS, RegisteredAccount } from '../data/mockData';

interface AdminDashboardProps {
  language: Language;
  user: UserAccount;
  transactions: Transaction[];
  refundRequests: RefundRequest[];
  complaints: ComplaintTicket[];
  auditLogs: AuditLog[];
  systemSettings: SystemSettings;
  onUpdateComplaintStatus: (ticketId: string, newStatus: DisputeStatus, adminNote?: string) => void;
  onUpdateSystemSettings: (newSettings: Partial<SystemSettings>) => void;
  onToggleAccountLock: (accountNumber: string) => void;
  onAddAuditLog: (action: string, actionEn: string, target: string, details: string) => void;
  onCloseAdmin: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'users'
  | 'transactions'
  | 'refunds'
  | 'complaints'
  | 'services'
  | 'audit'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  user,
  transactions,
  refundRequests,
  complaints,
  auditLogs,
  systemSettings,
  onUpdateComplaintStatus,
  onUpdateSystemSettings,
  onToggleAccountLock,
  onAddAuditLog,
  onCloseAdmin,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    complaints.length > 0 ? complaints[0].id : null
  );

  // Compute metrics
  const totalVolume = transactions.reduce((acc, tx) => acc + Math.abs(tx.amount), 0);
  const pendingRefundsCount = refundRequests.filter((r) => r.status === 'pending').length;
  const openComplaintsCount = complaints.filter(
    (c) => c.status === 'open' || c.status === 'under_review'
  ).length;

  const handleResolveTicket = (ticketId: string, status: DisputeStatus) => {
    onUpdateComplaintStatus(ticketId, status, adminNoteInput || undefined);
    onAddAuditLog(
      `تحديث حالة الشكوى ${ticketId} إلى ${status}`,
      `Updated dispute ${ticketId} status to ${status}`,
      ticketId,
      `قرار إداري من المشرف: ${adminNoteInput || 'مراجعة وتحديث الحالة'}`
    );
    setAdminNoteInput('');
  };

  const handleToggleLock = (accNumber: string, currentStatus: string) => {
    onToggleAccountLock(accNumber);
    const actionAr = currentStatus === 'active' ? 'تجميد الحساب احترازياً' : 'إلغاء تجميد الحساب';
    const actionEn = currentStatus === 'active' ? 'Account Freeze' : 'Account Unfreeze';
    onAddAuditLog(
      actionAr,
      actionEn,
      accNumber,
      `إجراء إداري رقابي على الحساب ${accNumber}`
    );
  };

  const selectedTicket = complaints.find((c) => c.id === selectedTicketId);

  return (
    <div className="space-y-4 pb-20 text-black">
      {/* Admin Header Bar */}
      <div className="bg-black text-amber-400 rounded-3xl p-5 border-2 border-black shadow-md flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-black">
            <LayoutDashboard className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-amber-300">
              {isAr ? 'لوحة الإدارة والرقابة المالية (Admin Portal)' : 'SAHEL Financial Compliance & Admin'}
            </h1>
            <p className="text-xs text-amber-200/80 font-bold">
              {isAr ? 'إدارة المعاملات، النزاعات، استرداد الأموال وسجلات التدقيق' : 'Operations, Disputes, Refunds & Audit Logs'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCloseAdmin}
          className="px-4 py-2 rounded-xl bg-amber-400 text-black font-black text-xs hover:bg-amber-300 cursor-pointer transition-transform active:scale-95 shadow-xs"
        >
          {isAr ? 'العودة لتطبيق العميل' : 'Return to Client App'}
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-amber-300 rounded-2xl p-2 border-2 border-black flex items-center gap-1.5 overflow-x-auto text-xs font-black">
        {[
          { id: 'dashboard', label: isAr ? 'نظرة عامة' : 'Dashboard', icon: LayoutDashboard },
          { id: 'users', label: isAr ? 'المستخدمون والحسابات' : 'Users & Accounts', icon: Users },
          { id: 'transactions', label: isAr ? 'المعاملات' : 'Transactions', icon: ArrowRightLeft },
          { id: 'refunds', label: isAr ? 'طلبات الاسترداد' : 'Refunds', count: pendingRefundsCount, icon: RotateCcw },
          { id: 'complaints', label: isAr ? 'الشكاوى والنزاعات' : 'Disputes', count: openComplaintsCount, icon: ShieldAlert },
          { id: 'services', label: isAr ? 'الفواتير والشحن' : 'Bills & Top-up', icon: Receipt },
          { id: 'audit', label: isAr ? 'سجل التدقيق (Audit)' : 'Audit Logs', icon: ClipboardList },
          { id: 'settings', label: isAr ? 'الإعدادات والسياسات' : 'Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? 'bg-black text-amber-400 shadow-xs'
                  : 'text-black hover:bg-black/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-amber-200 rounded-3xl p-4 border-2 border-black space-y-1">
              <span className="text-[11px] font-bold text-black/80 block">{isAr ? 'حجم المعاملات:' : 'Total Volume:'}</span>
              <span className="text-xl font-black text-black tabular-nums block">
                {totalVolume.toLocaleString('en-US')}
              </span>
              <span className="text-[10px] text-black font-extrabold">{isAr ? 'جنيه سوداني' : 'SDG'}</span>
            </div>

            <div className="bg-amber-200 rounded-3xl p-4 border-2 border-black space-y-1">
              <span className="text-[11px] font-bold text-black/80 block">{isAr ? 'إجمالي المعاملات:' : 'Transactions:'}</span>
              <span className="text-2xl font-black text-black tabular-nums block">
                {transactions.length}
              </span>
              <span className="text-[10px] text-black font-extrabold">{isAr ? 'عملية مسجلة' : 'Recorded'}</span>
            </div>

            <div className="bg-amber-200 rounded-3xl p-4 border-2 border-black space-y-1">
              <span className="text-[11px] font-bold text-black/80 block">{isAr ? 'طلبات استرداد معلقة:' : 'Pending Refunds:'}</span>
              <span className="text-2xl font-black text-black tabular-nums block">
                {pendingRefundsCount}
              </span>
              <span className="text-[10px] text-black font-extrabold">{isAr ? 'بانتظار المستفيدين' : 'Awaiting'}</span>
            </div>

            <div className="bg-amber-200 rounded-3xl p-4 border-2 border-black space-y-1">
              <span className="text-[11px] font-bold text-black/80 block">{isAr ? 'نزاعات قيد المراجعة:' : 'Open Disputes:'}</span>
              <span className="text-2xl font-black text-black tabular-nums block">
                {openComplaintsCount}
              </span>
              <span className="text-[10px] text-black font-extrabold">{isAr ? 'شكوى نشطة' : 'Active Tickets'}</span>
            </div>
          </div>

          {/* Quick Compliance Alerts */}
          <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-3">
            <h3 className="text-sm font-black text-black flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-black" />
              {isAr ? 'مؤشرات الامتثال والاستعداد للربط المصرفي:' : 'API Readiness & Compliance:'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-black">
              <div className="bg-amber-100 p-3 rounded-2xl border border-black/30">
                <span className="font-bold text-black/70 block mb-1">{isAr ? 'حالة السقف اليومي:' : 'Daily Limit Cap:'}</span>
                <span className="font-black text-sm text-black">3,000,000 جنيه</span>
              </div>
              <div className="bg-amber-100 p-3 rounded-2xl border border-black/30">
                <span className="font-bold text-black/70 block mb-1">{isAr ? 'معايير التحقق (KYC):' : 'KYC Verification:'}</span>
                <span className="font-black text-sm text-green-700">100% موثق بالرقم الوطني</span>
              </div>
              <div className="bg-amber-100 p-3 rounded-2xl border border-black/30">
                <span className="font-bold text-black/70 block mb-1">{isAr ? 'جاهزية واجهات الربط (API):' : 'API Endpoints:'}</span>
                <span className="font-black text-sm text-black">جاهز للربط المصرفي</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS & ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b-2 border-black/10">
            <h2 className="text-sm font-black text-black">
              {isAr ? 'إدارة المستخدمين والحسابات المسجلة:' : 'User & Account Management:'}
            </h2>
            <span className="text-xs font-bold text-black/80">
              {REGISTERED_ACCOUNTS.length + 1} {isAr ? 'حساب نشط' : 'Accounts'}
            </span>
          </div>

          <div className="divide-y-2 divide-black/10">
            {/* Current Primary User */}
            <div className="py-3 flex items-center justify-between gap-2 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-black">{user.name}</span>
                  <span className="text-[10px] bg-black text-amber-400 px-2 py-0.5 rounded font-black">
                    {isAr ? 'الحساب الحالي' : 'Active Demo User'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-black/80 mt-0.5">
                  <span>{user.accountNumber}</span>
                  <span>·</span>
                  <span>{user.phoneNumber}</span>
                  <span>·</span>
                  <span className="font-black text-black">{user.balance.toLocaleString('en-US')} ج.س</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-100 text-green-800 border border-green-800 px-2 py-1 rounded-lg font-black">
                  {isAr ? 'موثق KYC' : 'KYC Verified'}
                </span>
              </div>
            </div>

            {/* Other Registered Accounts */}
            {REGISTERED_ACCOUNTS.map((acc) => (
              <div key={acc.accountNumber} className="py-3 flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <span className="text-sm font-black text-black block">{acc.fullName}</span>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-black/80 mt-0.5">
                    <span>{acc.accountNumber}</span>
                    <span>·</span>
                    <span>{acc.phoneNumber}</span>
                    <span>·</span>
                    <span className="text-black font-bold">{acc.tier}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleLock(acc.accountNumber, acc.status)}
                    className={`px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs cursor-pointer flex items-center gap-1 ${
                      acc.status === 'active'
                        ? 'bg-amber-100 hover:bg-white text-black'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {acc.status === 'active' ? (
                      <>
                        <Lock className="w-3 h-3 text-black" />
                        <span>{isAr ? 'تجميد احترازي' : 'Freeze'}</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3 text-white" />
                        <span>{isAr ? 'إلغاء التجميد' : 'Unfreeze'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TRANSACTIONS AUDIT */}
      {activeTab === 'transactions' && (
        <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b-2 border-black/10">
            <h2 className="text-sm font-black text-black">
              {isAr ? 'سجل العمليات المالي المركزي:' : 'Central Transaction Ledger:'}
            </h2>
            <span className="text-xs font-mono font-bold">{transactions.length} Records</span>
          </div>

          <div className="divide-y-2 divide-black/10">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-black bg-amber-100 px-2 py-0.5 rounded border border-black/20">
                    {tx.referenceNo}
                  </span>
                  <span className="font-black tabular-nums text-sm">
                    {Math.abs(tx.amount).toLocaleString('en-US')} {isAr ? 'جنيه سوداني' : 'SDG'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-black/80 font-bold">
                  <span>{isAr ? 'المرسل:' : 'From:'} {tx.senderName} ({tx.senderAccount})</span>
                  <span>{tx.date} · {tx.time}</span>
                </div>
                <div className="flex items-center justify-between text-black font-black">
                  <span>{isAr ? 'المستلم:' : 'To:'} {tx.recipientName} ({tx.recipientAccount})</span>
                  <span className="bg-amber-400 px-2 py-0.5 rounded text-[10px]">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REFUND REQUESTS */}
      {activeTab === 'refunds' && (
        <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-3 animate-in fade-in">
          <h2 className="text-sm font-black text-black pb-2 border-b-2 border-black/10">
            {isAr ? 'طلبات استرداد التحويلات الخاطئة (Wrong Transfer Refunds):' : 'Wrong Transfer Refund Requests:'}
          </h2>

          <div className="space-y-3">
            {refundRequests.map((req) => (
              <div key={req.id} className="bg-amber-200 p-4 rounded-2xl border-2 border-black space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black bg-amber-100 px-2 py-0.5 rounded border border-black/30">
                    {req.referenceNo}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                      req.status === 'pending'
                        ? 'bg-black text-amber-400'
                        : req.status === 'accepted'
                        ? 'bg-green-700 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {req.status === 'pending'
                      ? (isAr ? 'بانتظار موافقة المستفيد' : 'Pending Recipient Approval')
                      : req.status === 'accepted'
                      ? (isAr ? 'تمت الإعادة بنجاح' : 'Returned')
                      : (isAr ? 'تم الرفض من المستفيد' : 'Declined')}
                  </span>
                </div>

                <div className="flex items-center justify-between font-bold">
                  <span>{isAr ? 'المبلغ المطلوب إرجاعه:' : 'Amount:'}</span>
                  <span className="font-black text-sm tabular-nums">{req.amount.toLocaleString('en-US')} ج.س</span>
                </div>

                <div className="text-[11px] text-black/80 space-y-0.5 font-bold">
                  <p>{isAr ? 'من صاحب الحساب المتضرر:' : 'Sender:'} {req.senderName} ({req.senderAccount})</p>
                  <p>{isAr ? 'إلى حساب المستلم الحالي:' : 'Recipient:'} {req.recipientName} ({req.recipientAccount})</p>
                  <p className="bg-amber-100 p-2 rounded-lg border border-black/20 mt-1 font-normal">
                    <strong>{isAr ? 'السبب الموضح:' : 'Reason:'}</strong> {req.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COMPLAINTS & DISPUTES */}
      {activeTab === 'complaints' && (
        <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-4 animate-in fade-in">
          <h2 className="text-sm font-black text-black pb-2 border-b-2 border-black/10">
            {isAr ? 'فحص وتدقيق النزاعات المالية والشكاوى (Dispute Review):' : 'Dispute & Complaint Investigations:'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tickets list */}
            <div className="space-y-2">
              <span className="text-xs font-black text-black block">{isAr ? 'قائمة التذاكر:' : 'Tickets:'}</span>
              {complaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedTicketId(c.id)}
                  className={`p-3.5 rounded-2xl border-2 text-xs space-y-1 cursor-pointer transition-all ${
                    selectedTicketId === c.id
                      ? 'bg-black text-amber-400 border-black shadow-xs'
                      : 'bg-amber-200 border-black/30 hover:border-black text-black'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black">{c.id}</span>
                    <span className="font-black">{c.amount.toLocaleString('en-US')} ج.س</span>
                  </div>
                  <p className="font-bold truncate">{c.reason}</p>
                  <span className="text-[10px] opacity-80 block">{c.date} · {c.status}</span>
                </div>
              ))}
            </div>

            {/* Ticket Decision Panel */}
            {selectedTicket && (
              <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-black/20">
                  <span className="font-mono font-black text-sm">{selectedTicket.id}</span>
                  <span className="bg-black text-amber-400 px-2 py-0.5 rounded font-black text-[10px]">
                    {selectedTicket.status}
                  </span>
                </div>

                <div className="space-y-1 font-bold">
                  <p>{isAr ? 'المرسل (الشاكي):' : 'Complainant:'} {selectedTicket.senderName} ({selectedTicket.senderAccount})</p>
                  <p>{isAr ? 'المستلم (المشكو ضده):' : 'Respondent:'} {selectedTicket.recipientName} ({selectedTicket.recipientAccount})</p>
                  <p>{isAr ? 'مبلغ النزاع:' : 'Disputed Amount:'} {selectedTicket.amount.toLocaleString('en-US')} ج.س</p>
                </div>

                <div className="bg-amber-100 p-2.5 rounded-xl border border-black/20">
                  <span className="text-[10px] font-black block mb-0.5">{isAr ? 'تفاصيل البلاغ:' : 'Dispute Statement:'}</span>
                  <p className="font-normal">{selectedTicket.reason}</p>
                </div>

                {/* Admin notes input */}
                <div>
                  <label className="text-xs font-black block mb-1">
                    {isAr ? 'إضافة ملاحظة إدارية / قرار:' : 'Admin Note / Determination:'}
                  </label>
                  <textarea
                    rows={2}
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder={isAr ? 'سجل قرار الإدارة بخصوص هذا النزاع...' : 'Record administrative determination...'}
                    className="w-full p-2 rounded-xl border-2 border-black bg-amber-100 text-xs font-bold resize-none focus:outline-none"
                  />
                </div>

                {/* Resolution Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleResolveTicket(selectedTicket.id, 'resolved')}
                    className="py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-black text-xs cursor-pointer shadow-xs active:scale-95"
                  >
                    {isAr ? 'تسوية النزاع (Resolved)' : 'Resolve Dispute'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolveTicket(selectedTicket.id, 'under_review')}
                    className="py-2.5 rounded-xl bg-black hover:bg-stone-900 text-amber-400 font-black text-xs cursor-pointer shadow-xs active:scale-95"
                  >
                    {isAr ? 'قيد المتابعة (Review)' : 'Keep Under Review'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: SERVICES & BILLS */}
      {activeTab === 'services' && (
        <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-4 animate-in fade-in">
          <h2 className="text-sm font-black text-black pb-2 border-b-2 border-black/10">
            {isAr ? 'إحصائيات شحن الرصيد والخدمات المسددة:' : 'Telecom & Utility Settlement Metrics:'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black text-center space-y-1">
              <span className="text-xs font-bold text-black/80">{isAr ? 'شبكة زين (Zain):' : 'Zain Top-up:'}</span>
              <span className="text-xl font-black block">10,000 ج.س</span>
              <span className="text-[10px] text-green-700 font-black">حالة الربط: نشطة ومباشرة</span>
            </div>
            <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black text-center space-y-1">
              <span className="text-xs font-bold text-black/80">{isAr ? 'شبكة سوداني (Sudani):' : 'Sudani Top-up:'}</span>
              <span className="text-xl font-black block">0 ج.س</span>
              <span className="text-[10px] text-green-700 font-black">حالة الربط: نشطة ومباشرة</span>
            </div>
            <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black text-center space-y-1">
              <span className="text-xs font-bold text-black/80">{isAr ? 'شبكة إم تي إن (MTN):' : 'MTN Top-up:'}</span>
              <span className="text-xl font-black block">0 ج.س</span>
              <span className="text-[10px] text-green-700 font-black">حالة الربط: نشطة ومباشرة</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT LOGS (سجل التدقيق) */}
      {activeTab === 'audit' && (
        <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b-2 border-black/10">
            <h2 className="text-sm font-black text-black">
              {isAr ? 'سجل التدقيق الرقابي والعمليات الإدارية (Audit Trail):' : 'Immutable Administrative Audit Logs:'}
            </h2>
            <span className="text-xs font-mono font-bold">{auditLogs.length} Events</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-amber-200/90 p-3 rounded-2xl border-2 border-black text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-black">
                    {isAr ? log.action : log.actionEn}
                  </span>
                  <span className="font-mono text-[10px] opacity-70">{log.timestamp}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-black/80 font-bold">
                  <span>{isAr ? 'المنفذ:' : 'Actor:'} {log.actor}</span>
                  <span className="font-mono">IP: {log.ipAddress}</span>
                </div>
                <p className="text-[11px] font-semibold text-black bg-amber-100 p-1.5 rounded-lg border border-black/20">
                  {log.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-4 animate-in fade-in text-xs font-bold">
          <h2 className="text-sm font-black text-black pb-2 border-b-2 border-black/10">
            {isAr ? 'إعدادات النظام والضوابط الرقابية:' : 'Regulatory Policy & System Limits:'}
          </h2>

          <div className="space-y-3">
            <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black flex items-center justify-between">
              <div>
                <span className="font-black text-sm text-black block">{isAr ? 'السقف اليومي الأقصى للتحويل:' : 'Daily Transfer Limit:'}</span>
                <span className="text-[11px] text-black/70">{isAr ? 'الحد المسموح به لحسابات الهوية الوطنية' : 'Maximum allowed per calendar day'}</span>
              </div>
              <span className="font-mono font-black text-base text-black">{systemSettings.dailyTransferLimit.toLocaleString('en-US')} ج.س</span>
            </div>

            <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black flex items-center justify-between">
              <div>
                <span className="font-black text-sm text-black block">{isAr ? 'ميزة استرداد التحويلات الخاطئة:' : 'Wrong Transfer Recovery Feature:'}</span>
                <span className="text-[11px] text-black/70">{isAr ? 'السماح للعملاء بإرسال طلبات الإعادة' : 'Allow voluntary recipient refund requests'}</span>
              </div>
              <span className="text-xs bg-green-700 text-white px-2.5 py-1 rounded-xl font-black">
                {isAr ? 'مفعلة ونشطة' : 'Enabled'}
              </span>
            </div>

            <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black flex items-center justify-between">
              <div>
                <span className="font-black text-sm text-black block">{isAr ? 'حالة الربط مع المصارف والجهات المرخصة:' : 'Financial Institution Integration:'}</span>
                <span className="text-[11px] text-black/70">{isAr ? 'واجهات برمجة التطبيقات (API Endpoints)' : 'Ready for licensed core-banking integration'}</span>
              </div>
              <span className="text-xs bg-black text-amber-400 px-2.5 py-1 rounded-xl font-black">
                {isAr ? 'جاهز للربط' : 'API Ready'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
