import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  FileText,
  X,
  Share2,
  Download,
  Check,
  RotateCcw,
  ShieldAlert,
  AlertCircle,
  Smartphone,
  Receipt,
} from 'lucide-react';
import { Language, Transaction } from '../types';
import { downloadReceiptAsImage } from '../utils/receiptGenerator';
import { ReceiptShareModal } from './ReceiptShareModal';

interface TransactionsScreenProps {
  transactions: Transaction[];
  language: Language;
  selectedTransaction: Transaction | null;
  onSelectTransaction: (tx: Transaction | null) => void;
  onRequestRefund: (tx: Transaction) => void;
  onReportTransaction: (tx: Transaction) => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  transactions,
  language,
  selectedTransaction,
  onSelectTransaction,
  onRequestRefund,
  onReportTransaction,
}) => {
  const isAr = language === 'ar';
  const [filter, setFilter] = useState<'all' | 'transfer' | 'recharge' | 'bill'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);
  const [receiptDownloaded, setReceiptDownloaded] = useState(false);

  const filteredTransactions = transactions.filter((tx) => {
    // Filter category
    if (filter === 'transfer' && tx.category !== 'transfer') return false;
    if (filter === 'recharge' && tx.category !== 'recharge') return false;
    if (filter === 'bill' && tx.category !== 'bill') return false;

    // Filter search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (tx.recipientName || '').toLowerCase().includes(q);
      const matchSender = (tx.senderName || '').toLowerCase().includes(q);
      const matchTitle = (isAr ? tx.title : tx.titleEn).toLowerCase().includes(q);
      const matchRef = tx.referenceNo.toLowerCase().includes(q);
      const matchAcc = (tx.recipientAccount || '').toLowerCase().includes(q);
      return matchName || matchSender || matchTitle || matchRef || matchAcc;
    }
    return true;
  });

  const handleDownload = async () => {
    if (!selectedTransaction) return;
    setIsDownloadingReceipt(true);
    const ok = await downloadReceiptAsImage(selectedTransaction, isAr);
    setIsDownloadingReceipt(false);
    if (ok) {
      setReceiptDownloaded(true);
      setTimeout(() => setReceiptDownloaded(false), 3000);
    }
  };

  const getRefundBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return {
          label: isAr ? 'طلب استرداد معلق' : 'Refund Pending',
          color: 'bg-black text-amber-400',
        };
      case 'accepted':
        return {
          label: isAr ? 'تم استرداد المبلغ' : 'Refund Accepted',
          color: 'bg-green-700 text-white',
        };
      case 'declined':
        return {
          label: isAr ? 'رفض المستفيد الإرجاع' : 'Refund Declined',
          color: 'bg-red-600 text-white',
        };
      case 'disputed':
        return {
          label: isAr ? 'نزاع مفتوح لدى الإدارة' : 'Dispute Escalated',
          color: 'bg-amber-400 text-black border border-black',
        };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 pb-20 text-black">
      {/* Page Title & Search Bar */}
      <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm space-y-3">
        <div>
          <h1 className="text-xl font-black text-black">
            {isAr ? 'سجل المعاملات (Transaction History)' : 'Transaction History'}
          </h1>
          <p className="text-xs text-black/80 font-bold">
            {isAr ? 'حفظ وتدقيق كامل لجميع العمليات المالية وحالات الاسترداد' : 'Full audit trail of all transactions and refund statuses'}
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder={isAr ? 'ابحث باسم المستفيد، رقم الحساب، أو رقم العملية...' : 'Search recipient, account, or reference...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 ps-9 pe-4 rounded-xl border-2 border-black bg-amber-200 text-xs font-bold text-black placeholder:text-black/60 focus:bg-amber-100 focus:outline-none"
          />
          <Search className="w-4 h-4 text-black absolute top-3.5 start-3" />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-amber-200/90 rounded-xl border border-black/30 text-xs font-black overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filter === 'all' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-black/10'
            }`}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          <button
            type="button"
            onClick={() => setFilter('transfer')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filter === 'transfer' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-black/10'
            }`}
          >
            {isAr ? 'التحويلات' : 'Transfers'}
          </button>
          <button
            type="button"
            onClick={() => setFilter('recharge')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filter === 'recharge' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-black/10'
            }`}
          >
            {isAr ? 'شحن الرصيد' : 'Recharge'}
          </button>
          <button
            type="button"
            onClick={() => setFilter('bill')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filter === 'bill' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-black/10'
            }`}
          >
            {isAr ? 'الفواتير' : 'Bills'}
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-amber-300 rounded-3xl p-4 border-2 border-black shadow-sm">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-black/70 text-xs font-bold">
            <FileText className="w-8 h-8 mx-auto mb-2 text-black/50" />
            <p>{isAr ? 'لا توجد معاملات تطابق البحث' : 'No transactions match your query'}</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-black/10">
            {filteredTransactions.map((tx) => {
              const isOut = tx.amount < 0;
              const refundBadge = getRefundBadge(tx.refundStatus);

              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="flex items-center justify-between py-3.5 hover:bg-black/5 rounded-2xl px-2.5 -mx-1 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-black text-amber-400 flex items-center justify-center shrink-0 border border-black">
                      {tx.category === 'recharge' ? (
                        <Smartphone className="w-5 h-5 text-amber-400" />
                      ) : tx.category === 'bill' ? (
                        <Receipt className="w-5 h-5 text-amber-400" />
                      ) : isOut ? (
                        <ArrowUpRight className="w-5 h-5 text-amber-400" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-black text-black block leading-tight">
                        {tx.recipientName || tx.title}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-black/80 font-bold mt-0.5">
                        <span>{tx.date} · {tx.time}</span>
                        <span>·</span>
                        <span className="font-mono">{tx.referenceNo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-end">
                    <span className="text-xs sm:text-sm font-black tabular-nums block text-black">
                      {isOut ? '-' : '+'}
                      {Math.abs(tx.amount).toLocaleString('en-US')} {isAr ? 'ج.س' : 'SDG'}
                    </span>
                    {refundBadge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-black mt-0.5 inline-block ${refundBadge.color}`}>
                        {refundBadge.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FULL TRANSACTION DETAILS MODAL */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 border-2 border-black max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-black/20">
              <div>
                <h3 className="text-base font-black text-black">
                  {isAr ? 'تفاصيل المعاملة المالية' : 'Transaction Details'}
                </h3>
                <span className="text-[10px] text-black/80 font-mono font-bold block">
                  {selectedTransaction.referenceNo}
                </span>
              </div>
              <button
                onClick={() => onSelectTransaction(null)}
                className="w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Amount Banner */}
            <div className="text-center py-2 bg-amber-200 rounded-2xl border-2 border-black">
              <span className="text-xs text-black/80 font-bold block">
                {isAr ? selectedTransaction.title : selectedTransaction.titleEn}
              </span>
              <div className="my-1">
                <span className="text-3xl font-black tabular-nums text-black">
                  {selectedTransaction.amount > 0 ? '+' : '-'}
                  {Math.abs(selectedTransaction.amount).toLocaleString('en-US')}
                </span>
                <span className="text-sm font-black text-black ms-1.5">
                  {isAr ? 'جنيه سوداني' : 'SDG'}
                </span>
              </div>
              <span className="text-xs font-black text-black">
                {selectedTransaction.recipientName}
              </span>
            </div>

            {/* Comprehensive Detail Table according to specification */}
            <div className="bg-amber-200/90 rounded-2xl p-4 border-2 border-black space-y-2.5 text-xs text-black">
              <div className="flex items-center justify-between">
                <span className="font-bold text-black/80">{isAr ? 'اسم المستفيد / المرسل:' : 'Recipient / Sender:'}</span>
                <span className="font-black text-black text-end">{selectedTransaction.recipientName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-black/80">{isAr ? 'رقم الحساب:' : 'Account ID:'}</span>
                <span className="font-mono font-black text-black">{selectedTransaction.recipientAccount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-black/80">{isAr ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                <span className="font-mono font-black text-black">{selectedTransaction.recipientPhone}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-black/80">{isAr ? 'رقم العملية (Transaction ID):' : 'Transaction ID:'}</span>
                <span className="font-mono font-black text-black">{selectedTransaction.referenceNo}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-black/80">{isAr ? 'التاريخ والوقت:' : 'Date & Time:'}</span>
                <span className="font-bold text-black">{selectedTransaction.date} · {selectedTransaction.time}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-black/80">{isAr ? 'نوع العملية:' : 'Operation Type:'}</span>
                <span className="font-black text-black">{isAr ? selectedTransaction.title : selectedTransaction.titleEn}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-black/80">{isAr ? 'حالة العملية:' : 'Status:'}</span>
                <span className="font-black text-black bg-amber-300 border border-black px-2 py-0.5 rounded">
                  {isAr ? 'مكتملة وناجحة' : 'Completed'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-black/80">{isAr ? 'رسوم المعاملة:' : 'Fee:'}</span>
                <span className="font-black text-black">{isAr ? '0 جنيه (مجاناً)' : '0 SDG'}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-black/15">
                <span className="font-bold text-black/80">{isAr ? 'حالة الاسترداد:' : 'Refund Status:'}</span>
                <span className="font-black text-black">
                  {selectedTransaction.refundStatus === 'none' && (isAr ? 'لا يوجد طلب استرداد' : 'None')}
                  {selectedTransaction.refundStatus === 'requested' && (isAr ? 'تم إرسال طلب استرداد وبانتظار الرد' : 'Refund Pending')}
                  {selectedTransaction.refundStatus === 'accepted' && (isAr ? 'تمت استعادة المبلغ بنجاح ✓' : 'Refund Completed')}
                  {selectedTransaction.refundStatus === 'declined' && (isAr ? 'تم رفض الاسترداد من المستفيد' : 'Declined')}
                  {selectedTransaction.refundStatus === 'disputed' && (isAr ? 'تذكرة نزاع مفتوحة لدى الإدارة' : 'Under Dispute')}
                </span>
              </div>
            </div>

            {/* WRONG TRANSFER RECOVERY ACTION ZONE */}
            {selectedTransaction.type === 'transfer_out' && (
              <div className="space-y-2 pt-1">
                {selectedTransaction.refundStatus === 'none' && (
                  <button
                    type="button"
                    onClick={() => {
                      onRequestRefund(selectedTransaction);
                      onSelectTransaction(null);
                    }}
                    className="w-full h-12 rounded-2xl border-2 border-black bg-black hover:bg-stone-900 text-amber-400 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'طلب استرداد (Request Refund)' : 'Request Refund'}</span>
                  </button>
                )}

                {/* If declined or requested, offer escalation to formal dispute */}
                {(selectedTransaction.refundStatus === 'declined' ||
                  selectedTransaction.refundStatus === 'requested') && (
                  <button
                    type="button"
                    onClick={() => {
                      onReportTransaction(selectedTransaction);
                      onSelectTransaction(null);
                    }}
                    className="w-full h-12 rounded-2xl border-2 border-red-700 bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    <ShieldAlert className="w-4 h-4 text-white" />
                    <span>{isAr ? 'الإبلاغ عن المعاملة (Report Transaction)' : 'Report Transaction'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Primary Share & Download Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="h-12 rounded-xl bg-black hover:bg-stone-900 text-amber-400 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'مشاركة الإشعار' : 'Share Receipt'}</span>
              </button>

              <button
                type="button"
                disabled={isDownloadingReceipt}
                onClick={handleDownload}
                className="h-12 rounded-xl border-2 border-black bg-amber-100 hover:bg-white text-black font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                {isDownloadingReceipt ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : receiptDownloaded ? (
                  <Check className="w-4 h-4 text-green-700" />
                ) : (
                  <Download className="w-4 h-4 text-black" />
                )}
                <span>
                  {receiptDownloaded
                    ? (isAr ? 'تم التنزيل!' : 'Downloaded!')
                    : (isAr ? 'تنزيل الإشعار (صورة)' : 'Download (PNG)')}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onSelectTransaction(null)}
              className="w-full h-11 rounded-xl border-2 border-black/40 text-black font-black text-xs hover:bg-black/10 cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Share & Download Modal */}
      {showShareModal && selectedTransaction && (
        <ReceiptShareModal
          transaction={selectedTransaction}
          language={language}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
