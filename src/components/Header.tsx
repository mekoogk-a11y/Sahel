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
      // Reset if too slow
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
      {/* Official Prototype Disclaimer Banner */}
      <div className="bg-black text-amber-400 px-4 py-1.5 text-xs text-center flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 mx-auto font-bold text-center">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>
            {isAr
              ? 'تطبيق ساهل — نموذج أولي تجريبي (Prototype/MVP) لعرض الفكرة فقط، لا يتبع لأي بنك أو مؤسسة مالية مرخصة'
              : 'SAHEL Prototype / MVP — Concept demonstration only, not affiliated with any bank or licensed institution'}
          </span>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Zone with Secret Designer Tap Gesture on Logo */}
        <div className="flex items-center gap-3 select-none">
          <div
            onClick={handleLogoTap}
            className="w-10 h-10 rounded-xl bg-black flex items-center justify-center font-black text-amber-400 text-2xl shadow-xs border-2 border-black cursor-pointer active:scale-90 transition-transform"
            title={isAr ? 'تطبيق ساهل' : 'SAHEL'}
          >
            س
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-black">ساهل</span>
              <span className="text-xs font-black text-black/80 tracking-wider">SAHEL</span>
            </div>
            <p className="text-[11px] text-black font-extrabold -mt-1">
              {isAr ? 'أموالك أقرب وأسهل' : 'Your Money Closer & Easier'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* ONLY SHOW ADMIN BUTTON IF DESIGNER IS AUTHENTICATED */}
          {isDesignerAuthenticated ? (
            <div className="flex items-center gap-1.5 bg-black p-1 rounded-2xl border-2 border-black">
              {/* Toggle View */}
              <button
                type="button"
                onClick={() => setAppView(appView === 'user' ? 'admin' : 'user')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer shadow-xs active:scale-95 ${
                  appView === 'admin'
                    ? 'bg-amber-400 text-black'
                    : 'bg-stone-800 text-amber-300 hover:bg-stone-700'
                }`}
                title={isAr ? 'لوحة تحكم مصمم التطبيق' : 'Designer Control Panel'}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {appView === 'admin' ? (isAr ? 'واجهة العميل' : 'Client View') : (isAr ? 'لوحة المصمم' : 'Designer Panel')}
                </span>
              </button>

              {/* Quick Lock & Logout */}
              <button
                type="button"
                onClick={onDesignerLogout}
                className="p-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors"
                title={isAr ? 'قفل لوحة المصمم وخروج' : 'Lock & Exit'}
              >
                <Lock className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          ) : null}

          {/* Security Center Link */}
          <button
            onClick={onOpenSecurity}
            className="p-2 rounded-xl text-black bg-amber-300 hover:bg-amber-200 transition-colors cursor-pointer border-2 border-black"
            title={isAr ? 'الأمان والحماية' : 'Security'}
            aria-label="Security"
          >
            <ShieldCheck className="w-4 h-4 text-black" />
          </button>

          {/* Device Frame Viewport Toggle */}
          <button
            onClick={() => setIsDeviceMode(!isDeviceMode)}
            className={`p-2 rounded-xl transition-colors cursor-pointer border-2 border-black ${
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
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 border-black bg-amber-300 hover:bg-amber-200 text-black font-black text-xs cursor-pointer transition-colors"
            title={isAr ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="w-3.5 h-3.5 text-black" />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Reset Prototype Data */}
          <button
            onClick={onResetData}
            className="p-2 rounded-xl text-black bg-amber-300 hover:bg-amber-200 transition-colors cursor-pointer border-2 border-black"
            title={isAr ? 'إعادة ضبط البيانات التجريبية' : 'Reset Demo Data'}
            aria-label="Reset Data"
          >
            <RotateCcw className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </header>
  );
};
