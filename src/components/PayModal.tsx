import React, { useState } from 'react';
import {
  X,
  QrCode,
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Language, Transaction } from '../types';
import { playKeypadClick, playSuccessChime } from '../utils/soundEffects';

interface PayModalProps {
  language: Language;
  currentBalance: number;
  onClose: () => void;
  onCompletePayment: (amount: number, merchantName: string, category: 'payment') => Transaction;
}

type Step = 'select_method' | 'amount' | 'confirm' | 'success';
type PayMethod = 'scan_qr' | 'phone' | 'merchant_code';

export const PayModal: React.FC<PayModalProps> = ({
  language,
  currentBalance,
  onClose,
  onCompletePayment,
}) => {
  const isAr = language === 'ar';

  const [step, setStep] = useState<Step>('select_method');
  const [method, setMethod] = useState<PayMethod>('scan_qr');
  const [merchantName, setMerchantName] = useState('سوبرماركت المهندسين');
  const [merchantPhone, setMerchantPhone] = useState('0912003344');
  const [merchantCode, setMerchantCode] = useState('M-7819');
  const [amountStr, setAmountStr] = useState('12500');
  const [billRef, setBillRef] = useState('');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  const numericAmount = parseInt(amountStr || '0', 10);
  const isInsufficient = numericAmount > currentBalance;

  const sampleMerchants = [
    { name: 'سوبرماركت المهندسين', category: 'بقالة ومواد غذائية', code: 'M-7819', phone: '0912003344' },
    { name: 'صيدلية النيلين الكبرى', category: 'أدوية ومستلزمات', code: 'M-4410', phone: '0922883344' },
    { name: 'محطة وقود بشائر', category: 'وقود وخدمات سيارات', code: 'M-9011', phone: '0966441122' },
    { name: 'مطاعم الأمواج البحرية', category: 'مأكولات ومشروبات', code: 'M-3329', phone: '0918776655' },
  ];

  const handleSelectSampleMerchant = (m: typeof sampleMerchants[0]) => {
    setMerchantName(m.name);
    setMerchantPhone(m.phone);
    setMerchantCode(m.code);
    setStep('amount');
  };

  const handleProceedToConfirm = () => {
    if (numericAmount <= 0 || isInsufficient) return;
    setStep('confirm');
  };

  const handleConfirmPay = () => {
    const tx = onCompletePayment(numericAmount, merchantName, 'payment');
    playSuccessChime();
    setCompletedTx(tx);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black">
      <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border-2 border-black">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-black/20 flex items-center justify-between bg-amber-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black text-sm">
              3
            </div>
            <h2 className="text-base font-black text-black">
              {step === 'select_method' && (isAr ? 'دفع للمتاجر والفواتير' : 'Pay Merchants & Bills')}
              {step === 'amount' && (isAr ? 'تحديد مبلغ الدفع' : 'Payment Amount')}
              {step === 'confirm' && (isAr ? 'تأكيد الدفع' : 'Confirm Payment')}
              {step === 'success' && (isAr ? 'تم الدفع بنجاح' : 'Payment Successful')}
            </h2>
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
          {/* STEP 1: METHOD SELECTION & SCAN */}
          {step === 'select_method' && (
            <div className="space-y-4">
              {/* 3 Methods */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('scan_qr')}
                  className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    method === 'scan_qr'
                      ? 'border-black bg-black text-amber-400 font-black shadow-xs'
                      : 'border-black/30 bg-amber-200 text-black font-bold hover:border-black'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs block">{isAr ? 'مسح QR' : 'Scan QR'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('phone')}
                  className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    method === 'phone'
                      ? 'border-black bg-black text-amber-400 font-black shadow-xs'
                      : 'border-black/30 bg-amber-200 text-black font-bold hover:border-black'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs block">{isAr ? 'رقم الموبايل' : 'Phone'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('merchant_code')}
                  className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    method === 'merchant_code'
                      ? 'border-black bg-black text-amber-400 font-black shadow-xs'
                      : 'border-black/30 bg-amber-200 text-black font-bold hover:border-black'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs block">{isAr ? 'رقم الحساب' : 'Account'}</span>
                </button>
              </div>

              {/* Viewfinder simulator for QR scan */}
              {method === 'scan_qr' && (
                <div className="bg-black rounded-3xl p-6 text-amber-400 text-center relative overflow-hidden border-2 border-black">
                  <div className="w-44 h-44 mx-auto border-2 border-amber-400 rounded-2xl relative flex items-center justify-center">
                    <div className="absolute inset-x-2 h-0.5 bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-bounce top-1/2" />
                    <QrCode className="w-20 h-20 text-stone-700" />
                  </div>
                  <p className="text-xs font-black text-amber-400 mt-4">
                    {isAr ? 'امسح وادفع في ثوانٍ' : 'Scan & Pay in Seconds'}
                  </p>
                  <p className="text-[11px] text-amber-100/80 font-bold mt-1">
                    {isAr ? 'وجّه كاميرا الهاتف نحو باركود التاجر' : 'Point camera at merchant barcode'}
                  </p>
                </div>
              )}

              {/* Phone Input */}
              {method === 'phone' && (
                <div className="p-4 bg-amber-200/90 rounded-2xl border-2 border-black space-y-3">
                  <div>
                    <label className="text-xs font-black text-black block mb-1">
                      {isAr ? 'رقم موبايل التاجر' : 'Merchant Mobile'}
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder="09XXXXXXXX"
                      value={merchantPhone}
                      onChange={(e) => setMerchantPhone(e.target.value)}
                      className="w-full h-12 px-3 rounded-xl border-2 border-black bg-amber-100 text-base font-mono font-black text-black focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-black/90 block mb-1">
                      {isAr ? 'اسم المتجر أو نقطة البيع' : 'Store Name'}
                    </label>
                    <input
                      type="text"
                      placeholder={isAr ? 'اسم المتجر' : 'Store name'}
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 text-sm font-bold text-black focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Merchant Code Input */}
              {method === 'merchant_code' && (
                <div className="p-4 bg-amber-200/90 rounded-2xl border-2 border-black space-y-3">
                  <div>
                    <label className="text-xs font-black text-black block mb-1">
                      {isAr ? 'رقم حساب التاجر أو كود الخدمة' : 'Merchant Account ID / Code'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="SH-XXXXXX / M-XXXX"
                      value={merchantCode}
                      onChange={(e) => setMerchantCode(e.target.value)}
                      className="w-full h-12 px-3 rounded-xl border-2 border-black bg-amber-100 text-base font-mono font-black text-black focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-black/90 block mb-1">
                      {isAr ? 'رقم الفاتورة أو المرجع (اختياري)' : 'Bill Reference (Optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder="INV-XXXXX"
                      value={billRef}
                      onChange={(e) => setBillRef(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 text-sm font-bold text-black focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Sample Quick Merchants for Demo */}
              <div className="space-y-2">
                <span className="text-xs font-black text-black block">
                  {isAr ? 'أو اختر تاجراً تجريبياً بضغطة زر:' : 'Or tap a demo merchant:'}
                </span>
                <div className="space-y-1.5">
                  {sampleMerchants.map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSampleMerchant(m)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl border-2 border-black/30 hover:border-black bg-amber-200/80 hover:bg-amber-100 transition-colors text-start cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black text-xs">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-black block">{m.name}</span>
                          <span className="text-[10px] text-black/80 font-bold">{m.category}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-black underline">
                        {isAr ? 'دفع' : 'Pay'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {method !== 'scan_qr' && (
                <button
                  type="button"
                  onClick={() => setStep('amount')}
                  className="w-full h-13 rounded-2xl bg-black hover:bg-stone-900 text-amber-400 font-black text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center active:scale-[0.99]"
                >
                  {isAr ? 'متابعة إلى تحديد المبلغ' : 'Proceed to Amount'}
                </button>
              )}
            </div>
          )}

          {/* STEP 2: AMOUNT */}
          {step === 'amount' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-200/90 rounded-xl border-2 border-black flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-black/80 font-bold block">{isAr ? 'الدفع إلى:' : 'Paying to:'}</span>
                  <span className="text-xs font-black text-black">{merchantName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('select_method')}
                  className="text-xs text-black underline font-black"
                >
                  {isAr ? 'تغيير' : 'Change'}
                </button>
              </div>

              {/* Amount input */}
              <div className="text-center py-2">
                <span className="text-xs font-bold text-black/80 block mb-1">
                  {isAr ? 'المبلغ المطلوب سداده' : 'Payment Amount'}
                </span>
                <div className="flex items-baseline justify-center gap-2">
                  <input
                    type="number"
                    dir="ltr"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="text-4xl font-black text-black text-center w-52 bg-transparent focus:outline-none border-b-2 border-black pb-1"
                  />
                  <span className="text-base font-black text-black">{isAr ? 'جنيه' : 'SDG'}</span>
                </div>

                {isInsufficient && (
                  <p className="text-xs font-black text-red-600 mt-1">
                    {isAr ? 'المبلغ يتجاوز الرصيد المتاح' : 'Amount exceeds available balance'}
                  </p>
                )}
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[2500, 5000, 12500, 25000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      playKeypadClick();
                      setAmountStr(preset.toString());
                    }}
                    className="py-2 px-1 text-xs font-black rounded-lg border-2 border-black bg-amber-200 hover:bg-amber-100 text-black transition-colors cursor-pointer"
                  >
                    {preset.toLocaleString('en-US')}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={numericAmount <= 0 || isInsufficient}
                onClick={handleProceedToConfirm}
                className={`w-full h-13 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center justify-center cursor-pointer ${
                  numericAmount > 0 && !isInsufficient
                    ? 'bg-black hover:bg-stone-900 text-amber-400 active:scale-[0.99]'
                    : 'bg-black/30 text-black/50 cursor-not-allowed border border-black/30'
                }`}
              >
                {isAr ? 'متابعة إلى تأكيد الدفع' : 'Proceed to Confirmation'}
              </button>
            </div>
          )}

          {/* STEP 3: CONFIRMATION CARD */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-amber-200 border-2 border-black rounded-3xl p-5 text-center shadow-sm">
                <span className="text-xs font-black text-black/80 block mb-1">
                  {isAr ? 'أنت على وشك سداد فاتورة / مشتريات' : 'You are about to pay'}
                </span>

                <div className="my-3">
                  <span className="text-4xl font-black text-black tabular-nums">
                    {numericAmount.toLocaleString('en-US')}
                  </span>
                  <span className="text-base font-black text-black ms-1.5">
                    {isAr ? 'جنيه' : 'SDG'}
                  </span>
                </div>

                <div className="bg-amber-100 rounded-2xl p-4 border-2 border-black text-start space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'المتجر / الجهة:' : 'Merchant:'}</span>
                    <span className="font-black text-black text-sm">{merchantName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'كود التاجر:' : 'Code:'}</span>
                    <span className="font-mono font-black text-black">{merchantCode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'رسوم الدفع:' : 'Fee:'}</span>
                    <span className="font-black text-black">{isAr ? '0 جنيه (مجاناً)' : '0 SDG (Free)'}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-black font-black">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                  <span>{isAr ? 'دفع آمن ومعتمد فورياً' : 'Secure & Instantly Verified Payment'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleConfirmPay}
                  className="w-full h-14 rounded-2xl bg-black hover:bg-stone-900 text-amber-400 font-black text-base transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>{isAr ? 'تأكيد ودفع الآن' : 'Confirm & Pay Now'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep('amount')}
                  className="w-full py-2 text-xs text-black font-black underline cursor-pointer"
                >
                  {isAr ? 'رجوع لتعديل المبلغ' : 'Back to Edit Amount'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'success' && completedTx && (
            <div className="space-y-4 text-center text-black">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-black text-amber-400 flex items-center justify-center border-2 border-black">
                <CheckCircle2 className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-black text-black">
                {isAr ? 'تم سداد الدفعة بنجاح!' : 'Payment Completed!'}
              </h3>
              <p className="text-xs text-black/80 font-bold">
                {isAr ? 'تم استلام الإشعار في نقطة البيع فوراً' : 'Point of sale received confirmation'}
              </p>

              <div className="bg-amber-200/90 rounded-2xl p-4 border-2 border-black space-y-2 text-xs text-start">
                <div className="flex items-center justify-between pb-2 border-b-2 border-black/20">
                  <span className="font-bold text-black/80">{isAr ? 'المرجع' : 'Reference'}</span>
                  <span className="font-mono font-black text-black">{completedTx.referenceNo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'التاجر' : 'Merchant'}</span>
                  <span className="font-black text-black">{completedTx.recipientOrSender}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'المبلغ' : 'Amount'}</span>
                  <span className="font-black text-black">
                    {Math.abs(completedTx.amount).toLocaleString('en-US')} {isAr ? 'جنيه' : 'SDG'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full h-13 rounded-2xl bg-black hover:bg-stone-900 active:scale-[0.98] text-amber-400 font-black text-sm cursor-pointer shadow-sm"
              >
                {isAr ? 'تم والعودة للرئيسية' : 'Done'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
