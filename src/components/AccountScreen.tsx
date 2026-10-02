import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Bell,
  Fingerprint,
  Info,
  CheckCircle2,
  Lock,
  Globe,
  RotateCcw,
} from 'lucide-react';
import { Language, UserAccount } from '../types';

interface AccountScreenProps {
  user: UserAccount;
  language: Language;
  onUpdateUser: (updated: Partial<UserAccount>) => void;
  onResetData: () => void;
  onTriggerDesignerAuth?: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  user,
  language,
  onUpdateUser,
  onResetData,
  onTriggerDesignerAuth,
}) => {
  const isAr = language === 'ar';
  const dailyLimit = user?.dailyLimit ?? 3000000;
  const dailyUsed = user?.dailyUsed ?? 0;
  const remainingLimit = Math.max(0, dailyLimit - dailyUsed);

  return (
    <div className="space-y-4 pb-20 text-black">
      {/* Profile Card */}
      <div className="bg-amber-300 rounded-3xl p-6 border-2 border-black shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-black text-amber-400 flex items-center justify-center font-black text-2xl border-2 border-black shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-black text-black leading-snug truncate">
              {isAr ? user.name : user.nameEn}
            </h1>
            <p className="text-xs font-mono font-bold text-black/80 mt-0.5">
              {user.phoneNumber}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] bg-green-700 text-white px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {isAr ? 'موثق بالهوية الوطنية (KYC)' : 'KYC Verified'}
              </span>
            </div>
          </div>
        </div>

        {/* Account Details Box */}
        <div className="bg-amber-200/90 rounded-2xl p-4 border-2 border-black space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-black/80">{isAr ? 'رقم حساب ساهل (Account ID):' : 'SAHEL Account:'}</span>
            <span className="font-mono font-black text-black">{user.accountNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-black/80">{isAr ? 'تصنيف الحساب:' : 'Account Tier:'}</span>
            <span className="font-black text-black">{user.tier}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-black/80">{isAr ? 'حالة الحساب:' : 'Account Status:'}</span>
            <span className="font-black text-black bg-amber-100 border border-black/30 px-2 py-0.5 rounded">
              {isAr ? 'نشط ومعتمد' : 'Active & Certified'}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Limits Card */}
      <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm space-y-3">
        <h2 className="text-sm font-black text-black">
          {isAr ? 'سقف العمليات اليومي (Daily Limits)' : 'Daily Transfer Limits'}
        </h2>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between font-bold">
            <span className="text-black/80">{isAr ? 'المستخدم اليوم:' : 'Used Today:'}</span>
            <span className="font-black tabular-nums">{(dailyUsed ?? 0).toLocaleString('en-US')} ج.س</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-amber-200 rounded-full border border-black/30 overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all"
              style={{ width: `${Math.min(100, (dailyUsed / (dailyLimit || 1)) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between font-bold text-[11px] text-black/80">
            <span>{isAr ? 'المتبقي لليوم:' : 'Remaining:'} {(remainingLimit ?? 0).toLocaleString('en-US')} ج.س</span>
            <span>{isAr ? 'السقف:' : 'Cap:'} {(dailyLimit ?? 3000000).toLocaleString('en-US')} ج.س</span>
          </div>
        </div>
      </div>

      {/* Security & Preferences */}
      <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm space-y-3">
        <h2 className="text-sm font-black text-black">
          {isAr ? 'الأمان والتفضيلات' : 'Security & Settings'}
        </h2>

        <div className="divide-y-2 divide-black/10 text-xs font-bold">
          {/* Biometrics Toggle */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Fingerprint className="w-5 h-5 text-black" />
              <span>{isAr ? 'المصادقة بالبصمة / PIN' : 'Biometric / PIN Auth'}</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateUser({ biometricEnabled: !user.biometricEnabled })}
              className={`w-12 h-6 rounded-full border-2 border-black transition-colors relative cursor-pointer ${
                user.biometricEnabled ? 'bg-black' : 'bg-amber-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-amber-400 absolute top-0.5 transition-transform ${
                  user.biometricEnabled ? 'end-1' : 'start-1'
                }`}
              />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-black" />
              <span>{isAr ? 'الإشعارات الفورية للعمليات' : 'Instant Transaction SMS'}</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateUser({ notificationsEnabled: !user.notificationsEnabled })}
              className={`w-12 h-6 rounded-full border-2 border-black transition-colors relative cursor-pointer ${
                user.notificationsEnabled ? 'bg-black' : 'bg-amber-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-amber-400 absolute top-0.5 transition-transform ${
                  user.notificationsEnabled ? 'end-1' : 'start-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Prototype Legal Disclaimer Notice */}
      <div className="bg-black text-amber-400 rounded-3xl p-5 border-2 border-black shadow-sm space-y-2 text-xs">
        <div className="flex items-center gap-2 font-black text-amber-300">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{isAr ? 'إشعار قانوني مهم:' : 'Important Legal Notice:'}</span>
        </div>
        <p className="leading-relaxed font-semibold">
          {isAr
            ? 'هذا المشروع نموذج أولي تجريبي (Prototype/MVP) لا يدعي أنه بنك أو مؤسسة مالية مرخصة. العمليات المالية المنفذة هنا هي لأغراض المحاكاة والعرض التقني فقط، وأي إطلاق مستقبلي سيتم بعد استيفاء التراخيص الرسمية والربط مع المؤسسات المالية المعتمدة.'
            : 'This project is a technical Prototype / MVP and does not claim to be a licensed bank. All financial transactions are for demonstration purposes only. Any future launch will occur following regulatory licensing and integration with approved institutions.'}
        </p>
      </div>

      {/* Reset Prototype Data */}
      <button
        type="button"
        onClick={onResetData}
        className="w-full p-3.5 rounded-2xl border-2 border-black bg-amber-200 hover:bg-amber-100 text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] transition-all"
      >
        <RotateCcw className="w-4 h-4 text-black" />
        <span>{isAr ? 'إعادة ضبط البيانات التجريبية للمشروع' : 'Reset Prototype Demo Data'}</span>
      </button>

      {/* Discreet Developer / Creator Gate */}
      {onTriggerDesignerAuth && (
        <div className="text-center pt-2 pb-2">
          <button
            type="button"
            onClick={onTriggerDesignerAuth}
            className="text-[10px] text-black/40 hover:text-black font-mono transition-colors cursor-pointer select-none"
            title={isAr ? 'بوابة المطور ومصمم النظام' : 'Developer & Creator Master Gate'}
          >
            SAHEL Core Engine · v1.4.2 (Restricted)
          </button>
        </div>
      )}
    </div>
  );
};
