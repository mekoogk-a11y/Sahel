import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { TransactionsScreen } from './components/TransactionsScreen';
import { MobileRechargeModal } from './components/MobileRechargeModal';
import { BillPaymentModal } from './components/BillPaymentModal';
import { SupportDisputesView } from './components/SupportDisputesView';
import { AccountScreen } from './components/AccountScreen';
import { SendModal } from './components/SendModal';
import { ReceiveModal } from './components/ReceiveModal';
import { RefundRequestModal } from './components/RefundRequestModal';
import { ReviewIncomingRefundModal } from './components/ReviewIncomingRefundModal';
import { ReportTransactionModal } from './components/ReportTransactionModal';
import { SecurityModal } from './components/SecurityModal';
import { AdminDashboard } from './components/AdminDashboard';

import {
  ActionModalType,
  AppView,
  AuditLog,
  Beneficiary,
  ComplaintTicket,
  DisputeStatus,
  Language,
  RefundRequest,
  SystemSettings,
  TabType,
  TelecomProvider,
  Transaction,
  UserAccount,
} from './types';

import {
  INITIAL_AUDIT_LOGS,
  INITIAL_BENEFICIARIES,
  INITIAL_COMPLAINT_TICKETS,
  INITIAL_REFUND_REQUESTS,
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
} from './data/mockData';

