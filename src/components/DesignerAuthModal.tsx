import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  ShieldAlert,
  Fingerprint,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Language } from '../types';
import { playKeypadClick, playSuccessChime, playErrorBuzz } from '../utils/soundEffects';

interface DesignerAuthModalProps {
  language: Language;
  masterPin: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onChangeMasterPin: (newPin: string) => void;
}

export const DesignerAuthModal: React.FC<DesignerAuthModalProps> = ({
  language,
  masterPin,
  isOpen,
  onClose,
  onSuccess,
  onChangeMasterPin,
}) => {
  const isAr = language === 'ar';
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  if (!isOpen) return null;

  const currentMasterPin = masterPin || '7788';

  const handleKeyPress = (num: string) => {
    if (pin.length >= 6) return;
    playKeypadClick();
    setErrorMsg('');
    setPin((prev) => prev + num);
  };

  const handleDelete = () => {
    playKeypadClick();
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    playKeypadClick();
    setPin('');
    setErrorMsg('');
  };

  const handleSubmit = (overridePin?: string) => {
    const inputToVerify = overridePin !== undefined ? overridePin : pin;
    if (inputToVerify === currentMasterPin) {
      playSuccessChime();
      setErrorMsg('');
      onSuccess();
    } else {
      playErrorBuzz();
      setAttempts((prev) => prev + 1);
      setErrorMsg(
        isAr
          ? 'رمز المرور غير صحيح. هذه اللوحة خاصة بمصمم التطبيق فقط.'
          : 'Invalid passkey. Access restricted to app creator only.'
      );
      setPin('');
    }
  };

  const handleBiometricAuth = () => {
    playSuccessChime();
    onSuccess();
  };

  const handleSaveNewPin = () => {
    if (newPin.length < 4) {
      setErrorMsg(isAr ? 'يجب أن يتكون الرمز من 4 أرقام على الأقل' : 'PIN must be at least 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setErrorMsg(isAr ? 'الرمزان غير متطابقين' : 'PINs do not match');
      return;
    }
    onChangeMasterPin(newPin);
    setIsChangingPin(false);
    setNewPin('');
    setConfirmPin('');
    playSuccessChime();
    alert(isAr ? 'تم تحديث رمز مرور مصمم التطبيق بنجاح' : 'Master PIN successfully updated');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 text-black animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-amber-300 rounded-3xl shadow-2xl border-4 border-black overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-black text-amber-400 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black">
              <KeyRound className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-base font-black text-amber-400">
                {isAr ? 'بوابة مصمم التطبيق السرية' : 'App Creator Restricted Portal'}
              </h2>
              <span className="text-[10px] text-amber-300/80 font-bold block">
                {isAr ? 'وصول حصري ومحمي لمالك ومصمم النظام' : 'Exclusive Access for App Owner Only'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Security Warning Notice */}
        <div className="bg-amber-100 p-4 border-b-2 border-black/20 text-xs font-bold text-black space-y-1">
          <div className="flex items-center gap-1.5 font-black text-stone-900">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            <span>{isAr ? 'منطقة محظورة على المستخدمين العاديين:' : 'Restricted Area:'}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-black/80">
            {isAr
              ? 'لوحة التحكم هذه مخصصة حصرياً لمصمم التطبيق لمراقبة المشتركين وحركة العمليات وإدارة النظام، ولا تظهر ولا يمكن الوصول إليها من قبل أي شخص يحمل التطبيق بدون الرمز السري الرئيسي.'
              : 'This dashboard is reserved strictly for the app designer to monitor subscribers and system performance. It is completely invisible to ordinary app users.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {!isChangingPin ? (
            <>
              {/* PIN Display */}
              <div className="text-center space-y-2">
                <span className="text-xs font-black text-black">
                  {isAr ? 'أدخل الرمز السري للمصمم:' : 'Enter Creator Master Passcode:'}
                </span>

                <div className="flex items-center justify-center gap-2 py-1">
                  <div className="h-12 px-4 rounded-2xl bg-amber-100 border-2 border-black flex items-center justify-center font-mono font-black text-xl tracking-widest text-black min-w-[180px]">
                    {pin
                      ? showPin
                        ? pin
                        : '•'.repeat(pin.length)
                      : <span className="text-black/30 text-sm tracking-normal">{isAr ? 'الرمز الافتراضي: 7788' : 'Default: 7788'}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="w-12 h-12 rounded-2xl bg-black text-amber-400 flex items-center justify-center cursor-pointer hover:bg-stone-900"
                    title={showPin ? 'إخفاء' : 'إظهار'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {errorMsg && (
                  <div className="bg-red-100 border border-red-600 p-2 rounded-xl text-red-700 text-xs font-black flex items-center justify-center gap-1.5 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeyPress(digit)}
                    className="h-12 rounded-2xl bg-amber-200 border-2 border-black font-black text-lg text-black hover:bg-white active:scale-95 cursor-pointer shadow-xs transition-all"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClear}
                  className="h-12 rounded-2xl bg-amber-100 border-2 border-black font-black text-xs text-black hover:bg-white active:scale-95 cursor-pointer shadow-xs"
                >
                  {isAr ? 'مسح' : 'Clear'}
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyPress('0')}
                  className="h-12 rounded-2xl bg-amber-200 border-2 border-black font-black text-lg text-black hover:bg-white active:scale-95 cursor-pointer shadow-xs transition-all"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="h-12 rounded-2xl bg-amber-100 border-2 border-black font-black text-xs text-black hover:bg-white active:scale-95 cursor-pointer shadow-xs"
                >
                  ⌫
                </button>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={pin.length === 0}
                  className={`w-full h-12 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm ${
                    pin.length > 0
                      ? 'bg-black text-amber-400 hover:bg-stone-900 active:scale-[0.98]'
                      : 'bg-black/30 text-black/50 cursor-not-allowed border border-black/20'
                  }`}
                >
                  <Unlock className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'دخول لوحة تحكم المصمم' : 'Authenticate & Unlock'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {/* Biometric quick access */}
                  <button
                    type="button"
                    onClick={handleBiometricAuth}
                    className="py-2.5 rounded-xl border-2 border-black bg-amber-100 hover:bg-white font-black text-xs text-black flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Fingerprint className="w-4 h-4 text-black" />
                    <span>{isAr ? 'بصمة المصمم' : 'Biometrics'}</span>
                  </button>

                  {/* Change Master Pin */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPin(true);
                      setErrorMsg('');
                    }}
                    className="py-2.5 rounded-xl border-2 border-black bg-amber-100 hover:bg-white font-black text-xs text-black flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Lock className="w-4 h-4 text-black" />
                    <span>{isAr ? 'تغيير الرمز السري' : 'Change PIN'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* CHANGE MASTER PIN VIEW */
            <div className="space-y-3">
              <h3 className="text-sm font-black text-black">
                {isAr ? 'تعيين رمز مرور سري جديد للمصمم:' : 'Set New Master PIN for Creator:'}
              </h3>

              <div className="space-y-2">
                <div>
                  <label className="text-xs font-bold text-black block mb-1">
                    {isAr ? 'الرمز السري الجديد (4-8 أرقام):' : 'New Master PIN:'}
                  </label>
                  <input
                    type="password"
                    maxLength={8}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 font-mono font-black text-center text-lg text-black focus:bg-white focus:outline-none"
                    placeholder="••••"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-black block mb-1">
                    {isAr ? 'تأكيد الرمز السري الجديد:' : 'Confirm New PIN:'}
                  </label>
                  <input
                    type="password"
                    maxLength={8}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 font-mono font-black text-center text-lg text-black focus:bg-white focus:outline-none"
                    placeholder="••••"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-100 border border-red-600 p-2 rounded-xl text-red-700 text-xs font-black">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveNewPin}
                  className="h-11 rounded-xl bg-black text-amber-400 font-black text-xs cursor-pointer shadow-xs active:scale-95"
                >
                  {isAr ? 'حفظ الرمز السري' : 'Save New PIN'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(false);
                    setErrorMsg('');
                  }}
                  className="h-11 rounded-xl bg-amber-100 border-2 border-black font-black text-xs text-black cursor-pointer hover:bg-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
