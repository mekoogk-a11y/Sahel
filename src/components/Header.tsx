import React from 'react';
import { Smartphone, Monitor, Globe, RotateCcw, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  isDeviceMode: boolean;
  setIsDeviceMode: (mode: boolean) => void;
  onResetData: () => void;
  onOpenSecurity: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  isDeviceMode,
  setIsDeviceMode,
  onResetData,
  onOpenSecurity,
}) => {
  const isAr = language === 'ar';

  return (
    <header className="w-full bg-amber-400 border-b-2 border-black/20 sticky top-0 z-30 shadow-xs">
      {/* Official Prototype Disclaimer Banner */}
      <div className="bg-black text-amber-400 px-4 py-1.5 text-xs text-center flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 mx-auto font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>
            {isAr
              ? 'هذا التطبيق لا يتبع لأي بنك، هو مجرد فكرة (نموذج تجريبي لعرض المفهوم)'
              : 'This application is not affiliated with any bank, it is merely a concept (Prototype)'}
          </span>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Zone: Sahel Wordmark */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center font-black text-amber-400 text-xl shadow-xs border border-black">
              س
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight text-black">ساهل</span>
                <span className="text-xs font-black text-black/80 tracking-wider">SAHEL</span>
              </div>
              <p className="text-[11px] text-black/80 font-bold -mt-1">
                {isAr ? 'قروشك أقرب وأسهل' : 'Simpler, Closer Financials'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Presentation Tools */}
        <div className="flex items-center gap-2">
          {/* Security Center Link */}
          <button
            onClick={onOpenSecurity}
            className="p-2 rounded-lg text-black hover:bg-black/10 transition-colors cursor-pointer border border-black/20"
            title={isAr ? 'الأمان والتحقق' : 'Security'}
            aria-label="Security"
          >
            <ShieldCheck className="w-4 h-4 text-black" />
          </button>

          {/* Device Frame Viewport Toggle */}
          <button
            onClick={() => setIsDeviceMode(!isDeviceMode)}
            className="hidden md:flex items-center gap-1 p-2 rounded-lg text-black hover:bg-black/10 transition-colors cursor-pointer border border-black/20"
            title={isDeviceMode ? (isAr ? 'عرض الشاشة الكاملة' : 'Fullscreen View') : (isAr ? 'عرض إطار الهاتف' : 'Device Frame')}
          >
            {isDeviceMode ? <Monitor className="w-4 h-4 text-black" /> : <Smartphone className="w-4 h-4 text-black" />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 border-black/30 text-black hover:bg-black/10 font-bold text-xs transition-colors cursor-pointer"
            title="Toggle Language / تغيير اللغة"
          >
            <Globe className="w-3.5 h-3.5 text-black" />
            <span>{language === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            className="p-2 rounded-lg text-black hover:bg-black/10 transition-colors cursor-pointer border border-black/20"
            title={isAr ? 'إعادة ضبط البيانات التجريبية' : 'Reset Demo Data'}
            aria-label="Reset Demo Data"
          >
            <RotateCcw className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </header>
  );
};
