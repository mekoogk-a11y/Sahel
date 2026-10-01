import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Users,
  Delete,
  ShieldCheck,
  CheckCircle2,
  BookmarkPlus,
  Fingerprint,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Share2,
  Download,
  Check,
} from 'lucide-react';
import { Beneficiary, Language, Transaction } from '../types';
import { lookupAccountByNumber, REGISTERED_ACCOUNTS, RegisteredAccount } from '../data/mockData';
import { playKeypadClick, playSuccessChime } from '../utils/soundEffects';
import { downloadReceiptAsImage } from '../utils/receiptGenerator';
import { ReceiptShareModal } from './ReceiptShareModal';

interface SendModalProps {
  language: Language;
  beneficiaries: Beneficiary[];
  preselectedBeneficiary?: Beneficiary | null;
  currentBalance: number;
  onClose: () => void;
  onCompleteTransfer: (amount: number, recipientName: string, recipientAccount: string) => Transaction;
  onSaveBeneficiary?: (name: string, phone: string) => void;
}

type Step = 'account' | 'amount' | 'confirm' | 'authenticating' | 'success';
type AccountInputMode = 'direct' | 'saved' | 'qr';

export const SendModal: React.FC<SendModalProps> = ({
  language,
  beneficiaries,
  preselectedBeneficiary,
  currentBalance,
  onClose,
  onCompleteTransfer,
  onSaveBeneficiary,
}) => {
  const isAr = language === 'ar';
  const ChevronBack = isAr ? ArrowRight : ArrowLeft;

  const [step, setStep] = useState<Step>(preselectedBeneficiary ? 'amount' : 'account');
  const [mode, setMode] = useState<AccountInputMode>(preselectedBeneficiary ? 'saved' : 'direct');

  // Account Number input — The ONLY way to identify the recipient
  const [accountNumber, setAccountNumber] = useState(
    preselectedBeneficiary?.accountNumber || 'SH-992011'
  );

  // Auto-resolved verified account details (Name is NEVER entered manually)
  const [resolvedAccount, setResolvedAccount] = useState<RegisteredAccount | null>(() => {
    if (preselectedBeneficiary?.accountNumber) {
      return lookupAccountByNumber(preselectedBeneficiary.accountNumber);
    }
    return lookupAccountByNumber('SH-992011');
  });

  const [isLookingUp, setIsLookingUp] = useState(false);

  // Amount entered via large numeric keypad
  const [amountStr, setAmountStr] = useState(preselectedBeneficiary ? '50000' : '');
  const [note, setNote] = useState('');

  // Completed transaction
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);
  const [receiptDownloaded, setReceiptDownloaded] = useState(false);

  const handleDownloadReceipt = async () => {
    if (!completedTx) return;
    setIsDownloadingReceipt(true);
    const ok = await downloadReceiptAsImage(completedTx, isAr);
    setIsDownloadingReceipt(false);
    if (ok) {
      setReceiptDownloaded(true);
      setTimeout(() => setReceiptDownloaded(false), 3000);
    }
  };

  // Auto-resolve recipient full name whenever account number changes
  useEffect(() => {
    if (!accountNumber || accountNumber.trim().length === 0) {
      setResolvedAccount(null);
      return;
    }

    setIsLookingUp(true);
    const timer = setTimeout(() => {
      const res = lookupAccountByNumber(accountNumber);
      setResolvedAccount(res);
      setIsLookingUp(false);
    }, 180);

    return () => clearTimeout(timer);
  }, [accountNumber]);

  const numericAmount = parseInt(amountStr || '0', 10);
  const isInsufficient = numericAmount > currentBalance;

  // Keypad press
  const handleKeypadPress = (val: string) => {
    playKeypadClick();
    if (val === 'backspace') {
      setAmountStr((prev) => prev.slice(0, -1));
      return;
    }
    if (val === '00' && (!amountStr || amountStr === '0')) return;
    if (amountStr.length >= 8) return;
    setAmountStr((prev) => (prev === '0' ? val : prev + val));
  };

  const handleSelectSaved = (b: Beneficiary) => {
    setAccountNumber(b.accountNumber);
    const resolved = lookupAccountByNumber(b.accountNumber);
    setResolvedAccount(
      resolved || {
        accountNumber: b.accountNumber,
        fullName: b.name,
        fullNameEn: b.nameEn,
        bankName: 'ساهل — الحساب الموثق',
        tier: 'مستفيد محفوظ',
      }
    );
    setStep('amount');
  };

  const handleSelectSuggestedAccount = (acc: RegisteredAccount) => {
    setAccountNumber(acc.accountNumber);
    setResolvedAccount(acc);
  };

  const handleProceedToAmount = () => {
    if (!accountNumber.trim()) return;
    if (!resolvedAccount) {
      const resolved = lookupAccountByNumber(accountNumber);
      setResolvedAccount(resolved);
    }
    setStep('amount');
  };

  const handleProceedToConfirm = () => {
    if (numericAmount <= 0 || isInsufficient) return;
    setStep('confirm');
  };

  const handleExecuteTransfer = () => {
    setStep('authenticating');
    const finalName = resolvedAccount?.fullName || 'مستفيد ساهل المعتمد';
    const finalAccount = resolvedAccount?.accountNumber || accountNumber;

    setTimeout(() => {
      const tx = onCompleteTransfer(numericAmount, finalName, finalAccount);
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
              {step === 'account' && '1'}
              {step === 'amount' && '2'}
              {step === 'confirm' && '3'}
              {step === 'authenticating' && '•'}
              {step === 'success' && '✓'}
            </div>
            <div>
              <h2 className="text-base font-black text-black">
                {step === 'account' && (isAr ? 'إرسال أموال — رقم الحساب' : 'Send Money — Account Number')}
                {step === 'amount' && (isAr ? 'إرسال أموال — تحديد المبلغ' : 'Send Money — Enter Amount')}
                {step === 'confirm' && (isAr ? 'تأكيد العملية' : 'Confirm Transfer')}
                {step === 'authenticating' && (isAr ? 'التحقق الأمني' : 'Security Verification')}
                {step === 'success' && (isAr ? 'تم التحويل بنجاح' : 'Transfer Successful')}
              </h2>
              <span className="text-[10px] text-black/80 font-bold block">
                {isAr
                  ? 'التحويل برقم الحساب فقط — يظهر اسم المرسل إليه بالكامل آلياً'
                  : 'Account Number Only — Recipient Full Name Auto-Resolved'}
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* STEP 1: ACCOUNT NUMBER ONLY */}
          {step === 'account' && (
            <div className="space-y-4">
              {/* Channel Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('direct')}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    mode === 'direct'
                      ? 'border-black bg-black text-amber-400 font-black shadow-xs'
                      : 'border-black/30 bg-amber-200 text-black font-bold hover:border-black'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs block">{isAr ? 'رقم الحساب' : 'Account ID'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('saved')}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    mode === 'saved'
                      ? 'border-black bg-black text-amber-400 font-black shadow-xs'
                      : 'border-black/30 bg-amber-200 text-black font-bold hover:border-black'
                  }`}
                >
                  <Users className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs block">{isAr ? 'مستفيد محفوظ' : 'Saved'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('qr')}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    mode === 'qr'
                      ? 'border-black bg-black text-amber-400 font-black shadow-xs'
                      : 'border-black/30 bg-amber-200 text-black font-bold hover:border-black'
                  }`}
                >
                  <QrCode className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs block">{isAr ? 'مسح QR' : 'Scan QR'}</span>
                </button>
              </div>

              {/* DIRECT ACCOUNT NUMBER INPUT */}
              {mode === 'direct' && (
                <div className="space-y-3.5">
                  <div className="bg-amber-200/90 p-4 rounded-2xl border-2 border-black space-y-2 shadow-xs">
                    <label className="text-xs font-black text-black block">
                      {isAr ? 'أدخل رقم حساب المرسل إليه:' : "Enter Recipient's Account Number:"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        dir="ltr"
                        autoFocus
                        placeholder="SH-XXXXXX أو الأرقام"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full h-13 px-4 rounded-xl border-2 border-black bg-amber-100 text-lg font-mono font-black text-black focus:outline-none focus:bg-white placeholder:text-black/40"
                      />
                      {isLookingUp && (
                        <span className="absolute end-3 top-3.5 text-xs text-black/70 font-bold animate-pulse">
                          {isAr ? 'جاري التحقق...' : 'Checking...'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-black/80 font-bold">
                      {isAr
                        ? '💡 لا داعي لكتابة الاسم! بمجرد إدخال رقم الحساب سيظهر اسم المستلم بالكامل تلقائياً.'
                        : '💡 No need to enter a name! The full name appears automatically from the account number.'}
                    </p>
                  </div>

                  {/* AUTO-RESOLVED RECIPIENT FULL NAME BADGE */}
                  {resolvedAccount ? (
                    <div className="bg-black text-amber-400 p-4 rounded-2xl border-2 border-black shadow-md space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-black text-amber-400">
                          <CheckCircle2 className="w-4 h-4 text-green-400 fill-green-400 text-black" />
                          {isAr ? 'تم التحقق من الحساب بنجاح' : 'Account Verified Successfully'}
                        </span>
                        <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded-md font-black">
                          {resolvedAccount.tier}
                        </span>
                      </div>

                      <div className="bg-stone-900/90 p-3 rounded-xl border border-amber-400/30">
                        <span className="text-[10px] text-amber-400/80 font-bold block mb-0.5">
                          {isAr ? 'الاسم الرباعي الكامل للمرسل إليه:' : "Recipient's Full Registered Name:"}
                        </span>
                        <p className="text-base sm:text-lg font-black text-amber-300 leading-snug">
                          {isAr ? resolvedAccount.fullName : resolvedAccount.fullNameEn}
                        </p>
                        <span className="text-xs font-mono font-black text-amber-400/90 block mt-1">
                          {resolvedAccount.accountNumber}
                        </span>
                      </div>
                    </div>
                  ) : (
                    accountNumber.trim().length > 0 && (
                      <div className="bg-amber-100 p-3 rounded-xl border border-black/30 text-center text-xs text-black font-bold">
                        {isAr
                          ? 'جاري مطابقة رقم الحساب في قاعدة البيانات المصرفية...'
                          : 'Matching account number in banking directory...'}
                      </div>
                    )
                  )}

                  {/* Quick-Click Account Chips for Easy Demonstration */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-black text-black block">
                      {isAr ? 'أو اختر حساباً تجريبياً جاهزاً للتجربة:' : 'Or tap a demo account to test:'}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {REGISTERED_ACCOUNTS.slice(0, 4).map((acc) => (
                        <button
                          key={acc.accountNumber}
                          type="button"
                          onClick={() => handleSelectSuggestedAccount(acc)}
                          className={`p-2.5 rounded-xl border-2 text-start transition-all cursor-pointer ${
                            accountNumber === acc.accountNumber
                              ? 'bg-black text-amber-400 border-black shadow-xs font-black'
                              : 'bg-amber-200 hover:bg-amber-100 border-black/30 text-black font-bold'
                          }`}
                        >
                          <span className="text-xs font-black block truncate">
                            {isAr ? acc.fullName : acc.fullNameEn}
                          </span>
                          <span className="text-[11px] font-mono font-black opacity-80 block">
                            {acc.accountNumber}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SAVED BENEFICIARIES LIST */}
              {mode === 'saved' && (
                <div className="space-y-2">
                  <span className="text-xs font-black text-black block">
                    {isAr ? 'اختر حساباً من قائمتك المحفوظة:' : 'Select from saved accounts:'}
                  </span>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {beneficiaries.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleSelectSaved(b)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-black/30 hover:border-black bg-amber-200/90 hover:bg-amber-100 transition-colors text-start cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black text-xs">
                            {b.initials}
                          </div>
                          <div>
                            <span className="text-xs font-black text-black block">
                              {isAr ? b.name : b.nameEn}
                            </span>
                            <span className="text-[11px] text-black font-mono font-black">
                              {b.accountNumber}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-black underline">
                          {isAr ? 'اختيار' : 'Select'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QR SCAN SIMULATION */}
              {mode === 'qr' && (
                <div className="bg-amber-200/90 p-5 rounded-2xl border-2 border-black text-center space-y-3">
                  <div className="w-24 h-24 mx-auto bg-amber-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-black">
                    <QrCode className="w-12 h-12 text-black animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-black">
                      {isAr ? 'امسح رمز QR الخاص بحساب المرسل إليه' : 'Scan recipient account QR'}
                    </p>
                    <p className="text-[11px] text-black/80 font-bold mt-0.5">
                      {isAr ? 'يتم استرجاع رقم الحساب والاسم بالكامل فوراً' : 'Account number and full name resolved instantly'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountNumber('SH-992011');
                      setResolvedAccount(lookupAccountByNumber('SH-992011'));
                      setMode('direct');
                    }}
                    className="px-4 py-2 rounded-xl bg-black text-amber-400 font-black text-xs cursor-pointer shadow-xs"
                  >
                    {isAr ? 'مسح كود تجريبي (SH-992011)' : 'Simulate QR Scan (SH-992011)'}
                  </button>
                </div>
              )}

              {/* Proceed to Amount Button */}
              {mode !== 'saved' && (
                <button
                  type="button"
                  disabled={!accountNumber.trim() || !resolvedAccount}
                  onClick={handleProceedToAmount}
                  className={`w-full h-13 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                    accountNumber.trim() && resolvedAccount
                      ? 'bg-black hover:bg-stone-900 text-amber-400 active:scale-[0.99]'
                      : 'bg-black/30 text-black/50 cursor-not-allowed border border-black/20'
                  }`}
                >
                  <span>{isAr ? 'متابعة إلى تحديد المبلغ' : 'Proceed to Amount'}</span>
                </button>
              )}
            </div>
          )}

          {/* STEP 2: AMOUNT WITH LARGE NUMERIC KEYPAD */}
          {step === 'amount' && (
            <div className="space-y-4">
              {/* Recipient summary badge (Full Name and Account Number) */}
              <div className="flex items-center justify-between p-3.5 bg-black text-amber-400 rounded-2xl border-2 border-black shadow-sm">
                <div>
                  <span className="text-[10px] text-amber-400/80 font-bold block">
                    {isAr ? 'المرسل إليه (المطابق آلياً):' : 'Recipient (Auto-Resolved):'}
                  </span>
                  <span className="text-sm font-black text-amber-300 block">
                    {resolvedAccount?.fullName || (isAr ? 'أحمد محمد عثمان البدوي' : 'Ahmed Mohammed Osman')}
                  </span>
                  <span className="text-xs font-mono font-black text-amber-400/90 block">
                    {resolvedAccount?.accountNumber || accountNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('account')}
                  className="text-xs text-black bg-amber-400 px-3 py-1.5 rounded-lg font-black hover:bg-amber-300 cursor-pointer"
                >
                  {isAr ? 'تغيير الحساب' : 'Change'}
                </button>
              </div>

              {/* Amount Display */}
              <div className="text-center py-2">
                <span className="text-xs font-bold text-black/80 block mb-1">
                  {isAr ? 'المبلغ المراد إرساله' : 'Amount to Send'}
                </span>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-black text-black tabular-nums tracking-tight">
                    {numericAmount > 0 ? numericAmount.toLocaleString('en-US') : '0'}
                  </span>
                  <span className="text-base font-black text-black">
                    {isAr ? 'جنيه' : 'SDG'}
                  </span>
                </div>

                {isInsufficient && (
                  <p className="text-xs font-black text-red-600 mt-1">
                    {isAr ? 'عذراً، المبلغ يتجاوز الرصيد المتاح' : 'Amount exceeds available balance'}
                  </p>
                )}
              </div>

              {/* Quick Preset Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[5000, 10000, 50000, 100000].map((preset) => (
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

              {/* Large Numeric Keypad */}
              <div className="bg-amber-200 p-3 rounded-2xl border-2 border-black">
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'backspace'].map((key) => {
                    const isBack = key === 'backspace';
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleKeypadPress(key)}
                        className="h-12 rounded-xl bg-amber-100 border-2 border-black hover:bg-white active:scale-95 text-lg font-black text-black flex items-center justify-center transition-all shadow-xs cursor-pointer"
                      >
                        {isBack ? <Delete className="w-5 h-5 text-black" /> : key}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Note / Purpose input */}
              <input
                type="text"
                placeholder={isAr ? 'ملاحظة التحويل (اختياري)' : 'Transfer note (optional)'}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-10 px-3 text-xs font-bold rounded-xl border-2 border-black bg-amber-100 text-black placeholder:text-black/60 focus:bg-white focus:outline-none"
              />

              {/* Confirm Action Button */}
              <button
                type="button"
                disabled={numericAmount <= 0 || isInsufficient}
                onClick={handleProceedToConfirm}
                className={`w-full h-13 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  numericAmount > 0 && !isInsufficient
                    ? 'bg-black hover:bg-stone-900 text-amber-400 active:scale-[0.99]'
                    : 'bg-black/30 text-black/50 cursor-not-allowed border border-black/30'
                }`}
              >
                <span>{isAr ? 'مراجعة وتأكيد التحويل' : 'Review & Confirm'}</span>
              </button>
            </div>
          )}

          {/* STEP 3: CLEAR CONFIRMATION CARD */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-amber-200 border-2 border-black rounded-3xl p-5 text-center shadow-sm">
                <span className="text-xs font-black text-black/80 block mb-1">
                  {isAr ? 'أنت على وشك إرسال' : 'You are about to send'}
                </span>

                <div className="my-3">
                  <span className="text-4xl font-black text-black tabular-nums">
                    {numericAmount.toLocaleString('en-US')}
                  </span>
                  <span className="text-base font-black text-black ms-1.5">
                    {isAr ? 'جنيه' : 'SDG'}
                  </span>
                </div>

                <div className="bg-amber-100 rounded-2xl p-4 border-2 border-black text-start space-y-2.5">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-bold text-black/80 shrink-0">{isAr ? 'إلى (صاحب الحساب):' : 'To (Account Owner):'}</span>
                    <span className="font-black text-black text-sm text-end">
                      {resolvedAccount?.fullName || 'أحمد محمد عثمان البدوي'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-black/80">{isAr ? 'رقم الحساب:' : 'Account ID:'}</span>
                    <span className="font-mono font-black text-black">
                      {resolvedAccount?.accountNumber || accountNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-black/80">{isAr ? 'رسوم التحويل:' : 'Fee:'}</span>
                    <span className="font-black text-black">
                      {isAr ? '0 جنيه (مجاناً)' : '0 SDG (Free)'}
                    </span>
                  </div>

                  {note && (
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-black/20">
                      <span className="font-bold text-black/80">{isAr ? 'ملاحظة:' : 'Note:'}</span>
                      <span className="font-bold text-black">{note}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-black font-black">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                  <span>
                    {isAr ? 'مطابقة آلية للاسم الرباعي وتشفير مصرفي' : 'Auto Name Resolution & Encrypted'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleExecuteTransfer}
                  className="w-full h-14 rounded-2xl bg-black hover:bg-stone-900 active:scale-[0.98] text-amber-400 font-black text-base transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-5 h-5 text-amber-400" />
                  <span>{isAr ? 'تأكيد الإرسال' : 'Confirm & Transfer'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('amount')}
                  className="w-full py-2.5 text-xs text-black font-black underline cursor-pointer"
                >
                  {isAr ? 'رجوع لتعديل المبلغ' : 'Back to Edit Amount'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: AUTHENTICATING SPINNER */}
          {step === 'authenticating' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-black text-amber-400 flex items-center justify-center animate-pulse border-2 border-black">
                <Fingerprint className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-black">
                  {isAr ? 'جاري التحقق من الهوية وإرسال المبلغ...' : 'Verifying Identity & Sending...'}
                </h3>
                <p className="text-xs text-black/80 font-bold mt-1">
                  {isAr ? 'الرجاء الانتظار ثوانٍ معدودة' : 'Please wait a few seconds'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS RECEIPT */}
          {step === 'success' && completedTx && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-black text-amber-400 flex items-center justify-center mx-auto border-2 border-black shadow-md">
                <CheckCircle2 className="w-10 h-10 text-amber-400" />
              </div>

              <div>
                <h3 className="text-lg font-black text-black">
                  {isAr ? 'تم التحويل بنجاح!' : 'Transfer Completed Successfully!'}
                </h3>
                <p className="text-xs text-black/80 font-bold mt-0.5">
                  {isAr ? 'وصلت القروش إلى حساب المستفيد فوراً' : 'Funds delivered instantly'}
                </p>
              </div>

              {/* Receipt Card */}
              <div className="bg-amber-200 rounded-3xl p-5 border-2 border-black text-start space-y-3">
                <div className="flex items-center justify-between pb-2 border-b-2 border-black/20">
                  <span className="text-xs text-black/80 font-bold">
                    {isAr ? 'المبلغ المحوّل:' : 'Transferred Amount:'}
                  </span>
                  <span className="text-xl font-black text-black tabular-nums">
                    {Math.abs(completedTx.amount).toLocaleString('en-US')}{' '}
                    <span className="text-xs">{isAr ? 'جنيه' : 'SDG'}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="text-black/80 font-bold shrink-0">{isAr ? 'صاحب الحساب المستلم:' : 'Recipient Name:'}</span>
                  <span className="font-black text-black text-end">{completedTx.recipientOrSender}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-black/80 font-bold">{isAr ? 'رقم الحساب:' : 'Account ID:'}</span>
                  <span className="font-mono font-black text-black">{completedTx.phoneOrAccount}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-black/80 font-bold">{isAr ? 'رقم العملية المرجعي:' : 'Reference No:'}</span>
                  <span className="font-mono font-black text-black">{completedTx.referenceNo}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-black/80 font-bold">{isAr ? 'الوقت والتاريخ:' : 'Date & Time:'}</span>
                  <span className="font-bold text-black">
                    {completedTx.date} · {completedTx.time}
                  </span>
                </div>
              </div>

              {/* PRIMARY SHARE & DOWNLOAD ACTIONS */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Share on Media Button */}
                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="p-3.5 rounded-2xl bg-black hover:bg-stone-900 text-amber-400 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'مشاركة الإشعار على الوسائط' : 'Share Receipt'}</span>
                </button>

                {/* 2. Download as Image Button */}
                <button
                  type="button"
                  disabled={isDownloadingReceipt}
                  onClick={handleDownloadReceipt}
                  className="p-3.5 rounded-2xl border-2 border-black bg-amber-100 hover:bg-white text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all"
                >
                  {isDownloadingReceipt ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : receiptDownloaded ? (
                    <Check className="w-4 h-4 text-green-700" />
                  ) : (
                    <Download className="w-4 h-4 text-black" />
                  )}
                  <span>
                    {receiptDownloaded
                      ? (isAr ? 'تم التنزيل بنجاح! ✓' : 'Downloaded! ✓')
                      : (isAr ? 'تنزيل الإشعار (صورة)' : 'Download Receipt')}
                  </span>
                </button>
              </div>

              {/* Save Beneficiary Option */}
              {onSaveBeneficiary && !isSaved && (
                <button
                  type="button"
                  onClick={() => {
                    onSaveBeneficiary(
                      resolvedAccount?.fullName || 'مستفيد جديد',
                      resolvedAccount?.accountNumber || accountNumber
                    );
                    setIsSaved(true);
                  }}
                  className="w-full p-3 rounded-xl border-2 border-black bg-amber-100 hover:bg-white text-xs font-black text-black flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <BookmarkPlus className="w-4 h-4 text-black" />
                  <span>{isAr ? 'حفظ الحساب في قائمة المستفيدين' : 'Save Account to Beneficiaries'}</span>
                </button>
              )}

              {isSaved && (
                <div className="p-2 rounded-xl bg-black text-amber-400 text-xs font-black text-center">
                  {isAr ? '✓ تم حفظ الحساب بنجاح في قائمتك' : '✓ Account saved to your favorites'}
                </div>
              )}

              {/* Done button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full h-13 rounded-2xl bg-black hover:bg-stone-900 text-amber-400 font-black text-sm shadow-md cursor-pointer transition-all active:scale-[0.98]"
              >
                {isAr ? 'تم والعودة للرئيسية' : 'Done & Return Home'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media Share & Download Modal */}
      {showShareModal && completedTx && (
        <ReceiptShareModal
          transaction={completedTx}
          language={language}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
