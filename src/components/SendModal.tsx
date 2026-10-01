import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Users,
  Delete,
  ShieldCheck,
  CheckCircle2,
  BookmarkPlus,
  Fingerprint,
  AlertTriangle,
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
  onCompleteTransfer: (
    amount: number,
    recipientName: string,
    recipientAccount: string,
    recipientPhone: string,
    note?: string
  ) => Transaction;
  onSaveBeneficiary?: (name: string, account: string, phone: string) => void;
}

type Step = 'recipient' | 'amount' | 'review' | 'authenticating' | 'success';

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

  const [step, setStep] = useState<Step>(preselectedBeneficiary ? 'amount' : 'recipient');
  const [accountNumber, setAccountNumber] = useState(preselectedBeneficiary?.accountNumber || '');
  const [resolvedAccount, setResolvedAccount] = useState<RegisteredAccount | null>(() => {
    if (preselectedBeneficiary?.accountNumber) {
      return lookupAccountByNumber(preselectedBeneficiary.accountNumber);
    }
    return null;
  });

  const [amountStr, setAmountStr] = useState(preselectedBeneficiary ? '25000' : '');
  const [note, setNote] = useState('');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Auto-resolve recipient when account number changes
  useEffect(() => {
    if (!accountNumber || accountNumber.trim().length === 0) {
      setResolvedAccount(null);
      return;
    }
    const match = lookupAccountByNumber(accountNumber);
    setResolvedAccount(match);
  }, [accountNumber]);

  const numericAmount = parseInt(amountStr || '0', 10);
  const transactionFee = 0; // Free of charge prototype
  const totalAmount = numericAmount + transactionFee;
  const isInsufficient = totalAmount > currentBalance;

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

  const handleSelectBeneficiary = (b: Beneficiary) => {
    setAccountNumber(b.accountNumber);
    const resolved = lookupAccountByNumber(b.accountNumber);
    setResolvedAccount(
      resolved || {
        accountNumber: b.accountNumber,
        fullName: b.name,
        fullNameEn: b.nameEn,
        phoneNumber: b.phoneNumber,
        bankName: 'ساهل — الحساب المعتمد',
        tier: 'حساب شخصي موثق',
        status: 'active',
      }
    );
    setStep('amount');
  };

  const handleProceedToAmount = () => {
    if (!accountNumber.trim()) return;
    if (!resolvedAccount) {
      const match = lookupAccountByNumber(accountNumber);
      if (match) setResolvedAccount(match);
      else return;
    }
    setStep('amount');
  };

  const handleProceedToReview = () => {
    if (numericAmount <= 0 || isInsufficient) return;
    setStep('review');
  };

  const handleConfirmTransfer = () => {
    setStep('authenticating');
    const recipientName = resolvedAccount?.fullName || 'مستفيد ساهل';
    const recipientAcc = resolvedAccount?.accountNumber || accountNumber;
    const recipientPhone = resolvedAccount?.phoneNumber || '09XXXXXXXX';

    setTimeout(() => {
      const tx = onCompleteTransfer(
        numericAmount,
        recipientName,
        recipientAcc,
        recipientPhone,
        note
      );
      playSuccessChime();
      setCompletedTx(tx);
      setStep('success');
    }, 1200);
  };

  const handleDownload = async () => {
    if (!completedTx) return;
    setIsDownloading(true);
    const ok = await downloadReceiptAsImage(completedTx, isAr);
    setIsDownloading(false);
    if (ok) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border-2 border-black">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-black/20 flex items-center justify-between bg-amber-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black text-sm">
              {step === 'recipient' && '1'}
              {step === 'amount' && '2'}
              {step === 'review' && '3'}
              {step === 'authenticating' && '•'}
              {step === 'success' && '✓'}
            </div>
            <div>
              <h2 className="text-base font-black text-black">
                {step === 'recipient' && (isAr ? 'إرسال الأموال — رقم الحساب' : 'Send Money — Recipient')}
                {step === 'amount' && (isAr ? 'إرسال الأموال — تحديد المبلغ' : 'Send Money — Amount')}
                {step === 'review' && (isAr ? 'مراجعة التحويل' : 'Review Transfer')}
                {step === 'authenticating' && (isAr ? 'التحقق الأمني' : 'Authenticating')}
                {step === 'success' && (isAr ? 'تم التحويل بنجاح' : 'Transfer Successful')}
              </h2>
              <span className="text-[10px] text-black/80 font-bold block">
                {isAr ? 'التحويل بين حسابات ساهل المعتمدة' : 'SAHEL Account-to-Account Transfer'}
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
          {/* STEP 1: RECIPIENT ACCOUNT */}
          {step === 'recipient' && (
            <div className="space-y-4">
              <div className="bg-amber-200/90 p-4 rounded-2xl border-2 border-black space-y-2">
                <label className="text-xs font-black text-black block">
                  {isAr ? 'أدخل رقم حساب ساهل (SAHEL Account Number):' : "Enter Recipient's SAHEL Account Number:"}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  autoFocus
                  placeholder="مثال: SH-992011"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full h-13 px-4 rounded-xl border-2 border-black bg-amber-100 text-lg font-mono font-black text-black focus:outline-none focus:bg-white placeholder:text-black/40"
                />
              </div>

              {/* Resolved Recipient Card before Proceeding */}
              {resolvedAccount && (
                <div className="bg-black text-amber-400 p-4 rounded-2xl border-2 border-black shadow-md space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      {isAr ? 'بيانات المستفيد المطابقة:' : 'Verified Recipient Details:'}
                    </span>
                    <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded font-black">
                      {resolvedAccount.tier}
                    </span>
                  </div>

                  <div className="bg-stone-900 p-3 rounded-xl border border-amber-400/30 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-300 font-bold">{isAr ? 'اسم المستفيد:' : 'Recipient Name:'}</span>
                      <span className="text-white font-black">{resolvedAccount.fullName}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-300 font-bold">{isAr ? 'رقم حساب ساهل:' : 'SAHEL Account:'}</span>
                      <span className="font-mono text-white font-black">{resolvedAccount.accountNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-300 font-bold">{isAr ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                      <span className="font-mono text-white font-black">{resolvedAccount.phoneNumber}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Preset Beneficiaries */}
              <div className="space-y-2">
                <span className="text-xs font-black text-black block">
                  {isAr ? 'أو اختر من المستفيدين المسجلين:' : 'Or choose from registered beneficiaries:'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {REGISTERED_ACCOUNTS.slice(0, 4).map((acc) => (
                    <button
                      key={acc.accountNumber}
                      type="button"
                      onClick={() => {
                        setAccountNumber(acc.accountNumber);
                        setResolvedAccount(acc);
                      }}
                      className={`p-2.5 rounded-xl border-2 text-start transition-all cursor-pointer ${
                        accountNumber === acc.accountNumber
                          ? 'bg-black text-amber-400 border-black font-black'
                          : 'bg-amber-200 hover:bg-amber-100 border-black/30 text-black font-bold'
                      }`}
                    >
                      <span className="text-xs font-black block truncate">{acc.fullName}</span>
                      <span className="text-[11px] font-mono opacity-80 block">{acc.accountNumber}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Proceed Button */}
              <button
                type="button"
                disabled={!resolvedAccount}
                onClick={handleProceedToAmount}
                className={`w-full h-13 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  resolvedAccount
                    ? 'bg-black hover:bg-stone-900 text-amber-400 active:scale-[0.99]'
                    : 'bg-black/30 text-black/50 cursor-not-allowed border border-black/20'
                }`}
              >
                <span>{isAr ? 'متابعة إلى تحديد المبلغ' : 'Proceed to Enter Amount'}</span>
              </button>
            </div>
          )}

          {/* STEP 2: ENTER AMOUNT */}
          {step === 'amount' && (
            <div className="space-y-4">
              {/* Recipient summary badge */}
              <div className="flex items-center justify-between p-3.5 bg-black text-amber-400 rounded-2xl border-2 border-black shadow-sm">
                <div>
                  <span className="text-[10px] text-amber-400/80 font-bold block">
                    {isAr ? 'المستفيد المحدد:' : 'Selected Recipient:'}
                  </span>
                  <span className="text-sm font-black text-amber-300 block">
                    {resolvedAccount?.fullName}
                  </span>
                  <span className="text-xs font-mono font-black text-amber-400/90 block">
                    {resolvedAccount?.accountNumber} · {resolvedAccount?.phoneNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('recipient')}
                  className="text-xs text-black bg-amber-400 px-3 py-1.5 rounded-lg font-black hover:bg-amber-300 cursor-pointer"
                >
                  {isAr ? 'تغيير' : 'Change'}
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
                    {isAr ? 'جنيه سوداني' : 'SDG'}
                  </span>
                </div>

                {isInsufficient && (
                  <p className="text-xs font-black text-red-600 mt-1">
                    {isAr ? 'المبلغ المطلوب يتجاوز رصيدك المتاح' : 'Amount exceeds available balance'}
                  </p>
                )}
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-2">
                {[5000, 10000, 25000, 50000].map((preset) => (
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

              {/* Numeric Keypad */}
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

              {/* Optional note */}
              <input
                type="text"
                placeholder={isAr ? 'الغرض من التحويل / ملاحظة (اختياري)' : 'Transfer note (optional)'}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-11 px-3 text-xs font-bold rounded-xl border-2 border-black bg-amber-100 text-black placeholder:text-black/60 focus:bg-white focus:outline-none"
              />

              {/* Proceed to Review */}
              <button
                type="button"
                disabled={numericAmount <= 0 || isInsufficient}
                onClick={handleProceedToReview}
                className={`w-full h-13 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  numericAmount > 0 && !isInsufficient
                    ? 'bg-black hover:bg-stone-900 text-amber-400 active:scale-[0.99]'
                    : 'bg-black/30 text-black/50 cursor-not-allowed border border-black/30'
                }`}
              >
                <span>{isAr ? 'مراجعة بيانات التحويل' : 'Review Transfer Details'}</span>
              </button>
            </div>
          )}

          {/* STEP 3: REVIEW TRANSFER (مراجعة التحويل) */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="bg-amber-200 border-2 border-black rounded-3xl p-5 shadow-sm space-y-4">
                <div className="text-center pb-3 border-b-2 border-black/20">
                  <span className="text-xs font-black text-black/80 block mb-1">
                    {isAr ? 'مراجعة التحويل (Review Transfer)' : 'Review Transfer'}
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

                {/* Table containing the required review fields */}
                <div className="bg-amber-100 rounded-2xl p-4 border-2 border-black space-y-2.5 text-xs text-black">
                  {/* Recipient */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'المستفيد (Recipient):' : 'Recipient:'}</span>
                    <span className="font-black text-sm text-end">{resolvedAccount?.fullName}</span>
                  </div>

                  {/* Account Number */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'رقم الحساب (Account Number):' : 'Account Number:'}</span>
                    <span className="font-mono font-black">{resolvedAccount?.accountNumber}</span>
                  </div>

                  {/* Phone Number */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'رقم الهاتف (Phone Number):' : 'Phone Number:'}</span>
                    <span className="font-mono font-black">{resolvedAccount?.phoneNumber}</span>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center justify-between pt-1 border-t border-black/15">
                    <span className="font-bold text-black/80">{isAr ? 'المبلغ (Amount):' : 'Amount:'}</span>
                    <span className="font-black tabular-nums">{numericAmount.toLocaleString('en-US')} {isAr ? 'ج.س' : 'SDG'}</span>
                  </div>

                  {/* Transaction Fee */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black/80">{isAr ? 'رسوم المعاملة (Transaction Fee):' : 'Transaction Fee:'}</span>
                    <span className="font-black text-black">{isAr ? '0 جنيه (مجاناً)' : '0 SDG (Free)'}</span>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-2 border-t-2 border-black/20 text-sm">
                    <span className="font-black text-black">{isAr ? 'الإجمالي (Total):' : 'Total:'}</span>
                    <span className="font-black tabular-nums text-base">{totalAmount.toLocaleString('en-US')} {isAr ? 'جنيه سوداني' : 'SDG'}</span>
                  </div>
                </div>

                {/* MANDATORY WARNING ACCORDING TO PROMPT */}
                <div className="bg-amber-100 p-3.5 rounded-2xl border-2 border-black flex items-start gap-2.5 text-xs text-black font-extrabold">
                  <AlertTriangle className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    {isAr
                      ? 'يرجى التحقق من بيانات المستفيد قبل تأكيد التحويل.'
                      : 'Please verify the recipient details before confirming this transfer.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleConfirmTransfer}
                  className="w-full h-14 rounded-2xl bg-black hover:bg-stone-900 active:scale-[0.98] text-amber-400 font-black text-base transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-5 h-5 text-amber-400" />
                  <span>{isAr ? 'تأكيد التحويل (Confirm Transfer)' : 'Confirm Transfer'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('amount')}
                  className="w-full py-2.5 text-xs text-black font-black underline cursor-pointer text-center"
                >
                  {isAr ? 'الرجوع لتعديل المبلغ' : 'Back to Edit Amount'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: AUTHENTICATING SPINNER */}
          {step === 'authenticating' && (
            <div className="py-14 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-black text-amber-400 flex items-center justify-center animate-pulse border-2 border-black">
                <Fingerprint className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-black">
                  {isAr ? 'جاري التحقق الأمني وتنفيذ التحويل...' : 'Authenticating & Executing Transfer...'}
                </h3>
                <p className="text-xs text-black/80 font-bold mt-1">
                  {isAr ? 'يرجى الانتظار ثوانٍ معدودة' : 'Please wait a moment'}
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
                  {isAr ? 'تم التحويل بنجاح!' : 'Transfer Successful!'}
                </h3>
                <p className="text-xs text-black/80 font-bold mt-0.5">
                  {isAr ? 'تم إيداع المبلغ في حساب المستفيد فوراً' : 'Funds credited to recipient account instantly'}
                </p>
              </div>

              {/* Receipt Table */}
              <div className="bg-amber-200 rounded-3xl p-5 border-2 border-black text-start space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b-2 border-black/20">
                  <span className="font-bold text-black/80">{isAr ? 'المبلغ المحوّل:' : 'Amount:'}</span>
                  <span className="text-xl font-black text-black tabular-nums">
                    {Math.abs(completedTx.amount).toLocaleString('en-US')}{' '}
                    <span className="text-xs">{isAr ? 'جنيه' : 'SDG'}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'المستفيد:' : 'Recipient:'}</span>
                  <span className="font-black text-black">{completedTx.recipientName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'رقم حساب ساهل:' : 'SAHEL Account:'}</span>
                  <span className="font-mono font-black text-black">{completedTx.recipientAccount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                  <span className="font-mono font-black text-black">{completedTx.recipientPhone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'رقم العملية (Transaction ID):' : 'Transaction ID:'}</span>
                  <span className="font-mono font-black text-black">{completedTx.referenceNo}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'التاريخ والوقت:' : 'Date & Time:'}</span>
                  <span className="font-bold text-black">{completedTx.date} · {completedTx.time}</span>
                </div>
              </div>

              {/* Share & Download Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="p-3.5 rounded-2xl bg-black hover:bg-stone-900 text-amber-400 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'مشاركة الإشعار' : 'Share Receipt'}</span>
                </button>

                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={handleDownload}
                  className="p-3.5 rounded-2xl border-2 border-black bg-amber-100 hover:bg-white text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
                >
                  {downloadSuccess ? (
                    <Check className="w-4 h-4 text-green-700" />
                  ) : (
                    <Download className="w-4 h-4 text-black" />
                  )}
                  <span>
                    {downloadSuccess
                      ? (isAr ? 'تم التنزيل!' : 'Downloaded!')
                      : (isAr ? 'تنزيل الإشعار (صورة)' : 'Download (PNG)')}
                  </span>
                </button>
              </div>

              {/* Save Beneficiary Button */}
              {onSaveBeneficiary && !isSaved && (
                <button
                  type="button"
                  onClick={() => {
                    if (resolvedAccount) {
                      onSaveBeneficiary(
                        resolvedAccount.fullName,
                        resolvedAccount.accountNumber,
                        resolvedAccount.phoneNumber
                      );
                      setIsSaved(true);
                    }
                  }}
                  className="w-full p-3 rounded-xl border-2 border-black bg-amber-100 hover:bg-white text-xs font-black text-black flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <BookmarkPlus className="w-4 h-4 text-black" />
                  <span>{isAr ? 'حفظ الحساب في قائمة المستفيدين' : 'Save to Beneficiaries'}</span>
                </button>
              )}

              {/* Done button */}
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
