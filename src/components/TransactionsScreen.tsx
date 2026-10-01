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
} from 'lucide-react';
import { Language, Transaction } from '../types';
import { downloadReceiptAsImage } from '../utils/receiptGenerator';
import { ReceiptShareModal } from './ReceiptShareModal';

interface TransactionsScreenProps {
  transactions: Transaction[];
  language: Language;
  selectedTransaction: Transaction | null;
  onSelectTransaction: (tx: Transaction | null) => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  transactions,
  language,
  selectedTransaction,
  onSelectTransaction,
}) => {
  const isAr = language === 'ar';
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);
  const [receiptDownloaded, setReceiptDownloaded] = useState(false);

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

  const filteredTransactions = transactions.filter((tx) => {
    // Filter by type
    if (filter === 'in' && tx.amount <= 0) return false;
    if (filter === 'out' && tx.amount >= 0) return false;

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = tx.recipientOrSender.toLowerCase().includes(q);
      const matchTitle = (isAr ? tx.title : tx.titleEn).toLowerCase().includes(q);
      const matchRef = tx.referenceNo.toLowerCase().includes(q);
      return matchName || matchTitle || matchRef;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-20 text-black">
      {/* Page Title & Search Bar */}
      <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm space-y-3">
        <div>
          <h1 className="text-xl font-black text-black">
            {isAr ? 'سجل العمليات والتحويلات' : 'Activity & History'}
          </h1>
          <p className="text-xs text-black/80 font-bold">
            {isAr ? 'عرض فوري لجميع حركات الأموال الواردة والصادرة' : 'Instant view of incoming & outgoing funds'}
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder={isAr ? 'ابحث باسم الشخص، المتجر، أو رقم الإشعار...' : 'Search by person, merchant, or reference...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 ps-9 pe-4 rounded-xl border-2 border-black bg-amber-200 text-xs font-bold text-black placeholder:text-black/60 focus:bg-amber-100 focus:outline-none"
          />
          <Search className="w-4 h-4 text-black absolute top-3.5 start-3" />
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-amber-200/90 rounded-xl border border-black/30">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              filter === 'all' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-black/10'
            }`}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          <button
            type="button"
            onClick={() => setFilter('in')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              filter === 'in' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-black/10'
            }`}
          >
            {isAr ? 'الوارد (+)' : 'Incoming (+)'}
          </button>
          <button
            type="button"
            onClick={() => setFilter('out')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              filter === 'out' ? 'bg-black text-amber-400 shadow-xs' : 'text-black hover:bg-black/10'
            }`}
          >
            {isAr ? 'المنصرف (-)' : 'Outgoing (-)'}
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-amber-300 rounded-3xl p-4 border-2 border-black shadow-sm">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-black/70 text-xs font-bold">
            <FileText className="w-8 h-8 mx-auto mb-2 text-black/50" />
            <p>{isAr ? 'لا توجد عمليات تطابق البحث' : 'No transactions match your search'}</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-black/10">
            {filteredTransactions.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="flex items-center justify-between py-3.5 hover:bg-black/5 rounded-2xl px-2.5 -mx-1 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-black text-amber-400 flex items-center justify-center shrink-0 border border-black">
                      {isPositive ? <ArrowDownLeft className="w-5 h-5 text-amber-400" /> : <ArrowUpRight className="w-5 h-5 text-amber-400" />}
                    </div>

                    <div>
                      <h3 className="text-xs font-black text-black">{tx.recipientOrSender}</h3>
                      <p className="text-[11px] text-black/80 font-bold mt-0.5">
                        {isAr ? tx.title : tx.titleEn} · {tx.date} {tx.time}
                      </p>
                      {tx.phoneOrAccount && (
                        <span className="text-[10px] text-black/70 font-mono font-bold block">
                          {tx.phoneOrAccount}
                        </span>
                      )}
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
                    <span className="text-[9px] text-black font-extrabold bg-amber-200 border border-black/30 px-1.5 py-0.2 rounded inline-block mt-0.5">
                      {isAr ? 'مكتملة' : 'Success'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAILED TRANSACTION RECEIPT MODAL */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black">
          <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 border-2 border-black">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black/20">
              <h3 className="text-base font-black text-black">
                {isAr ? 'تفاصيل الإشعار المالي' : 'Transaction Receipt'}
              </h3>
              <button
                onClick={() => onSelectTransaction(null)}
                className="w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            <div className="text-center py-2">
              <span className="text-xs text-black/80 font-bold block">
                {isAr ? selectedTransaction.title : selectedTransaction.titleEn}
              </span>
              <div className="my-1.5">
                <span className="text-3xl font-black tabular-nums text-black">
                  {selectedTransaction.amount > 0 ? '+' : ''}
                  {Math.abs(selectedTransaction.amount).toLocaleString('en-US')}
                </span>
                <span className="text-sm font-black text-black ms-1">
                  {isAr ? 'جنيه' : 'SDG'}
                </span>
              </div>
              <span className="text-xs font-black text-black">
                {selectedTransaction.recipientOrSender}
              </span>
            </div>

            {/* Receipt Table */}
            <div className="bg-amber-200/90 rounded-2xl p-4 border-2 border-black space-y-2.5 text-xs text-black">
              <div className="flex items-center justify-between">
                <span className="font-bold text-black/80">{isAr ? 'رقم الإشعار المرجعي' : 'Ref Number'}</span>
                <span className="font-mono font-black text-black">{selectedTransaction.referenceNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-black/80">{isAr ? 'التاريخ والوقت' : 'Date & Time'}</span>
                <span className="font-bold text-black">{selectedTransaction.date} · {selectedTransaction.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-black/80">{isAr ? 'الحالة' : 'Status'}</span>
                <span className="font-black text-black bg-amber-300 border border-black px-2 py-0.5 rounded">
                  {isAr ? 'ناجحة وموثقة' : 'Completed'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-black/80">{isAr ? 'الرسوم المصرفية' : 'Fee'}</span>
                <span className="font-black text-black">{isAr ? '0 جنيه (مجاناً)' : '0 SDG'}</span>
              </div>
            </div>

            {/* Share on Media & Download Image Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="h-12 rounded-xl bg-black hover:bg-stone-900 text-amber-400 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'مشاركة على الوسائط' : 'Share Receipt'}</span>
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
                    ? (isAr ? 'تم التنزيل! ✓' : 'Downloaded! ✓')
                    : (isAr ? 'تنزيل الإشعار (صورة)' : 'Download (PNG)')}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onSelectTransaction(null)}
              className="w-full h-11 rounded-xl border-2 border-black text-black font-black text-xs hover:bg-black/10 cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Media Share & Download Modal */}
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
