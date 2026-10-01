import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Language, Transaction } from '../types';

interface ReportTransactionModalProps {
  transaction: Transaction;
  language: Language;
  onClose: () => void;
  onSubmitDispute: (transactionId: string, reason: string) => void;
}

export const ReportTransactionModal: React.FC<ReportTransactionModalProps> = ({
  transaction,
  language,
  onClose,
  onSubmitDispute,
}) => {
  const isAr = language === 'ar';
  const [reason, setReason] = useState(
    isAr
      ? 'تحويل إلى حساب خاطئ مع رفض أو عدم استجابة المستفيد لإعادة المبلغ'
      : 'Wrong account transfer — Recipient declined or failed to respond to the refund request'
  );
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  const handleSubmit = () => {
    onSubmitDispute(transaction.id, reason);
    const newId = `CMP-${Math.floor(1000 + Math.random() * 9000)}-SD`;
    setCreatedTicketId(newId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border-2 border-black">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-black/20 flex items-center justify-between bg-amber-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-black">
                {isAr ? 'الإبلاغ عن المعاملة (Report Transaction)' : 'Report Transaction'}
              </h2>
              <span className="text-[10px] text-black/80 font-bold block">
                {isAr ? 'فتح تذكرة نزاع وشكوى رسمية لدى الإدارة' : 'Open a Formal Dispute Ticket'}
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
          {!createdTicketId ? (
            <>
              <div className="bg-amber-100 p-4 rounded-2xl border-2 border-black space-y-1.5 text-xs text-black">
                <div className="flex items-center gap-1.5 font-black text-black">
                  <AlertTriangle className="w-4 h-4 text-black shrink-0" />
                  <span>{isAr ? 'فتح تذكرة نزاع مالي رسمي:' : 'Formal Dispute Filing:'}</span>
                </div>
                <p className="leading-relaxed font-bold">
                  {isAr
                    ? 'سيتم رفع هذا النزاع مباشرة إلى فريق الامتثال والإدارة للتحقق من سجلات المعاملة والتواصل مع الطرف المستفيد وفق الإجراءات التنظيمية.'
                    : 'This dispute will be escalated directly to the compliance department to verify transaction logs and contact the recipient.'}
                </p>
              </div>

              {/* Transaction Recap */}
              <div className="bg-amber-200/90 rounded-2xl p-4 border-2 border-black space-y-2 text-xs text-black">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'رقم المعاملة (Transaction ID):' : 'Transaction ID:'}</span>
                  <span className="font-mono font-black">{transaction.referenceNo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'المبلغ المتنازع عليه:' : 'Disputed Amount:'}</span>
                  <span className="font-black tabular-nums">{Math.abs(transaction.amount).toLocaleString('en-US')} {isAr ? 'جنيه سوداني' : 'SDG'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'الطرف المستلم:' : 'Recipient:'}</span>
                  <span className="font-black">{transaction.recipientName} ({transaction.recipientAccount})</span>
                </div>
              </div>

              {/* Dispute statement */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-black block">
                  {isAr ? 'تفاصيل البلاغ والشكوى:' : 'Dispute Statement & Details:'}
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-black bg-amber-100 text-xs font-bold text-black focus:outline-none focus:bg-white resize-none"
                  placeholder={isAr ? 'اكتب تفاصيل الواقعة...' : 'Provide dispute details...'}
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full h-13 rounded-2xl bg-black hover:bg-stone-900 active:scale-[0.98] text-amber-400 font-black text-sm shadow-sm cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'تأكيد تقديم الشكوى (Submit Dispute)' : 'Submit Dispute Ticket'}</span>
              </button>
            </>
          ) : (
            <div className="py-10 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-black text-amber-400 flex items-center justify-center mx-auto border-2 border-black shadow-md">
                <CheckCircle2 className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-black">
                  {isAr ? 'تم إنشاء تذكرة الشكوى بنجاح!' : 'Dispute Ticket Created!'}
                </h3>
                <span className="inline-block mt-2 font-mono font-black text-sm bg-black text-amber-400 px-3 py-1 rounded-xl">
                  {createdTicketId}
                </span>
                <p className="text-xs text-black/80 font-bold leading-relaxed px-3 mt-3">
                  {isAr
                    ? 'حالة التذكرة الآن: قيد المراجعة (Under Review). يمكنك متابعة التحديثات والتواصل مع الإدارة عبر قسم الدعم والشكاوى.'
                    : 'Ticket Status: Under Review. You can track updates and correspond with staff via the Support & Complaints section.'}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 rounded-2xl bg-black text-amber-400 font-black text-xs cursor-pointer mt-3"
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
