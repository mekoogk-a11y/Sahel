import React, { useState, useRef } from 'react';
import {
  Smartphone,
  Monitor,
  Globe,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  LayoutDashboard,
  User,
  KeyRound,
  LogOut,
  Lock,
} from 'lucide-react';
import { AppView, Language } from '../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  appView: AppView;
  setAppView: (view: AppView) => void;
  isDeviceMode: boolean;
  setIsDeviceMode: (mode: boolean) => void;
  isDesignerAuthenticated: boolean;
  onTriggerDesignerAuth: () => void;
  onDesignerLogout: () => void;
  onResetData: () => void;
  onOpenSecurity: () => void;
  pendingRefundCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  appView,
  setAppView,
  isDeviceMode,
  setIsDeviceMode,
  isDesignerAuthenticated,
  onTriggerDesignerAuth,
  onDesignerLogout,
  onResetData,
  onOpenSecurity,
  pendingRefundCount,
}) => {
  const isAr = language === 'ar';

  // Secret Logo Multi-Tap Trigger for App Designer (5 taps within 3 seconds)
  const [tapCount, setTapCount] = useState(0);
  const lastTapTimeRef = useRef<number>(0);

  const handleLogoTap = () => {
    const now = Date.now();
    if (now - lastTapTimeRef.current > 3000) {
      setTapCount(1);
    } else {
      const newCount = tapCount + 1;
      setTapCount(newCount);
      if (newCount >= 5) {
        setTapCount(0);
        onTriggerDesignerAuth();
        return;
      }
    }
    lastTapTimeRef.current = now;
  };

  return (
    <header className="w-full bg-amber-400 border-b-2 border-black sticky top-0 z-30 shadow-xs">
      {/* Official Prototype Disclaimer Banner - Responsive Single-Line on Mobile */}
      <div className="bg-black text-amber-400 px-3 py-1 text-[11px] sm:text-xs text-center flex items-center justify-center">
        <div className="flex items-center gap-1.5 font-bold text-center truncate">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
          <span className="sm:hidden truncate">
            {isAr ? 'ساهل — نموذج أولي تجريبي (MVP)' : 'SAHEL — Prototype MVP'}
          </span>
          <span className="hidden sm:inline">
            {isAr
              ? 'تطبيق ساهل — نموذج أولي تجريبي (Prototype/MVP) لعرض الفكرة فقط، لا يتبع لأي بنك أو مؤسسة مالية'
              : 'SAHEL Prototype / MVP — Concept demonstration only, not affiliated with any bank'}
          </span>
        </div>
      </div>

      {/* Main App Navigation Bar - Sized for Mobile Smartphone Viewport */}
      <div className="max-w-md mx-auto px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Brand Zone with Secret Designer Tap Gesture on Logo */}
        <div className="flex items-center gap-2 sm:gap-2.5 select-none shrink-0">
          <div
            onClick={handleLogoTap}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black flex items-center justify-center font-black text-amber-400 text-xl sm:text-2xl shadow-xs border-2 border-black cursor-pointer active:scale-90 transition-transform shrink-0"
            title={isAr ? 'تطبيق ساهل' : 'SAHEL'}
          >
            س
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-black leading-tight">ساهل</span>
              <span className="text-[10px] sm:text-xs font-black text-black/80 tracking-wider">SAHEL</span>
            </div>
            <p className="text-[10px] text-black font-extrabold -mt-0.5 leading-tight">
              {isAr ? 'أموالك أقرب وأسهل' : 'Your Money Closer & Easier'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* ONLY SHOW ADMIN BUTTON IF DESIGNER IS AUTHENTICATED */}
          {isDesignerAuthenticated ? (
            <div className="flex items-center gap-1 bg-black p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border-2 border-black">
              {/* Toggle View */}
              <button
                type="button"
                onClick={() => setAppView(appView === 'user' ? 'admin' : 'user')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg sm:rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer shadow-xs active:scale-95 ${
                  appView === 'admin'
                    ? 'bg-amber-400 text-black'
                    : 'bg-stone-800 text-amber-300 hover:bg-stone-700'
                }`}
                title={isAr ? 'لوحة تحكم مصمم التطبيق' : 'Designer Control Panel'}
              >
                <KeyRound className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">
                  {appView === 'admin' ? (isAr ? 'العميل' : 'Client') : (isAr ? 'المصمم' : 'Designer')}
                </span>
              </button>

              {/* Quick Lock & Logout */}
              <button
                type="button"
                onClick={onDesignerLogout}
                className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors"
                title={isAr ? 'قفل لوحة المصمم وخروج' : 'Lock & Exit'}
              >
                <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              </button>
            </div>
          ) : null}

          {/* Security Center Link */}
          <button
            onClick={onOpenSecurity}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-black bg-amber-300 hover:bg-amber-200 transition-colors cursor-pointer border-2 border-black flex items-center justify-center shrink-0 active:scale-95"
            title={isAr ? 'الأمان والحماية' : 'Security'}
            aria-label="Security"
          >
            <ShieldCheck className="w-4 h-4 text-black" />
          </button>

          {/* Device Frame Viewport Toggle - Hidden on mobile screens to keep phone UI native */}
          <button
            onClick={() => setIsDeviceMode(!isDeviceMode)}
            className={`hidden md:flex w-9 h-9 rounded-xl transition-colors cursor-pointer border-2 border-black items-center justify-center shrink-0 active:scale-95 ${
              isDeviceMode
                ? 'bg-black text-amber-400'
                : 'bg-amber-300 text-black hover:bg-amber-200'
            }`}
            title={
              isDeviceMode
                ? isAr ? 'عرض ملء الشاشة' : 'Full Screen'
                : isAr ? 'محاكاة شاشة الهاتف' : 'Mobile Frame'
            }
            aria-label="Toggle device frame"
          >
            {isDeviceMode ? (
              <Monitor className="w-4 h-4 text-amber-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-black" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="h-8 sm:h-9 px-2 rounded-xl border-2 border-black bg-amber-300 hover:bg-amber-200 text-black font-black text-[11px] sm:text-xs cursor-pointer transition-colors flex items-center gap-1 shrink-0 active:scale-95"
            title={isAr ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="w-3.5 h-3.5 text-black" />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Reset Prototype Data */}
          <button
            onClick={onResetData}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-black bg-amber-300 hover:bg-amber-200 transition-colors cursor-pointer border-2 border-black flex items-center justify-center shrink-0 active:scale-95"
            title={isAr ? 'إعادة ضبط البيانات التجريبية' : 'Reset Demo Data'}
            aria-label="Reset Data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
      </div>
    </header>
  );
};