export function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [appView, setAppView] = useState<AppView>('user');
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeModal, setActiveModal] = useState<ActionModalType>(null);
  const [isDeviceMode, setIsDeviceMode] = useState<boolean>(false);

  // Application Data States
  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('sahel_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('sahel_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    const saved = localStorage.getItem('sahel_beneficiaries');
    return saved ? JSON.parse(saved) : INITIAL_BENEFICIARIES;
  });

  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(() => {
    const saved = localStorage.getItem('sahel_refund_requests');
    return saved ? JSON.parse(saved) : INITIAL_REFUND_REQUESTS;
  });

  const [complaints, setComplaints] = useState<ComplaintTicket[]>(() => {
    const saved = localStorage.getItem('sahel_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINT_TICKETS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('sahel_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('sahel_settings');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_SETTINGS;
  });

  // Modal Specific State Holders
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedRefundForReview, setSelectedRefundForReview] = useState<RefundRequest | null>(null);
  const [selectedTxForRefund, setSelectedTxForRefund] = useState<Transaction | null>(null);
  const [selectedTxForDispute, setSelectedTxForDispute] = useState<Transaction | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('sahel_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sahel_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sahel_refund_requests', JSON.stringify(refundRequests));
  }, [refundRequests]);

  useEffect(() => {
    localStorage.setItem('sahel_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('sahel_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('sahel_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  // Adjust document direction according to language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Helper to append audit logs
  const logAuditEvent = (action: string, actionEn: string, target: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: language === 'ar' ? 'الآن' : 'Just now',
      actor: user.accountNumber,
      action,
      actionEn,
      target,
      details,
      ipAddress: '197.251.14.88',
      status: 'success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // 1. Send Money Completion Handler
  const handleCompleteTransfer = (
    amount: number,
    recipientName: string,
    recipientAccount: string,
    recipientPhone: string,
    note?: string
  ): Transaction => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      referenceNo: `TXN-${Math.floor(1000 + Math.random() * 9000)}-SD`,
      type: 'transfer_out',
      title: 'تحويل مالي إلى حساب ساهل',
      titleEn: 'Transfer to Sahel Account',
      recipientName,
      recipientAccount,
      recipientPhone,
      senderName: user.name,
      senderAccount: user.accountNumber,
      senderPhone: user.phoneNumber,
      amount: -amount,
      fee: 0,
      date: language === 'ar' ? 'اليوم' : 'Today',
      time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
      status: 'completed',
      category: 'transfer',
      note: note || undefined,
      refundStatus: 'none',
    };

    setUser((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
      dailyUsed: prev.dailyUsed + amount,
    }));

    setTransactions((prev) => [newTx, ...prev]);

    logAuditEvent(
      `إرسال تحويل مالي فوري (${amount.toLocaleString('en-US')} ج.س)`,
      `Instant money transfer (${amount.toLocaleString('en-US')} SDG)`,
      recipientAccount,
      `تم التحويل إلى ${recipientName} برقم مرجعي ${newTx.referenceNo}`
    );

    return newTx;
  };

  // 2. Mobile Recharge Completion Handler
  const handleCompleteRecharge = (
    provider: TelecomProvider,
    phoneNumber: string,
    amount: number
  ): Transaction => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      referenceNo: `TOP-${Math.floor(1000 + Math.random() * 9000)}-SD`,
      type: 'recharge',
      title: `شحن رصيد شبكة ${provider}`,
      titleEn: `Mobile Recharge — ${provider}`,
      recipientName: `شبكة ${provider} السودان`,
      recipientAccount: `${provider.toUpperCase()}-TOPUP`,
      recipientPhone: phoneNumber,
      senderName: user.name,
      senderAccount: user.accountNumber,
      senderPhone: user.phoneNumber,
      amount: -amount,
      fee: 0,
      date: language === 'ar' ? 'اليوم' : 'Today',
      time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
      status: 'completed',
      category: 'recharge',
      note: `شحن هاتف: ${phoneNumber}`,
      refundStatus: 'none',
    };

    setUser((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
      dailyUsed: prev.dailyUsed + amount,
    }));

    setTransactions((prev) => [newTx, ...prev]);

    logAuditEvent(
      `شحن رصيد خط ${provider} بمبلغ ${amount} ج.س`,
      `Recharge top-up for ${provider} (${amount} SDG)`,
      phoneNumber,
      `رقم مرجعي ${newTx.referenceNo}`
    );

    return newTx;
  };

  // 3. Bill Payment Completion Handler
  const handleCompleteBillPayment = (
    serviceName: string,
    serviceNameEn: string,
    accountOrMeterNumber: string,
    amount: number
  ): Transaction => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      referenceNo: `BIL-${Math.floor(1000 + Math.random() * 9000)}-SD`,
      type: 'bill_payment',
      title: `سداد فاتورة: ${serviceName}`,
      titleEn: `Bill Settlement: ${serviceNameEn}`,
      recipientName: serviceName,
      recipientAccount: accountOrMeterNumber,
      recipientPhone: accountOrMeterNumber,
      senderName: user.name,
      senderAccount: user.accountNumber,
      senderPhone: user.phoneNumber,
      amount: -amount,
      fee: 0,
      date: language === 'ar' ? 'اليوم' : 'Today',
      time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
      status: 'completed',
      category: 'bill',
      note: `رقم الحساب أو العداد: ${accountOrMeterNumber}`,
      refundStatus: 'none',
    };

    setUser((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
      dailyUsed: prev.dailyUsed + amount,
    }));

    setTransactions((prev) => [newTx, ...prev]);

    logAuditEvent(
      `سداد فاتورة ${serviceName} بمبلغ ${amount} ج.س`,
      `Bill settlement for ${serviceNameEn} (${amount} SDG)`,
      accountOrMeterNumber,
      `رقم إيصال ${newTx.referenceNo}`
    );

    return newTx;
  };

  // 4. WRONG TRANSFER RECOVERY: Submit Refund Request Handler
  const handleSubmitRefundRequest = (transactionId: string, reason: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) return;

    const newRequest: RefundRequest = {
      id: `ref-req-${Date.now()}`,
      transactionId: tx.id,
      referenceNo: tx.referenceNo,
      senderName: user.name,
      senderAccount: user.accountNumber,
      senderPhone: user.phoneNumber,
      recipientName: tx.recipientName,
      recipientAccount: tx.recipientAccount,
      recipientPhone: tx.recipientPhone,
      amount: Math.abs(tx.amount),
      reason,
      status: 'pending',
      createdAt: language === 'ar' ? 'الآن' : 'Just now',
      timestamp: Date.now(),
    };

    setRefundRequests((prev) => [newRequest, ...prev]);

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? { ...t, refundStatus: 'requested', refundRequestId: newRequest.id }
          : t
      )
    );

    logAuditEvent(
      `تقديم طلب استرداد تحويل خاطئ للمعاملة ${tx.referenceNo}`,
      `Submitted wrong-transfer refund request for ${tx.referenceNo}`,
      tx.recipientAccount,
      `المبلغ: ${Math.abs(tx.amount)} ج.س — السبب: ${reason}`
    );
  };

  // 5. WRONG TRANSFER RECOVERY: Recipient Accepts Refund (Return Money)
  const handleAcceptRefund = (requestId: string) => {
    const req = refundRequests.find((r) => r.id === requestId);
    if (!req) return;

    // Deduct from current user (recipient)
    setUser((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - req.amount),
    }));

    // Update refund request status
    setRefundRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'accepted',
              respondedAt: language === 'ar' ? 'الآن' : 'Just now',
            }
          : r
      )
    );

    // Update transaction refundStatus
    setTransactions((prev) =>
      prev.map((t) =>
        t.referenceNo === req.referenceNo
          ? { ...t, refundStatus: 'accepted' }
          : t
      )
    );

    // Create an explicit refund reversal transaction record in ledger
    const reversalTx: Transaction = {
      id: `tx-rev-${Date.now()}`,
      referenceNo: `REV-${Math.floor(1000 + Math.random() * 9000)}-SD`,
      type: 'refund_reversal',
      title: 'إعادة مبلغ تحويل خاطئ للمرسل',
      titleEn: 'Return of Mistaken Transfer to Sender',
      recipientName: req.senderName,
      recipientAccount: req.senderAccount,
      recipientPhone: req.senderPhone,
      senderName: user.name,
      senderAccount: user.accountNumber,
      senderPhone: user.phoneNumber,
      amount: -req.amount,
      fee: 0,
      date: language === 'ar' ? 'اليوم' : 'Today',
      time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
      status: 'completed',
      category: 'transfer',
      note: `إعادة المبلغ للمرسل بناءً على طلب الاسترداد ${req.referenceNo}`,
      refundStatus: 'accepted',
    };

    setTransactions((prev) => [reversalTx, ...prev]);

    logAuditEvent(
      `موافقة وإعادة مبلغ تحويل خاطئ (${req.amount.toLocaleString('en-US')} ج.س)`,
      `Accepted & returned mistaken transfer (${req.amount.toLocaleString('en-US')} SDG)`,
      req.senderAccount,
      `تمت إعادة الأموال إلى ${req.senderName}`
    );
  };

  // 6. WRONG TRANSFER RECOVERY: Recipient Declines Refund
  const handleDeclineRefund = (requestId: string) => {
    const req = refundRequests.find((r) => r.id === requestId);
    if (!req) return;

    setRefundRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'declined',
              respondedAt: language === 'ar' ? 'الآن' : 'Just now',
            }
          : r
      )
    );

    setTransactions((prev) =>
      prev.map((t) =>
        t.referenceNo === req.referenceNo
          ? { ...t, refundStatus: 'declined' }
          : t
      )
    );

    logAuditEvent(
      `رفض طلب استرداد تحويل خاطئ للمعاملة ${req.referenceNo}`,
      `Declined refund request for ${req.referenceNo}`,
      req.senderAccount,
      `تم تسجيل رفض الإعادة في السجلات الرقابية`
    );
  };

  // 7. SUPPORT & COMPLAINTS: Submit Dispute Ticket
  const handleSubmitDispute = (transactionId: string, reason: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) return;

    const newTicketId = `CMP-${Math.floor(1000 + Math.random() * 9000)}-SD`;
    const newTicket: ComplaintTicket = {
      id: newTicketId,
      transactionId: tx.id,
      referenceNo: tx.referenceNo,
      senderName: user.name,
      senderAccount: user.accountNumber,
      recipientName: tx.recipientName,
      recipientAccount: tx.recipientAccount,
      amount: Math.abs(tx.amount),
      date: language === 'ar' ? 'اليوم' : 'Today',
      reason,
      status: 'under_review',
      createdAt: language === 'ar' ? 'الآن' : 'Just now',
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          sender: 'user',
          senderName: user.name,
          text: reason,
          timestamp: language === 'ar' ? 'الآن' : 'Just now',
        },
        {
          id: `msg-${Date.now()}-2`,
          sender: 'support',
          senderName: language === 'ar' ? 'إدارة النزاعات والامتثال — ساهل' : 'SAHEL Compliance Dept',
          text:
            language === 'ar'
              ? 'تم استلام تذكرة الشكوى وبدء التدقيق الإداري. يجري فحص حركة الحساب المستلم والتواصل معه رسمياً.'
              : 'Dispute ticket received. Administrative investigation and formal recipient contact in progress.',
          timestamp: language === 'ar' ? 'الآن' : 'Just now',
        },
      ],
      adminNotes: [
        language === 'ar'
          ? 'تم إنشاء النزاع إثر عدم استرداد المبلغ المحول بالخطأ.'
          : 'Dispute opened following failed refund resolution.',
      ],
    };

    setComplaints((prev) => [newTicket, ...prev]);

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? { ...t, refundStatus: 'disputed', disputeId: newTicketId }
          : t
      )
    );

    logAuditEvent(
      `فتح تذكرة نزاع مالي رسمي (${newTicketId})`,
      `Created dispute ticket (${newTicketId})`,
      tx.recipientAccount,
      `بشأن المعاملة ${tx.referenceNo} بمبلغ ${Math.abs(tx.amount)} ج.س`
    );
  };

  // 8. SUPPORT & COMPLAINTS: Add message to existing ticket
  const handleAddTicketMessage = (ticketId: string, text: string) => {
    setComplaints((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              messages: [
                ...ticket.messages,
                {
                  id: `msg-${Date.now()}`,
                  sender: 'user',
                  senderName: user.name,
                  text,
                  timestamp: language === 'ar' ? 'الآن' : 'Just now',
                },
              ],
            }
          : ticket
      )
    );
  };

  // 9. ADMIN: Update Dispute Ticket Status
  const handleAdminUpdateComplaint = (
    ticketId: string,
    newStatus: DisputeStatus,
    adminNote?: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === ticketId
          ? {
              ...c,
              status: newStatus,
              adminNotes: adminNote ? [...c.adminNotes, adminNote] : c.adminNotes,
            }
          : c
      )
    );
  };

  // 10. ADMIN: Toggle Account Lock / Freeze
  const handleToggleAccountLock = (accountNumber: string) => {
    if (accountNumber === user.accountNumber) {
      setUser((prev) => ({
        ...prev,
        status: prev.status === 'active' ? 'frozen' : 'active',
      }));
    }
  };

  // 11. Reset Prototype Data
  const handleResetData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setTransactions(INITIAL_TRANSACTIONS);
    setBeneficiaries(INITIAL_BENEFICIARIES);
    setRefundRequests(INITIAL_REFUND_REQUESTS);
    setComplaints(INITIAL_COMPLAINT_TICKETS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSystemSettings(INITIAL_SYSTEM_SETTINGS);
    setActiveModal(null);
    setSelectedTransaction(null);
    setSelectedRefundForReview(null);
    setSelectedTxForRefund(null);
    setSelectedTxForDispute(null);
  };

  // Find incoming pending refund requests targeted to current user
  const incomingPendingRefunds = refundRequests.filter(
    (r) => r.recipientAccount === user.accountNumber && r.status === 'pending'
  );

  const openDisputesCount = complaints.filter(
    (c) => c.status === 'open' || c.status === 'under_review' || c.status === 'waiting_user'
  ).length;

  return (
    <div className="min-h-screen bg-amber-400 text-black flex flex-col antialiased selection:bg-black selection:text-amber-400 font-sans">
      {/* Top Application Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        appView={appView}
        setAppView={setAppView}
        isDeviceMode={isDeviceMode}
        setIsDeviceMode={setIsDeviceMode}
        onResetData={handleResetData}
        onOpenSecurity={() => setActiveModal('security')}
        pendingRefundCount={incomingPendingRefunds.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 flex justify-center items-start p-2 sm:p-4">
        <div
          className={`w-full transition-all duration-300 ${
            isDeviceMode
              ? 'max-w-[420px] bg-amber-400 rounded-[44px] shadow-2xl border-[10px] border-black p-3 my-2 overflow-hidden ring-4 ring-black/20'
              : 'max-w-2xl'
          }`}
        >
          {/* VIEW ROUTING: USER APP vs. ADMIN DASHBOARD */}
          {appView === 'admin' ? (
            <AdminDashboard
              language={language}
              user={user}
              transactions={transactions}
              refundRequests={refundRequests}
              complaints={complaints}
              auditLogs={auditLogs}
              systemSettings={systemSettings}
              onUpdateComplaintStatus={handleAdminUpdateComplaint}
              onUpdateSystemSettings={(st) => setSystemSettings((prev) => ({ ...prev, ...st }))}
              onToggleAccountLock={handleToggleAccountLock}
              onAddAuditLog={(ar, en, tgt, dt) => logAuditEvent(ar, en, tgt, dt)}
              onCloseAdmin={() => setAppView('user')}
            />
          ) : (
            <>
              {/* TAB 1: HOME */}
              {currentTab === 'home' && (
                <HomeScreen
                  user={user}
                  recentTransactions={transactions}
                  pendingIncomingRefunds={incomingPendingRefunds}
                  language={language}
                  onOpenAction={(action) => {
                    if (action === 'send') setActiveModal('send');
                    else if (action === 'receive') setActiveModal('receive');
                    else if (action === 'recharge') setActiveModal('recharge');
                    else if (action === 'bills') setActiveModal('bills');
                  }}
                  onViewAllTransactions={() => setCurrentTab('transactions')}
                  onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                  onOpenRefundReview={(refReq) => setSelectedRefundForReview(refReq)}
                />
              )}

              {/* TAB 2: TRANSACTIONS HISTORY */}
              {currentTab === 'transactions' && (
                <TransactionsScreen
                  transactions={transactions}
                  language={language}
                  selectedTransaction={selectedTransaction}
                  onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                  onRequestRefund={(tx) => {
                    setSelectedTxForRefund(tx);
                    setActiveModal('refundRequest');
                  }}
                  onReportTransaction={(tx) => {
                    setSelectedTxForDispute(tx);
                    setActiveModal('reportDispute');
                  }}
                />
              )}

              {/* TAB 3: MOBILE RECHARGE */}
              {currentTab === 'recharge' && (
                <div className="space-y-4">
                  <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-2">
                    <h1 className="text-xl font-black text-black">
                      {language === 'ar' ? 'شحن الرصيد (Mobile Recharge)' : 'Mobile Recharge'}
                    </h1>
                    <p className="text-xs text-black/80 font-bold">
                      {language === 'ar' ? 'شحن فوري ومباشر لجميع شبكات الاتصالات في السودان' : 'Direct mobile airtime top-up for Sudan telecom networks'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveModal('recharge')}
                      className="mt-3 w-full h-12 rounded-2xl bg-black text-amber-400 font-black text-sm flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      {language === 'ar' ? 'بدء شحن الرصيد الآن' : 'Start Mobile Recharge Now'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: BILL PAYMENTS */}
              {currentTab === 'bills' && (
                <div className="space-y-4">
                  <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black space-y-2">
                    <h1 className="text-xl font-black text-black">
                      {language === 'ar' ? 'دفع الفواتير (Pay Bills)' : 'Pay Bills'}
                    </h1>
                    <p className="text-xs text-black/80 font-bold">
                      {language === 'ar' ? 'سداد فوري للكهرباء، المياه، إيصال 15 والخدمات الحكومية والتعليمية' : 'Pay electricity, water, E-15, and education fees'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveModal('bills')}
                      className="mt-3 w-full h-12 rounded-2xl bg-black text-amber-400 font-black text-sm flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      {language === 'ar' ? 'بدء دفع الفاتورة الآن' : 'Start Bill Payment Now'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: SUPPORT & COMPLAINTS */}
              {currentTab === 'support' && (
                <SupportDisputesView
                  complaints={complaints}
                  language={language}
                  onAddMessage={handleAddTicketMessage}
                />
              )}

              {/* TAB 6: ACCOUNT / PROFILE */}
              {currentTab === 'account' && (
                <AccountScreen
                  user={user}
                  language={language}
                  onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
                  onResetData={handleResetData}
                />
              )}

              {/* Bottom Navigation Bar */}
              <BottomNav
                currentTab={currentTab}
                setTab={(tab) => {
                  setCurrentTab(tab);
                  // Quick trigger modal if tapping recharge or bills directly from bottom nav
                  if (tab === 'recharge') setActiveModal('recharge');
                  if (tab === 'bills') setActiveModal('bills');
                }}
                language={language}
                openDisputesCount={openDisputesCount}
              />
            </>
          )}
        </div>
      </main>

      {/* CORE ACTION MODALS */}
      {/* 1. Send Money Modal */}
      {activeModal === 'send' && (
        <SendModal
          language={language}
          beneficiaries={beneficiaries}
          currentBalance={user.balance}
          onClose={() => setActiveModal(null)}
          onCompleteTransfer={handleCompleteTransfer}
          onSaveBeneficiary={(name, account, phone) => {
            setBeneficiaries((prev) => [
              ...prev,
              {
                id: `b-${Date.now()}`,
                name,
                nameEn: name,
                accountNumber: account,
                phoneNumber: phone,
                avatarColor: 'bg-black text-amber-400',
                initials: name.charAt(0),
                isFavorite: true,
              },
            ]);
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

      {/* 3. Mobile Recharge Modal */}
      {activeModal === 'recharge' && (
        <MobileRechargeModal
          language={language}
          currentBalance={user.balance}
          userPhone={user.phoneNumber}
          onClose={() => setActiveModal(null)}
          onCompleteRecharge={handleCompleteRecharge}
        />
      )}

      {/* 4. Bill Payment Modal */}
      {activeModal === 'bills' && (
        <BillPaymentModal
          language={language}
          currentBalance={user.balance}
          onClose={() => setActiveModal(null)}
          onCompleteBillPayment={handleCompleteBillPayment}
        />
      )}

      {/* 5. Wrong Transfer Recovery: Submit Refund Request */}
      {activeModal === 'refundRequest' && selectedTxForRefund && (
        <RefundRequestModal
          transaction={selectedTxForRefund}
          language={language}
          onClose={() => {
            setActiveModal(null);
            setSelectedTxForRefund(null);
          }}
          onSubmitRefundRequest={handleSubmitRefundRequest}
        />
      )}

      {/* 6. Wrong Transfer Recovery: Review Incoming Refund Request */}
      {selectedRefundForReview && (
        <ReviewIncomingRefundModal
          refundRequest={selectedRefundForReview}
          language={language}
          onClose={() => setSelectedRefundForReview(null)}
          onAcceptRefund={handleAcceptRefund}
          onDeclineRefund={handleDeclineRefund}
        />
      )}

      {/* 7. Support & Complaints: Report Transaction Modal */}
      {activeModal === 'reportDispute' && selectedTxForDispute && (
        <ReportTransactionModal
          transaction={selectedTxForDispute}
          language={language}
          onClose={() => {
            setActiveModal(null);
            setSelectedTxForDispute(null);
          }}
          onSubmitDispute={handleSubmitDispute}
        />
      )}

      {/* 8. Security Modal */}
      {activeModal === 'security' && (
        <SecurityModal
          language={language}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
