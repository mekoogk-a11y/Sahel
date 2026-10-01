import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Fingerprint,
} from 'lucide-react';
import { Language, RefundRequest } from '../types';
import { playSuccessChime } from '../utils/soundEffects';

interface ReviewIncomingRefundModalProps {
  refundRequest: RefundRequest;
  language: Language;
  onClose: () => void;
  onAcceptRefund: (requestId: string) => void;
  onDeclineRefund: (requestId: string) => void;
}

export const ReviewIncomingRefundModal: React.FC<ReviewIncomingRefundModalProps> = ({
  refundRequest,
  language,
  onClose,
  onAcceptRefund,
  onDeclineRefund,
}) => {
  const isAr = language === 'ar';
  const [actionState, setActionState] = useState<'idle' | 'processing' | 'accepted' | 'declined'>('idle');

  const handleReturnMoney = () => {
    setActionState('processing');
    setTimeout(() => {
      onAcceptRefund(refundRequest.id);
      playSuccessChime();
      setActionState('accepted');
    }, 1200);
  };

  const handleDecline = () => {
    onDeclineRefund(refundRequest.id);
    setActionState('declined');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border-2 border-black">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-black/20 flex items-center justify-between bg-amber-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black text-sm">
              <RotateCcw className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-black">
                {isAr ? 'طلب استرداد (Refund Request)' : 'Refund Request'}
              </h2>
              <span className="text-[10px] text-black/80 font-bold block">
                {isAr ? 'مراجعة طلب استرداد تحويل مالي خاطئ' : 'Review Incoming Refund Request'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {actionState === 'idle' && (
            <>
              {/* THE SENDER HAS REQUESTED THE RETURN TEXT */}
              <div className="bg-black text-amber-400 p-4 rounded-2xl border-2 border-black shadow-sm space-y-2">
                <span className="text-xs font-black block">
                  {isAr ? 'إشعار من نظام ساهل المالي:' : 'SAHEL Notification:'}
                </span>
                <p className="text-sm font-black text-white leading-relaxed">
                  {isAr
                    ? 'طلب المرسل إعادة هذا المبلغ.'
                    : 'The sender has requested the return of this transfer.'}
                </p>
                <p className="text-xs text-amber-200/90 font-bold">
                  {isAr
                    ? `أفاد المرسل (${refundRequest.senderName}) بأن التحويل تم إلى حسابك عن طريق الخطأ.`
                    : `Sender (${refundRequest.senderName}) indicated this transfer was sent by mistake.`}
                </p>
              </div>

              {/* DETAILS CARD: Amount, Transaction ID, Sender Info */}
              <div className="bg-amber-200/90 rounded-2xl p-4 border-2 border-black space-y-2.5 text-xs text-black">
                <div className="flex items-center justify-between pb-2 border-b border-black/20">
                  <span className="font-bold text-black/80">{isAr ? 'المبلغ (Amount):' : 'Amount:'}</span>
                  <span className="text-xl font-black tabular-nums">
                    {refundRequest.amount.toLocaleString('en-US')} {isAr ? 'جنيه سوداني' : 'SDG'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'رقم العملية (Transaction ID):' : 'Transaction ID:'}</span>
                  <span className="font-mono font-black">{refundRequest.referenceNo}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'المرسل الأصلي:' : 'Sender:'}</span>
                  <span className="font-black">{refundRequest.senderName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'رقم حساب المرسل:' : 'Sender Account:'}</span>
                  <span className="font-mono font-black">{refundRequest.senderAccount}</span>
                </div>

                <div className="pt-2 border-t border-black/15">
                  <span className="font-bold text-black/80 block mb-0.5">{isAr ? 'سبب طلب الإرجاع:' : 'Stated Reason:'}</span>
                  <p className="font-bold text-black bg-amber-100 p-2 rounded-lg border border-black/20 text-[11px]">
                    {refundRequest.reason}
                  </p>
                </div>
              </div>

              {/* THE TWO BUTTONS REQUIRED: Return Money & Decline Request */}
              <div className="space-y-2.5 pt-1">
                {/* 1. Return Money (إعادة الأموال) */}
                <button
                  type="button"
                  onClick={handleReturnMoney}
                  className="w-full h-13 rounded-2xl bg-black hover:bg-stone-900 active:scale-[0.98] text-amber-400 font-black text-sm shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'إعادة الأموال (Return Money)' : 'Return Money'}</span>
                </button>

                {/* 2. Decline Request (رفض الطلب) */}
                <button
                  type="button"
                  onClick={handleDecline}
                  className="w-full h-12 rounded-2xl border-2 border-black bg-amber-100 hover:bg-white active:scale-[0.98] text-black font-black text-xs shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4 text-black" />
                  <span>{isAr ? 'رفض الطلب (Decline Request)' : 'Decline Request'}</span>
                </button>
              </div>
            </>
          )}

          {actionState === 'processing' && (
            <div className="py-14 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-black text-amber-400 flex items-center justify-center animate-pulse border-2 border-black">
                <RotateCcw className="w-8 h-8 text-amber-400 animate-spin" />
              </div>
              <h3 className="text-base font-black text-black">
                {isAr ? 'جاري إعادة الأموال وفق النظام المالي...' : 'Executing Reversal...'}
              </h3>
            </div>
          )}

          {actionState === 'accepted' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-black text-amber-400 flex items-center justify-center mx-auto border-2 border-black shadow-md">
                <CheckCircle2 className="w-10 h-10 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-black">
                  {isAr ? 'تمت إعادة الأموال بنجاح!' : 'Funds Returned Successfully!'}
                </h3>
                <p className="text-xs text-black/80 font-bold mt-1">
                  {isAr
                    ? `تم تحويل مبلغ ${refundRequest.amount.toLocaleString('en-US')} ج.س إلى حساب المرسل (${refundRequest.senderName}).`
                    : 'The transfer amount has been refunded back to the sender.'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 rounded-2xl bg-black text-amber-400 font-black text-xs cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          )}

          {actionState === 'declined' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-black text-amber-400 flex items-center justify-center mx-auto border-2 border-black shadow-md">
                <XCircle className="w-10 h-10 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-black">
                  {isAr ? 'تم رفض طلب الاسترداد' : 'Refund Request Declined'}
                </h3>
                <p className="text-xs text-black/80 font-bold mt-1 leading-relaxed">
                  {isAr
                    ? 'تم تسجيل رفضك للطلب في النظام. يحق للمرسل تصعيد الأمر وتقديم بلاغ رسمي للتحقيق في المعاملة.'
                    : 'Your decision was recorded. The sender may choose to report the transaction for formal dispute review.'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 rounded-2xl bg-black text-amber-400 font-black text-xs cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
