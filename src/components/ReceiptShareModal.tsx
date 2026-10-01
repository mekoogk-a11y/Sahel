import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Send,
  FileCheck2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Language, Transaction } from '../types';
import {
  downloadReceiptAsImage,
  shareViaWhatsApp,
  shareViaTelegram,
  shareReceiptNative,
} from '../utils/receiptGenerator';

interface ReceiptShareModalProps {
  transaction: Transaction;
  language: Language;
  onClose: () => void;
}

export const ReceiptShareModal: React.FC<ReceiptShareModalProps> = ({
  transaction,
  language,
  onClose,
}) => {
  const isAr = language === 'ar';
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    const success = await downloadReceiptAsImage(transaction, isAr);
    setIsDownloading(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const handleCopy = async () => {
    const res = await shareReceiptNative(transaction, isAr);
    if (res.method === 'clipboard' || res.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    await shareReceiptNative(transaction, isAr);
  };

  const handleWhatsApp = () => {
    shareViaWhatsApp(transaction, isAr);
  };

  const handleTelegram = () => {
    shareViaTelegram(transaction, isAr);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border-2 border-black">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b-2 border-black/20 flex items-center justify-between bg-amber-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black">
              <Share2 className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-black">
                {isAr ? 'مشاركة وتنزيل الإشعار المالي' : 'Share & Download Receipt'}
              </h3>
              <span className="text-[11px] text-black/80 font-bold block -mt-0.5">
                {isAr ? 'إشعار تحويل معتمد من ساهل' : 'Official Sahel Transfer Receipt'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Quick Summary Card */}
          <div className="bg-amber-200/90 rounded-2xl p-4 border-2 border-black space-y-2 text-center">
            <span className="text-[11px] font-bold text-black/80 block">
              {isAr ? 'المبلغ المحول:' : 'Amount:'}
            </span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-3xl font-black text-black tabular-nums">
                {Math.abs(transaction.amount).toLocaleString('en-US')}
              </span>
              <span className="text-sm font-black text-black">
                {isAr ? 'جنيه سوداني' : 'SDG'}
              </span>
            </div>
            <div className="bg-amber-100 p-2.5 rounded-xl border border-black/30 text-xs font-bold text-black flex items-center justify-between">
              <span>{isAr ? 'المستلم:' : 'Recipient:'}</span>
              <span className="font-black">{transaction.recipientOrSender}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-black/80 font-mono font-bold px-1">
              <span>{transaction.phoneOrAccount}</span>
              <span>{transaction.referenceNo}</span>
            </div>
          </div>

          {/* PRIMARY ACTION 1: DOWNLOAD AS IMAGE */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-black flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-black" />
              {isAr ? 'تنزيل الإشعار في جهازك:' : 'Download Receipt:'}
            </h4>

            <button
              type="button"
              disabled={isDownloading}
              onClick={handleDownload}
              className="w-full p-3.5 rounded-2xl bg-black hover:bg-stone-900 text-amber-400 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>{isAr ? 'جاري تجهيز الصورة...' : 'Generating Image...'}</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span>{isAr ? 'تم تنزيل الإشعار كصورة بنجاح! ✓' : 'Receipt Image Downloaded! ✓'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'تنزيل الإشعار كصورة عالية الدقة (PNG)' : 'Download Receipt as Image (PNG)'}</span>
                </>
              )}
            </button>
          </div>

          {/* PRIMARY ACTION 2: SHARE ON SOCIAL MEDIA & APPS */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-black flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-black" />
              {isAr ? 'المشاركة على وسائط التواصل:' : 'Share on Social Media & Apps:'}
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp Share */}
              <button
                type="button"
                onClick={handleWhatsApp}
                className="p-3 rounded-2xl border-2 border-black bg-amber-200 hover:bg-amber-100 flex items-center justify-center gap-2 font-black text-xs text-black cursor-pointer shadow-xs transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-green-600 text-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 fill-white text-green-600" />
                </div>
                <span>{isAr ? 'واتساب (WhatsApp)' : 'WhatsApp'}</span>
              </button>

              {/* Telegram Share */}
              <button
                type="button"
                onClick={handleTelegram}
                className="p-3 rounded-2xl border-2 border-black bg-amber-200 hover:bg-amber-100 flex items-center justify-center gap-2 font-black text-xs text-black cursor-pointer shadow-xs transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 fill-white text-sky-500 -rotate-45" />
                </div>
                <span>{isAr ? 'تلغرام (Telegram)' : 'Telegram'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Copy Formatted Text */}
              <button
                type="button"
                onClick={handleCopy}
                className="p-3 rounded-2xl border-2 border-black bg-amber-200 hover:bg-amber-100 flex items-center justify-center gap-2 font-black text-xs text-black cursor-pointer shadow-xs transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-700" />
                    <span>{isAr ? 'تم نسخ النص!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-black" />
                    <span>{isAr ? 'نسخ نص الإشعار' : 'Copy Text'}</span>
                  </>
                )}
              </button>

              {/* Native System Share */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="p-3 rounded-2xl border-2 border-black bg-amber-200 hover:bg-amber-100 flex items-center justify-center gap-2 font-black text-xs text-black cursor-pointer shadow-xs transition-colors"
              >
                <Share2 className="w-4 h-4 text-black" />
                <span>{isAr ? 'تطبيقات الهاتف' : 'More Apps'}</span>
              </button>
            </div>
          </div>

          {/* Formatted Text Preview */}
          <div className="bg-amber-100 p-3.5 rounded-2xl border border-black/30 space-y-1">
            <span className="text-[10px] text-black/70 font-black block">
              {isAr ? 'معاينة نص الإشعار المشارك:' : 'Receipt Text Preview:'}
            </span>
            <p className="text-[11px] font-mono text-black font-bold whitespace-pre-line leading-relaxed bg-amber-50 p-2.5 rounded-xl border border-black/20 max-h-36 overflow-y-auto">
              {`🟡 إشعار مالي معتمد — تطبيق ساهل\nالمبلغ: ${Math.abs(transaction.amount).toLocaleString('en-US')} جنيه\nالمستلم: ${transaction.recipientOrSender}\nرقم الحساب: ${transaction.phoneOrAccount}\nالمرجع: ${transaction.referenceNo}\nالتاريخ: ${transaction.date} · ${transaction.time}`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-amber-400 border-t-2 border-black/20 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-black text-amber-400 font-black text-xs cursor-pointer shadow-xs active:scale-95"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
