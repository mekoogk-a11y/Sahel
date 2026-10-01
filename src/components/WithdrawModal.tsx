import React, { useState } from 'react';
import {
  X,
  Building2,
  Store,
  UserCheck,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { Language, Transaction } from '../types';
import { playKeypadClick, playSuccessChime } from '../utils/soundEffects';

interface WithdrawModalProps {
  language: Language;
  currentBalance: number;
  onClose: () => void;
  onCompleteWithdrawal: (
    amount: number,
    type: 'atm_withdraw' | 'agent_withdraw',
    description: string
  ) => Transaction;
}

type WithdrawOption = 'atm' | 'agent' | 'remit_cash';
type Step = 'select_option' | 'enter_details' | 'generated_code';

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  language,
  currentBalance,
  onClose,
  onCompleteWithdrawal,
}) => {
  const isAr = language === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [step, setStep] = useState<Step>('select_option');
  const [option, setOption] = useState<WithdrawOption>('atm');
  const [amountStr, setAmountStr] = useState('20000');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  
  // Generated code state
  const [withdrawalCode, setWithdrawalCode] = useState('');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const numericAmount = parseInt(amountStr || '0', 10);
  const isInsufficient = numericAmount > currentBalance;

  const handleSelectOption = (opt: WithdrawOption) => {
    setOption(opt);
    setStep('enter_details');
  };

  const handleGenerateWithdrawal = () => {
    if (numericAmount <= 0 || isInsufficient) return;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setWithdrawalCode(code);

    let titleDesc = 'سحب نقدي من الصراف الآلي';
    let txType: 'atm_withdraw' | 'agent_withdraw' = 'atm_withdraw';

    if (option === 'agent') {
      titleDesc = 'سحب نقدي عبر وكيل معتمد';
      txType = 'agent_withdraw';
    } else if (option === 'remit_cash') {
      titleDesc = `حوالة سحب نقدي لـ: ${recipientName || 'المستفيد'}`;
      txType = 'agent_withdraw';
    }

    const tx = onCompleteWithdrawal(numericAmount, txType, titleDesc);
    playSuccessChime();
    setCompletedTx(tx);
    setStep('generated_code');
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(withdrawalCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black">
      <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border-2 border-black">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-black/20 flex items-center justify-between bg-amber-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black text-sm">
              4
            </div>
            <div>
              <h2 className="text-base font-black text-black">
                {step === 'select_option' && (isAr ? 'سحب نقدي (كاش)' : 'Cash Withdrawal')}
                {step === 'enter_details' && (
                  option === 'atm'
                    ? (isAr ? 'السحب من الصراف الآلي' : 'ATM Withdrawal')
                    : option === 'agent'
                    ? (isAr ? 'السحب عبر وكيل معتمد' : 'Agent Cash Out')
                    : (isAr ? 'إرسال مبلغ لشخص ليسحب كاش' : 'Send Cash Voucher')
                )}
                {step === 'generated_code' && (isAr ? 'كود السحب جاهز' : 'Withdrawal Code Ready')}
              </h2>
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
          {/* STEP 1: SELECT 3 OPTIONS */}
          {step === 'select_option' && (
            <div className="space-y-3">
              <p className="text-xs text-black/80 font-bold">
                {isAr ? 'اختر طريقة سحب الكاش المناسبة لك:' : 'Choose your cash withdrawal method:'}
              </p>

              {/* Option 1: ATM */}
              <button
                type="button"
                onClick={() => handleSelectOption('atm')}
                className="w-full p-4 rounded-2xl border-2 border-black/30 hover:border-black bg-amber-200/90 hover:bg-amber-100 transition-all text-start flex items-center gap-3.5 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-black text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-black text-black block">
                    {isAr ? 'السحب من الصراف' : 'ATM Cardless Cash Out'}
                  </span>
                  <span className="text-xs text-black/80 font-bold mt-0.5 block">
                    {isAr ? 'سحب كاش من أي صراف آلي بدون بطاقة عبر كود مؤقت' : 'Withdraw from any ATM without card using a temp code'}
                  </span>
                </div>
              </button>

              {/* Option 2: Agent */}
              <button
                type="button"
                onClick={() => handleSelectOption('agent')}
                className="w-full p-4 rounded-2xl border-2 border-black/30 hover:border-black bg-amber-200/90 hover:bg-amber-100 transition-all text-start flex items-center gap-3.5 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-black text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Store className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-black text-black block">
                    {isAr ? 'السحب عبر وكيل' : 'Withdraw via Agent'}
                  </span>
                  <span className="text-xs text-black/80 font-bold mt-0.5 block">
                    {isAr ? 'سحب فوري من أي دكان أو نقطة معتمدة لشبكة ساهل' : 'Instant cash out at local verified Sahel partner stores'}
                  </span>
                </div>
              </button>

              {/* Option 3: Send to Someone to Withdraw */}
              <button
                type="button"
                onClick={() => handleSelectOption('remit_cash')}
                className="w-full p-4 rounded-2xl border-2 border-black/30 hover:border-black bg-amber-200/90 hover:bg-amber-100 transition-all text-start flex items-center gap-3.5 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-black text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-black text-black block">
                    {isAr ? 'إرسال مبلغ لشخص ليقوم بالسحب' : 'Send Voucher for Non-Account Cash Out'}
                  </span>
                  <span className="text-xs text-black/80 font-bold mt-0.5 block">
                    {isAr ? 'إرسال كود سحب لشخص لا يملك حساباً بنكياً ليستلم كاش' : 'Send SMS cash code to family/friends without bank account'}
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* STEP 2: ENTER DETAILS & AMOUNT */}
          {step === 'enter_details' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setStep('select_option')}
                className="flex items-center gap-1 text-xs text-black underline font-black cursor-pointer"
              >
                <BackIcon className="w-3.5 h-3.5 text-black" />
                <span>{isAr ? 'تغيير خيار السحب' : 'Change Method'}</span>
              </button>

              {/* Remit to someone inputs */}
              {option === 'remit_cash' && (
                <div className="bg-amber-200/90 p-4 rounded-2xl border-2 border-black space-y-3">
                  <div>
                    <label className="text-xs font-black text-black block mb-1">
                      {isAr ? 'اسم المستلم الثلاثي' : "Recipient's Full Name"}
                    </label>
                    <input
                      type="text"
                      placeholder={isAr ? 'مثال: فاطمة إبراهيم' : 'e.g., Fatima Ibrahim'}
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 text-sm font-bold text-black focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-black block mb-1">
                      {isAr ? 'رقم موبايل المستلم' : "Recipient's Mobile"}
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder="09XXXXXXXX"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 font-mono font-black text-black focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Amount input */}
              <div className="text-center py-2">
                <span className="text-xs font-bold text-black/80 block mb-1">
                  {isAr ? 'المبلغ المراد سحبه كاش' : 'Cash Amount to Withdraw'}
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
                {[10000, 20000, 50000, 100000].map((preset) => (
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

              {/* Context advice */}
              <div className="p-3 bg-amber-200/90 border-2 border-black rounded-xl text-xs text-black flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                <span>
                  {option === 'atm' && (isAr ? 'سيتم إصدار كود مؤقت صالح لمدة 15 دقيقة للاستخدام في أي صراف آلي' : 'A 15-minute temporary code will be generated for ATM use')}
                  {option === 'agent' && (isAr ? 'أبرز الكود للوكيل المعتمد لاستلام المبلغ مباشرة' : 'Show code to certified agent to disburse cash immediately')}
                  {option === 'remit_cash' && (isAr ? 'سيصل كود السحب للمستلم في رسالة نصية SMS ليصرف الكاش بدون حساب' : 'Recipient receives SMS withdrawal code to cash out without an account')}
                </span>
              </div>

              <button
                type="button"
                disabled={numericAmount <= 0 || isInsufficient}
                onClick={handleGenerateWithdrawal}
                className={`w-full h-14 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center justify-center cursor-pointer ${
                  numericAmount > 0 && !isInsufficient
                    ? 'bg-black hover:bg-stone-900 text-amber-400 active:scale-[0.98]'
                    : 'bg-black/30 text-black/50 cursor-not-allowed border border-black/30'
                }`}
              >
                {isAr ? 'تأكيد وإصدار كود السحب' : 'Generate Cash Out Code'}
              </button>
            </div>
          )}

          {/* STEP 3: GENERATED WITHDRAWAL CODE */}
          {step === 'generated_code' && completedTx && (
            <div className="space-y-4 text-center text-black">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-black text-amber-400 flex items-center justify-center border-2 border-black">
                <CheckCircle2 className="w-8 h-8 text-amber-400" />
              </div>

              <div>
                <h3 className="text-lg font-black text-black">
                  {isAr ? 'كود السحب جاهز الآن' : 'Withdrawal Code is Ready'}
                </h3>
                <p className="text-xs text-black/80 font-bold">
                  {isAr ? 'صالح لمدة 15 دقيقة فقط' : 'Valid for 15 minutes only'}
                </p>
              </div>

              {/* Big 6-Digit Code Display */}
              <div className="bg-black text-amber-400 rounded-3xl p-5 border-2 border-black shadow-md">
                <span className="text-[11px] text-amber-400 font-black block mb-1 uppercase tracking-widest">
                  {isAr ? 'كود السحب السري' : 'One-Time Cash Out Code'}
                </span>
                <div className="text-4xl font-mono font-black tracking-widest text-amber-400 my-2 select-all">
                  {withdrawalCode.slice(0, 3)} {withdrawalCode.slice(3)}
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-200 mt-2 font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'متبقي: 14:59 دقيقة' : 'Expires in: 14:59 min'}</span>
                </div>

                <button
                  type="button"
                  onClick={copyCode}
                  className="mt-3 inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-black text-black transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5 text-black" />}
                  <span>{copiedCode ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الكود' : 'Copy Code')}</span>
                </button>
              </div>

              {/* Instructions steps */}
              <div className="bg-amber-200/90 rounded-2xl p-4 border-2 border-black text-start space-y-2 text-xs font-bold text-black">
                <span className="font-black text-black block mb-1">
                  {isAr ? 'خطوات استلام الكاش:' : 'Cash Out Steps:'}
                </span>
                <p>
                  1. {option === 'atm' ? (isAr ? 'توجه لأي صراف آلي يدعم ساهل' : 'Go to any Sahel-enabled ATM') : (isAr ? 'توجه لأقرب وكيل أو دكان ساهل' : 'Go to nearest Sahel agent store')}
                </p>
                <p>
                  2. {isAr ? 'اختر "سحب نقدي بدون بطاقة"' : 'Select "Cardless Withdrawal"'}
                </p>
                <p>
                  3. {isAr ? `أدخل الكود أعلاه (${withdrawalCode}) واستلم المبلغ فوراً (${numericAmount.toLocaleString('en-US')} جنيه)` : `Enter code (${withdrawalCode}) to collect ${numericAmount.toLocaleString('en-US')} SDG`}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full h-13 rounded-2xl bg-black hover:bg-stone-900 active:scale-[0.98] text-amber-400 font-black text-sm cursor-pointer shadow-sm"
              >
                {isAr ? 'تم وحفظ العملية' : 'Done & Save'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
