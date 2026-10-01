import React, { useState } from 'react';
import {
  Send,
  Download,
  CreditCard,
  Building2,
  Eye,
  EyeOff,
  SignalZero,
  ChevronRight,
  ChevronLeft,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { Beneficiary, Language, Transaction, UserAccount } from '../types';

interface HomeScreenProps {
  user: UserAccount;
  beneficiaries: Beneficiary[];
  recentTransactions: Transaction[];
  language: Language;
  onOpenAction: (action: 'send' | 'receive' | 'pay' | 'withdraw' | 'ussd') => void;
  onSelectBeneficiary: (beneficiary: Beneficiary) => void;
  onViewAllTransactions: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
  onAddBeneficiary: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  beneficiaries,
  recentTransactions,
  language,
  onOpenAction,
  onSelectBeneficiary,
  onViewAllTransactions,
  onSelectTransaction,
  onAddBeneficiary,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const isAr = language === 'ar';
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;

  const favoriteBeneficiaries = beneficiaries.filter((b) => b.isFavorite).slice(0, 5);

  return (
    <div className="space-y-4 pb-20 text-black">
      {/* Brand Hero & Balance Card */}
      <section className="bg-amber-300 rounded-3xl p-6 border-2 border-black shadow-sm relative overflow-hidden">
        {/* Top Wordmark & Tagline */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-black tracking-tight">ساهل</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-black text-amber-400 font-extrabold tracking-wider">
                SAHEL
              </span>
            </div>
            <p className="text-xs font-bold text-black/80 mt-1">
              {isAr ? 'قروشك أقرب وأسهل' : 'Simpler, Closer Financials'}
            </p>
          </div>

          <div className="text-end">
            <span className="text-[11px] text-black/80 font-bold block">
              {isAr ? 'رقم الحساب' : 'Account ID'}
            </span>
            <span className="font-mono text-xs font-black text-black bg-amber-200 border border-black/30 px-2 py-1 rounded-md mt-0.5 inline-block">
              {user.accountNumber}
            </span>
          </div>
        </div>

        {/* Available Balance Box */}
        <div className="bg-amber-200/90 rounded-2xl p-5 border-2 border-black">
          <div className="flex items-center justify-between text-black mb-2">
            <span className="text-xs font-black">
              {isAr ? 'الرصيد المتاح' : 'Available Balance'}
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="flex items-center gap-1.5 text-xs text-black font-bold hover:bg-black/10 transition-colors cursor-pointer min-h-[36px] px-2.5 rounded-lg border border-black/20"
            >
              {showBalance ? (
                <>
                  <EyeOff className="w-4 h-4 text-black" />
                  <span>{isAr ? 'إخفاء' : 'Hide'}</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-black" />
                  <span>{isAr ? 'إظهار' : 'Show'}</span>
                </>
              )}
            </button>
          </div>

          {/* Balance Figure */}
          <div className="flex items-baseline gap-2">
            {showBalance ? (
              <>
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-black tabular-nums">
                  {user.balance.toLocaleString('en-US')}
                </span>
                <span className="text-sm font-black text-black">
                  {isAr ? user.currency : user.currencyEn}
                </span>
              </>
            ) : (
              <span className="text-3xl font-black text-black tracking-widest">
                ••••••••••
              </span>
            )}
          </div>
        </div>
      </section>

      {/* THE FOUR VERY LARGE PRIMARY ACTIONS (إرسال، استلام، دفع، سحب) */}
      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-sm font-black text-black">
            {isAr ? 'الخدمات الأساسية السريعة' : 'Primary Quick Services'}
          </h2>
          <span className="text-[11px] text-black/80 font-bold">
            {isAr ? 'أقل عدد خطوات لإنجاز العملية' : 'Minimum Steps Needed'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 1. إرسال (Send) */}
          <button
            onClick={() => onOpenAction('send')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-amber-300 border-2 border-black hover:bg-amber-200 active:scale-[0.98] transition-all cursor-pointer shadow-sm min-h-[115px] group text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-black text-amber-400 flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-lg font-black text-black">
              {isAr ? 'إرسال' : 'Send'}
            </span>
            <span className="text-[11px] text-black/80 font-bold mt-0.5">
              {isAr ? 'تحويل فوري برقم الحساب' : 'Instant transfer by Account ID'}
            </span>
          </button>

          {/* 2. استلام (Receive) */}
          <button
            onClick={() => onOpenAction('receive')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-amber-300 border-2 border-black hover:bg-amber-200 active:scale-[0.98] transition-all cursor-pointer shadow-sm min-h-[115px] group text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-black text-amber-400 flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
              <Download className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-lg font-black text-black">
              {isAr ? 'استلام' : 'Receive'}
            </span>
            <span className="text-[11px] text-black/80 font-bold mt-0.5">
              {isAr ? 'كود QR وطلب مبلغ' : 'QR code & request money'}
            </span>
          </button>

          {/* 3. دفع (Pay) */}
          <button
            onClick={() => onOpenAction('pay')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-amber-300 border-2 border-black hover:bg-amber-200 active:scale-[0.98] transition-all cursor-pointer shadow-sm min-h-[115px] group text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-black text-amber-400 flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-lg font-black text-black">
              {isAr ? 'دفع' : 'Pay'}
            </span>
            <span className="text-[11px] text-black/80 font-bold mt-0.5">
              {isAr ? 'مشتريات وفواتير وتجار' : 'Merchants & bills'}
            </span>
          </button>

          {/* 4. سحب (Withdraw) */}
          <button
            onClick={() => onOpenAction('withdraw')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-amber-300 border-2 border-black hover:bg-amber-200 active:scale-[0.98] transition-all cursor-pointer shadow-sm min-h-[115px] group text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-black text-amber-400 flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-lg font-black text-black">
              {isAr ? 'سحب' : 'Withdraw'}
            </span>
            <span className="text-[11px] text-black/80 font-bold mt-0.5">
              {isAr ? 'صراف آلي أو وكيل دكان' : 'ATM & agent cash out'}
            </span>
          </button>
        </div>
      </section>

      {/* QUICK FAVORITES / SAVED RECIPIENTS (الأسرة، محمد، أحمد، العمل) */}
      <section className="bg-amber-300 rounded-2xl p-4 border-2 border-black shadow-sm text-black">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-black">
            {isAr ? 'المستفيدون المحفوظون (إرسال سريع)' : 'Favorites (Quick Send)'}
          </h2>
          <button
            onClick={onAddBeneficiary}
            className="text-xs text-black hover:bg-black/10 font-black flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-lg border border-black/30"
          >
            <Plus className="w-3.5 h-3.5 text-black" />
            <span>{isAr ? 'إضافة' : 'Add'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {favoriteBeneficiaries.map((beneficiary) => (
            <button
              key={beneficiary.id}
              onClick={() => onSelectBeneficiary(beneficiary)}
              className="flex flex-col items-center text-center shrink-0 min-w-[70px] group cursor-pointer"
            >
              <div
                className="w-14 h-14 rounded-2xl bg-black text-amber-400 flex items-center justify-center text-lg font-black shadow-sm border-2 border-black group-hover:scale-105 transition-transform"
              >
                {beneficiary.initials}
              </div>
              <span className="text-xs font-black text-black mt-1.5 truncate max-w-[74px]">
                {isAr ? beneficiary.name : beneficiary.nameEn}
              </span>
              <span className="text-[10px] text-black/80 font-bold truncate max-w-[74px]">
                {beneficiary.relationship || (isAr ? 'مستفيد' : 'Contact')}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* OFFLINE / LOW CONNECTIVITY CONCEPT CARD */}
      <section className="bg-black text-amber-400 rounded-2xl p-5 border-2 border-black shadow-md relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center shrink-0 font-black">
            <SignalZero className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-amber-400">
                {isAr ? 'لا يوجد إنترنت؟' : 'No Internet Available?'}
              </h3>
              <span className="text-[10px] bg-stone-800 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                USSD *789#
              </span>
            </div>
            <p className="text-xs text-amber-100/90 mt-1 leading-relaxed font-medium">
              {isAr
                ? 'يمكن استخدام القنوات البديلة المتاحة من المؤسسة المالية عبر كود الـ USSD السريع لإجراء العمليات الحيوية بدون إنترنت.'
                : 'Alternative access channels (such as USSD) remain fully accessible for essential transactions during internet disruptions.'}
            </p>
            <button
              onClick={() => onOpenAction('ussd')}
              className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <span>{isAr ? 'تجربة محاكي الـ USSD البديل' : 'Try Alternative USSD Simulator'}</span>
              <ChevronIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* RECENT TRANSACTIONS PREVIEW */}
      <section className="bg-amber-300 rounded-2xl p-4 border-2 border-black shadow-sm text-black">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-black">
            {isAr ? 'آخر العمليات' : 'Recent Activity'}
          </h2>
          <button
            onClick={onViewAllTransactions}
            className="text-xs text-black font-black flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-lg border border-black/30 hover:bg-black/10"
          >
            <span>{isAr ? 'عرض الكل' : 'View All'}</span>
            <ChevronIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y-2 divide-black/10">
          {recentTransactions.slice(0, 4).map((tx) => {
            const isPositive = tx.amount > 0;
            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="flex items-center justify-between py-3 hover:bg-black/5 rounded-xl px-2 -mx-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center shrink-0 border border-black">
                    {isPositive ? (
                      <ArrowDownLeft className="w-5 h-5 text-amber-400" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-black">
                      {tx.recipientOrSender}
                    </h3>
                    <p className="text-[11px] text-black/80 font-bold mt-0.5">
                      {isAr ? tx.title : tx.titleEn} · {tx.date}
                    </p>
                  </div>
                </div>

                <div className="text-end">
                  <span className="text-sm font-black tabular-nums text-black">
                    {isPositive ? '+' : ''}
                    {Math.abs(tx.amount).toLocaleString('en-US')}
                  </span>
                  <span className="text-[10px] text-black/80 font-bold block">
                    {isAr ? 'جنيه' : 'SDG'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
