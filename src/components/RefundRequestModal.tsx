import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Language, Transaction } from '../types';

interface RefundRequestModalProps {
  transaction: Transaction;
  language: Language;
  onClose: () => void;
  onSubmitRefundRequest: (transactionId: string, reason: string) => void;
}

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
  transaction,
  language,
  onClose,
  onSubmitRefundRequest,
}) => {
  const isAr = language === 'ar';
  const [reason, setReason] = useState(
    isAr ? 'تم إدخال رقم الحساب عن طريق الخطأ' : 'Transferred to the wrong account number by mistake'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    onSubmitRefundRequest(transaction.id, reason);
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
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
                {isAr ? 'تحويل إلى حساب خاطئ (Wrong Transfer)' : 'Wrong Transfer Recovery'}
              </h2>
              <span className="text-[10px] text-black/80 font-bold block">
                {isAr ? 'طلب استرداد ودي للأموال' : 'Submit Refund Request to Recipient'}
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

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {!isSubmitted ? (
            <>
              {/* CLEAR EXPLANATION AS SPECIFIED IN PROMPT */}
              <div className="bg-amber-100 p-4 rounded-2xl border-2 border-black space-y-2">
                <div className="flex items-center gap-2 font-black text-xs text-black">
                  <AlertTriangle className="w-4 h-4 text-black shrink-0" />
                  <span>{isAr ? 'تحويل إلى حساب خاطئ' : 'Wrong Transfer Notice'}</span>
                </div>
                <p className="text-xs font-bold text-black/90 leading-relaxed">
                  {isAr
                    ? 'إذا قمت بتحويل الأموال إلى حساب خاطئ، يمكنك إرسال طلب استرداد إلى المستفيد.'
                    : 'If you transferred money to the wrong account, you can submit a refund request to the recipient.'}
                </p>
                <p className="text-[11px] text-black/70 font-semibold pt-1 border-t border-black/10">
                  {isAr
                    ? '💡 حرصاً على الأمان، لا يتم سحب الأموال تلقائياً من حساب المستفيد؛ بل يُرسل إليه إشعار رسمي موثق لإعادة المبلغ.'
                    : '💡 For financial integrity, funds are not automatically deducted; a formal refund request is sent to the recipient.'}
                </p>
              </div>

              {/* Transaction Summary Table */}
              <div className="bg-amber-200/90 rounded-2xl p-4 border-2 border-black space-y-2 text-xs text-black">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'المبلغ المطلوب استرداده:' : 'Amount:'}</span>
                  <span className="font-black text-sm tabular-nums">
                    {Math.abs(transaction.amount).toLocaleString('en-US')} {isAr ? 'جنيه سوداني' : 'SDG'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'المستفيد الحالي:' : 'Recipient:'}</span>
                  <span className="font-black">{transaction.recipientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'رقم حساب ساهل:' : 'Account ID:'}</span>
                  <span className="font-mono font-black">{transaction.recipientAccount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'رقم العملية (Transaction ID):' : 'Transaction ID:'}</span>
                  <span className="font-mono font-black">{transaction.referenceNo}</span>
                </div>
              </div>

              {/* Reason input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-black block">
                  {isAr ? 'سبب طلب الاسترداد:' : 'Reason for Refund Request:'}
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-black bg-amber-100 text-xs font-bold text-black focus:outline-none focus:bg-white resize-none"
                  placeholder={isAr ? 'وضح سبب التحويل الخاطئ للمستفيد...' : 'State the reason...'}
                />
              </div>

              {/* Quick Reason Presets */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  isAr ? 'خطأ في رقم الحساب' : 'Wrong account number',
                  isAr ? 'تحويل مكرر' : 'Duplicate transfer',
                  isAr ? 'مبلغ غير مقصود' : 'Unintended amount',
                ].map((txt) => (
                  <button
                    key={txt}
                    type="button"
                    onClick={() => setReason(txt)}
                    className="text-[10px] font-bold px-2 py-1 rounded-lg border border-black/30 bg-amber-200 hover:bg-white text-black cursor-pointer"
                  >
                    {txt}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full h-13 rounded-2xl bg-black hover:bg-stone-900 active:scale-[0.98] text-amber-400 font-black text-sm shadow-sm cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'إرسال طلب الاسترداد للمستفيد' : 'Submit Refund Request'}</span>
              </button>
            </>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-black text-amber-400 flex items-center justify-center mx-auto border-2 border-black shadow-md">
                <CheckCircle2 className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-base font-black text-black">
                {isAr ? 'تم إرسال طلب الاسترداد بنجاح' : 'Refund Request Submitted'}
              </h3>
              <p className="text-xs text-black/80 font-bold leading-relaxed px-4">
                {isAr
                  ? 'تم إشعار المستفيد رسمياً بالطلب. في حال عدم الاستجابة أو الرفض، يمكنك الإبلاغ عن المعاملة لفتح تذكرة نزاع.'
                  : 'The recipient has been notified. If declined or unanswered, you can report the transaction to open a dispute.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
