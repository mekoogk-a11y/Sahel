import React from 'react';
import {
  Home,
  ArrowRightLeft,
  ShieldAlert,
  User,
  CreditCard,
} from 'lucide-react';
import { Language, TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  setTab: (tab: TabType) => void;
  language: Language;
  openDisputesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setTab,
  language,
  openDisputesCount,
}) => {
  const isAr = language === 'ar';

  // 5 Essential Smartphone Navigation Items (Standard Mobile Banking Layout)
  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    {
      id: 'home',
      label: isAr ? 'الرئيسية' : 'Home',
      icon: Home,
    },
    {
      id: 'visa',
      label: isAr ? 'فيزا' : 'Visa',
      icon: CreditCard,
    },
    {
      id: 'transactions',
      label: isAr ? 'المعاملات' : 'Activity',
      icon: ArrowRightLeft,
    },
    {
      id: 'support',
      label: isAr ? 'الشكاوى' : 'Support',
      icon: ShieldAlert,
      badge: openDisputesCount,
    },
    {
      id: 'account',
      label: isAr ? 'حسابي' : 'Account',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-amber-400/95 backdrop-blur-xs border-t-2 border-black max-w-md mx-auto shadow-lg pb-[max(env(safe-area-inset-bottom),6px)]">
      <div className="flex items-center justify-between px-1.5 py-1.5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer relative min-h-[48px] active:scale-95 ${
                isActive
                  ? 'bg-black text-amber-400 font-black shadow-xs'
                  : 'text-black font-extrabold hover:bg-black/10'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-black'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -end-2.5 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-black tracking-tight mt-1 leading-none text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
