import React from 'react';
import { Home, ArrowLeftRight, Users, User } from 'lucide-react';
import { TabType, Language } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  setTab: (tab: TabType) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setTab, language }) => {
  const isAr = language === 'ar';

  const navItems: { id: TabType; labelAr: string; labelEn: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'home',
      labelAr: 'الرئيسية',
      labelEn: 'Home',
      icon: Home,
    },
    {
      id: 'transactions',
      labelAr: 'العمليات',
      labelEn: 'Activity',
      icon: ArrowLeftRight,
    },
    {
      id: 'beneficiaries',
      labelAr: 'المستفيدون',
      labelEn: 'Beneficiaries',
      icon: Users,
    },
    {
      id: 'account',
      labelAr: 'الحساب',
      labelEn: 'Account',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-amber-400 border-t-2 border-black/20 shadow-md">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-black font-black'
                  : 'text-black/75 hover:text-black font-bold'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-black text-amber-400 scale-105 shadow-xs' : 'text-black'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-black text-black' : 'font-bold text-black/80'}`}>
                {isAr ? item.labelAr : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
