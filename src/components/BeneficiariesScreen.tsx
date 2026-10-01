import React, { useState } from 'react';
import {
  Plus,
  Search,
  Star,
  Send,
  X,
  BookmarkPlus,
} from 'lucide-react';
import { Beneficiary, Language } from '../types';

interface BeneficiariesScreenProps {
  beneficiaries: Beneficiary[];
  language: Language;
  onSendToBeneficiary: (beneficiary: Beneficiary) => void;
  onAddBeneficiary: (b: Beneficiary) => void;
}

export const BeneficiariesScreen: React.FC<BeneficiariesScreenProps> = ({
  beneficiaries,
  language,
  onSendToBeneficiary,
  onAddBeneficiary,
}) => {
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New beneficiary form fields
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAccount, setNewAccount] = useState('');
  const [newRelationship, setNewRelationship] = useState('');

  const filteredBeneficiaries = beneficiaries.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.nameEn.toLowerCase().includes(q) ||
      b.phoneNumber.includes(q) ||
      (b.nickname && b.nickname.toLowerCase().includes(q))
    );
  });

  const handleCreateBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const newB: Beneficiary = {
      id: `b-${Date.now()}`,
      name: newName.trim(),
      nameEn: newName.trim(),
      phoneNumber: newPhone.trim(),
      accountNumber: newAccount.trim() || `SH-${Math.floor(100000 + Math.random() * 900000)}`,
      avatarColor: 'bg-black text-amber-400',
      initials: newName.trim().charAt(0),
      isFavorite: true,
      relationship: newRelationship.trim() || (isAr ? 'مستفيد محفوظ' : 'Saved Contact'),
    };

    onAddBeneficiary(newB);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewAccount('');
    setNewRelationship('');
  };

  return (
    <div className="space-y-4 pb-20 text-black">
      {/* Header and Add Button */}
      <div className="bg-amber-300 rounded-3xl p-5 border-2 border-black shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-black">
              {isAr ? 'المستفيدون والمفضلة' : 'Beneficiaries & Favorites'}
            </h1>
            <p className="text-xs text-black/80 font-bold">
              {isAr ? 'تحويل سريع بضغطة زر واحدة لأهلك وأصدقائك' : '1-tap quick transfers to family & frequent contacts'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black hover:bg-stone-900 text-amber-400 font-black text-xs transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'إضافة جديد' : 'Add New'}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder={isAr ? 'ابحث عن مستفيد بالاسم أو الرقم...' : 'Search by name or mobile...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 ps-9 pe-4 rounded-xl border-2 border-black bg-amber-200 text-xs font-bold text-black placeholder:text-black/60 focus:bg-amber-100 focus:outline-none"
          />
          <Search className="w-4 h-4 text-black absolute top-3.5 start-3" />
        </div>
      </div>

      {/* List */}
      <div className="bg-amber-300 rounded-3xl p-4 border-2 border-black shadow-sm space-y-2">
        {filteredBeneficiaries.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-black/30 hover:border-black bg-amber-200/80 hover:bg-amber-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl bg-black text-amber-400 flex items-center justify-center font-black text-base shadow-sm border border-black shrink-0"
              >
                {b.initials}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-black">
                    {isAr ? b.name : b.nameEn}
                  </h3>
                  {b.isFavorite && (
                    <Star className="w-3.5 h-3.5 fill-black text-black" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-black/80 font-bold mt-0.5">
                  <span className="font-mono">{b.phoneNumber}</span>
                  <span>·</span>
                  <span>{b.relationship}</span>
                </div>
              </div>
            </div>

            {/* Quick 1-Tap Transfer CTA */}
            <button
              type="button"
              onClick={() => onSendToBeneficiary(b)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black hover:bg-stone-900 text-amber-400 font-black text-xs transition-colors cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'إرسال' : 'Send'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* ADD BENEFICIARY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-black">
          <div className="w-full sm:max-w-md bg-amber-300 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-4 border-2 border-black">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black/20">
              <div className="flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-black" />
                <h3 className="text-base font-black text-black">
                  {isAr ? 'إضافة مستفيد جديد' : 'Add New Beneficiary'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            <form onSubmit={handleCreateBeneficiary} className="space-y-3">
              <div>
                <label className="text-xs font-black text-black block mb-1">
                  {isAr ? 'الاسم أو اللقب' : 'Name or Nickname'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: محمد ود الخالة' : 'e.g., Mohammed Friend'}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 font-bold text-sm text-black focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-black text-black block mb-1">
                  {isAr ? 'رقم الموبايل (سوداني)' : 'Sudanese Mobile'}
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  required
                  placeholder="09XXXXXXXX"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 font-mono font-black text-sm text-black focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-black/90 block mb-1">
                  {isAr ? 'رقم حساب ساهل (اختياري)' : 'Sahel Account ID (Optional)'}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="SH-XXXXXX"
                  value={newAccount}
                  onChange={(e) => setNewAccount(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 font-mono font-bold text-xs text-black focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-black/90 block mb-1">
                  {isAr ? 'صلة القرابة أو الوصف' : 'Relationship / Tag'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: زميل عمل / عائلة' : 'e.g., Colleague / Family'}
                  value={newRelationship}
                  onChange={(e) => setNewRelationship(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border-2 border-black bg-amber-100 font-bold text-xs text-black focus:outline-none focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 h-12 rounded-xl bg-black hover:bg-stone-900 text-amber-400 font-black text-xs transition-colors cursor-pointer shadow-sm active:scale-95"
                >
                  {isAr ? 'حفظ في المفضلة' : 'Save Beneficiary'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 h-12 rounded-xl border-2 border-black text-black text-xs font-black hover:bg-black/10 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
