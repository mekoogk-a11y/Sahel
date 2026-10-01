import React, { useState } from 'react';
import {
  X,
  Receipt,
  Zap,
  Droplets,
  Landmark,
  GraduationCap,
  Wifi,
  CheckCircle2,
  Fingerprint,
} from 'lucide-react';
import { BillCategory, Language, Transaction } from '../types';
import { playSuccessChime } from '../utils/soundEffects';

interface BillPaymentModalProps {
  language: Language;
  currentBalance: number;
  onClose: () => void;
  onCompleteBillPayment: (
    serviceName: string,
    serviceNameEn: string,
    accountOrMeterNumber: string,
    amount: number
  ) => Transaction;
}

type Step = 'choose' | 'details' | 'review' | 'authenticating' | 'success';

interface BillService {
  id: BillCategory;
  name: string;
  nameEn: string;
  fieldLabel: string;
  fieldLabelEn: string;
  placeholder: string;
  defaultAmount: number;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICES: BillService[] = [
  {
    id: 'electricity',
    name: 'الشركة القومية للكهرباء',
    nameEn: 'National Electricity Company',
    fieldLabel: 'رقم العداد (Meter Number)',
    fieldLabelEn: 'Meter Number',
    placeholder: 'مثال: 14209881',
    defaultAmount: 25000,
    icon: Zap,
  },
  {
    id: 'water',
    name: 'هيئة مياه الخرطوم والولايات',
    nameEn: 'State Water Authority',
    fieldLabel: 'رقم اشتراك المياه (Water ID)',
    fieldLabelEn: 'Subscriber Number',
    placeholder: 'مثال: WTR-78210',
    defaultAmount: 12000,
    icon: Droplets,
  },
  {
    id: 'government_e15',
    name: 'المعاملات الحكومية (إيصال 15 الإلكتروني)',
    nameEn: 'Government Services (E-15 Receipt)',
    fieldLabel: 'رقم مطالبة إيصال 15 (E-15 Claim)',
    fieldLabelEn: 'E-15 Claim Number',
    placeholder: 'مثال: E15-9921008',
    defaultAmount: 40000,
    icon: Landmark,
  },
  {
    id: 'education',
    name: 'الرسوم الجامعية والتعليمية',
    nameEn: 'University & Tuition Fees',
    fieldLabel: 'الرقم الجامعي / رقم الطالب (Student ID)',
    fieldLabelEn: 'Student ID / Reference',
    placeholder: 'مثال: STU-2026-90',
    defaultAmount: 75000,
    icon: GraduationCap,
  },
  {
    id: 'telecom_fiber',
    name: 'الإنترنت المنزلي والألياف الضوئية',
    nameEn: 'Home Fiber & High-Speed Internet',
    fieldLabel: 'رقم اشتراك الخط المنزلي (Account Number)',
    fieldLabelEn: 'Subscription Line Number',
    placeholder: 'مثال: 0183XXXXXX',
    defaultAmount: 18000,
    icon: Wifi,
  },
];

export const BillPaymentModal: React.FC<BillPaymentModalProps> = ({
  language,
  currentBalance,
  onClose,
  onCompleteBillPayment,
}) => {
  const isAr = language === 'ar';

  const [step, setStep] = useState<Step>('choose');
  const [selectedService, setSelectedService] = useState<BillService>(SERVICES[0]);
  const [serviceAccount, setServiceAccount] = useState('14209881');
  const [amountStr, setAmountStr] = useState(SERVICES[0].defaultAmount.toString());
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  const numericAmount = parseInt(amountStr || '0', 10);
  const isInsufficient = numericAmount > currentBalance;

  const handleSelectService = (serv: BillService) => {
    setSelectedService(serv);
    setAmountStr(serv.defaultAmount.toString());
    setStep('details');
  };

  const handleProceedToReview = () => {
    if (!serviceAccount.trim() || numericAmount <= 0 || isInsufficient) return;
    setStep('review');
  };

  const handleConfirmPayment = () => {
    setStep('authenticating');
    setTimeout(() => {
      const tx = onCompleteBillPayment(
        selectedService.name,
        selectedService.nameEn,
        serviceAccount,
        numericAmount
      );
      playSuccessChime();
      setCompletedTx(tx);
      setStep('success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border-2 border-black">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-black/20 flex items-center justify-between bg-amber-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black text-sm">
              <Receipt className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-black">
                {step === 'choose' && (isAr ? 'دفع الفواتير — اختر الخدمة' : 'Pay Bills — Choose Service')}
                {step === 'details' && (isAr ? 'بيانات الخدمة والمبلغ' : 'Service Details & Amount')}
                {step === 'review' && (isAr ? 'مراجعة الدفع (Review Payment)' : 'Review Payment')}
                {step === 'authenticating' && (isAr ? 'تنفيذ السداد' : 'Processing Payment')}
                {step === 'success' && (isAr ? 'تم سداد الفاتورة بنجاح' : 'Payment Successful')}
              </h2>
              <span className="text-[10px] text-black/80 font-bold block">
                {isAr ? 'سداد فوري ومباشر للفواتير الخدمية' : 'Instant Utility & Government Settlement'}
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
        <div className="p-5 overflow-y-auto flex-1">
          {/* STEP 1: CHOOSE SERVICE */}
          {step === 'choose' && (
            <div className="space-y-3">
              <label className="text-xs font-black text-black block mb-1">
                {isAr ? 'اختر الخدمة (Choose Service):' : 'Choose Service:'}
              </label>

              <div className="space-y-2">
                {SERVICES.map((serv) => {
                  const Icon = serv.icon;
                  return (
                    <button
                      key={serv.id}
                      type="button"
                      onClick={() => handleSelectService(serv)}
                      className="w-full p-4 rounded-2xl border-2 border-black/30 hover:border-black bg-amber-200 hover:bg-amber-100 flex items-center justify-between text-start cursor-pointer transition-all shadow-xs group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center shrink-0 border border-black">
                          <Icon className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <span className="text-sm font-black text-black block leading-tight">
                            {isAr ? serv.name : serv.nameEn}
                          </span>
                          <span className="text-[11px] text-black/80 font-bold block mt-0.5">
                            {isAr ? serv.fieldLabel : serv.fieldLabelEn}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-black underline">
                        {isAr ? 'اختيار' : 'Select'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SERVICE DETAILS & AMOUNT */}
          {step === 'details' && (
            <div className="space-y-4">
              <div className="bg-black text-amber-400 p-3.5 rounded-2xl flex items-center justify-between border-2 border-black">
                <div>
                  <span className="text-[10px] text-amber-400/80 font-bold block">
                    {isAr ? 'الخدمة المختارة:' : 'Selected Service:'}
                  </span>
                  <span className="text-sm font-black text-amber-300">
                    {isAr ? selectedService.name : selectedService.nameEn}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  className="text-xs text-black bg-amber-400 px-3 py-1.5 rounded-lg font-black hover:bg-amber-300 cursor-pointer"
                >
                  {isAr ? 'تغيير' : 'Change'}
                </button>
              </div>

              {/* Service Input */}
              <div className="bg-amber-200/90 p-4 rounded-2xl border-2 border-black space-y-2">
                <label className="text-xs font-black text-black block">
                  {isAr ? selectedService.fieldLabel : selectedService.fieldLabelEn}:
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder={selectedService.placeholder}
                  value={serviceAccount}
                  onChange={(e) => setServiceAccount(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border-2 border-black bg-amber-100 text-base font-mono font-black text-black focus:outline-none focus:bg-white"
                />
              </div>

              {/* Amount Input */}
              <div className="bg-amber-200/90 p-4 rounded-2xl border-2 border-black space-y-2">
                <label className="text-xs font-black text-black block">
                  {isAr ? 'مبلغ السداد (جنيه سوداني):' : 'Payment Amount (SDG):'}
                </label>
                <input
                  type="number"
                  dir="ltr"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border-2 border-black bg-amber-100 text-xl font-black text-black focus:outline-none focus:bg-white"
                />
                {isInsufficient && (
                  <p className="text-xs font-black text-red-600 mt-1">
                    {isAr ? 'المبلغ المطلوب يتجاوز الرصيد المتاح' : 'Amount exceeds available balance'}
                  </p>
                )}
              </div>

              {/* Proceed to Review */}
              <button
                type="button"
                disabled={!serviceAccount.trim() || numericAmount <= 0 || isInsufficient}
                onClick={handleProceedToReview}
                className={`w-full h-13 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  serviceAccount.trim() && numericAmount > 0 && !isInsufficient
                    ? 'bg-black hover:bg-stone-900 text-amber-400 active:scale-[0.99]'
                    : 'bg-black/30 text-black/50 cursor-not-allowed border border-black/20'
                }`}
              >
                <span>{isAr ? 'مراجعة الدفع (Review Payment)' : 'Review Payment'}</span>
              </button>
            </div>
          )}

          {/* STEP 3: REVIEW PAYMENT */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="bg-amber-200 border-2 border-black rounded-3xl p-5 shadow-sm space-y-4">
                <div className="text-center pb-3 border-b-2 border-black/20">
                  <span className="text-xs font-black text-black/80 block mb-1">
                    {isAr ? 'مراجعة الدفع (Review Payment)' : 'Review Payment'}
                  </span>
                  <div className="my-1">
                    <span className="text-4xl font-black text-black tabular-nums">
                      {numericAmount.toLocaleString('en-US')}
                    </span>
                    <span className="text-base font-black text-black ms-1.5">
                      {isAr ? 'جنيه سوداني' : 'SDG'}
                    </span>
                  </div>
                </div>

                <div className="bg-amber-100 rounded-2xl p-4 border-2 border-black space-y-2.5 text-xs text-black">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'الخدمة:' : 'Service:'}</span>
                    <span className="font-black text-end">{isAr ? selectedService.name : selectedService.nameEn}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'رقم الحساب / العداد:' : 'Account / Meter ID:'}</span>
                    <span className="font-mono font-black">{serviceAccount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'قيمة الفاتورة:' : 'Bill Amount:'}</span>
                    <span className="font-black tabular-nums">{numericAmount.toLocaleString('en-US')} {isAr ? 'ج.س' : 'SDG'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'رسوم السداد الإلكتروني:' : 'Fees:'}</span>
                    <span className="font-black text-black">{isAr ? '0 جنيه (مجاناً)' : '0 SDG'}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t-2 border-black/20 text-sm">
                    <span className="font-black text-black">{isAr ? 'الإجمالي المطلوب دفعه:' : 'Total:'}</span>
                    <span className="font-black tabular-nums text-base">{numericAmount.toLocaleString('en-US')} {isAr ? 'جنيه' : 'SDG'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="w-full h-14 rounded-2xl bg-black hover:bg-stone-900 active:scale-[0.98] text-amber-400 font-black text-base transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-5 h-5 text-amber-400" />
                  <span>{isAr ? 'تأكيد الدفع (Confirm Payment)' : 'Confirm Payment'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-full py-2.5 text-xs text-black font-black underline cursor-pointer text-center"
                >
                  {isAr ? 'الرجوع لتعديل البيانات' : 'Back to Edit Details'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PROCESSING */}
          {step === 'authenticating' && (
            <div className="py-14 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-black text-amber-400 flex items-center justify-center animate-pulse border-2 border-black">
                <Receipt className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-base font-black text-black">
                {isAr ? 'جاري سداد الفاتورة مع الجهة المعنية...' : 'Settling Bill with Provider...'}
              </h3>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 'success' && completedTx && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-black text-amber-400 flex items-center justify-center mx-auto border-2 border-black shadow-md">
                <CheckCircle2 className="w-10 h-10 text-amber-400" />
              </div>

              <div>
                <h3 className="text-lg font-black text-black">
                  {isAr ? 'تم سداد الفاتورة بنجاح!' : 'Payment Completed!'}
                </h3>
                <p className="text-xs text-black/80 font-bold mt-0.5">
                  {isAr ? `تم إصدار إشعار سداد معتمد لـ ${selectedService.name}` : 'Official Receipt Issued'}
                </p>
              </div>

              <div className="bg-amber-200 rounded-2xl p-4 border-2 border-black text-start space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'رقم الإيصال المرجعي:' : 'Receipt Reference:'}</span>
                  <span className="font-mono font-black">{completedTx.referenceNo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'الجهة المستفيدة:' : 'Service:'}</span>
                  <span className="font-black text-end">{completedTx.recipientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'المبلغ:' : 'Amount:'}</span>
                  <span className="font-black tabular-nums">{Math.abs(completedTx.amount).toLocaleString('en-US')} {isAr ? 'جنيه' : 'SDG'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full h-13 rounded-2xl bg-black hover:bg-stone-900 text-amber-400 font-black text-sm shadow-md cursor-pointer transition-all active:scale-[0.98]"
              >
                {isAr ? 'العودة إلى الشاشة الرئيسية' : 'Return to Home'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
