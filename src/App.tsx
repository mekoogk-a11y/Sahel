/**
 * SAHEL (ساهل) — Mobile Banking & Digital Payment Prototype for Sudan
 * "فلوسك أقرب وأسهل"
 * High-Fidelity Demonstration Prototype
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { TransactionsScreen } from './components/TransactionsScreen';
import { BeneficiariesScreen } from './components/BeneficiariesScreen';
import { AccountScreen } from './components/AccountScreen';
import { SendModal } from './components/SendModal';
import { ReceiveModal } from './components/ReceiveModal';
import { PayModal } from './components/PayModal';
import { WithdrawModal } from './components/WithdrawModal';
import { OfflineUssdModal } from './components/OfflineUssdModal';
import { SecurityModal } from './components/SecurityModal';
import { HelpModal } from './components/HelpModal';

import {
  ActionModalType,
  Beneficiary,
  Language,
  TabType,
  Transaction,
  UserAccount,
} from './types';
import {
  INITIAL_BENEFICIARIES,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
} from './data/mockData';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeModal, setActiveModal] = useState<ActionModalType>(null);
  const [isDeviceMode, setIsDeviceMode] = useState(false);

  // App reactive state
  const [user, setUser] = useState<UserAccount>(INITIAL_USER);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [preselectedBeneficiary, setPreselectedBeneficiary] = useState<Beneficiary | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Sync HTML dir attribute with language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Handle Send Money completion
  const handleCompleteTransfer = (amount: number, recipientName: string, recipientAccount: string): Transaction => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'transfer_out',
      title: 'إرسال تحويل مالي فوري',
      titleEn: 'Instant Transfer Sent',
      recipientOrSender: recipientName,
      phoneOrAccount: recipientAccount,
      amount: -amount,
      date: language === 'ar' ? 'الآن' : 'Just now',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceNo: `TXN-${Math.floor(1000 + Math.random() * 9000)}-SD`,
      fee: 0,
      category: 'transfer',
    };

    setUser((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
      dailyUsed: prev.dailyUsed + amount,
    }));

    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  // Handle Pay Merchant completion
  const handleCompletePayment = (amount: number, merchantName: string): Transaction => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'merchant_pay',
      title: 'دفع مشتريات / فاتورة',
      titleEn: 'Merchant Payment',
      recipientOrSender: merchantName,
      phoneOrAccount: 'نقطة بيع معتمدة',
      amount: -amount,
      date: language === 'ar' ? 'الآن' : 'Just now',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceNo: `POS-${Math.floor(1000 + Math.random() * 9000)}-SD`,
      fee: 0,
      category: 'payment',
    };

    setUser((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
      dailyUsed: prev.dailyUsed + amount,
    }));

    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  // Handle Withdrawal completion
  const handleCompleteWithdrawal = (
    amount: number,
    type: 'atm_withdraw' | 'agent_withdraw',
    description: string
  ): Transaction => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type,
      title: description,
      titleEn: type === 'atm_withdraw' ? 'Cardless ATM Withdrawal' : 'Agent Cash Out',
      recipientOrSender: type === 'atm_withdraw' ? 'صراف آلي معتمد' : 'وكيل ساهل معتمد',
      phoneOrAccount: `كود سحب: ${Math.floor(100000 + Math.random() * 900000)}`,
      amount: -amount,
      date: language === 'ar' ? 'الآن' : 'Just now',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      referenceNo: `CSH-${Math.floor(1000 + Math.random() * 9000)}-SD`,
      fee: 0,
      category: 'cash',
    };

    setUser((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
      dailyUsed: prev.dailyUsed + amount,
    }));

    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  // Add new beneficiary
  const handleAddBeneficiary = (b: Beneficiary) => {
    setBeneficiaries((prev) => [b, ...prev]);
  };

  // Quick trigger send to beneficiary
  const handleSelectBeneficiaryToSend = (b: Beneficiary) => {
    setPreselectedBeneficiary(b);
    setActiveModal('send');
  };

  // Reset demo state
  const handleResetData = () => {
    setUser(INITIAL_USER);
    setBeneficiaries(INITIAL_BENEFICIARIES);
    setTransactions(INITIAL_TRANSACTIONS);
    setPreselectedBeneficiary(null);
    setSelectedTransaction(null);
  };

  return (
    <div className="min-h-screen bg-amber-400 text-black flex flex-col antialiased selection:bg-black selection:text-amber-400">
      {/* Top Application Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        isDeviceMode={isDeviceMode}
        setIsDeviceMode={setIsDeviceMode}
        onResetData={handleResetData}
        onOpenSecurity={() => setActiveModal('security')}
      />

      {/* Main Viewport Wrapper (Fluid or Simulated Smartphone Frame) */}
      <main className="flex-1 flex justify-center items-start p-2 sm:p-4">
        <div
          className={`w-full transition-all duration-300 ${
            isDeviceMode
              ? 'max-w-[420px] bg-amber-300 border-8 border-black rounded-[44px] shadow-2xl p-4 my-2 ring-1 ring-black/20'
              : 'max-w-md'
          }`}
        >
          {/* Active Tab Screen */}
          {currentTab === 'home' && (
            <HomeScreen
              user={user}
              beneficiaries={beneficiaries}
              recentTransactions={transactions}
              language={language}
              onOpenAction={(action) => {
                setPreselectedBeneficiary(null);
                setActiveModal(action);
              }}
              onSelectBeneficiary={handleSelectBeneficiaryToSend}
              onViewAllTransactions={() => setCurrentTab('transactions')}
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
              onAddBeneficiary={() => setCurrentTab('beneficiaries')}
            />
          )}

          {currentTab === 'transactions' && (
            <TransactionsScreen
              transactions={transactions}
              language={language}
              selectedTransaction={selectedTransaction}
              onSelectTransaction={setSelectedTransaction}
            />
          )}

          {currentTab === 'beneficiaries' && (
            <BeneficiariesScreen
              beneficiaries={beneficiaries}
              language={language}
              onSendToBeneficiary={handleSelectBeneficiaryToSend}
              onAddBeneficiary={handleAddBeneficiary}
            />
          )}

          {currentTab === 'account' && (
            <AccountScreen
              user={user}
              language={language}
              setLanguage={setLanguage}
              onOpenSecurity={() => setActiveModal('security')}
              onOpenHelp={() => setActiveModal('help')}
            />
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
      />

      {/* MODALS */}
      {/* 1. Send Money Modal */}
      {activeModal === 'send' && (
        <SendModal
          language={language}
          beneficiaries={beneficiaries}
          preselectedBeneficiary={preselectedBeneficiary}
          currentBalance={user.balance}
          onClose={() => {
            setActiveModal(null);
            setPreselectedBeneficiary(null);
          }}
          onCompleteTransfer={handleCompleteTransfer}
          onSaveBeneficiary={(name, account) => {
            handleAddBeneficiary({
              id: `b-${Date.now()}`,
              name,
              nameEn: name,
              phoneNumber: '09XXXXXXXX',
              accountNumber: account,
              avatarColor: 'bg-black text-amber-400',
              initials: name.charAt(0),
              isFavorite: true,
              relationship: 'مستفيد محفوظ',
            });
          }}
        />
      )}

      {/* 2. Receive Money Modal */}
      {activeModal === 'receive' && (
        <ReceiveModal
          user={user}
          language={language}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* 3. Pay Merchants & Bills Modal */}
      {activeModal === 'pay' && (
        <PayModal
          language={language}
          currentBalance={user.balance}
          onClose={() => setActiveModal(null)}
          onCompletePayment={handleCompletePayment}
        />
      )}

      {/* 4. Cash Withdrawal Modal */}
      {activeModal === 'withdraw' && (
        <WithdrawModal
          language={language}
          currentBalance={user.balance}
          onClose={() => setActiveModal(null)}
          onCompleteWithdrawal={handleCompleteWithdrawal}
        />
      )}

      {/* 5. Offline USSD Simulator Modal */}
      {activeModal === 'ussd' && (
        <OfflineUssdModal
          language={language}
          balance={user.balance}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* 6. Help & Support Modal */}
      {activeModal === 'help' && (
        <HelpModal
          language={language}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* 7. Security Framework Modal */}
      {activeModal === 'security' && (
        <SecurityModal
          language={language}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
