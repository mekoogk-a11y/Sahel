import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe,
  Fingerprint,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileText,
  DollarSign,
  Info,
} from 'lucide-react';
import { Language, UserAccount, VirtualVisaCard } from '../types';
import { playKeypadClick, playSuccessChime } from '../utils/soundEffects';

interface IssueVisaModalProps {
  user: UserAccount;
  language: Language;
  exchangeRate: number; // e.g. 2650 SDG per 1 USD
  issuanceFeeSdg: number; // e.g. 0
  onClose: () => void;
  onCardIssued: (card: VirtualVisaCard, initialAmountUsd: number, totalDeductedSdg: number) => void;
}

type Step = 'kyc_terms' | 'funding' | 'security' | 'processing' | 'success';

export const IssueVisaModal: React.FC<IssueVisaModalProps> = ({
  user,
  language,
  exchangeRate,
  issuanceFeeSdg,
  onClose,
  onCardIssued,
}) => {
  const isAr = language === 'ar';
  const safeExchangeRate = exchangeRate || 2650;
  const safeIssuanceFee = issuanceFeeSdg ?? 0;
  const [step, setStep] = useState<Step>('kyc_terms');

  // KYC details verified from user profile
  const [cardholderName, setCardholderName] = useState(user.nameEn.toUpperCase());
  const [nationalId, setNationalId] = useState('10928374615');
  const [passportNumber, setPassportNumber] = useState('P01928374');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Funding state
  const [amountUsdStr, setAmountUsdStr] = useState('25');
  const numericAmountUsd = parseFloat(amountUsdStr || '0');
  const totalDeductedSdg = Math.round(numericAmountUsd * safeExchangeRate) + safeIssuanceFee;
  const isInsufficient = totalDeductedSdg > user.balance;

  // Security state
  const [cardPin, setCardPin] = useState('8419');
  const [newCard, setNewCard] = useState<VirtualVisaCard | null>(null);

  const handleProceedFromKyc = () => {
    if (!cardholderName.trim() || !nationalId.trim() || !acceptedTerms) return;
    setStep('funding');
  };

  const handleProceedFromFunding = () => {
    if (numericAmountUsd < 5 || isInsufficient) return;
    setStep('security');
  };

  const handleConfirmIssuance = () => {
    setStep('processing');

    setTimeout(() => {
      // Deterministic / Realistic PAN generation
      const randomMiddle = Math.floor(1000 + Math.random() * 9000);
      const randomTail = Math.floor(1000 + Math.random() * 9000);
      const generatedPan = `4024 8812 ${randomMiddle} ${randomTail}`;
      const randomCvv = `${Math.floor(100 + Math.random() * 900)}`;

      const currentYear = new Date().getFullYear();
      const expiryYear = (currentYear + 3).toString().slice(-2);
      const expiryMonth = '09';

      const certificateNo = `SAHEL-VISA-REG-${Math.floor(100000 + Math.random() * 900000)}`;

      const card: VirtualVisaCard = {
        id: `visa-${Date.now()}`,
        cardNumber: generatedPan,
        cardholderName: cardholderName.trim(),
        expiryMonth,
        expiryYear,
        cvv: randomCvv,
        balanceUsd: numericAmountUsd,
        billingAddress: {
          country: 'Sudan',
          city: 'Khartoum',
          postalCode: '11111',
          street: 'Al-Siteen Street',
        },
        nationalId,
        passportNumber: passportNumber.trim() || undefined,
        status: 'active',
        monthlyLimitUsd: 500,
        onlinePurchasesEnabled: true,
        internationalPaymentsEnabled: true,
        issuedAt: isAr ? 'اليوم' : 'Today',
        certificateNumber: certificateNo,
      };

      setNewCard(card);
      playSuccessChime();
      onCardIssued(card, numericAmountUsd, totalDeductedSdg);
      setStep('success');
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col border-2 border-black">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-black/20 flex items-center justify-between bg-amber-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-black text-amber-400 flex items-center justify-center font-black text-sm">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-black">
                {step === 'kyc_terms' && (isAr ? 'إصدار بطاقة فيزا — الإجراءات الرسمية' : 'Issue Visa Card — Official Verification')}
                {step === 'funding' && (isAr ? 'تغذية الرصيد الافتتاحي وسقف الاستخدام' : 'Initial Card Funding & Limits')}
                {step === 'security' && (isAr ? 'المصادقة الأمنية ورمز البطاقة' : 'Security PIN & Authorization')}
                {step === 'processing' && (isAr ? 'جاري إصدار واعتماد البطاقة...' : 'Minting & Authorizing Card...')}
                {step === 'success' && (isAr ? 'تم إصدار بطاقة فيزا ساهل بنجاح' : 'Virtual Visa Card Issued')}
              </h2>
              <span className="text-[10px] text-black/80 font-bold block">
                {isAr ? 'بطاقة دولية افتراضية معتمدة للدفع الإلكتروني والتسوق العالمي' : 'Official International Virtual Payment Card'}
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
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: OFFICIAL KYC & REGULATORY TERMS */}
          {step === 'kyc_terms' && (
            <div className="space-y-4">
              {/* Visual Preview Banner */}
              <div className="bg-black text-amber-400 rounded-3xl p-5 border-2 border-black relative overflow-hidden shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-widest text-amber-400">SAHEL VIRTUAL</span>
                  <span className="text-xl font-black italic tracking-tighter text-white">VISA</span>
                </div>
                <div className="my-3">
                  <p className="font-mono text-sm tracking-widest text-amber-200">
                    4024 •••• •••• ••••
                  </p>
                  <p className="text-xs font-bold text-white mt-1 uppercase tracking-wider">
                    {cardholderName || 'CARDHOLDER NAME'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-amber-400/80 font-mono">
                  <span>EXP: 09/29</span>
                  <span>CVV: •••</span>
                </div>
              </div>

              {/* Regulatory Notice Box */}
              <div className="bg-amber-100 p-4 rounded-2xl border-2 border-black space-y-2 text-xs text-black">
                <div className="flex items-center gap-2 font-black text-black">
                  <ShieldCheck className="w-5 h-5 text-black shrink-0" />
                  <span>{isAr ? 'الإجراءات والضوابط المصرفية الرسمية:' : 'Regulatory Compliance & Verification:'}</span>
                </div>
                <p className="leading-relaxed font-bold">
                  {isAr
                    ? 'يتم إصدار بطاقة فيزا ساهل الافتراضية وفق الضوابط واللوائح المنظمة لخدمات الدفع الإلكتروني الدولي، وترتبط مباشرة بالهوية الوطنية المعتمدة لصاحب الحساب لضمان أمان العمليات ومطابقة معايير الامتثال ومكافحة غسل الأموال.'
                    : 'The SAHEL Virtual Visa Card is issued following official international e-payment regulations, bound to your verified national identity for fraud protection and compliance.'}
                </p>
              </div>

              {/* Verified KYC Form Fields */}
              <div className="space-y-3">
                <div className="bg-amber-200/90 p-3.5 rounded-2xl border-2 border-black space-y-1">
                  <label className="text-[11px] font-black text-black block">
                    {isAr ? 'اسم حامل البطاقة باللغة الإنجليزية (كما في الجواز):' : 'Cardholder Name in English (as per Passport):'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                    className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 font-mono font-black text-xs text-black uppercase focus:bg-white focus:outline-none"
                  />
                  <span className="text-[10px] text-black/70 font-semibold block">
                    {isAr ? 'سيكون هذا الاسم مطبوعاً ومسجلاً لدى شبكة 3D Secure العالمية' : 'Used for 3D Secure / Verified by Visa authentication'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-amber-200/90 p-3 rounded-2xl border-2 border-black space-y-1">
                    <label className="text-[11px] font-black text-black block">
                      {isAr ? 'الرقم الوطني المعتمد:' : 'National ID:'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      className="w-full h-10 px-2 rounded-xl border-2 border-black bg-amber-100 font-mono font-black text-xs text-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="bg-amber-200/90 p-3 rounded-2xl border-2 border-black space-y-1">
                    <label className="text-[11px] font-black text-black block">
                      {isAr ? 'رقم جواز السفر (اختياري):' : 'Passport Number:'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                      className="w-full h-10 px-2 rounded-xl border-2 border-black bg-amber-100 font-mono font-black text-xs text-black uppercase focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-200/90 border-2 border-black cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-black rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-black leading-snug">
                  {isAr
                    ? 'أقر بصحة البيانات وأوافق على الشروط والأحكام الرسمية لإصدار واستخدام بطاقة فيزا ساهل الافتراضية.'
                    : 'I confirm my details and agree to the official terms and conditions for SAHEL Virtual Visa usage.'}
                </span>
              </label>

              {/* Next Button */}
              <button
                type="button"
                disabled={!cardholderName.trim() || !nationalId.trim() || !acceptedTerms}
                onClick={handleProceedFromKyc}
                className={`w-full h-13 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  cardholderName.trim() && nationalId.trim() && acceptedTerms
                    ? 'bg-black hover:bg-stone-900 text-amber-400 active:scale-[0.99]'
                    : 'bg-black/30 text-black/50 cursor-not-allowed border border-black/20'
                }`}
              >
                <span>{isAr ? 'المتابعة لتحديد الرصيد وسقف الاستخدام' : 'Proceed to Fund Card'}</span>
              </button>
            </div>
          )}

          {/* STEP 2: FUNDING & SPENDING LIMITS */}
          {step === 'funding' && (
            <div className="space-y-4">
              <div className="bg-amber-200 p-4 rounded-3xl border-2 border-black space-y-3">
                <div className="text-center pb-2 border-b border-black/20">
                  <span className="text-xs font-bold text-black/80 block mb-1">
                    {isAr ? 'تغذية رصيد البطاقة الافتتاحي (بالدولار الأمريكي):' : 'Initial Card Balance (USD):'}
                  </span>
                  <div className="flex items-baseline justify-center gap-1.5 my-1">
                    <span className="text-4xl font-black text-black tabular-nums">
                      ${numericAmountUsd > 0 ? numericAmountUsd.toFixed(2) : '0.00'}
                    </span>
                    <span className="text-base font-black text-black">USD</span>
                  </div>
                  <span className="text-xs font-bold text-black/80">
                    {isAr
                      ? `سعر الصرف الرسمي المعتمد: 1 دولار = ${safeExchangeRate.toLocaleString('en-US')} جنيه سوداني`
                      : `Official Bank Exchange Rate: 1 USD = ${safeExchangeRate.toLocaleString('en-US')} SDG`}
                  </span>
                </div>

                {/* Quick Amount Chips */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[10, 25, 50, 100].map((val) => (
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

                {/* Custom input */}
                <div>
                  <label className="text-[11px] font-black text-black block mb-1">
                    {isAr ? 'أو أدخل مبلغاً مخصصاً (بالدولار):' : 'Or enter custom amount in USD:'}
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={amountUsdStr}
                    onChange={(e) => setAmountUsdStr(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 font-black text-base text-black focus:bg-white focus:outline-none"
                    placeholder="25"
                  />
                  <span className="text-[10px] text-black/70 font-bold block mt-1">
                    {isAr ? 'الحد الأدنى للتغذية الافتتاحية: $5 دولار أمريكي' : 'Minimum initial top-up: $5.00 USD'}
                  </span>
                </div>
              </div>

              {/* Settlement Summary Table */}
              <div className="bg-amber-100 rounded-2xl p-4 border-2 border-black space-y-2 text-xs text-black">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'مبلغ شحن البطاقة:' : 'Card Top-up:'}</span>
                  <span className="font-black">${numericAmountUsd.toFixed(2)} USD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'المقابل بالجنيه السوداني:' : 'Equivalent in SDG:'}</span>
                  <span className="font-black tabular-nums">
                    {((numericAmountUsd * safeExchangeRate) || 0).toLocaleString('en-US')} ج.س
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'رسوم الإصدار الرسمي:' : 'Issuance Fee:'}</span>
                  <span className="font-black text-green-700">
                    {issuanceFeeSdg === 0 ? (isAr ? '0 ج.س (عرض مجاني)' : '0 SDG (Free)') : `${issuanceFeeSdg} ج.س`}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t-2 border-black/20 text-sm">
                  <span className="font-black text-black">{isAr ? 'الإجمالي المخصوم من حساب ساهل:' : 'Total Deducted from Sahel:'}</span>
                  <span className="font-black tabular-nums text-base">
                    {totalDeductedSdg.toLocaleString('en-US')} ج.س
                  </span>
                </div>
              </div>

              {isInsufficient && (
                <div className="bg-red-100 border-2 border-red-600 p-3 rounded-xl flex items-center gap-2 text-xs font-black text-red-700">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{isAr ? 'رصيد حساب ساهل لا يكفي لتغطية هذا المبلغ' : 'Insufficient Sahel balance for this amount'}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={numericAmountUsd < 5 || isInsufficient}
                  onClick={handleProceedFromFunding}
                  className={`w-full h-13 rounded-2xl font-black text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                    numericAmountUsd >= 5 && !isInsufficient
                      ? 'bg-black hover:bg-stone-900 text-amber-400 active:scale-[0.99]'
                      : 'bg-black/30 text-black/50 cursor-not-allowed border border-black/20'
                  }`}
                >
                  <span>{isAr ? 'المتابعة لتعيين الرقم السري وتأكيد الإصدار' : 'Proceed to Set Security PIN'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('kyc_terms')}
                  className="w-full py-2 text-xs text-black font-black underline cursor-pointer text-center"
                >
                  {isAr ? 'الرجوع للخطوة السابقة' : 'Back to KYC Verification'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SECURITY PIN & CONFIRMATION */}
          {step === 'security' && (
            <div className="space-y-4">
              <div className="bg-amber-200 p-5 rounded-3xl border-2 border-black space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-black text-amber-400 flex items-center justify-center mx-auto border-2 border-black">
                  <Lock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-black">
                    {isAr ? 'تعيين الرقم السري لبطاقة فيزا (Card PIN):' : 'Set 4-Digit Card PIN:'}
                  </h3>
                  <p className="text-xs text-black/80 font-bold mt-1">
                    {isAr ? 'مكون من 4 أرقام لتأكيد المشتريات الدولية' : '4 digits for 3D Secure purchase authorization'}
                  </p>
                </div>

                {/* PIN input */}
                <div className="flex justify-center gap-3 py-2">
                  {['0', '1', '2', '3'].map((idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 rounded-xl bg-amber-100 border-2 border-black flex items-center justify-center font-black text-xl text-black shadow-xs"
                    >
                      {cardPin[parseInt(idx)] || '•'}
                    </div>
                  ))}
                </div>

                <div className="bg-amber-100 p-3 rounded-2xl border border-black/30 text-xs text-black font-bold text-start">
                  <p>✓ {isAr ? 'سقف الإنفاق الشهري المبدئي:' : 'Initial Monthly Cap:'} $500 USD</p>
                  <p>✓ {isAr ? 'حماية 3D Secure للشراء عبر الإنترنت:' : '3D Secure Protection:'} {isAr ? 'مفعلة وتلقائية' : 'Active'}</p>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                onClick={handleConfirmIssuance}
                className="w-full h-14 rounded-2xl bg-black hover:bg-stone-900 active:scale-[0.98] text-amber-400 font-black text-base transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-5 h-5 text-amber-400" />
                <span>{isAr ? 'تأكيد وإصدار البطاقة فورياً' : 'Authorize & Issue Card Instantly'}</span>
              </button>
            </div>
          )}

          {/* STEP 4: PROCESSING ANIMATION */}
          {step === 'processing' && (
            <div className="py-14 text-center space-y-4">
              <div className="w-18 h-18 mx-auto rounded-full bg-black text-amber-400 flex items-center justify-center animate-pulse border-2 border-black shadow-lg">
                <CreditCard className="w-9 h-9 text-amber-400 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-black text-black">
                  {isAr ? 'جاري تخصيص واعتماد بطاقة فيزا الرسمية...' : 'Allocating & Registering Visa Card...'}
                </h3>
                <p className="text-xs text-black/80 font-bold mt-1">
                  {isAr
                    ? 'يتم توليد رقم البطاقة الآمن والربط مع شبكة فيزا العالمية ومعايير 3D Secure'
                    : 'Generating secure PAN, CVV, and registering with the global Visa network'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS CARD DISPLAY */}
          {step === 'success' && newCard && (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-black text-amber-400 flex items-center justify-center mx-auto border-2 border-black shadow-md">
                <CheckCircle2 className="w-9 h-9 text-amber-400" />
              </div>

              <div>
                <h3 className="text-lg font-black text-black">
                  {isAr ? 'تهانينا! تم إصدار بطاقة فيزا بنجاح' : 'Congratulations! Visa Card Issued!'}
                </h3>
                <p className="text-xs text-black/80 font-bold mt-0.5">
                  {isAr ? 'بطاقتك جاهزة الآن للتسوق والشراء عبر أي موقع أو تطبيق عالمي' : 'Your card is ready for instant global online purchases'}
                </p>
              </div>

              {/* CARD PREVIEW */}
              <div className="bg-stone-950 text-amber-400 rounded-3xl p-5 border-2 border-black shadow-xl text-start relative overflow-hidden space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-6 rounded bg-amber-400/30 border border-amber-400/50 flex items-center justify-center">
                      <div className="w-5 h-3.5 border border-amber-300 rounded-xs" />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold">SAHEL VIRTUAL</span>
                  </div>
                  <span className="text-2xl font-black italic tracking-tighter text-white">VISA</span>
                </div>

                <div className="py-2">
                  <p className="text-base sm:text-lg font-mono font-black tracking-widest text-amber-200">
                    {newCard.cardNumber}
                  </p>
                </div>

                <div className="flex items-end justify-between text-xs font-mono pt-1 border-t border-amber-400/20">
                  <div>
                    <span className="text-[9px] text-amber-400/70 block">CARDHOLDER</span>
                    <span className="text-white font-bold text-xs">{newCard.cardholderName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-amber-400/70 block">EXPIRES</span>
                    <span className="text-white font-bold">{newCard.expiryMonth}/{newCard.expiryYear}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-amber-400/70 block">CVV</span>
                    <span className="text-amber-300 font-bold">{newCard.cvv}</span>
                  </div>
                </div>
              </div>

              {/* Balance Summary Box */}
              <div className="bg-amber-200 rounded-2xl p-4 border-2 border-black text-start space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'رصيد البطاقة المتاح:' : 'Available Card Balance:'}</span>
                  <span className="text-lg font-black text-black tabular-nums">${newCard.balanceUsd.toFixed(2)} USD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'رقم الشهادة المصرفية المعتمدة:' : 'Official Certificate No:'}</span>
                  <span className="font-mono font-black text-black">{newCard.certificateNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black/80">{isAr ? 'حالة الشراء الدولي:' : 'International Purchases:'}</span>
                  <span className="text-green-700 font-black">{isAr ? 'مفعلة ونشطة ✓' : 'Active ✓'}</span>
                </div>
              </div>

              {/* Close / Return */}
              <button
                type="button"
                onClick={onClose}
                className="w-full h-13 rounded-2xl bg-black hover:bg-stone-900 text-amber-400 font-black text-sm shadow-md cursor-pointer transition-all active:scale-[0.98]"
              >
                {isAr ? 'عرض وإدارة البطاقة الآن' : 'View & Manage Visa Card'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
