import React, { useState } from 'react';
import {
  Send,
  ArrowDownLeft,
  Smartphone,
  Receipt,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Language, RefundRequest, Transaction, UserAccount } from '../types';

interface HomeScreenProps {
  user: UserAccount;
  recentTransactions: Transaction[];
  pendingIncomingRefunds: RefundRequest[];
  language: Language;
  onOpenAction: (action: 'send' | 'receive' | 'recharge' | 'bills') => void;
  onViewAllTransactions: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
  onOpenRefundReview: (refund: RefundRequest) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  recentTransactions,
  pendingIncomingRefunds,
  language,
  onOpenAction,
  onViewAllTransactions,
  onSelectTransaction,
  onOpenRefundReview,
}) => {
  const isAr = language === 'ar';
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="space-y-4 pb-20 text-black">
      {/* PENDING REFUND REQUEST NOTIFICATION (If someone sent money by mistake) */}
      {pendingIncomingRefunds.length > 0 && (
        <div className="bg-black text-amber-400 rounded-3xl p-4 border-2 border-black shadow-md space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-black text-amber-400">
              <RotateCcw className="w-4 h-4 text-amber-400 animate-spin" />
              {isAr ? 'تنبيه: وصلك طلب استرداد تحويل مالي' : 'Alert: Incoming Refund Request Received'}
            </span>
            <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded-full font-black">
              {pendingIncomingRefunds.length}
            </span>
          </div>

          {pendingIncomingRefunds.map((req) => (
            <div
              key={req.id}
              className="bg-stone-900 p-3.5 rounded-2xl border border-amber-400/30 flex items-center justify-between gap-3 flex-wrap"
            >
              <div>
                <p className="text-xs font-black text-white">
                  {isAr ? `طلب ${req.senderName} إعادة مبلغ:` : `${req.senderName} requested return of:`}
                </p>
                <p className="text-lg font-black text-amber-300 tabular-nums">
                  {req.amount.toLocaleString('en-US')} {isAr ? 'جنيه سوداني' : 'SDG'}
                </p>
                <p className="text-[11px] text-amber-200/80 font-bold mt-0.5">
                  {isAr ? `السبب: ${req.reason}` : `Reason: ${req.reason}`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenRefundReview(req)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-xs"
              >
                {isAr ? 'مراجعة الطلب (إعادة أو رفض)' : 'Review Request'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 1. BALANCE CARD (YOUR BALANCE / رصيدك) */}
      <section className="bg-amber-300 rounded-3xl p-6 border-2 border-black shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-extrabold text-black/80 tracking-wide uppercase">
            {isAr ? 'رصيدك' : 'Your Balance'}
          </span>
          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/30 hover:border-black bg-amber-200/80 text-black text-xs font-black cursor-pointer transition-colors"
            title={showBalance ? (isAr ? 'إخفاء الرصيد' : 'Hide Balance') : (isAr ? 'إظهار الرصيد' : 'Show Balance')}
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

        {/* Large Amount Display */}
        <div className="flex items-baseline gap-2 py-1">
          {showBalance ? (
            <>
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-black tabular-nums">
                {user.balance.toLocaleString('en-US')}
              </span>
              <span className="text-lg font-black text-black">
                {isAr ? user.currency : user.currencyEn}
              </span>
            </>
          ) : (
            <span className="text-4xl sm:text-5xl font-black tracking-widest text-black">
              ••••••••
            </span>
          )}
        </div>

        {/* User Account ID Pill */}
        <div className="mt-3 pt-3 border-t border-black/20 flex items-center justify-between text-xs font-bold text-black/80">
          <div className="flex items-center gap-1.5">
            <span className="font-bold">{isAr ? 'حساب ساهل:' : 'SAHEL Account:'}</span>
            <span className="font-mono font-black text-black">{user.accountNumber}</span>
          </div>
          <span className="text-[11px] bg-black text-amber-400 px-2 py-0.5 rounded-md font-bold">
            {isAr ? 'حساب نشط' : 'Active'}
          </span>
        </div>
      </section>

      {/* 2. THE FOUR LARGE PRIMARY ACTIONS */}
      <section>
        <div className="grid grid-cols-2 gap-3.5">
          {/* Action 1: Send Money (إرسال الأموال) */}
          <button
            type="button"
            onClick={() => onOpenAction('send')}
            className="flex flex-col items-center justify-center p-6 rounded-3xl bg-amber-300 border-2 border-black hover:bg-amber-200 active:scale-[0.98] transition-all cursor-pointer shadow-sm min-h-[140px] text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-black text-amber-400 flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-105 transition-transform border border-black">
              <Send className="w-7 h-7 text-amber-400" />
            </div>
            <span className="text-base sm:text-lg font-black text-black leading-tight">
              {isAr ? 'إرسال الأموال' : 'Send Money'}
            </span>
          </button>

          {/* Action 2: Receive Money (استلام الأموال) */}
          <button
            type="button"
            onClick={() => onOpenAction('receive')}
            className="flex flex-col items-center justify-center p-6 rounded-3xl bg-amber-300 border-2 border-black hover:bg-amber-200 active:scale-[0.98] transition-all cursor-pointer shadow-sm min-h-[140px] text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-black text-amber-400 flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-105 transition-transform border border-black">
              <ArrowDownLeft className="w-7 h-7 text-amber-400" />
            </div>
            <span className="text-base sm:text-lg font-black text-black leading-tight">
              {isAr ? 'استلام الأموال' : 'Receive Money'}
            </span>
          </button>

          {/* Action 3: Mobile Recharge (شحن الرصيد) */}
          <button
            type="button"
            onClick={() => onOpenAction('recharge')}
            className="flex flex-col items-center justify-center p-6 rounded-3xl bg-amber-300 border-2 border-black hover:bg-amber-200 active:scale-[0.98] transition-all cursor-pointer shadow-sm min-h-[140px] text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-black text-amber-400 flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-105 transition-transform border border-black">
              <Smartphone className="w-7 h-7 text-amber-400" />
            </div>
            <span className="text-base sm:text-lg font-black text-black leading-tight">
              {isAr ? 'شحن الرصيد' : 'Mobile Recharge'}
            </span>
          </button>

          {/* Action 4: Pay Bills (دفع الفواتير) */}
          <button
            type="button"
            onClick={() => onOpenAction('bills')}
            className="flex flex-col items-center justify-center p-6 rounded-3xl bg-amber-300 border-2 border-black hover:bg-amber-200 active:scale-[0.98] transition-all cursor-pointer shadow-sm min-h-[140px] text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-black text-amber-400 flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-105 transition-transform border border-black">
              <Receipt className="w-7 h-7 text-amber-400" />
            </div>
            <span className="text-base sm:text-lg font-black text-black leading-tight">
              {isAr ? 'دفع الفواتير' : 'Pay Bills'}
            </span>
          </button>
        </div>
      </section>

      {/* 3. RECENT TRANSACTIONS (آخر المعاملات) */}
      <section className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-black/10">
          <h2 className="text-base font-black text-black">
            {isAr ? 'آخر المعاملات' : 'Recent Transactions'}
          </h2>
          <button
            type="button"
            onClick={onViewAllTransactions}
            className="flex items-center gap-1 text-xs font-black text-black hover:underline cursor-pointer bg-amber-200/90 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-black/20"
          >
            <span>{isAr ? 'عرض الكل' : 'View All'}</span>
            <ChevronIcon className="w-3.5 h-3.5 text-black" />
          </button>
        </div>

        <div className="divide-y-2 divide-black/10">
          {recentTransactions.slice(0, 4).map((tx) => {
            const isOut = tx.amount < 0;
            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="flex items-center justify-between py-3.5 hover:bg-black/5 rounded-2xl px-2 -mx-1 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-black text-amber-400 flex items-center justify-center shrink-0 border border-black">
                    {isOut ? (
                      <ArrowUpRight className="w-5 h-5 text-amber-400" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-black block leading-tight">
                      {isAr ? tx.recipientName || tx.title : tx.recipientName || tx.titleEn}
                    </span>
                    <span className="text-[11px] text-black/80 font-bold block mt-0.5">
                      {tx.date} · {tx.time}
                    </span>
                  </div>
                </div>

                <div className="text-end">
                  <span className="text-xs sm:text-sm font-black tabular-nums block text-black">
                    {isOut ? '-' : '+'}
                    {Math.abs(tx.amount).toLocaleString('en-US')} {isAr ? 'ج.س' : 'SDG'}
                  </span>
                  {tx.refundStatus === 'requested' && (
                    <span className="text-[10px] bg-black text-amber-400 px-1.5 py-0.5 rounded font-black mt-0.5 inline-block">
                      {isAr ? 'طلب استرداد معلق' : 'Refund Pending'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
