import React from 'react';
import {
  Home,
  ArrowRightLeft,
  Smartphone,
  Receipt,
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

  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    {
      id: 'home',
      label: isAr ? 'الرئيسية' : 'Home',
      icon: Home,
    },
    {
      id: 'visa',
      label: isAr ? 'بطاقة فيزا' : 'Visa Card',
      icon: CreditCard,
    },
    {
      id: 'transactions',
      label: isAr ? 'المعاملات' : 'History',
      icon: ArrowRightLeft,
    },
    {
      id: 'recharge',
      label: isAr ? 'الشحن' : 'Recharge',
      icon: Smartphone,
    },
    {
      id: 'bills',
      label: isAr ? 'الفواتير' : 'Bills',
      icon: Receipt,
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
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-amber-400 border-t-2 border-black max-w-4xl mx-auto shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all cursor-pointer relative min-w-[54px] ${
                isActive
                  ? 'bg-black text-amber-400 font-black shadow-xs -translate-y-0.5'
                  : 'text-black font-extrabold hover:bg-black/10'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-black'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -end-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-[62px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
