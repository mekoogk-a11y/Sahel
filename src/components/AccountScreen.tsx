import React, { useState } from 'react';
import {
  Globe,
  KeyRound,
  Fingerprint,
  Bell,
  Smartphone,
  SlidersHorizontal,
  HelpCircle,
  FileText,
  Lock,
  ChevronRight,
  ChevronLeft,
  ToggleLeft,
  ToggleRight,
  X,
  Info,
  MessageCircle,
} from 'lucide-react';
import { Language, UserAccount } from '../types';

interface AccountScreenProps {
  user: UserAccount;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenSecurity: () => void;
  onOpenHelp: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  user,
  language,
  setLanguage,
  onOpenSecurity,
  onOpenHelp,
}) => {
  const isAr = language === 'ar';
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;

  const [biometrics, setBiometrics] = useState(user.biometricEnabled);
  const [notifications, setNotifications] = useState(user.notificationsEnabled);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLimitsModal, setShowLimitsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <div className="space-y-4 pb-20 text-black">
      {/* Profile Card */}
      <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-black text-amber-400 flex items-center justify-center font-black text-2xl shadow-sm border border-black shrink-0">
          ع
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-black">
              {isAr ? user.name : user.nameEn}
            </h1>
            <span className="text-[10px] font-black bg-black text-amber-400 px-2 py-0.5 rounded-full">
              {user.tier}
            </span>
          </div>
          <p className="text-xs text-black/80 font-mono font-bold mt-0.5">
            {user.phoneNumber} · {user.accountNumber}
          </p>
        </div>
      </div>

      {/* Transaction Limits Bar (حدود العمليات اليومية) */}
      <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-black">
            {isAr ? 'حد العمليات اليومي' : 'Daily Transaction Limit'}
          </span>
          <button
            type="button"
            onClick={() => setShowLimitsModal(true)}
            className="text-black hover:underline font-black cursor-pointer"
          >
            {isAr ? 'تعديل الحدود' : 'Adjust Limits'}
          </button>
        </div>

        <div className="w-full bg-amber-200 border border-black/40 h-3 rounded-full overflow-hidden">
          <div
            className="bg-black h-full rounded-full transition-all"
            style={{ width: `${(user.dailyUsed / user.dailyLimit) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-black/80 font-bold">
          <span>
            {isAr ? 'المستخدم اليوم:' : 'Used today:'}{' '}
            <strong className="text-black font-mono font-black">
              {user.dailyUsed.toLocaleString('en-US')}
            </strong>{' '}
            {isAr ? 'جنيه' : 'SDG'}
          </span>
          <span>
            {isAr ? 'الحد الأقصى:' : 'Max limit:'}{' '}
            <strong className="text-black font-mono font-black">
              {user.dailyLimit.toLocaleString('en-US')}
            </strong>{' '}
            {isAr ? 'جنيه' : 'SDG'}
          </span>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-amber-300 rounded-3xl p-3 border-2 border-black shadow-sm divide-y-2 divide-black/10">
        {/* 1. التوضيح عن التطبيق (About App & Conception) - PROMINENT FEATURE */}
        <button
          type="button"
          onClick={() => setShowAboutModal(true)}
          className="w-full flex items-center justify-between p-3 hover:bg-black/5 rounded-2xl transition-colors cursor-pointer text-start bg-amber-200/60"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-amber-400 flex items-center justify-center">
              <Info className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-black text-black block">
                {isAr ? 'التوضيح عن التطبيق وفكرة المشروع' : 'About App & Project Concept'}
              </span>
              <span className="text-[11px] text-black font-black block">
                {isAr ? 'هذا التطبيق لا يتبع لأي بنك هو مجرد فكرة' : 'Not affiliated with any bank — Just a concept'}
              </span>
              <span className="text-[10px] text-black/80 font-bold">
                {isAr ? 'من تصميم وفكرة: كمال جعفر زكريا' : 'Conceived & Designed by: Kamal Jaafar Zakaria'}
              </span>
            </div>
          </div>
          <ChevronIcon className="w-4 h-4 text-black" />
        </button>

        {/* 2. اللغة (Language) */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-amber-400 flex items-center justify-center">
              <Globe className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-black text-black block">
                {isAr ? 'اللغة' : 'Language'}
              </span>
              <span className="text-[11px] text-black/80 font-bold">
                {isAr ? 'العربية (الافتراضية)' : 'English'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="px-3 py-1.5 rounded-xl border-2 border-black bg-amber-200 hover:bg-amber-100 text-xs font-black text-black transition-colors cursor-pointer"
          >
            {language === 'ar' ? 'English' : 'عربي'}
          </button>
        </div>

        {/* 3. تغيير الرقم السري (Change PIN) */}
        <button
          type="button"
          onClick={onOpenSecurity}
          className="w-full flex items-center justify-between p-3 hover:bg-black/5 rounded-2xl transition-colors cursor-pointer text-start"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-amber-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-black text-black block">
                {isAr ? 'تغيير الرقم السري' : 'Change Security PIN'}
              </span>
              <span className="text-[11px] text-black/80 font-bold">
                {isAr ? 'رمز الحماية المكون من 4 أرقام' : 'Manage your 4-digit code'}
              </span>
            </div>
          </div>
          <ChevronIcon className="w-4 h-4 text-black" />
        </button>

        {/* 4. البصمة (Biometrics toggle) */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-amber-400 flex items-center justify-center">
              <Fingerprint className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-black text-black block">
                {isAr ? 'البصمة' : 'Biometric Login'}
              </span>
              <span className="text-[11px] text-black/80 font-bold">
                {isAr ? 'دخول فوري ببصمة الإصبع أو الوجه' : 'Use fingerprint or Face ID'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setBiometrics(!biometrics)}
            className="cursor-pointer"
          >
            {biometrics ? (
              <ToggleRight className="w-8 h-8 text-black fill-black" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-black/50" />
            )}
          </button>
        </div>

        {/* 5. الإشعارات (Notifications toggle) */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-amber-400 flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-black text-black block">
                {isAr ? 'الإشعارات' : 'Notifications'}
              </span>
              <span className="text-[11px] text-black/80 font-bold">
                {isAr ? 'إشعارات التحويلات والسحب' : 'Transaction alerts via SMS & App'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotifications(!notifications)}
            className="cursor-pointer"
          >
            {notifications ? (
              <ToggleRight className="w-8 h-8 text-black fill-black" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-black/50" />
            )}
          </button>
        </div>

        {/* 6. الأجهزة الموثوقة (Trusted Devices) */}
        <button
          type="button"
          onClick={onOpenSecurity}
          className="w-full flex items-center justify-between p-3 hover:bg-black/5 rounded-2xl transition-colors cursor-pointer text-start"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-amber-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-black text-black block">
                {isAr ? 'الأجهزة الموثوقة' : 'Trusted Devices'}
              </span>
              <span className="text-[11px] text-black/80 font-bold">
                {isAr ? 'إدارة الهواتف المسموح لها بالدخول' : '1 device actively verified'}
              </span>
            </div>
          </div>
          <ChevronIcon className="w-4 h-4 text-black" />
        </button>

        {/* 7. حدود العمليات (Limits) */}
        <button
          type="button"
          onClick={() => setShowLimitsModal(true)}
          className="w-full flex items-center justify-between p-3 hover:bg-black/5 rounded-2xl transition-colors cursor-pointer text-start"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-amber-400 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-black text-black block">
                {isAr ? 'حدود العمليات' : 'Transaction Limits'}
              </span>
              <span className="text-[11px] text-black/80 font-bold">
                {isAr ? 'الحد اليومي والشهري للتحويل والسحب' : 'Daily & monthly ceiling'}
              </span>
            </div>
          </div>
          <ChevronIcon className="w-4 h-4 text-black" />
        </button>

        {/* 8. المساعدة (Help) */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="w-full flex items-center justify-between p-3 hover:bg-black/5 rounded-2xl transition-colors cursor-pointer text-start"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-amber-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-black text-black block">
                {isAr ? 'المساعدة والدعم' : 'Help & Support'}
              </span>
              <span className="text-[11px] text-black/80 font-bold">
                {isAr ? 'مركز الاتصال الموحد والأسئلة الشائعة' : 'Support line 19999 & FAQs'}
              </span>
            </div>
          </div>
          <ChevronIcon className="w-4 h-4 text-black" />
        </button>

        {/* 9. شروط الاستخدام (Terms of Use) */}
        <button
          type="button"
          onClick={() => setShowTermsModal(true)}
          className="w-full flex items-center justify-between p-3 hover:bg-black/5 rounded-2xl transition-colors cursor-pointer text-start"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-amber-400 flex items-center justify-center">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-black text-black block">
                {isAr ? 'شروط الاستخدام' : 'Terms of Use'}
              </span>
              <span className="text-[11px] text-black/80 font-bold">
                {isAr ? 'وثيقة الشروط والاتفاقيات المصرفية' : 'User terms & agreements'}
              </span>
            </div>
          </div>
          <ChevronIcon className="w-4 h-4 text-black" />
        </button>

        {/* 10. سياسة الخصوصية (Privacy Policy) */}
        <button
          type="button"
          onClick={() => setShowPrivacyModal(true)}
          className="w-full flex items-center justify-between p-3 hover:bg-black/5 rounded-2xl transition-colors cursor-pointer text-start"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-amber-400 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-black text-black block">
                {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </span>
              <span className="text-[11px] text-black/80 font-bold">
                {isAr ? 'حماية البيانات وسرية الحسابات' : 'Data protection & confidentiality'}
              </span>
            </div>
          </div>
          <ChevronIcon className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* Independence Disclaimer & Creator Credit */}
      <div className="p-4 rounded-2xl bg-amber-300 border-2 border-black text-center text-xs text-black space-y-3 shadow-sm">
        <div>
          <p className="font-black text-black text-sm mb-0.5">
            {isAr ? 'هذا التطبيق لا يتبع لأي بنك، هو مجرد فكرة' : 'This app is not affiliated with any bank — Just a concept'}
          </p>
          <p className="text-[11px] text-black/80 font-bold">
            {isAr
              ? 'ساهل — نموذج تجريبي توضيحي مستقل لعرض فكرة الخدمات المصرفية الميسرة في السودان.'
              : 'SAHEL — Independent fintech demonstration prototype for presentation purposes.'}
          </p>
        </div>

        {/* Conception & Design by Kamal Jaafar Zakaria */}
        <div className="pt-2.5 border-t-2 border-black/20 flex flex-col items-center gap-1.5">
          <span className="text-xs font-black text-black">
            {isAr
              ? 'من تصميم وفكرة: كمال جعفر زكريا'
              : 'Conception & Design: Kamal Jaafar Zakaria'}
          </span>
          <a
            href="https://wa.me/249919980435"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-amber-400 hover:bg-stone-900 font-black text-xs transition-transform active:scale-95 shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>واتساب: 00249919980435</span>
          </a>
        </div>
      </div>

      {/* ABOUT APPLICATION MODAL (ميزة التوضيح عن التطبيق) */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-black">
          <div className="w-full max-w-md bg-amber-300 rounded-3xl p-6 shadow-2xl space-y-4 border-2 border-black">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black/20">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-black" />
                <h3 className="text-base font-black text-black">
                  {isAr ? 'التوضيح عن تطبيق ساهل' : 'About SAHEL Application'}
                </h3>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            <div className="bg-amber-200/90 rounded-2xl p-4 border-2 border-black space-y-3 text-xs text-black leading-relaxed font-bold">
              {/* Highlighted Disclaimer Banner */}
              <div className="p-3 rounded-xl bg-black text-amber-400 border-2 border-black text-center shadow-xs space-y-1">
                <p className="text-sm font-black text-amber-300">
                  {isAr
                    ? '⚠️ هذا التطبيق لا يتبع لأي بنك، هو مجرد فكرة'
                    : '⚠️ This application is not affiliated with any bank, it is merely a concept'}
                </p>
                <p className="text-[11px] text-amber-400/80 font-bold">
                  {isAr ? 'نموذج تجريبي تصوري للمدفوعات الرقمية والخدمات المصرفية' : 'Conceptual Fintech Demonstration Prototype'}
                </p>
              </div>

              <p className="text-sm font-black text-black">
                {isAr ? 'فكرة وتصميم المشروع:' : 'Project Concept & Design:'}
              </p>
              <div className="bg-amber-100 p-3 rounded-xl border border-black/30 space-y-1">
                <p className="font-black text-sm text-black">
                  {isAr ? 'من تصميم وفكرة: كمال جعفر زكريا' : 'Designed & Conceived by: Kamal Jaafar Zakaria'}
                </p>
                <p className="font-mono font-black text-xs text-black">
                  واتساب: 00249919980435
                </p>
              </div>

              <p className="pt-1">
                {isAr
                  ? 'هذا التطبيق لا يتبع لأي بنك، هو مجرد فكرة. تطبيق «ساهل» هو رؤية وتصميم لنظام دفع رقمي ومصرفي فائق البساطة مخصص للبيئة السودانية، صُمم لحل تحديات التعقيد المصرفي، وانقطاعات شبكة الإنترنت عبر دعم القنوات البديلة (USSD)، وتسهيل التعامل المالي للجميع تحت شعار «قروشك أقرب وأسهل».'
                  : 'This application is not affiliated with any bank, it is merely a concept. SAHEL is a simplified digital banking and mobile payment concept tailored for Sudan, solving interface complexity and internet disruptions via USSD alternative channels.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/249919980435"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-black text-amber-400 hover:bg-stone-900 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'تواصل عبر الواتساب' : 'Contact via WhatsApp'}</span>
              </a>
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-2.5 rounded-xl border-2 border-black text-black font-black text-xs hover:bg-black/10 cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TERMS MODAL */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-black">
          <div className="w-full max-w-md bg-amber-300 rounded-3xl p-6 shadow-2xl space-y-3 border-2 border-black">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black/20">
              <h3 className="text-base font-black text-black">
                {isAr ? 'شروط الاستخدام — ساهل' : 'Terms of Use — SAHEL'}
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-amber-400" />
              </button>
            </div>
            <p className="text-xs text-black/90 font-bold leading-relaxed">
              {isAr
                ? 'يهدف تطبيق «ساهل» إلى تقديم تجربة دفع رقمية ميسرة للمواطنين والمقيمين في السودان وفق أعلى معايير الحماية المصرفية المعتمدة، مع الالتزام التام بالشفافية وخلو العمليات الأساسية من أي رسوم مبالغ فيها.'
                : 'SAHEL provides streamlined digital payment experiences for Sudanese users upholding regulatory standards, zero hidden fees, and maximum accessibility.'}
            </p>
            <div className="p-3 bg-amber-200 rounded-xl border border-black/30 text-xs font-black">
              <span>{isAr ? 'من تصميم وفكرة: كمال جعفر زكريا | واتساب: 00249919980435' : 'Conception & Design: Kamal Jaafar Zakaria | WhatsApp: 00249919980435'}</span>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 rounded-xl bg-black text-amber-400 font-black text-xs cursor-pointer"
            >
              {isAr ? 'موافق وإغلاق' : 'Accept & Close'}
            </button>
          </div>
        </div>
      )}

      {/* PRIVACY MODAL */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-black">
          <div className="w-full max-w-md bg-amber-300 rounded-3xl p-6 shadow-2xl space-y-3 border-2 border-black">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black/20">
              <h3 className="text-base font-black text-black">
                {isAr ? 'سياسة الخصوصية — ساهل' : 'Privacy Policy — SAHEL'}
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-amber-400" />
              </button>
            </div>
            <p className="text-xs text-black/90 font-bold leading-relaxed">
              {isAr
                ? 'نحن ملتزمون بسرية المعلومات المالية وبيانات الهوية للمستخدمين. يتم تشفير كافة حركات الأموال محلياً ولا يتم مشاركة أي بيانات حساسة مع أطراف ثالثة غير مخولة.'
                : 'All financial transmissions are protected by end-to-end encryption. No personal or banking credentials are shared with unauthorized third parties.'}
            </p>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 rounded-xl bg-black text-amber-400 font-black text-xs cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* LIMITS MODAL */}
      {showLimitsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-black">
          <div className="w-full max-w-md bg-amber-300 rounded-3xl p-6 shadow-2xl space-y-4 border-2 border-black">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black/20">
              <h3 className="text-base font-black text-black">
                {isAr ? 'تعديل حدود العمليات' : 'Adjust Limits'}
              </h3>
              <button
                onClick={() => setShowLimitsModal(false)}
                className="w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-amber-400" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-200 rounded-xl border-2 border-black">
                <span className="text-black/80 font-bold block mb-1">
                  {isAr ? 'الحد اليومي الأقصى الحالي' : 'Current Daily Limit'}
                </span>
                <span className="text-lg font-black text-black">
                  3,000,000 {isAr ? 'جنيه سوداني' : 'SDG'}
                </span>
              </div>
              <p className="text-black/90 font-bold">
                {isAr
                  ? 'يمكن رفع السقف اليومي حتى 10,000,000 جنيه سوداني عبر توثيق الرقم الوطني أو زيارة أقرب فرع/وكيل معتمد.'
                  : 'Daily ceiling can be upgraded to 10M SDG via National ID verification or at any authorized agent.'}
              </p>
            </div>
            <button
              onClick={() => setShowLimitsModal(false)}
              className="w-full py-2.5 rounded-xl bg-black text-amber-400 font-black text-xs cursor-pointer"
            >
              {isAr ? 'حفظ التعديلات' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
