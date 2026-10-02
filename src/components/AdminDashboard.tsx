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
  Activity,
  Server,
  Radio,
  Eye,
  Send,
  UserCheck,
  UserX,
  SmartphoneNfc,
  KeyRound,
  LogOut,
} from 'lucide-react';
import {
  AuditLog,
  ComplaintTicket,
  DisputeStatus,
  Language,
  RefundRequest,
  Subscriber,
  SystemSettings,
  Transaction,
  UserAccount,
} from '../types';

interface AdminDashboardProps {
  language: Language;
  user: UserAccount;
  subscribers: Subscriber[];
  transactions: Transaction[];
  refundRequests: RefundRequest[];
  complaints: ComplaintTicket[];
  auditLogs: AuditLog[];
  systemSettings: SystemSettings;
  onUpdateComplaintStatus: (ticketId: string, newStatus: DisputeStatus, adminNote?: string) => void;
  onUpdateSystemSettings: (newSettings: Partial<SystemSettings>) => void;
  onToggleSubscriberLock: (accountNumber: string) => void;
  onAddAuditLog: (action: string, actionEn: string, target: string, details: string) => void;
  onCloseAdmin: () => void;
  onLockDashboardAndExit: () => void;
}

type AdminTab =
  | 'overview'
  | 'subscribers'
  | 'app_health'
  | 'transactions'
  | 'refunds'
  | 'complaints'
  | 'audit'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  user,
  subscribers,
  transactions,
  refundRequests,
  complaints,
  auditLogs,
  systemSettings,
  onUpdateComplaintStatus,
  onUpdateSystemSettings,
  onToggleSubscriberLock,
  onAddAuditLog,
  onCloseAdmin,
  onLockDashboardAndExit,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [subscriberFilter, setSubscriberFilter] = useState<'all' | 'active' | 'frozen' | 'visa'>('all');
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    complaints.length > 0 ? complaints[0].id : null
  );

  // Compute live creator metrics
  const totalSubscribersCount = subscribers.length;
  const activeSubscribersCount = subscribers.filter((s) => s.status === 'active').length;
  const frozenSubscribersCount = subscribers.filter((s) => s.status === 'frozen').length;
  const visaHoldersCount = subscribers.filter((s) => s.hasVisaCard).length;
  const totalSubscribersBalance = subscribers.reduce((acc, s) => acc + s.balance, 0);

  const totalVolume = transactions.reduce((acc, tx) => acc + Math.abs(tx.amount || 0), 0);
  const pendingRefundsCount = refundRequests.filter((r) => r.status === 'pending').length;
  const openComplaintsCount = complaints.filter(
    (c) => c.status === 'open' || c.status === 'under_review'
  ).length;

  // Filter subscribers based on search and tab filter
  const filteredSubscribers = subscribers.filter((s) => {
    const matchesFilter =
      subscriberFilter === 'all'
        ? true
        : subscriberFilter === 'active'
        ? s.status === 'active'
        : subscriberFilter === 'frozen'
        ? s.status === 'frozen'
        : s.hasVisaCard;

    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesFilter;

    const matchesQuery =
      s.fullName.toLowerCase().includes(query) ||
      s.fullNameEn.toLowerCase().includes(query) ||
      s.accountNumber.toLowerCase().includes(query) ||
      s.phoneNumber.includes(query) ||
      s.city.toLowerCase().includes(query);

    return matchesFilter && matchesQuery;
  });

  const handleResolveTicket = (ticketId: string, status: DisputeStatus) => {
    onUpdateComplaintStatus(ticketId, status, adminNoteInput || undefined);
    onAddAuditLog(
      `تحديث حالة الشكوى ${ticketId} إلى ${status}`,
      `Updated dispute ${ticketId} status to ${status}`,
      ticketId,
      `قرار مصمم النظام: ${adminNoteInput || 'مراجعة وتحديث الحالة'}`
    );
    setAdminNoteInput('');
  };

  const handleToggleLock = (accNumber: string, currentStatus: string, name: string) => {
    onToggleSubscriberLock(accNumber);
    const actionAr = currentStatus === 'active' ? `تجميد حساب المشترك ${name}` : `إلغاء تجميد حساب المشترك ${name}`;
    const actionEn = currentStatus === 'active' ? `Freeze Subscriber Account ${accNumber}` : `Unfreeze Subscriber Account ${accNumber}`;
    onAddAuditLog(
      actionAr,
      actionEn,
      accNumber,
      `إجراء إشرافي مباشر من مصمم التطبيق على الحساب ${accNumber}`
    );
  };

  const handleSendNotificationToSubscriber = (sub: Subscriber) => {
    const msg = prompt(
      isAr ? `أدخل رسالة التنبيه الفوري للمشترك (${sub.fullName}):` : `Enter push notification text for (${sub.fullName}):`,
      isAr ? 'تنبيه أمني من إدارة ساهل: يرجى مراجعة بيانات حسابك وتحديث كلمة السر.' : 'Security alert from SAHEL Admin.'
    );
    if (msg) {
      alert(isAr ? `تم إرسال التنبيه الفوري بنجاح إلى جهاز ${sub.deviceModel}` : `Notification pushed to ${sub.deviceModel}`);
      onAddAuditLog(
        `إرسال تنبيه مباشر للمشترك ${sub.fullName}`,
        `Sent push notification to ${sub.fullName}`,
        sub.accountNumber,
        msg
      );
    }
  };

  const selectedTicket = complaints.find((c) => c.id === selectedTicketId);

  return (
    <div className="space-y-4 pb-20 text-black">
      {/* Top Banner: Designer Exclusivity & Safe Exit */}
      <div className="bg-stone-950 text-amber-400 rounded-3xl p-5 border-2 border-black shadow-md space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-black shadow-sm">
              <KeyRound className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-amber-300">
                  {isAr ? 'لوحة تحكم مصمم التطبيق — المراقبة الشاملة' : 'App Designer Master Dashboard'}
                </h1>
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
                  {isAr ? 'خاص بالمطور فقط' : 'CREATOR ONLY'}
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-bold mt-0.5">
                {isAr
                  ? 'مراقبة حسابات المشتركين، أداء الخوادم، حركة العمليات، وضوابط الحماية المركزية'
                  : 'Exclusive access to subscriber directory, app performance, and core controls'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Client App Button */}
            <button
              type="button"
              onClick={onCloseAdmin}
              className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs cursor-pointer transition-transform active:scale-95 shadow-xs"
              title={isAr ? 'معاينة واجهة العميل' : 'View Client App'}
            >
              {isAr ? 'معاينة واجهة العميل' : 'Client View'}
            </button>

            {/* Lock & Safe Exit Button */}
            <button
              type="button"
              onClick={onLockDashboardAndExit}
              className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-xs"
              title={isAr ? 'قفل اللوحة وتسجيل خروج المصمم التام' : 'Lock & Exit Dashboard'}
            >
              <LogOut className="w-3.5 h-3.5 text-white" />
              <span>{isAr ? 'قفل اللوحة وخروج تام' : 'Lock & Exit'}</span>
            </button>
          </div>
        </div>

        {/* Security Assurance Notice */}
        <div className="bg-black/60 p-2.5 rounded-xl border border-amber-400/30 text-[11px] font-bold text-amber-300 flex items-center justify-between flex-wrap gap-2">
          <span>🔒 {isAr ? 'هذه اللوحة لا تظهر لأي مستخدم يحمل التطبيق وتتطلب كلمة سر المصمم للدخول.' : 'This panel is completely hidden from anyone downloading the app.'}</span>
          <span className="text-[10px] font-mono text-amber-400">PIN: {systemSettings.designerMasterPin || '7788'}</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-amber-400 p-2 rounded-2xl border-2 border-black flex items-center gap-1.5 overflow-x-auto shadow-xs text-xs font-black scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2 rounded-xl cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-amber-300'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{isAr ? 'نظرة عامة' : 'Overview'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subscribers')}
          className={`px-3 py-2 rounded-xl cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'subscribers' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-amber-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isAr ? 'مراقبة المشتركين' : 'Subscribers'}</span>
          <span className="bg-amber-300 text-black text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            {subscribers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('app_health')}
          className={`px-3 py-2 rounded-xl cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'app_health' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-amber-300'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{isAr ? 'متابعة التطبيق والخوادم' : 'App Health'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`px-3 py-2 rounded-xl cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'transactions' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-amber-300'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>{isAr ? 'العمليات المركزية' : 'Transactions'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('refunds')}
          className={`px-3 py-2 rounded-xl cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 relative ${
            activeTab === 'refunds' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-amber-300'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isAr ? 'طلبات الاسترداد' : 'Refunds'}</span>
          {pendingRefundsCount > 0 && (
            <span className="bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {pendingRefundsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('complaints')}
          className={`px-3 py-2 rounded-xl cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 relative ${
            activeTab === 'complaints' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-amber-300'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isAr ? 'الشكاوى والنزاعات' : 'Disputes'}</span>
          {openComplaintsCount > 0 && (
            <span className="bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {openComplaintsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-2 rounded-xl cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'audit' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-amber-300'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>{isAr ? 'سجل التدقيق' : 'Audit Logs'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-2 rounded-xl cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'settings' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-amber-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{isAr ? 'ضوابط النظام' : 'System Controls'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW METRICS */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Total Subscribers */}
            <div className="bg-amber-300 p-4 rounded-3xl border-2 border-black shadow-xs space-y-1">
              <div className="flex items-center justify-between text-black/70">
                <span className="text-xs font-bold">{isAr ? 'المشتركون المسجلون:' : 'Total Subscribers:'}</span>
                <Users className="w-4 h-4 text-black" />
              </div>
              <span className="text-2xl font-black text-black block">{totalSubscribersCount}</span>
              <span className="text-[10px] text-green-800 font-bold block">
                {activeSubscribersCount} {isAr ? 'نشط' : 'Active'} · {frozenSubscribersCount} {isAr ? 'مجمّد' : 'Frozen'}
              </span>
            </div>

            {/* 2. Total Network Liquidity */}
            <div className="bg-amber-300 p-4 rounded-3xl border-2 border-black shadow-xs space-y-1">
              <div className="flex items-center justify-between text-black/70">
                <span className="text-xs font-bold">{isAr ? 'أرصدة المشتركين:' : 'Total Deposits:'}</span>
                <Building className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg sm:text-xl font-black text-black tabular-nums block">
                {totalSubscribersBalance.toLocaleString('en-US')}
              </span>
              <span className="text-[10px] text-black/70 font-bold block">{isAr ? 'جنيه سوداني مودع' : 'Total SDG Liquidity'}</span>
            </div>

            {/* 3. Transaction Volume */}
            <div className="bg-amber-300 p-4 rounded-3xl border-2 border-black shadow-xs space-y-1">
              <div className="flex items-center justify-between text-black/70">
                <span className="text-xs font-bold">{isAr ? 'حجم التداول:' : 'Total Volume:'}</span>
                <ArrowRightLeft className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg sm:text-xl font-black text-black tabular-nums block">
                {totalVolume.toLocaleString('en-US')}
              </span>
              <span className="text-[10px] text-black/70 font-bold block">{transactions.length} {isAr ? 'معاملة مسجلة' : 'Transactions'}</span>
            </div>

            {/* 4. Virtual Visa Cards */}
            <div className="bg-amber-300 p-4 rounded-3xl border-2 border-black shadow-xs space-y-1">
              <div className="flex items-center justify-between text-black/70">
                <span className="text-xs font-bold">{isAr ? 'بطاقات فيزا الافتراضية:' : 'Visa Cards:'}</span>
                <CreditCard className="w-4 h-4 text-black" />
              </div>
              <span className="text-2xl font-black text-black block">{visaHoldersCount}</span>
              <span className="text-[10px] text-green-800 font-bold block">3D Secure {isAr ? 'نشط ومعتمد' : 'Active'}</span>
            </div>
          </div>

          {/* System Performance & Live Health */}
          <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm space-y-3">
            <h2 className="text-sm font-black text-black pb-2 border-b-2 border-black/10 flex items-center justify-between">
              <span>{isAr ? 'مؤشرات أداء تطبيق ساهل الحية:' : 'Live System Performance Metrics:'}</span>
              <span className="text-[11px] bg-green-700 text-white px-2 py-0.5 rounded-full font-black">
                {isAr ? 'الخوادم تعمل بكفاءة 99.98%' : 'System Operational 99.98%'}
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
              <div className="bg-amber-200 p-3.5 rounded-2xl border-2 border-black space-y-1">
                <span className="text-black/70 block">{isAr ? 'معدل نجاح المعاملات:' : 'Success Rate:'}</span>
                <span className="text-xl font-black text-green-800">99.85%</span>
                <span className="text-[10px] text-black/70 block">{isAr ? 'معاملات فورية دون انقطاع' : 'Zero dropped settlements'}</span>
              </div>

              <div className="bg-amber-200 p-3.5 rounded-2xl border-2 border-black space-y-1">
                <span className="text-black/70 block">{isAr ? 'متوسط سرعة المعالجة:' : 'Avg Response Time:'}</span>
                <span className="text-xl font-black text-black font-mono">0.68s</span>
                <span className="text-[10px] text-black/70 block">{isAr ? 'تنفيذ فوري تحت الثانية' : 'Sub-second real-time execution'}</span>
              </div>

              <div className="bg-amber-200 p-3.5 rounded-2xl border-2 border-black space-y-1">
                <span className="text-black/70 block">{isAr ? 'النزاعات والشكاوى:' : 'Pending Disputes:'}</span>
                <span className="text-xl font-black text-black font-mono">{openComplaintsCount}</span>
                <span className="text-[10px] text-black/70 block">{isAr ? 'قيد المتابعة والحل' : 'Under active investigation'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SUBSCRIBERS MONITORING (مراقبة المشتركين) */}
      {/* ========================================================================= */}
      {activeTab === 'subscribers' && (
        <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-4 animate-in fade-in">
          {/* Header & Filter Controls */}
          <div className="space-y-3 pb-3 border-b-2 border-black/10">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base font-black text-black">
                  {isAr ? 'دليل ومراقبة المشتركين في التطبيق:' : 'Subscribers Directory & Live Monitor:'}
                </h2>
                <span className="text-xs text-black/70 font-bold block">
                  {isAr ? 'مراقبة أرصدة المشتركين، نشاط الأجهزة، والتحكم الفوري في الحسابات' : 'Monitor balances, devices, and control accounts in real-time'}
                </span>
              </div>

              <span className="text-xs font-black bg-black text-amber-400 px-3 py-1 rounded-xl">
                {filteredSubscribers.length} {isAr ? 'مشترك مطابق' : 'Matching'}
              </span>
            </div>

            {/* Search Input & Status Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute start-3 top-3.5 text-black/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'البحث بالاسم، رقم الحساب، الهاتف، أو المدينة...' : 'Search subscriber by name, account, phone, city...'}
                  className="w-full h-11 ps-9 pe-3 rounded-xl border-2 border-black bg-amber-100 text-xs font-black text-black placeholder:text-black/50 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs font-black">
                <button
                  type="button"
                  onClick={() => setSubscriberFilter('all')}
                  className={`px-3 py-2 rounded-xl border-2 border-black cursor-pointer ${
                    subscriberFilter === 'all' ? 'bg-black text-amber-400' : 'bg-amber-200 text-black hover:bg-white'
                  }`}
                >
                  {isAr ? 'الكل' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => setSubscriberFilter('active')}
                  className={`px-3 py-2 rounded-xl border-2 border-black cursor-pointer ${
                    subscriberFilter === 'active' ? 'bg-black text-amber-400' : 'bg-amber-200 text-black hover:bg-white'
                  }`}
                >
                  {isAr ? 'النشطون' : 'Active'}
                </button>
                <button
                  type="button"
                  onClick={() => setSubscriberFilter('frozen')}
                  className={`px-3 py-2 rounded-xl border-2 border-black cursor-pointer ${
                    subscriberFilter === 'frozen' ? 'bg-black text-amber-400' : 'bg-amber-200 text-black hover:bg-white'
                  }`}
                >
                  {isAr ? 'المجمّدون' : 'Frozen'}
                </button>
                <button
                  type="button"
                  onClick={() => setSubscriberFilter('visa')}
                  className={`px-3 py-2 rounded-xl border-2 border-black cursor-pointer ${
                    subscriberFilter === 'visa' ? 'bg-black text-amber-400' : 'bg-amber-200 text-black hover:bg-white'
                  }`}
                >
                  {isAr ? 'حاملو فيزا' : 'Visa'}
                </button>
              </div>
            </div>
          </div>

          {/* Subscribers Cards Grid */}
          <div className="space-y-3">
            {filteredSubscribers.map((sub) => {
              const isCurrentSessionUser = sub.accountNumber === user.accountNumber;
              const isFrozen = sub.status === 'frozen';

              return (
                <div
                  key={sub.id}
                  className={`p-4 rounded-2xl border-2 border-black transition-all ${
                    isFrozen ? 'bg-stone-200/90 border-red-700' : 'bg-amber-200/90'
                  }`}
                >
                  <div className="flex items-start justify-between flex-wrap gap-2 pb-2 border-b border-black/15">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-black text-amber-400 flex items-center justify-center font-black text-base border border-black shrink-0">
                        {sub.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-black">{sub.fullName}</span>
                          {isCurrentSessionUser && (
                            <span className="text-[10px] bg-black text-amber-400 px-2 py-0.5 rounded font-black">
                              {isAr ? 'الحساب الحالي المفتوح' : 'Current Active User'}
                            </span>
                          )}
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                              isFrozen ? 'bg-red-600 text-white' : 'bg-green-700 text-white'
                            }`}
                          >
                            {isFrozen ? (isAr ? 'مجمّد' : 'Frozen') : (isAr ? 'حساب نشط' : 'Active')}
                          </span>
                        </div>
                        <span className="text-xs text-black/70 font-semibold block mt-0.5">
                          {sub.fullNameEn} · {sub.tier}
                        </span>
                      </div>
                    </div>

                    <div className="text-end">
                      <span className="text-base font-black text-black tabular-nums block">
                        {(sub.balance || 0).toLocaleString('en-US')} ج.س
                      </span>
                      <span className="text-[10px] font-bold text-black/70 block">
                        {isAr ? 'الرصيد المتاح' : 'Available Balance'}
                      </span>
                    </div>
                  </div>

                  {/* Subscriber Details Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 text-[11px] font-bold text-black">
                    <div className="bg-amber-100 p-2 rounded-xl border border-black/20">
                      <span className="text-black/60 block text-[10px]">{isAr ? 'رقم الحساب والهاتف:' : 'Account & Phone:'}</span>
                      <span className="font-mono font-black">{sub.accountNumber}</span>
                      <span className="block font-mono text-[10px]">{sub.phoneNumber}</span>
                    </div>

                    <div className="bg-amber-100 p-2 rounded-xl border border-black/20">
                      <span className="text-black/60 block text-[10px]">{isAr ? 'الرقم الوطني والمدينة:' : 'National ID & City:'}</span>
                      <span className="font-mono font-black">{sub.nationalId}</span>
                      <span className="block text-[10px]">{sub.city}</span>
                    </div>

                    <div className="bg-amber-100 p-2 rounded-xl border border-black/20">
                      <span className="text-black/60 block text-[10px]">{isAr ? 'الجهاز المتصل والنشاط:' : 'Device & Activity:'}</span>
                      <span className="truncate block font-semibold">{sub.deviceModel}</span>
                      <span className="block text-[10px] text-green-800 font-black">{sub.lastActive}</span>
                    </div>

                    <div className="bg-amber-100 p-2 rounded-xl border border-black/20">
                      <span className="text-black/60 block text-[10px]">{isAr ? 'بطاقة فيزا والعمليات:' : 'Visa & Operations:'}</span>
                      <span className="font-black block">
                        {sub.hasVisaCard ? (
                          <span className="text-green-800">✓ {isAr ? 'مفعلة' : 'Visa Active'}</span>
                        ) : (
                          <span className="text-black/60">{isAr ? 'غير مصدرة' : 'None'}</span>
                        )}
                      </span>
                      <span className="block text-[10px] text-black/70">{sub.totalTransfersCount} {isAr ? 'عملية منفذة' : 'Transfers'}</span>
                    </div>
                  </div>

                  {/* Actions for Designer */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10 flex-wrap">
                    {/* 1. Send Direct Push Alert */}
                    <button
                      type="button"
                      onClick={() => handleSendNotificationToSubscriber(sub)}
                      className="px-3 py-1.5 rounded-xl border-2 border-black bg-amber-100 hover:bg-white text-black font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                    >
                      <Bell className="w-3.5 h-3.5 text-black" />
                      <span>{isAr ? 'إرسال تنبيه للمشترك' : 'Push Alert'}</span>
                    </button>

                    {/* 2. Freeze / Unfreeze Action Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleLock(sub.accountNumber, sub.status, sub.fullName)}
                      className={`px-3 py-1.5 rounded-xl border-2 border-black font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                        isFrozen
                          ? 'bg-green-700 hover:bg-green-800 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {isFrozen ? <Unlock className="w-3.5 h-3.5 text-white" /> : <Lock className="w-3.5 h-3.5 text-white" />}
                      <span>{isFrozen ? (isAr ? 'إلغاء التجميد' : 'Unfreeze') : (isAr ? 'تجميد الحساب فورياً' : 'Freeze Account')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: APP HEALTH & SERVER PERFORMANCE (متابعة التطبيق والخوادم) */}
      {/* ========================================================================= */}
      {activeTab === 'app_health' && (
        <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b-2 border-black/10">
            <div>
              <h2 className="text-sm font-black text-black">
                {isAr ? 'متابعة جاهزية بوابات التطبيق والشبكات:' : 'App Gateways & Network Health:'}
              </h2>
              <span className="text-xs text-black/70 font-bold">
                {isAr ? 'حالة الاتصال المباشر مع مزودي الخدمات في السودان والشبكات الدولية' : 'Live connection status for Sudanese telcos, utilities, and Visa'}
              </span>
            </div>
            <span className="w-3 h-3 rounded-full bg-green-600 animate-ping" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Zain */}
            <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-black">{isAr ? 'بوابة اتصالات زين (Zain SD):' : 'Zain Sudan Gateway:'}</span>
                <span className="text-[10px] bg-green-700 text-white px-2 py-0.5 rounded font-black">نشطة ومباشرة</span>
              </div>
              <p className="text-xs text-black/80 font-bold">زمن الاستجابة: 120ms · تغطية الشحن الفوري 100%</p>
            </div>

            {/* Sudani */}
            <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-black">{isAr ? 'بوابة سوداني (Sudani 4G):' : 'Sudani Gateway:'}</span>
                <span className="text-[10px] bg-green-700 text-white px-2 py-0.5 rounded font-black">نشطة ومباشرة</span>
              </div>
              <p className="text-xs text-black/80 font-bold">زمن الاستجابة: 145ms · تغطية الشحن الفوري 100%</p>
            </div>

            {/* MTN */}
            <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-black">{isAr ? 'بوابة إم تي إن (MTN SD):' : 'MTN Gateway:'}</span>
                <span className="text-[10px] bg-green-700 text-white px-2 py-0.5 rounded font-black">نشطة ومباشرة</span>
              </div>
              <p className="text-xs text-black/80 font-bold">زمن الاستجابة: 130ms · تغطية الشحن الفوري 100%</p>
            </div>

            {/* Electricity Grid */}
            <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-black">{isAr ? 'خادم الشركة القومية للكهرباء:' : 'National Electricity Grid:'}</span>
                <span className="text-[10px] bg-green-700 text-white px-2 py-0.5 rounded font-black">ربط إلكتروني معتمد</span>
              </div>
              <p className="text-xs text-black/80 font-bold">توليد التوكن الفوري 20 رقم بنجاح 100%</p>
            </div>

            {/* Visa Network */}
            <div className="bg-stone-900 text-amber-400 p-4 rounded-2xl border-2 border-black space-y-1 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-amber-300">
                  {isAr ? 'شبكة فيزا العالمية ومعايير 3D Secure الدولية:' : 'Global Visa & 3D Secure Network:'}
                </span>
                <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded font-black">
                  Visa Certified
                </span>
              </div>
              <p className="text-xs text-white/80 font-bold">
                {isAr
                  ? 'تفويض المشتريات الدولية، التوليد الآمن للأرقام PAN، واشتراكات Google و Netflix و Coursera تعمل بكفاءة تامة.'
                  : 'International e-commerce tokenization and 3D Secure authorization online.'}
              </p>
            </div>
          </div>

          {/* Emergency Kill-Switch / Maintenance Control */}
          <div className="bg-amber-100 p-4 rounded-2xl border-2 border-black space-y-3">
            <h3 className="text-xs font-black text-black">
              {isAr ? 'مفتاح الصيانة وحماية الطوارئ (Emergency Control):' : 'Emergency Maintenance Controls:'}
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-black text-xs text-black block">{isAr ? 'وضع الصيانة وإيقاف التحويلات المؤقت:' : 'Emergency Maintenance Mode:'}</span>
                <span className="text-[10px] text-black/70 font-bold">{isAr ? 'يمنع المستخدمين مؤقتاً من إرسال الأموال في حال الصيانة' : 'Temporarily halts transfers during updates'}</span>
              </div>

              <button
                type="button"
                onClick={() => onUpdateSystemSettings({ maintenanceMode: !systemSettings.maintenanceMode })}
                className={`px-4 py-2 rounded-xl font-black text-xs cursor-pointer border-2 border-black transition-all ${
                  systemSettings.maintenanceMode ? 'bg-red-600 text-white' : 'bg-amber-200 text-black hover:bg-white'
                }`}
              >
                {systemSettings.maintenanceMode ? (isAr ? 'وضع الصيانة مفعل 🔴' : 'Maintenance ON') : (isAr ? 'الوضع العادي 🟢' : 'Normal ON')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TRANSACTIONS LEDGER */}
      {/* ========================================================================= */}
      {activeTab === 'transactions' && (
        <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b-2 border-black/10">
            <h2 className="text-sm font-black text-black">
              {isAr ? 'سجل العمليات المالية المركزي (Central Ledger):' : 'Central Transaction Ledger:'}
            </h2>
            <span className="text-xs font-mono font-bold">{transactions.length} Transactions</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-amber-200 p-3.5 rounded-2xl border-2 border-black text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-black bg-amber-100 px-2 py-0.5 rounded border border-black/30">
                    {tx.referenceNo}
                  </span>
                  <span className="font-black text-sm text-black tabular-nums">
                    {Math.abs(tx.amount || 0).toLocaleString('en-US')} {isAr ? 'جنيه سوداني' : 'SDG'}
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

      {/* ========================================================================= */}
      {/* TAB 5: REFUND REQUESTS */}
      {/* ========================================================================= */}
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
                    {req.status === 'pending' ? (isAr ? 'قيد انتظار رد المستفيد' : 'Pending') : req.status}
                  </span>
                </div>

                <div className="flex justify-between font-bold">
                  <span>{isAr ? 'مقدم الطلب (المرسل):' : 'Applicant:'} {req.senderName}</span>
                  <span className="font-black text-sm tabular-nums">{(req.amount || 0).toLocaleString('en-US')} ج.س</span>
                </div>

                <div className="flex justify-between font-bold text-black/80">
                  <span>{isAr ? 'المستفيد المطلوب منه الإعادة:' : 'Recipient:'} {req.recipientName}</span>
                  <span>{req.createdAt}</span>
                </div>

                <p className="bg-amber-100 p-2 rounded-xl border border-black/20 text-[11px] font-bold">
                  {isAr ? 'السبب المعلن:' : 'Reason:'} {req.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: COMPLAINTS & DISPUTES */}
      {/* ========================================================================= */}
      {activeTab === 'complaints' && (
        <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-4 animate-in fade-in">
          <h2 className="text-sm font-black text-black pb-2 border-b-2 border-black/10">
            {isAr ? 'إدارة الشكاوى والنزاعات الرسمية:' : 'Formal Dispute Management:'}
          </h2>

          <div className="space-y-3">
            {complaints.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedTicketId(c.id)}
                className={`p-3.5 rounded-2xl border-2 border-black cursor-pointer transition-all ${
                  selectedTicketId === c.id ? 'bg-amber-100 shadow-sm' : 'bg-amber-200 hover:bg-amber-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-black">{c.id}</span>
                  <span className="bg-black text-amber-400 px-2 py-0.5 rounded font-black text-[10px]">
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold mt-1">
                  <span>{c.senderName} ➔ {c.recipientName}</span>
                  <span className="font-black">{(c.amount || 0).toLocaleString('en-US')} ج.س</span>
                </div>
              </div>
            ))}

            {selectedTicket && (
              <div className="bg-amber-100 p-4 rounded-2xl border-2 border-black space-y-3 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <h3 className="font-black text-black">{isAr ? 'تفاصيل التذكرة:' : 'Ticket Details:'} {selectedTicket.id}</h3>
                  <span className="font-mono font-bold">{selectedTicket.referenceNo}</span>
                </div>

                <div className="text-xs font-bold space-y-1">
                  <p>{isAr ? 'مبلغ النزاع:' : 'Disputed Amount:'} {(selectedTicket.amount || 0).toLocaleString('en-US')} ج.س</p>
                  <p>{isAr ? 'سبب الشكوى:' : 'Complaint Reason:'} {selectedTicket.reason}</p>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder={isAr ? 'أدخل قرار وإفادة مصمم النظام للبت في الشكوى...' : 'Enter resolution note...'}
                    className="w-full p-2 rounded-xl border-2 border-black bg-amber-50 text-xs font-bold resize-none focus:outline-none"
                  />
                </div>

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

      {/* ========================================================================= */}
      {/* TAB 7: AUDIT LOGS */}
      {/* ========================================================================= */}
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
              <div key={log.id} className="bg-amber-200 p-3 rounded-xl border-2 border-black text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-black">{isAr ? log.action : log.actionEn}</span>
                  <span className="text-[10px] text-black/70 font-mono">{log.timestamp}</span>
                </div>
                <div className="flex items-center justify-between text-black/80 font-bold text-[11px]">
                  <span>{isAr ? 'المنفذ:' : 'Actor:'} {log.actor}</span>
                  <span className="font-mono">{log.target}</span>
                </div>
                <p className="text-[11px] text-black/70 font-semibold">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: SYSTEM CONTROLS & MASTER SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-4 animate-in fade-in">
          <h2 className="text-sm font-black text-black pb-2 border-b-2 border-black/10">
            {isAr ? 'ضوابط النظام الرئيسية وإعدادات المصمم:' : 'Master System Settings:'}
          </h2>

          <div className="space-y-3">
            <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black flex items-center justify-between">
              <div>
                <span className="font-black text-sm text-black block">{isAr ? 'الرمز السري الرئيسي لمصمم التطبيق:' : 'Creator Master PIN:'}</span>
                <span className="text-[11px] text-black/70">{isAr ? 'رمز الدخول الحصري للوحة التحكم' : 'Protects this portal from unauthorized entry'}</span>
              </div>
              <span className="font-mono font-black text-lg bg-black text-amber-400 px-3 py-1 rounded-xl">
                {systemSettings.designerMasterPin || '7788'}
              </span>
            </div>

            <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black flex items-center justify-between">
              <div>
                <span className="font-black text-sm text-black block">{isAr ? 'السقف اليومي الأقصى للتحويل:' : 'Daily Transfer Limit:'}</span>
                <span className="text-[11px] text-black/70">{isAr ? 'الحد المسموح به لحسابات الهوية الوطنية' : 'Maximum allowed per calendar day'}</span>
              </div>
              <span className="font-mono font-black text-base text-black">{(systemSettings.dailyTransferLimit || 3000000).toLocaleString('en-US')} ج.س</span>
            </div>

            <div className="bg-amber-200 p-4 rounded-2xl border-2 border-black flex items-center justify-between">
              <div>
                <span className="font-black text-sm text-black block">{isAr ? 'سعر صرف الدولار المعتمد (USD):' : 'Official USD Exchange Rate:'}</span>
                <span className="text-[11px] text-black/70">{isAr ? 'سعر صرف بطاقات فيزا الافتراضية' : 'Applied for Virtual Visa card conversions'}</span>
              </div>
              <span className="font-mono font-black text-base text-black">1 USD = {(systemSettings.usdExchangeRate || 2650).toLocaleString('en-US')} ج.س</span>
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
          </div>
        </div>
      )}
    </div>
  );
};
