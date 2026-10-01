import React, { useState } from 'react';
import {
  ShieldAlert,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  Mail,
  Send,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';
import { ComplaintTicket, DisputeStatus, Language } from '../types';

interface SupportDisputesViewProps {
  complaints: ComplaintTicket[];
  language: Language;
  onAddMessage: (ticketId: string, text: string) => void;
}

export const SupportDisputesView: React.FC<SupportDisputesViewProps> = ({
  complaints,
  language,
  onAddMessage,
}) => {
  const isAr = language === 'ar';
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;
  const [selectedTicket, setSelectedTicket] = useState<ComplaintTicket | null>(
    complaints.length > 0 ? complaints[0] : null
  );
  const [replyText, setReplyText] = useState('');

  const getStatusBadge = (status: DisputeStatus) => {
    switch (status) {
      case 'open':
        return {
          label: isAr ? 'مفتوحة (Open)' : 'Open',
          color: 'bg-amber-200 text-black border border-black',
        };
      case 'under_review':
        return {
          label: isAr ? 'قيد المراجعة (Under Review)' : 'Under Review',
          color: 'bg-black text-amber-400',
        };
      case 'waiting_user':
        return {
          label: isAr ? 'بانتظار ردك (Waiting for User)' : 'Waiting for User',
          color: 'bg-amber-400 text-black border border-black',
        };
      case 'resolved':
        return {
          label: isAr ? 'تم الحل (Resolved)' : 'Resolved',
          color: 'bg-green-700 text-white',
        };
      case 'closed':
        return {
          label: isAr ? 'مغلقة (Closed)' : 'Closed',
          color: 'bg-stone-400 text-white',
        };
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    onAddMessage(selectedTicket.id, replyText);
    setReplyText('');
  };

  return (
    <div className="space-y-4 pb-20 text-black">
      {/* Page Title */}
      <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm space-y-2">
        <h1 className="text-xl font-black text-black">
          {isAr ? 'الدعم الفني والشكاوى (Support & Disputes)' : 'Support & Complaints'}
        </h1>
        <p className="text-xs text-black/80 font-bold leading-relaxed">
          {isAr
            ? 'نظام النزاعات والشكاوى المعتمد لمتابعة التحويلات الخاطئة والتواصل المباشر مع إدارة ساهل.'
            : 'Official dispute management and direct compliance communication portal.'}
        </p>
      </div>

      {/* Official Contact Channels */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-amber-200/90 p-3.5 rounded-2xl border-2 border-black flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] text-black/80 font-bold block">{isAr ? 'مركز الاتصال الموحد:' : 'Hotline:'}</span>
            <span className="text-xs font-mono font-black text-black">4499 / +249</span>
          </div>
        </div>

        <div className="bg-amber-200/90 p-3.5 rounded-2xl border-2 border-black flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] text-black/80 font-bold block">{isAr ? 'البريد الرسمي:' : 'Official Email:'}</span>
            <span className="text-[11px] font-mono font-black text-black truncate block max-w-[120px]">
              support@sahel.sd
            </span>
          </div>
        </div>
      </div>

      {/* Complaints List & Details */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-black px-1 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-black" />
          {isAr ? 'تذاكر النزاعات والشكاوى المسجلة:' : 'Registered Dispute Tickets:'}
        </h2>

        {complaints.length === 0 ? (
          <div className="bg-amber-200/90 rounded-3xl p-8 border-2 border-black text-center text-xs font-bold text-black/70">
            <CheckCircle2 className="w-10 h-10 text-black/40 mx-auto mb-2" />
            <p>{isAr ? 'لا توجد شكاوى أو نزاعات مسجلة حالياً.' : 'No active complaints or disputes recorded.'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {complaints.map((ticket) => {
              const statusInfo = getStatusBadge(ticket.status);
              const isSelected = selectedTicket?.id === ticket.id;

              return (
                <div
                  key={ticket.id}
                  className={`bg-amber-200 rounded-3xl p-4 border-2 transition-all ${
                    isSelected ? 'border-black shadow-sm' : 'border-black/30'
                  }`}
                >
                  <div
                    onClick={() => setSelectedTicket(isSelected ? null : ticket)}
                    className="flex items-start justify-between gap-2 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-xs text-black bg-amber-100 px-2 py-0.5 rounded border border-black/30">
                          {ticket.id}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-black mt-1 line-clamp-1">
                        {ticket.reason}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-black/70 font-semibold mt-1">
                        <span>{ticket.date}</span>
                        <span>·</span>
                        <span className="font-black text-black">{ticket.amount.toLocaleString('en-US')} ج.س</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded-lg hover:bg-black/10 text-black"
                    >
                      <ChevronIcon className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  {/* Expanded Conversation Thread */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t-2 border-black/15 space-y-3 animate-in fade-in">
                      <div className="bg-amber-100 p-3 rounded-2xl border border-black/20 text-xs space-y-1">
                        <div className="flex justify-between font-mono">
                          <span className="text-black/70 font-bold">{isAr ? 'رقم المعاملة:' : 'Transaction ID:'}</span>
                          <span className="font-black text-black">{ticket.referenceNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black/70 font-bold">{isAr ? 'الطرف المستلم:' : 'Recipient:'}</span>
                          <span className="font-bold text-black">{ticket.recipientName} ({ticket.recipientAccount})</span>
                        </div>
                      </div>

                      {/* Messages Feed */}
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {ticket.messages.map((msg) => {
                          const isSupport = msg.sender === 'support';
                          return (
                            <div
                              key={msg.id}
                              className={`p-3 rounded-2xl text-xs space-y-1 ${
                                isSupport
                                  ? 'bg-black text-amber-400 ms-4 border border-black'
                                  : 'bg-amber-100 text-black me-4 border border-black/30'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] font-bold opacity-80">
                                <span>{msg.senderName}</span>
                                <span>{msg.timestamp}</span>
                              </div>
                              <p className="font-semibold leading-relaxed">{msg.text}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Reply Input */}
                      {ticket.status !== 'closed' && (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                            placeholder={isAr ? 'اكتب رداً أو إفادة للمشرف...' : 'Type a response...'}
                            className="flex-1 h-11 px-3 rounded-xl border-2 border-black bg-amber-100 text-xs font-bold text-black focus:outline-none focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={handleSendReply}
                            className="h-11 px-4 rounded-xl bg-black text-amber-400 font-black text-xs cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
