import React, { useState } from 'react';
import { X, Copy, Check, Share2, FileText } from 'lucide-react';
import { Language, UserAccount } from '../types';

interface ReceiveModalProps {
  user: UserAccount;
  language: Language;
  onClose: () => void;
}

export const ReceiveModal: React.FC<ReceiveModalProps> = ({ user, language, onClose }) => {
  const isAr = language === 'ar';

  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Request amount state
  const [isRequestingAmount, setIsRequestingAmount] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState('');
  const [requestNote, setRequestNote] = useState('');

  const copyToClipboard = (text: string, type: 'phone' | 'account' | 'link') => {
    navigator.clipboard?.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else if (type === 'account') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const numericReqAmount = parseInt(requestedAmount || '0', 10);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black">
      <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border-2 border-black">
        {/* Header */}
        <div className="px-5 py-4 border-b-2 border-black/20 flex items-center justify-between bg-amber-300 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black text-sm">
              2
            </div>
            <div>
              <h2 className="text-base font-black text-black">
                {isAr ? 'استلام الأموال' : 'Receive Money'}
              </h2>
              <span className="text-[11px] text-black/80 font-bold block -mt-0.5">
                {isAr ? 'رمزي لاستلام الأموال وطلب مبالغ' : 'My QR code & payment request'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* QR Code Container */}
          <div className="bg-amber-200/90 rounded-3xl p-5 border-2 border-black text-center flex flex-col items-center">
            <span className="text-xs font-black text-black mb-2">
              {isAr ? 'رمزي لاستلام الأموال' : 'My QR Code for Receiving Money'}
            </span>

            {/* Generated Sahel QR Code SVG */}
            <div className="p-4 bg-white rounded-2xl border-2 border-black shadow-sm relative">
              <svg
                viewBox="0 0 200 200"
                className="w-48 h-48 sm:w-52 sm:h-52 mx-auto"
                shapeRendering="crispEdges"
              >
                {/* Background */}
                <rect width="200" height="200" fill="#ffffff" />

                {/* Corner Finder 1 (Top-Left) */}
                <rect x="15" y="15" width="45" height="45" fill="#000000" />
                <rect x="22" y="22" width="31" height="31" fill="#ffffff" />
                <rect x="29" y="29" width="17" height="17" fill="#000000" />

                {/* Corner Finder 2 (Top-Right) */}
                <rect x="140" y="15" width="45" height="45" fill="#000000" />
                <rect x="147" y="22" width="31" height="31" fill="#ffffff" />
                <rect x="154" y="29" width="17" height="17" fill="#000000" />

                {/* Corner Finder 3 (Bottom-Left) */}
                <rect x="15" y="140" width="45" height="45" fill="#000000" />
                <rect x="22" y="22" width="31" height="31" fill="#ffffff" />
                <rect x="29" y="154" width="17" height="17" fill="#000000" />

                {/* Data Matrix Dots Pattern */}
                <rect x="70" y="20" width="10" height="10" fill="#000000" />
                <rect x="90" y="20" width="10" height="10" fill="#000000" />
                <rect x="110" y="20" width="10" height="10" fill="#000000" />
                <rect x="80" y="35" width="10" height="10" fill="#000000" />
                <rect x="100" y="35" width="10" height="10" fill="#000000" />
                <rect x="120" y="35" width="10" height="10" fill="#000000" />

                <rect x="20" y="70" width="10" height="10" fill="#000000" />
                <rect x="20" y="90" width="10" height="10" fill="#000000" />
                <rect x="20" y="110" width="10" height="10" fill="#000000" />
                <rect x="35" y="80" width="10" height="10" fill="#000000" />
                <rect x="35" y="100" width="10" height="10" fill="#000000" />
                <rect x="35" y="120" width="10" height="10" fill="#000000" />

                <rect x="70" y="70" width="12" height="12" fill="#000000" />
                <rect x="120" y="70" width="12" height="12" fill="#000000" />
                <rect x="70" y="120" width="12" height="12" fill="#000000" />
                <rect x="120" y="120" width="12" height="12" fill="#000000" />

                <rect x="145" y="75" width="10" height="10" fill="#000000" />
                <rect x="165" y="85" width="10" height="10" fill="#000000" />
                <rect x="150" y="105" width="10" height="10" fill="#000000" />
                <rect x="170" y="115" width="10" height="10" fill="#000000" />

                <rect x="75" y="145" width="10" height="10" fill="#000000" />
                <rect x="95" y="155" width="10" height="10" fill="#000000" />
                <rect x="115" y="145" width="10" height="10" fill="#000000" />
                <rect x="145" y="155" width="10" height="10" fill="#000000" />
                <rect x="165" y="145" width="10" height="10" fill="#000000" />

                {/* Sahel Center Emblem */}
                <rect x="80" y="80" width="40" height="40" rx="8" fill="#F59E0B" />
                <text
                  x="100"
                  y="106"
                  textAnchor="middle"
                  fontSize="22"
                  fontWeight="900"
                  fill="#000000"
                  fontFamily="'Cairo', sans-serif"
                >
                  س
                </text>
              </svg>

              {/* If specific amount is requested */}
              {numericReqAmount > 0 && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black border-2 border-black text-amber-400 px-3 py-0.5 rounded-full text-xs font-black whitespace-nowrap shadow-xs">
                  {numericReqAmount.toLocaleString('en-US')} {isAr ? 'جنيه' : 'SDG'}
                </div>
              )}
            </div>

            <p className="text-xs font-black text-black mt-4">
              {isAr ? user.name : user.nameEn}
            </p>
            <p className="text-[11px] text-black/80 font-bold">
              {isAr ? 'امسح الرمز عبر أي تطبيق ساهل لتحويل فوري' : 'Scan via any Sahel app for instant transfer'}
            </p>
          </div>

          {/* Account Identifiers (Phone & Account ID with Copy) */}
          <div className="space-y-2">
            {/* Phone Number */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-200/90 border-2 border-black">
              <div>
                <span className="text-[11px] text-black/80 font-bold block">
                  {isAr ? 'رقم الموبايل المسجل' : 'Registered Phone Number'}
                </span>
                <span className="text-sm font-mono font-black text-black" dir="ltr">
                  {user.phoneNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(user.phoneNumber, 'phone')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black text-amber-400 font-black text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                {copiedPhone ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'نسخ' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Account Identifier */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-200/90 border-2 border-black">
              <div>
                <span className="text-[11px] text-black/80 font-bold block">
                  {isAr ? 'معرف حساب ساهل' : 'Sahel Account Identifier'}
                </span>
                <span className="text-sm font-mono font-black text-black" dir="ltr">
                  {user.accountNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(user.accountNumber, 'account')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black text-amber-400 font-black text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
              >
                {copiedAccount ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'نسخ' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* REQUEST MONEY (طلب مبلغ) */}
          <div className="border-2 border-black rounded-2xl p-4 bg-amber-200/90">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-black" />
                <h3 className="text-xs font-black text-black">
                  {isAr ? 'طلب مبلغ محدد' : 'Request Specific Amount'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestingAmount(!isRequestingAmount)}
                className="text-xs text-black underline font-black cursor-pointer"
              >
                {isRequestingAmount ? (isAr ? 'إلغاء' : 'Cancel') : (isAr ? 'تحديد مبلغ' : 'Set Amount')}
              </button>
            </div>

            {isRequestingAmount && (
              <div className="mt-3 pt-3 border-t-2 border-black/20 space-y-2.5">
                <div>
                  <label className="text-[11px] font-black text-black block mb-1">
                    {isAr ? 'المبلغ المطلوب (جنيه سوداني)' : 'Requested Amount (SDG)'}
                  </label>
                  <input
                    type="number"
                    dir="ltr"
                    placeholder="25000"
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 font-black text-sm text-black focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-black/90 block mb-1">
                    {isAr ? 'سبب الطلب (اختياري)' : 'Purpose (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? 'مثال: حساب فطور / قطة المشوار' : 'e.g., Breakfast split / Shared ride'}
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border-2 border-black bg-amber-100 font-bold text-xs text-black focus:outline-none focus:bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Share Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => copyToClipboard(`https://sahel.sd/pay/${user.accountNumber}?amount=${requestedAmount}`, 'link')}
              className="h-12 rounded-xl border-2 border-black bg-amber-200 hover:bg-amber-100 text-black font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              {copiedLink ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
              <span>{copiedLink ? (isAr ? 'تم نسخ الرابط' : 'Link Copied') : (isAr ? 'نسخ رابط الدفع' : 'Copy Pay Link')}</span>
            </button>

            <button
              type="button"
              onClick={() => alert(isAr ? 'تم تجهيز بطاقة الرمز للمشاركة عبر واتساب والرسائل' : 'QR card ready for WhatsApp & SMS sharing')}
              className="h-12 rounded-xl bg-black hover:bg-stone-900 text-amber-400 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'مشاركة الرمز' : 'Share QR Card'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
