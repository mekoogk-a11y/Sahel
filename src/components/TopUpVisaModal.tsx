import React, { useState } from 'react';
import {
  X,
  CreditCard,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react';
import { Language, UserAccount, VirtualVisaCard } from '../types';
import { playKeypadClick, playSuccessChime } from '../utils/soundEffects';

interface TopUpVisaModalProps {
  card: VirtualVisaCard;
  user: UserAccount;
  language: Language;
  exchangeRate: number; // e.g. 2650 SDG per 1 USD
  onClose: () => void;
  onConfirmTopUp: (amountUsd: number, amountSdg: number) => void;
}

export const TopUpVisaModal: React.FC<TopUpVisaModalProps> = ({
  card,
  user,
  language,
  exchangeRate,
  onClose,
  onConfirmTopUp,
}) => {
  const isAr = language === 'ar';
  const safeExchangeRate = exchangeRate || 2650;
  const [amountUsdStr, setAmountUsdStr] = useState('20');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const numericAmountUsd = parseFloat(amountUsdStr || '0');
  const requiredSdg = Math.round(numericAmountUsd * safeExchangeRate);
  const isInsufficient = requiredSdg > user.balance;

  const handleTopUp = () => {
    if (numericAmountUsd <= 0 || isInsufficient) return;
    setIsProcessing(true);

    setTimeout(() => {
      onConfirmTopUp(numericAmountUsd, requiredSdg);
      playSuccessChime();
      setIsProcessing(false);
      setIsDone(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border-2 border-black">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-black/20 flex items-center justify-between bg-amber-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black text-sm">
              <PlusCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-black">
                {isAr ? 'شحن رصيد بطاقة فيزا' : 'Top Up Visa Card'}
              </h2>
              <span className="text-[10px] text-black/80 font-bold block">
                {isAr ? 'تغذية فورية من رصيد حساب ساهل بالجنيه' : 'Instant Funding from Sahel Balance'}
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

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {!isDone ? (
            <>
              {/* Card Summary Badge */}
              <div className="bg-black text-amber-400 p-3.5 rounded-2xl border-2 border-black flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-400/80 font-bold block">
                    {isAr ? 'البطاقة المستهدفة:' : 'Target Card:'}
                  </span>
                  <span className="font-mono text-sm font-black text-white">
                    •••• {card.cardNumber.slice(-4)}
                  </span>
                </div>
                <div className="text-end">
                  <span className="text-[10px] text-amber-400/80 font-bold block">
                    {isAr ? 'الرصيد الحالي:' : 'Current Balance:'}
                  </span>
                  <span className="font-black text-sm text-amber-300 tabular-nums">
                    ${card.balanceUsd.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="bg-amber-200 p-4 rounded-3xl border-2 border-black space-y-3">
                <div className="text-center pb-2 border-b border-black/20">
                  <span className="text-xs font-bold text-black/80 block mb-1">
                    {isAr ? 'المبلغ المراد إضافته (بالدولار الأمريكي):' : 'Amount to Add (USD):'}
                  </span>
                  <div className="flex items-baseline justify-center gap-1.5 my-1">
                    <span className="text-4xl font-black text-black tabular-nums">
                      ${numericAmountUsd > 0 ? numericAmountUsd.toFixed(2) : '0.00'}
                    </span>
                    <span className="text-base font-black text-black">USD</span>
                  </div>
                  <span className="text-[11px] font-bold text-black/80">
                    {isAr
                      ? `سعر الصرف: 1 دولار = ${safeExchangeRate.toLocaleString('en-US')} ج.س`
                      : `Rate: 1 USD = ${safeExchangeRate.toLocaleString('en-US')} SDG`}
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 50, 100].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        playKeypadClick();
                        setAmountUsdStr(val.toString());
                      }}
                      className={`py-2 rounded-xl border-2 font-black text-xs transition-all cursor-pointer ${
                        numericAmountUsd === val
                          ? 'bg-black text-amber-400 border-black shadow-xs'
                          : 'bg-amber-100 hover:bg-white text-black border-black/30'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>

                {/* Custom Number Input */}
                <div>
                  <input
                    type="number"
                    min="1"
                    step="5"
                    value={amountUsdStr}
                    onChange={(e) => setAmountUsdStr(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 font-black text-base text-black focus:bg-white focus:outline-none text-center"
                    placeholder="20"
                  />
                </div>
              </div>

              {/* Deduction Table */}
              <div className="bg-amber-100 rounded-2xl p-4 border-2 border-black space-y-2 text-xs text-black">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'المبلغ بالدولار:' : 'Amount in USD:'}</span>
                  <span className="font-black">${numericAmountUsd.toFixed(2)} USD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'الرسوم المصرفية:' : 'Bank Fee:'}</span>
                  <span className="font-black text-green-700">{isAr ? '0 جنيه (مجاناً)' : '0 SDG (Free)'}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t-2 border-black/20 text-sm">
                  <span className="font-black text-black">{isAr ? 'الإجمالي المخصوم من حساب ساهل:' : 'Total Deducted:'}</span>
                  <span className="font-black tabular-nums text-base">{requiredSdg.toLocaleString('en-US')} ج.س</span>
                </div>
              </div>

              {isInsufficient && (
                <div className="bg-red-100 border-2 border-red-600 p-3 rounded-xl flex items-center gap-2 text-xs font-black text-red-700">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{isAr ? 'رصيد حساب ساهل لا يكفي لتغطية هذا المبلغ' : 'Insufficient Sahel balance'}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                disabled={numericAmountUsd <= 0 || isInsufficient || isProcessing}
                onClick={handleTopUp}
                className={`w-full h-13 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  numericAmountUsd > 0 && !isInsufficient && !isProcessing
                    ? 'bg-black hover:bg-stone-900 text-amber-400 active:scale-[0.99]'
                    : 'bg-black/30 text-black/50 cursor-not-allowed border border-black/20'
                }`}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5 text-amber-400" />
                    <span>{isAr ? 'تأكيد شحن البطاقة فورياً' : 'Confirm Instant Top-Up'}</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="py-10 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-black text-amber-400 flex items-center justify-center mx-auto border-2 border-black shadow-md">
                <CheckCircle2 className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-base font-black text-black">
                {isAr ? 'تم شحن رصيد بطاقة فيزا بنجاح!' : 'Visa Card Successfully Funded!'}
              </h3>
              <p className="text-xs text-black/80 font-bold px-3">
                {isAr
                  ? `تمت إضافة $${numericAmountUsd.toFixed(2)} USD إلى بطاقتك الافتراضية، وخصم ${requiredSdg.toLocaleString('en-US')} ج.س من حساب ساهل.`
                  : `Added $${numericAmountUsd.toFixed(2)} USD to your card.`}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 rounded-2xl bg-black text-amber-400 font-black text-xs cursor-pointer mt-2"
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
