import React, { useState } from 'react';
import {
  CreditCard,
  PlusCircle,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
  Globe,
  FileText,
  DollarSign,
  AlertCircle,
  ExternalLink,
  ShoppingBag,
  Cloud,
  GraduationCap,
  Tv,
  CheckCircle2,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  Language,
  UserAccount,
  VirtualVisaCard,
  VisaTransaction,
} from '../types';

interface VirtualVisaScreenProps {
  card: VirtualVisaCard | null;
  user: UserAccount;
  transactions: VisaTransaction[];
  exchangeRate: number;
  language: Language;
  onOpenIssueModal: () => void;
  onOpenTopUpModal: () => void;
  onToggleFreezeCard: () => void;
  onUpdateCardSettings: (settings: Partial<VirtualVisaCard>) => void;
}

export const VirtualVisaScreen: React.FC<VirtualVisaScreenProps> = ({
  card,
  user,
  transactions,
  exchangeRate,
  language,
  onOpenIssueModal,
  onOpenTopUpModal,
  onToggleFreezeCard,
  onUpdateCardSettings,
}) => {
  const isAr = language === 'ar';
  const safeExchangeRate = exchangeRate || 2650;

  const [showFullPan, setShowFullPan] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [copiedPan, setCopiedPan] = useState(false);
  const [copiedCvv, setCopiedCvv] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const handleCopyPan = () => {
    if (!card) return;
    navigator.clipboard?.writeText(card.cardNumber.replace(/\s+/g, ''));
    setCopiedPan(true);
    setTimeout(() => setCopiedPan(false), 2000);
  };

  const handleCopyCvv = () => {
    if (!card) return;
    navigator.clipboard?.writeText(card.cvv);
    setCopiedCvv(true);
    setTimeout(() => setCopiedCvv(false), 2000);
  };

  const isFrozen = card?.status === 'frozen';

  return (
    <div className="space-y-4 pb-20 text-black">
      {/* Title Card */}
      <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-amber-400 flex items-center justify-center font-black">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-black">
                {isAr ? 'بطاقة فيزا ساهل الافتراضية' : 'SAHEL Virtual Visa Card'}
              </h1>
              <p className="text-xs text-black/80 font-bold">
                {isAr
                  ? 'إصدار مصرفي رسمي معتمد للشراء عبر الإنترنت والتسوق الدولي'
                  : 'Official International Virtual Payment & E-Commerce Card'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-black text-amber-400 px-3 py-1.5 rounded-xl font-mono text-xs font-black">
            <span>1 USD = {safeExchangeRate.toLocaleString('en-US')} SDG</span>
          </div>
        </div>
      </div>

      {/* STATE A: NO CARD ISSUED YET */}
      {!card ? (
        <div className="bg-amber-300 rounded-3xl p-6 border-2 border-black shadow-md space-y-5 text-center">
          {/* Mock Card Hero */}
          <div className="max-w-sm mx-auto bg-stone-950 text-amber-400 rounded-3xl p-6 border-2 border-black shadow-xl text-start relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold">SAHEL VIRTUAL</span>
              <span className="text-2xl font-black italic tracking-tighter text-white">VISA</span>
            </div>
            <div className="py-2">
              <p className="text-base font-mono tracking-widest text-amber-200">
                4024 •••• •••• ••••
              </p>
              <p className="text-xs font-bold text-white mt-1 uppercase tracking-wider">
                {user.nameEn.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center justify-between text-[10px] text-amber-400/80 font-mono">
              <span>VALID THRU: 09/29</span>
              <span>CVV: •••</span>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black text-black">
              {isAr ? 'احصل على بطاقة فيزا دولية أونلاين بالإجراءات الرسمية' : 'Issue Your Virtual Visa Card Online Instantly'}
            </h2>
            <p className="text-xs text-black/80 font-bold max-w-md mx-auto mt-1 leading-relaxed">
              {isAr
                ? 'استمتع بالتسوق والشراء من آلاف المواقع العالمية، دفع رسوم الاشتراكات، الامتحانات والشهادات الدولية بكل سهولة وأمان.'
                : 'Shop online globally, pay for subscriptions, software, and international education with verified banking security.'}
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-black font-bold">
            <div className="bg-amber-200/90 p-3 rounded-2xl border-2 border-black">
              <ShieldCheck className="w-5 h-5 text-black mx-auto mb-1" />
              <span>{isAr ? 'موثقة بالهوية الوطنية' : 'KYC Verified'}</span>
            </div>
            <div className="bg-amber-200/90 p-3 rounded-2xl border-2 border-black">
              <Globe className="w-5 h-5 text-black mx-auto mb-1" />
              <span>{isAr ? 'قبول عالمي 3D Secure' : 'Global 3D Secure'}</span>
            </div>
            <div className="bg-amber-200/90 p-3 rounded-2xl border-2 border-black">
              <DollarSign className="w-5 h-5 text-black mx-auto mb-1" />
              <span>{isAr ? 'شحن فوري بالجنيه' : 'Instant SDG Top-up'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenIssueModal}
            className="w-full h-14 rounded-2xl bg-black hover:bg-stone-900 active:scale-[0.98] text-amber-400 font-black text-base shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span>{isAr ? 'بدء إجراءات إصدار بطاقة فيزا الآن' : 'Start Official Visa Issuance'}</span>
          </button>
        </div>
      ) : (
        /* STATE B: ACTIVE / MANAGED VIRTUAL VISA CARD */
        <div className="space-y-4">
          {/* INTERACTIVE VIRTUAL CARD */}
          <div
            className={`rounded-3xl p-6 border-2 border-black shadow-xl relative overflow-hidden transition-all ${
              isFrozen
                ? 'bg-stone-800 text-stone-300 opacity-90'
                : 'bg-stone-950 text-amber-400'
            }`}
          >
            {/* Card Watermark Glow */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                {/* Metallic Chip */}
                <div className="w-9 h-7 rounded bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-black/40 flex items-center justify-center shadow-xs">
                  <div className="w-6 h-4 border border-black/30 rounded-xs" />
                </div>
                <span className="text-[11px] font-mono tracking-widest text-amber-400 font-black">
                  SAHEL VIRTUAL
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isFrozen && (
                  <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black">
                    {isAr ? 'مجمّدة احترازياً' : 'FROZEN'}
                  </span>
                )}
                <span className="text-2xl font-black italic tracking-tighter text-white">VISA</span>
              </div>
            </div>

            {/* 16-Digit Card Number with Show/Hide & Copy */}
            <div className="my-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400/70 font-mono font-bold">CARD NUMBER</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFullPan(!showFullPan)}
                    className="text-amber-400 hover:text-white transition-colors cursor-pointer text-xs p-1"
                    title={showFullPan ? (isAr ? 'إخفاء الأرقام' : 'Hide') : (isAr ? 'إظهار الأرقام' : 'Show')}
                  >
                    {showFullPan ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyPan}
                    className="text-amber-400 hover:text-white transition-colors cursor-pointer text-xs p-1"
                    title={isAr ? 'نسخ رقم البطاقة' : 'Copy'}
                  >
                    {copiedPan ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-base sm:text-xl font-mono font-black tracking-wider sm:tracking-widest text-amber-200 mt-0.5 select-all">
                {showFullPan ? card.cardNumber : `•••• •••• •••• ${card.cardNumber.slice(-4)}`}
              </p>
            </div>

            {/* Bottom Row: Name, Expiry, CVV */}
            <div className="flex items-end justify-between text-xs font-mono pt-3 border-t border-amber-400/20">
              <div>
                <span className="text-[9px] text-amber-400/70 block font-sans font-bold">CARDHOLDER NAME</span>
                <span className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase">
                  {card.cardholderName}
                </span>
              </div>

              <div className="text-center">
                <span className="text-[9px] text-amber-400/70 block font-sans font-bold">EXPIRES</span>
                <span className="text-white font-bold text-xs sm:text-sm">
                  {card.expiryMonth}/{card.expiryYear}
                </span>
              </div>

              <div className="text-end">
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-[9px] text-amber-400/70 block font-sans font-bold">CVV</span>
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="text-amber-400 hover:text-white p-0.5"
                  >
                    {showCvv ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-amber-300 font-bold text-xs sm:text-sm tracking-widest">
                    {showCvv ? card.cvv : '•••'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCvv}
                    className="text-amber-400 hover:text-white text-xs"
                  >
                    {copiedCvv ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BALANCE & PRIMARY CARD CONTROLS */}
          <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-black/80 block mb-0.5">
                  {isAr ? 'رصيد بطاقة فيزا المتاح:' : 'Available Visa Balance:'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-black tabular-nums">
                    ${card.balanceUsd.toFixed(2)}
                  </span>
                  <span className="text-base font-black text-black">USD</span>
                </div>
                <span className="text-xs font-bold text-black/70 block mt-0.5">
                  ≈ {((card.balanceUsd || 0) * safeExchangeRate).toLocaleString('en-US')} {isAr ? 'جنيه سوداني' : 'SDG'}
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenTopUpModal}
                className="px-4 py-2.5 rounded-2xl bg-black hover:bg-stone-900 active:scale-95 text-amber-400 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'شحن الرصيد' : 'Top Up'}</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t-2 border-black/10">
              {/* 1. Freeze / Unfreeze */}
              <button
                type="button"
                onClick={onToggleFreezeCard}
                className={`p-3 rounded-2xl border-2 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                  isFrozen
                    ? 'bg-amber-100 text-black border-black hover:bg-white'
                    : 'bg-black text-amber-400 border-black hover:bg-stone-900'
                }`}
              >
                {isFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{isFrozen ? (isAr ? 'إلغاء التجميد' : 'Unfreeze Card') : (isAr ? 'تجميد مؤقت' : 'Freeze Card')}</span>
              </button>

              {/* 2. Regulatory Certificate */}
              <button
                type="button"
                onClick={() => setShowCertificateModal(true)}
                className="p-3 rounded-2xl border-2 border-black bg-amber-100 hover:bg-white text-black font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <FileText className="w-4 h-4 text-black" />
                <span>{isAr ? 'الشهادة الرسمية' : 'Certificate'}</span>
              </button>

              {/* 3. Issue Another Card */}
              <button
                type="button"
                onClick={onOpenIssueModal}
                className="col-span-2 sm:col-span-1 p-3 rounded-2xl border-2 border-black bg-amber-100 hover:bg-white text-black font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <RefreshCw className="w-4 h-4 text-black" />
                <span>{isAr ? 'إصدار بطاقة إضافية' : 'New Card'}</span>
              </button>
            </div>
          </div>

          {/* CARD SETTINGS & SECURITY TOGGLES */}
          <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm space-y-3">
            <h3 className="text-sm font-black text-black">
              {isAr ? 'ضوابط الاستخدام وسقف الإنفاق:' : 'Card Controls & Limits:'}
            </h3>

            <div className="divide-y-2 divide-black/10 text-xs font-bold">
              {/* Monthly Spending Cap */}
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-black block">{isAr ? 'سقف الإنفاق الشهري الأقصى:' : 'Monthly Spending Limit:'}</span>
                  <span className="text-[10px] text-black/70">{isAr ? 'حماية من السحوبات غير المصرح بها' : 'Protection against unauthorized debits'}</span>
                </div>
                <span className="font-mono font-black text-sm text-black">${card.monthlyLimitUsd} USD</span>
              </div>

              {/* Online Purchases (3D Secure) */}
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-black block">{isAr ? 'الشراء عبر الإنترنت (E-Commerce):' : 'Online Purchases:'}</span>
                  <span className="text-[10px] text-black/70">{isAr ? 'قبول في جميع المتاجر العالمية' : 'Accepted across global merchants'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateCardSettings({ onlinePurchasesEnabled: !card.onlinePurchasesEnabled })}
                  className={`w-12 h-6 rounded-full border-2 border-black transition-colors relative cursor-pointer ${
                    card.onlinePurchasesEnabled ? 'bg-black' : 'bg-amber-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-amber-400 absolute top-0.5 transition-transform ${
                      card.onlinePurchasesEnabled ? 'end-1' : 'start-1'
                    }`}
                  />
                </button>
              </div>

              {/* International Payments */}
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-black block">{isAr ? 'المدفوعات والاشتراكات الدولية:' : 'International Subscriptions:'}</span>
                  <span className="text-[10px] text-black/70">{isAr ? 'Google, Netflix, Apple, Amazon' : 'Automated recurring billing'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateCardSettings({ internationalPaymentsEnabled: !card.internationalPaymentsEnabled })}
                  className={`w-12 h-6 rounded-full border-2 border-black transition-colors relative cursor-pointer ${
                    card.internationalPaymentsEnabled ? 'bg-black' : 'bg-amber-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-amber-400 absolute top-0.5 transition-transform ${
                      card.internationalPaymentsEnabled ? 'end-1' : 'start-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RECENT VISA TRANSACTIONS */}
          <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black/10">
              <h3 className="text-sm font-black text-black">
                {isAr ? 'سجل مشتريات بطاقة فيزا:' : 'Visa Card Activity:'}
              </h3>
              <span className="text-xs font-mono font-bold">{transactions.length} Purchases</span>
            </div>

            <div className="divide-y-2 divide-black/10">
              {transactions.map((vtx) => (
                <div key={vtx.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center shrink-0 border border-black font-black text-sm">
                      {vtx.merchant.charAt(0)}
                    </div>
                    <div>
                      <span className="font-black text-black block text-xs sm:text-sm">{vtx.merchant}</span>
                      <span className="text-[10px] text-black/70 font-bold block">{vtx.merchantCategory}</span>
                      <span className="text-[10px] text-black/60 font-mono block mt-0.5">{vtx.date} · {vtx.time}</span>
                    </div>
                  </div>

                  <div className="text-end">
                    <span className="text-sm font-black text-black tabular-nums block">
                      -${vtx.amountUsd.toFixed(2)} USD
                    </span>
                    <span className="text-[11px] text-black/70 font-bold block">
                      ≈ {(vtx.amountSdg ?? 0).toLocaleString('en-US')} ج.س
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REGULATORY CERTIFICATE MODAL */}
      {showCertificateModal && card && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-black animate-in fade-in">
          <div className="w-full max-w-md bg-amber-300 rounded-3xl border-2 border-black p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-black/20 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-black" />
                <h3 className="text-sm font-black text-black">
                  {isAr ? 'الشهادة المصرفية المعتمدة لإصدار البطاقة' : 'Official Regulatory Certificate'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="w-7 h-7 rounded-full bg-black text-amber-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            <div className="bg-amber-100 rounded-2xl p-4 border-2 border-black space-y-2 text-xs text-black">
              <div className="flex justify-between">
                <span className="font-bold text-black/80">{isAr ? 'رقم الشهادة المعتمد:' : 'Certificate No:'}</span>
                <span className="font-mono font-black">{card.certificateNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-black/80">{isAr ? 'حامل البطاقة:' : 'Cardholder:'}</span>
                <span className="font-black">{card.cardholderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-black/80">{isAr ? 'الرقم الوطني:' : 'National ID:'}</span>
                <span className="font-mono font-black">{card.nationalId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-black/80">{isAr ? 'تاريخ الإصدار:' : 'Issued Date:'}</span>
                <span className="font-bold">{card.issuedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-black/80">{isAr ? 'حالة الاعتماد:' : 'Compliance Status:'}</span>
                <span className="font-black text-green-700">{isAr ? 'معتمد ومطابق للوائح' : 'Compliant'}</span>
              </div>
            </div>

            <p className="text-[11px] text-black/80 font-bold leading-relaxed">
              {isAr
                ? 'شهادة رقمية موثقة تثبت استيفاء بطاقة فيزا ساهل الافتراضية لكافة متطلبات التحقق من الهوية (KYC) وضوابط الدفع الإلكتروني المعتمدة.'
                : 'Certified digital document verifying compliance with official KYC and electronic payment guidelines.'}
            </p>

            <button
              type="button"
              onClick={() => setShowCertificateModal(false)}
              className="w-full h-11 rounded-xl bg-black text-amber-400 font-black text-xs cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
