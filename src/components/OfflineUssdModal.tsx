import React, { useState } from 'react';
import { X, SignalZero, CheckCircle2, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { playKeypadClick } from '../utils/soundEffects';

interface OfflineUssdModalProps {
  language: Language;
  balance: number;
  onClose: () => void;
}

export const OfflineUssdModal: React.FC<OfflineUssdModalProps> = ({ language, balance, onClose }) => {
  const isAr = language === 'ar';

  const [inputVal, setInputVal] = useState('');
  const [ussdStage, setUssdStage] = useState<'main' | 'balance' | 'transfer_phone' | 'transfer_amount' | 'transfer_done' | 'cash_out'>('main');
  const [targetPhone, setTargetPhone] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const handleSendInput = (choice?: string) => {
    playKeypadClick();
    const val = choice !== undefined ? choice : inputVal.trim();
    setInputVal('');

    if (ussdStage === 'main') {
      if (val === '1') {
        setUssdStage('balance');
      } else if (val === '2') {
        setUssdStage('transfer_phone');
      } else if (val === '3') {
        setUssdStage('cash_out');
      }
    } else if (ussdStage === 'transfer_phone') {
      setTargetPhone(val || '0912345678');
      setUssdStage('transfer_amount');
    } else if (ussdStage === 'transfer_amount') {
      setTransferAmount(val || '10000');
      setUssdStage('transfer_done');
    }
  };

  const handleReset = () => {
    setUssdStage('main');
    setInputVal('');
    setTargetPhone('');
    setTransferAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-black">
      <div className="w-full max-w-sm bg-amber-300 rounded-3xl border-2 border-black shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-5 py-4 border-b-2 border-black/20 flex items-center justify-between bg-amber-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-amber-400 flex items-center justify-center font-black">
              <SignalZero className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-black">
                {isAr ? 'محاكي الـ USSD (بدون إنترنت)' : 'USSD Offline Simulator'}
              </h2>
              <span className="text-[10px] text-black font-mono font-black">
                *789# (قناة مصرفية بديلة)
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

        {/* Informational Presentation Banner */}
        <div className="bg-amber-200/90 px-4 py-3 border-b-2 border-black/20 text-xs text-black">
          <span className="font-black text-black block mb-0.5">
            {isAr ? 'لا يوجد إنترنت؟' : 'No Internet Connection?'}
          </span>
          <p className="text-[11px] text-black/85 leading-relaxed font-bold">
            {isAr
              ? 'يمكن استخدام القنوات البديلة المتاحة من المؤسسة المالية عبر كود USSD السريع لإنجاز التحويلات حتى على الهواتف العادية بأمان.'
              : 'Alternative financial channels (USSD) allow users to perform core operations even during full internet outages or on basic feature phones.'}
          </p>
        </div>

        {/* Feature Phone LCD Screen Container */}
        <div className="p-5 flex-1 space-y-4">
          <div className="bg-black border-2 border-black rounded-2xl p-4 font-mono text-xs text-amber-400 shadow-inner relative">
            <div className="flex items-center justify-between text-[10px] text-amber-300/70 border-b border-stone-800 pb-1.5 mb-2.5">
              <span>SAHEL USSD MENU</span>
              <span>*789#</span>
            </div>

            {/* Stage: Main Menu */}
            {ussdStage === 'main' && (
              <div className="space-y-1.5 text-amber-300">
                <p className="font-black text-amber-400 mb-2">
                  {isAr ? 'خدمة ساهل السريعة:' : 'SAHEL Quick Financial Service:'}
                </p>
                <p>1. {isAr ? 'استعلام عن الرصيد' : 'Check Account Balance'}</p>
                <p>2. {isAr ? 'تحويل فوري لرقم موبايل' : 'Quick Money Transfer'}</p>
                <p>3. {isAr ? 'إصدار كود سحب كاش صراف' : 'ATM Cash Out Code'}</p>
                <p>4. {isAr ? 'شراء كهرباء ورصيد' : 'Electricity & Airtime'}</p>
                <p className="text-[10px] text-amber-200/80 pt-2 font-bold">
                  {isAr ? 'اختر رقماً واضغط إرسال' : 'Choose number & send'}
                </p>
              </div>
            )}

            {/* Stage: Balance */}
            {ussdStage === 'balance' && (
              <div className="space-y-2 text-amber-300">
                <p className="font-black text-amber-400">
                  {isAr ? 'نتيجة الاستعلام:' : 'Account Balance:'}
                </p>
                <p className="text-base font-black text-amber-400">
                  {balance.toLocaleString('en-US')} {isAr ? 'جنيه سوداني' : 'SDG'}
                </p>
                <p className="text-[10px] text-amber-200/80 font-bold">
                  {isAr ? 'الحساب: SH-882194 (نشط)' : 'Account: SH-882194 (Active)'}
                </p>
              </div>
            )}

            {/* Stage: Transfer Phone */}
            {ussdStage === 'transfer_phone' && (
              <div className="space-y-2 text-amber-300">
                <p className="font-black text-amber-400">
                  {isAr ? 'أدخل رقم موبايل المستلم:' : "Enter Recipient's Mobile:"}
                </p>
                <p className="text-xs text-amber-200/80 font-mono font-bold">(09XXXXXXXX / 01XXXXXXXX)</p>
              </div>
            )}

            {/* Stage: Transfer Amount */}
            {ussdStage === 'transfer_amount' && (
              <div className="space-y-2 text-amber-300">
                <p className="font-black text-amber-400">
                  {isAr ? `المستلم: ${targetPhone}` : `Recipient: ${targetPhone}`}
                </p>
                <p>{isAr ? 'أدخل المبلغ بالجنيه السوداني:' : 'Enter amount in SDG:'}</p>
              </div>
            )}

            {/* Stage: Transfer Done */}
            {ussdStage === 'transfer_done' && (
              <div className="space-y-2 text-amber-300">
                <div className="flex items-center gap-1.5 text-amber-400 font-black">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'تم التحويل بنجاح!' : 'Transfer Successful!'}</span>
                </div>
                <p>
                  {isAr ? `تم إرسال ${transferAmount || '10,000'} جنيه إلى ${targetPhone}` : `Sent ${transferAmount || '10,000'} SDG to ${targetPhone}`}
                </p>
                <p className="text-[10px] text-amber-200/80 font-bold">
                  {isAr ? 'رقم الإشعار: USSD-91823' : 'Ref: USSD-91823'}
                </p>
              </div>
            )}

            {/* Stage: Cash Out */}
            {ussdStage === 'cash_out' && (
              <div className="space-y-2 text-amber-300">
                <p className="font-black text-amber-400">
                  {isAr ? 'كود السحب السريع للصراف:' : 'ATM Cash Out Code:'}
                </p>
                <p className="text-xl font-bold tracking-widest text-amber-400">
                  482 109
                </p>
                <p className="text-[10px] text-amber-200/80 font-bold">
                  {isAr ? 'صالح لمدة 15 دقيقة في أي صراف آلي' : 'Valid 15 mins at any ATM'}
                </p>
              </div>
            )}
          </div>

          {/* Quick interactive buttons to make presentation instant */}
          {ussdStage === 'main' ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSendInput('1')}
                className="py-2.5 px-3 rounded-xl bg-black hover:bg-stone-900 border-2 border-black text-xs font-black text-amber-400 transition-colors cursor-pointer text-center shadow-xs"
              >
                1. {isAr ? 'معرفة الرصيد' : 'Check Balance'}
              </button>
              <button
                type="button"
                onClick={() => handleSendInput('2')}
                className="py-2.5 px-3 rounded-xl bg-black hover:bg-stone-900 border-2 border-black text-xs font-black text-amber-400 transition-colors cursor-pointer text-center shadow-xs"
              >
                2. {isAr ? 'إرسال حوالة' : 'Send Money'}
              </button>
              <button
                type="button"
                onClick={() => handleSendInput('3')}
                className="py-2.5 px-3 rounded-xl bg-black hover:bg-stone-900 border-2 border-black text-xs font-black text-amber-400 transition-colors cursor-pointer text-center shadow-xs"
              >
                3. {isAr ? 'كود سحب صراف' : 'ATM Code'}
              </button>
              <button
                type="button"
                onClick={() => handleSendInput('4')}
                className="py-2.5 px-3 rounded-xl bg-black hover:bg-stone-900 border-2 border-black text-xs font-black text-amber-400 transition-colors cursor-pointer text-center shadow-xs"
              >
                4. {isAr ? 'شراء كهرباء' : 'Electricity'}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {ussdStage === 'transfer_phone' || ussdStage === 'transfer_amount' ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    dir="ltr"
                    placeholder={ussdStage === 'transfer_phone' ? '0912345678' : '50000'}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="flex-1 h-11 px-3 rounded-xl bg-amber-100 border-2 border-black text-black font-mono font-black text-sm focus:outline-none focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendInput()}
                    className="px-4 h-11 rounded-xl bg-black text-amber-400 font-black text-xs cursor-pointer shadow-xs"
                  >
                    {isAr ? 'إرسال' : 'Send'}
                  </button>
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl border-2 border-black bg-amber-200 hover:bg-amber-100 text-black font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-black" />
                <span>{isAr ? 'الرجوع للقائمة الرئيسية' : 'Back to Main Menu'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
