import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  Delete,
  Fingerprint,
  Share2,
  Download,
  AlertCircle,
} from 'lucide-react';
import { Language, TelecomProvider, Transaction } from '../types';
import { playKeypadClick, playSuccessChime } from '../utils/soundEffects';

interface MobileRechargeModalProps {
  language: Language;
  currentBalance: number;
  userPhone: string;
  onClose: () => void;
  onCompleteRecharge: (
    provider: TelecomProvider,
    phoneNumber: string,
    amount: number
  ) => Transaction;
}

type Step = 'input' | 'review' | 'authenticating' | 'success';

export const MobileRechargeModal: React.FC<MobileRechargeModalProps> = ({
  language,
  currentBalance,
  userPhone,
  onClose,
  onCompleteRecharge,
}) => {
  const isAr = language === 'ar';

  const [step, setStep] = useState<Step>('input');
  const [provider, setProvider] = useState<TelecomProvider>('Zain');
  const [phoneNumber, setPhoneNumber] = useState(userPhone);
  const [amountStr, setAmountStr] = useState('5000');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  const numericAmount = parseInt(amountStr || '0', 10);
  const isInsufficient = numericAmount > currentBalance;

  const handleKeypadPress = (val: string) => {
    playKeypadClick();
    if (val === 'backspace') {
      setAmountStr((prev) => prev.slice(0, -1));
      return;
    }
    if (val === '00' && (!amountStr || amountStr === '0')) return;
    if (amountStr.length >= 7) return;
    setAmountStr((prev) => (prev === '0' ? val : prev + val));
  };

  const handleProceedToReview = () => {
    if (!phoneNumber.trim() || numericAmount <= 0 || isInsufficient) return;
    setStep('review');
  };

  const handleConfirmRecharge = () => {
    setStep('authenticating');
    setTimeout(() => {
      const tx = onCompleteRecharge(provider, phoneNumber, numericAmount);
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
              <Smartphone className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-black">
                {step === 'input' && (isAr ? 'شحن الرصيد (Mobile Recharge)' : 'Mobile Recharge')}
                {step === 'review' && (isAr ? 'مراجعة الشحن' : 'Review Recharge')}
                {step === 'authenticating' && (isAr ? 'تأكيد العملية' : 'Processing')}
                {step === 'success' && (isAr ? 'تم شحن الرصيد بنجاح' : 'Recharge Successful')}
              </h2>
              <span className="text-[10px] text-black/80 font-bold block">
                {isAr ? 'شحن فوري لشبكات زين وسوداني وإم تي إن' : 'Instant Top-Up for Zain, Sudani, MTN'}
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
          {/* STEP 1: CHOOSE NETWORK, PHONE NUMBER, AMOUNT */}
          {step === 'input' && (
            <div className="space-y-4">
              {/* Choose Network */}
              <div>
                <label className="text-xs font-black text-black block mb-2">
                  {isAr ? 'اختر الشبكة (Choose Network):' : 'Choose Network:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Zain', 'Sudani', 'MTN'] as TelecomProvider[]).map((net) => {
                    const isSelected = provider === net;
                    return (
                      <button
                        key={net}
                        type="button"
                        onClick={() => setProvider(net)}
                        className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-black bg-black text-amber-400 font-black shadow-xs'
                            : 'border-black/30 bg-amber-200 text-black font-bold hover:border-black'
                        }`}
                      >
                        <span className="text-sm block font-black">
                          {net === 'Zain' ? (isAr ? 'زين' : 'Zain') : net === 'Sudani' ? (isAr ? 'سوداني' : 'Sudani') : (isAr ? 'إم تي إن' : 'MTN')}
                        </span>
                        <span className="text-[10px] font-mono opacity-80 block">{net}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone Number */}
              <div className="bg-amber-200/90 p-4 rounded-2xl border-2 border-black space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-black block">
                    {isAr ? 'رقم الهاتف (Phone Number):' : 'Phone Number:'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setPhoneNumber(userPhone)}
                    className="text-[11px] text-black font-black underline cursor-pointer"
                  >
                    {isAr ? 'رقمي الحالي' : 'My Phone'}
                  </button>
                </div>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="09XXXXXXXX / 01XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border-2 border-black bg-amber-100 text-lg font-mono font-black text-black focus:outline-none focus:bg-white"
                />
              </div>

              {/* Amount Display */}
              <div className="text-center py-1">
                <span className="text-xs font-bold text-black/80 block mb-0.5">
                  {isAr ? 'المبلغ (Amount)' : 'Amount'}
                </span>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-4xl font-black text-black tabular-nums">
                    {numericAmount > 0 ? numericAmount.toLocaleString('en-US') : '0'}
                  </span>
                  <span className="text-base font-black text-black">
                    {isAr ? 'جنيه سوداني' : 'SDG'}
                  </span>
                </div>
                {isInsufficient && (
                  <p className="text-xs font-black text-red-600 mt-1">
                    {isAr ? 'المبلغ المطلوب يتجاوز الرصيد المتاح' : 'Amount exceeds available balance'}
                  </p>
                )}
              </div>

              {/* Preset Amounts */}
              <div className="grid grid-cols-4 gap-2">
                {[1000, 3000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountStr(amt.toString())}
                    className="py-2 text-xs font-black rounded-lg border-2 border-black bg-amber-200 hover:bg-amber-100 text-black cursor-pointer"
                  >
                    {amt.toLocaleString('en-US')}
                  </button>
                ))}
              </div>

              {/* Keypad */}
              <div className="bg-amber-200 p-2.5 rounded-2xl border-2 border-black">
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'backspace'].map((key) => {
                    const isBack = key === 'backspace';
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleKeypadPress(key)}
                        className="h-11 rounded-xl bg-amber-100 border-2 border-black hover:bg-white active:scale-95 text-base font-black text-black flex items-center justify-center transition-all shadow-xs cursor-pointer"
                      >
                        {isBack ? <Delete className="w-4 h-4 text-black" /> : key}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Proceed to Review */}
              <button
                type="button"
                disabled={!phoneNumber.trim() || numericAmount <= 0 || isInsufficient}
                onClick={handleProceedToReview}
                className={`w-full h-13 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  phoneNumber.trim() && numericAmount > 0 && !isInsufficient
                    ? 'bg-black hover:bg-stone-900 text-amber-400 active:scale-[0.99]'
                    : 'bg-black/30 text-black/50 cursor-not-allowed border border-black/20'
                }`}
              >
                <span>{isAr ? 'مراجعة الشحن (Review Recharge)' : 'Review Recharge'}</span>
              </button>
            </div>
          )}

          {/* STEP 2: REVIEW RECHARGE */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="bg-amber-200 border-2 border-black rounded-3xl p-5 shadow-sm space-y-4">
                <div className="text-center pb-3 border-b-2 border-black/20">
                  <span className="text-xs font-black text-black/80 block mb-1">
                    {isAr ? 'مراجعة الشحن (Review Recharge)' : 'Review Recharge'}
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
                    <span className="font-bold text-black/80">{isAr ? 'الشبكة المختارة:' : 'Network:'}</span>
                    <span className="font-black text-sm">{provider}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                    <span className="font-mono font-black">{phoneNumber}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'مبلغ الشحن:' : 'Recharge Amount:'}</span>
                    <span className="font-black tabular-nums">{numericAmount.toLocaleString('en-US')} {isAr ? 'ج.س' : 'SDG'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'الرسوم:' : 'Fees:'}</span>
                    <span className="font-black text-black">{isAr ? '0 جنيه (مجاناً)' : '0 SDG'}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t-2 border-black/20 text-sm">
                    <span className="font-black text-black">{isAr ? 'الإجمالي المطلوب خصمه:' : 'Total:'}</span>
                    <span className="font-black tabular-nums text-base">{numericAmount.toLocaleString('en-US')} {isAr ? 'جنيه' : 'SDG'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleConfirmRecharge}
                  className="w-full h-14 rounded-2xl bg-black hover:bg-stone-900 active:scale-[0.98] text-amber-400 font-black text-base transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-5 h-5 text-amber-400" />
                  <span>{isAr ? 'تأكيد الشحن (Confirm Recharge)' : 'Confirm Recharge'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="w-full py-2.5 text-xs text-black font-black underline cursor-pointer text-center"
                >
                  {isAr ? 'الرجوع لتعديل البيانات' : 'Back to Edit'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING */}
          {step === 'authenticating' && (
            <div className="py-14 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-black text-amber-400 flex items-center justify-center animate-pulse border-2 border-black">
                <Smartphone className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-base font-black text-black">
                {isAr ? 'جاري شحن الرصيد من الخادم...' : 'Executing Recharge...'}
              </h3>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'success' && completedTx && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-black text-amber-400 flex items-center justify-center mx-auto border-2 border-black shadow-md">
                <CheckCircle2 className="w-10 h-10 text-amber-400" />
              </div>

              <div>
                <h3 className="text-lg font-black text-black">
                  {isAr ? 'تم شحن الرصيد بنجاح!' : 'Recharge Successful!'}
                </h3>
                <p className="text-xs text-black/80 font-bold mt-0.5">
                  {isAr ? `تم شحن رصيد ${provider} للرقم ${phoneNumber}` : `Top-up completed for ${phoneNumber}`}
                </p>
              </div>

              <div className="bg-amber-200 rounded-2xl p-4 border-2 border-black text-start space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'رقم العملية:' : 'Reference No:'}</span>
                  <span className="font-mono font-black">{completedTx.referenceNo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'المبلغ:' : 'Amount:'}</span>
                  <span className="font-black tabular-nums">{Math.abs(completedTx.amount).toLocaleString('en-US')} {isAr ? 'جنيه' : 'SDG'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'الوقت والتاريخ:' : 'Date & Time:'}</span>
                  <span className="font-bold">{completedTx.date} · {completedTx.time}</span>
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
