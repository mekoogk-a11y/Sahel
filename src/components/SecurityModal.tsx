import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  KeyRound,
  Fingerprint,
  Smartphone,
  Clock,
  Lock,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Language } from '../types';

interface SecurityModalProps {
  language: Language;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ language, onClose }) => {
  const isAr = language === 'ar';

  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [otpForBigTransfers, setOtpForBigTransfers] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('3');
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black">
      <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border-2 border-black">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-black/20 flex items-center justify-between bg-amber-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-black">
                {isAr ? 'منظومة الأمان والحماية' : 'Security Architecture'}
              </h2>
              <span className="text-[11px] text-black/80 font-bold block -mt-0.5">
                {isAr ? 'معايير أمان مصرفية معتمدة' : 'Demonstration Security Framework'}
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
          <div className="bg-amber-200/90 p-4 rounded-2xl border-2 border-black text-xs text-black font-bold leading-relaxed">
            <span className="font-black text-black block mb-1">
              {isAr ? 'أمان مصرفي متقدم بدون تعقيد:' : 'Advanced Banking Security with Zero Clutter:'}
            </span>
            {isAr
              ? 'تعتمد «ساهل» على مبدأ الأمان الذكي غير المرئي؛ حيث يتم تأمين حسابك عبر ربط الجهاز، القياسات الحيوية، والتحقق لمرة واحدة دون إرهاق المستخدم.'
              : 'SAHEL integrates invisible banking-grade protection through hardware binding, biometric authentication, and multi-factor session defense.'}
          </div>

          <div className="space-y-3">
            {/* 1. PIN */}
            <div className="p-4 rounded-2xl border-2 border-black/30 bg-amber-200/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-black">
                    {isAr ? 'الرقم السري (PIN)' : 'Security PIN'}
                  </h3>
                  <p className="text-[11px] text-black/80 font-bold">
                    {isAr ? 'مكون من 4 أرقام لتأكيد العمليات' : '4-digit code for sensitive transfers'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPinPrompt(true);
                  setTimeout(() => {
                    setPinSuccess(true);
                    setTimeout(() => {
                      setShowPinPrompt(false);
                      setPinSuccess(false);
                    }, 1500);
                  }, 1000);
                }}
                className="px-3 py-1.5 rounded-lg border-2 border-black bg-amber-100 text-xs font-black text-black transition-colors cursor-pointer hover:bg-white"
              >
                {isAr ? 'تغيير' : 'Change'}
              </button>
            </div>

            {/* Simulated PIN change prompt */}
            {showPinPrompt && (
              <div className="p-3 bg-amber-100 rounded-xl border-2 border-black text-xs text-center">
                {pinSuccess ? (
                  <span className="text-black font-black flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    {isAr ? 'تم تحديث الرقم السري بنجاح' : 'PIN updated successfully'}
                  </span>
                ) : (
                  <span className="text-black font-bold">
                    {isAr ? 'جاري التحقق من الرقم السري الجديد...' : 'Verifying new security PIN...'}
                  </span>
                )}
              </div>
            )}

            {/* 2. OTP */}
            <div className="p-4 rounded-2xl border-2 border-black/30 bg-amber-200/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-black">
                    {isAr ? 'التحقق بخطوتين (OTP)' : 'Two-Factor OTP'}
                  </h3>
                  <p className="text-[11px] text-black/80 font-bold">
                    {isAr ? 'رمز SMS فوري للتحويلات الكبيرة' : 'One-time SMS password on big transfers'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOtpForBigTransfers(!otpForBigTransfers)}
                className="cursor-pointer"
              >
                {otpForBigTransfers ? (
                  <ToggleRight className="w-8 h-8 text-black fill-black" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-black/50" />
                )}
              </button>
            </div>

            {/* 3. Fingerprint */}
            <div className="p-4 rounded-2xl border-2 border-black/30 bg-amber-200/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-black">
                    {isAr ? 'البصمة البيومترية' : 'Biometric Fingerprint / Face ID'}
                  </h3>
                  <p className="text-[11px] text-black/80 font-bold">
                    {isAr ? 'تسجيل دخول وتأكيد فوري بالبصمة' : 'Instant biometric authentication'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBiometricEnabled(!biometricEnabled)}
                className="cursor-pointer"
              >
                {biometricEnabled ? (
                  <ToggleRight className="w-8 h-8 text-black fill-black" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-black/50" />
                )}
              </button>
            </div>

            {/* 4. Device verification */}
            <div className="p-4 rounded-2xl border-2 border-black/30 bg-amber-200/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-black">
                    {isAr ? 'توثيق الجهاز (Device Binding)' : 'Trusted Device Binding'}
                  </h3>
                  <p className="text-[11px] text-black/80 font-bold">
                    {isAr ? 'هاتف موثق: Samsung Galaxy A54' : 'Bound Device: Verified'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-black text-black bg-amber-300 border border-black px-2 py-1 rounded-md">
                {isAr ? 'موثوق' : 'Verified'}
              </span>
            </div>

            {/* 5. Automatic session timeout */}
            <div className="p-4 rounded-2xl border-2 border-black/30 bg-amber-200/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-black">
                    {isAr ? 'إنهاء الجلسة التلقائي' : 'Automatic Session Timeout'}
                  </h3>
                  <p className="text-[11px] text-black/80 font-bold">
                    {isAr ? 'قفل التطبيق عند عدم النشاط' : 'App lock upon inactivity'}
                  </p>
                </div>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="text-xs font-black text-black bg-amber-100 px-2.5 py-1.5 rounded-lg border-2 border-black focus:outline-none"
              >
                <option value="1">{isAr ? 'دقيقة واحدة' : '1 Min'}</option>
                <option value="3">{isAr ? '3 دقائق' : '3 Mins'}</option>
                <option value="5">{isAr ? '5 دقائق' : '5 Mins'}</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full h-13 rounded-2xl bg-black hover:bg-stone-900 text-amber-400 font-black text-sm transition-colors cursor-pointer shadow-sm active:scale-[0.99]"
          >
            {isAr ? 'حفظ وإغلاق' : 'Save & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
