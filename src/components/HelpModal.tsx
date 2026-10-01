import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  HelpCircle,
  FileQuestion,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';

interface HelpModalProps {
  language: Language;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ language, onClose }) => {
  const isAr = language === 'ar';

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [issueText, setIssueText] = useState('');

  const faqs = [
    {
      qAr: 'كيف يعمل تطبيق «ساهل» عند انقطاع الإنترنت؟',
      qEn: 'How does SAHEL operate during internet cuts?',
      aAr: 'يمكنك استخدام كود الـ USSD المخصص (*789#) من أي شريحة سودانية، حيث يتم تحويل الأموال واستعلام الرصيد وسحب الكاش عبر إشارات الاتصال الأساسية دون الحاجة لباقات إنترنت.',
      aEn: 'Dial the USSD shortcode (*789#) from any registered SIM. You can transfer money, check balances, and generate cash codes over basic cellular signaling without internet data.',
    },
    {
      qAr: 'ما هي رسوم التحويل في ساهل؟',
      qEn: 'What are transaction fees in SAHEL?',
      aAr: 'التحويلات بين مستخدمي ساهل مجانية تماماً (0 جنيه). سداد المشتريات بالـ QR ودفع الفواتير مجاني وبدون أي رسوم خفية.',
      aEn: 'Transfers between Sahel users are 100% free (0 SDG). QR merchant payments and utility bills carry zero hidden fees.',
    },
    {
      qAr: 'كيف أسحب كاش إذا لم تكن لدي بطاقة صراف؟',
      qEn: 'How to withdraw cash without an ATM card?',
      aAr: 'من خيار "سحب" في التطبيق، اختر "السحب من الصراف"، سيظهر لك كود مؤقت من 6 أرقام. أدخله في شاشة الصراف الآلي واستلم أموالك فوراً.',
      aEn: 'From "Withdraw", select "ATM Cash Out". A 6-digit one-time code is generated. Enter it on the ATM screen to receive your cash.',
    },
    {
      qAr: 'هل يمكنني إرسال أموال لشخص لا يملك تطبيق ساهل؟',
      qEn: 'Can I send funds to someone without the app?',
      aAr: 'نعم! اختر "إرسال مبلغ لشخص ليقوم بالسحب"، وسيصل كود نقدي على رقم موبايله يمكنه صرفه من أي صراف أو وكيل معتمد.',
      aEn: 'Yes! Choose "Send Cash Voucher". The recipient receives an SMS code to collect cash at any ATM or partner store without an account.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black">
      <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border-2 border-black">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-black/20 flex items-center justify-between bg-amber-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black">
              <HelpCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-black">
                {isAr ? 'مركز المساعدة والدعم' : 'Support & Help Center'}
              </h2>
              <span className="text-[11px] text-black/80 font-bold block -mt-0.5">
                {isAr ? 'نحن معك على مدار الساعة' : '24/7 Sudanese Customer Care'}
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* THE 4 VERY LARGE BUTTONS */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1. اتصل بنا */}
            <a
              href="tel:19999"
              className="p-4 rounded-2xl border-2 border-black bg-amber-200/90 hover:bg-amber-100 transition-all flex flex-col items-center text-center cursor-pointer group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-black text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-sm font-black text-black">
                {isAr ? 'اتصل بنا' : 'Call Us'}
              </span>
              <span className="text-[11px] text-black/80 font-bold mt-0.5 font-mono">
                19999 ({isAr ? 'رقم مجاني' : 'Toll Free'})
              </span>
            </a>

            {/* 2. المساعدة */}
            <button
              type="button"
              onClick={() => alert(isAr ? 'تم فتح دليل الاستخدام السريع الميسر' : 'User guide opened')}
              className="p-4 rounded-2xl border-2 border-black bg-amber-200/90 hover:bg-amber-100 transition-all flex flex-col items-center text-center cursor-pointer group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-black text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-sm font-black text-black">
                {isAr ? 'المساعدة' : 'Quick Guide'}
              </span>
              <span className="text-[11px] text-black/80 font-bold mt-0.5">
                {isAr ? 'دليل مبسط' : 'Simple steps'}
              </span>
            </button>

            {/* 3. الأسئلة الشائعة */}
            <button
              type="button"
              onClick={() => setActiveFaq(activeFaq === null ? 0 : null)}
              className="p-4 rounded-2xl border-2 border-black bg-amber-200/90 hover:bg-amber-100 transition-all flex flex-col items-center text-center cursor-pointer group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-black text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <FileQuestion className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-sm font-black text-black">
                {isAr ? 'الأسئلة الشائعة' : 'FAQs'}
              </span>
              <span className="text-[11px] text-black/80 font-bold mt-0.5">
                {isAr ? 'إجابات فورية' : 'Common questions'}
              </span>
            </button>

            {/* 4. الإبلاغ عن مشكلة */}
            <button
              type="button"
              onClick={() => setShowReportForm(!showReportForm)}
              className="p-4 rounded-2xl border-2 border-black bg-amber-200/90 hover:bg-amber-100 transition-all flex flex-col items-center text-center cursor-pointer group shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-black text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-sm font-black text-black">
                {isAr ? 'الإبلاغ عن مشكلة' : 'Report Issue'}
              </span>
              <span className="text-[11px] text-black/80 font-bold mt-0.5">
                {isAr ? 'متابعة فورية' : 'Instant ticket'}
              </span>
            </button>
          </div>

          {/* REPORT FORM ACCORDION */}
          {showReportForm && (
            <div className="p-4 bg-amber-200/90 rounded-2xl border-2 border-black space-y-3">
              <h3 className="text-xs font-black text-black">
                {isAr ? 'نموذج الإبلاغ المباشر' : 'Report an Issue'}
              </h3>
              {reportSubmitted ? (
                <div className="p-3 bg-amber-100 rounded-xl text-black border-2 border-black text-xs font-black flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  <span>{isAr ? 'تم استلام بلاغك برقم #9821 وسيتم الرد خلال دقائق' : 'Ticket #9821 received, our team is responding'}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    placeholder={isAr ? 'اشرح ما حدث معك باختصار...' : 'Briefly describe what happened...'}
                    value={issueText}
                    onChange={(e) => setIssueText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-black text-xs bg-amber-100 text-black font-bold focus:outline-none focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!issueText.trim()) return;
                      setReportSubmitted(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-black hover:bg-stone-900 text-amber-400 font-black text-xs cursor-pointer shadow-xs active:scale-95"
                  >
                    {isAr ? 'إرسال البلاغ' : 'Submit Ticket'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FAQs LIST */}
          <div className="space-y-2 pt-1">
            <h3 className="text-xs font-black text-black">
              {isAr ? 'أهم الأسئلة الشائعة للمستخدمين في السودان:' : 'Frequently Asked Questions:'}
            </h3>
            <div className="space-y-2">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border-2 border-black rounded-2xl overflow-hidden bg-amber-200/90"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-3.5 flex items-center justify-between text-start text-xs font-black text-black hover:bg-amber-100 cursor-pointer"
                    >
                      <span>{isAr ? faq.qAr : faq.qEn}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-black shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-black shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-3.5 pt-0 text-xs font-bold text-black border-t-2 border-black/20 bg-amber-100 leading-relaxed">
                        {isAr ? faq.aAr : faq.aEn}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
