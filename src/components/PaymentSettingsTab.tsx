import React, { useState } from 'react';
import { PaymentMethodItem, PaymentMethodType, BusinessProfile } from '../types';
import { 
  Plus, Edit, Trash2, Smartphone, Building2, Hash, Send, 
  Check, X, AlertCircle, Eye, EyeOff, ShieldCheck, Copy, 
  HelpCircle, CheckCircle2, ArrowRight
} from 'lucide-react';

interface PaymentSettingsTabProps {
  businessProfile: BusinessProfile;
  onUpdateBusinessProfile: (profile: BusinessProfile) => void;
  showToast: (message: string, type?: 'success' | 'info') => void;
}

export const PaymentSettingsTab: React.FC<PaymentSettingsTabProps> = ({
  businessProfile,
  onUpdateBusinessProfile,
  showToast,
}) => {
  const paymentMethods: PaymentMethodItem[] = businessProfile.paymentMethods || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethodItem | null>(null);

  // Form State
  const [formType, setFormType] = useState<PaymentMethodType>('send_money');
  const [formName, setFormName] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formPhoneNumber, setFormPhoneNumber] = useState('');
  const [formRecipientName, setFormRecipientName] = useState('');
  const [formPaybillNumber, setFormPaybillNumber] = useState('');
  const [formAccountNumber, setFormAccountNumber] = useState('');
  const [formAccountName, setFormAccountName] = useState('');
  const [formTillNumber, setFormTillNumber] = useState('');
  const [formTillName, setFormTillName] = useState('');
  const [formBankName, setFormBankName] = useState('');
  const [formBankAccountName, setFormBankAccountName] = useState('');
  const [formBankAccountNumber, setFormBankAccountNumber] = useState('');
  const [formBranchName, setFormBranchName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Handle Toggle Active/Inactive directly
  const handleToggleActive = (id: string) => {
    const updated = paymentMethods.map((pm) =>
      pm.id === id ? { ...pm, isActive: !pm.isActive } : pm
    );
    const target = updated.find((pm) => pm.id === id);
    onUpdateBusinessProfile({
      ...businessProfile,
      paymentMethods: updated,
    });
    showToast(
      target?.isActive
        ? `Enabled "${target.name}" for customer checkout!`
        : `Disabled "${target?.name}" from customer checkout.`
    );
  };

  // Open Modal to Add
  const handleOpenAdd = () => {
    setEditingMethod(null);
    setFormType('send_money');
    setFormName('M-Pesa Send Money');
    setFormIsActive(true);
    setFormPhoneNumber(businessProfile.phones[0] || '0728090599');
    setFormRecipientName(businessProfile.name);
    setFormPaybillNumber(businessProfile.paybillNumber || '247247');
    setFormAccountNumber(businessProfile.phones[0] || '0728090599');
    setFormAccountName(businessProfile.name);
    setFormTillNumber(businessProfile.tillNumber || '5428901');
    setFormTillName(businessProfile.name);
    setFormBankName('KCB Bank Kenya');
    setFormBankAccountName(`${businessProfile.name} Limited`);
    setFormBankAccountNumber('1289405821');
    setFormBranchName('Kipande House Branch');
    setFormDescription('Direct Safaricom M-Pesa transfer to merchant number');
    setIsModalOpen(true);
  };

  // Open Modal to Edit
  const handleOpenEdit = (pm: PaymentMethodItem) => {
    setEditingMethod(pm);
    setFormType(pm.type);
    setFormName(pm.name);
    setFormIsActive(pm.isActive);
    setFormPhoneNumber(pm.phoneNumber || '');
    setFormRecipientName(pm.recipientName || '');
    setFormPaybillNumber(pm.paybillNumber || '');
    setFormAccountNumber(pm.accountNumber || '');
    setFormAccountName(pm.accountName || '');
    setFormTillNumber(pm.tillNumber || '');
    setFormTillName(pm.tillName || '');
    setFormBankName(pm.bankName || '');
    setFormBankAccountName(pm.accountName || '');
    setFormBankAccountNumber(pm.accountNumber || '');
    setFormBranchName(pm.branchName || '');
    setFormDescription(pm.description || '');
    setIsModalOpen(true);
  };

  // Delete Payment Method
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from your payment methods?`)) {
      const updated = paymentMethods.filter((pm) => pm.id !== id);
      onUpdateBusinessProfile({
        ...businessProfile,
        paymentMethods: updated,
      });
      showToast(`Removed payment method "${name}".`);
    }
  };

  // Save Modal (Add or Edit)
  const handleSaveMethod = (e: React.FormEvent) => {
    e.preventDefault();

    const newMethod: PaymentMethodItem = {
      id: editingMethod ? editingMethod.id : `pm-${Date.now()}`,
      type: formType,
      name: formName.trim() || getDefaultNameForType(formType),
      isActive: formIsActive,
      description: formDescription.trim(),
      ...(formType === 'send_money' && {
        phoneNumber: formPhoneNumber.trim(),
        recipientName: formRecipientName.trim(),
      }),
      ...(formType === 'paybill' && {
        paybillNumber: formPaybillNumber.trim(),
        accountNumber: formAccountNumber.trim(),
        accountName: formAccountName.trim(),
      }),
      ...(formType === 'till_number' && {
        tillNumber: formTillNumber.trim(),
        tillName: formTillName.trim(),
      }),
      ...(formType === 'bank_transfer' && {
        bankName: formBankName.trim(),
        accountName: formBankAccountName.trim(),
        accountNumber: formBankAccountNumber.trim(),
        branchName: formBranchName.trim(),
      }),
    };

    let updatedList: PaymentMethodItem[];
    if (editingMethod) {
      updatedList = paymentMethods.map((pm) => (pm.id === editingMethod.id ? newMethod : pm));
      showToast(`Updated "${newMethod.name}" payment settings!`);
    } else {
      updatedList = [...paymentMethods, newMethod];
      showToast(`Added new payment channel "${newMethod.name}"!`);
    }

    onUpdateBusinessProfile({
      ...businessProfile,
      paymentMethods: updatedList,
    });
    setIsModalOpen(false);
  };

  const getDefaultNameForType = (type: PaymentMethodType) => {
    switch (type) {
      case 'send_money': return 'M-Pesa Send Money';
      case 'paybill': return 'M-Pesa Paybill';
      case 'till_number': return 'M-Pesa Buy Goods Till';
      case 'bank_transfer': return 'Bank Transfer';
    }
  };

  return (
    <div className="bg-[#111] border border-zinc-800 p-6 sm:p-8 space-y-6 animate-fadeIn text-white">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-orange-500 text-black font-black text-[10px] uppercase tracking-wider">
              Payment Gateway Settings
            </span>
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              {paymentMethods.filter((pm) => pm.isActive).length} Active Channels
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase font-display text-white mt-1">
            M-Pesa, Till Numbers &amp; Bank Account Management
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Configure the exact payment methods displayed to customers during checkout. Enable or disable channels, update Till/Paybill numbers, or add corporate bank accounts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-wider text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Payment Method</span>
        </button>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((pm) => {
          const isSendMoney = pm.type === 'send_money';
          const isPaybill = pm.type === 'paybill';
          const isTill = pm.type === 'till_number';
          const isBank = pm.type === 'bank_transfer';

          return (
            <div
              key={pm.id}
              className={`p-5 border transition-all ${
                pm.isActive 
                  ? 'bg-zinc-950 border-zinc-700/80 shadow-lg' 
                  : 'bg-zinc-900/40 border-zinc-800/60 opacity-60'
              }`}
            >
              {/* Card Header with Icon & Active Toggle */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center font-black ${
                    isSendMoney ? 'bg-emerald-500 text-black' :
                    isPaybill ? 'bg-orange-500 text-black' :
                    isTill ? 'bg-emerald-400 text-black' :
                    'bg-blue-500 text-white'
                  }`}>
                    {isSendMoney && <Send className="w-5 h-5" />}
                    {isPaybill && <Smartphone className="w-5 h-5" />}
                    {isTill && <Hash className="w-5 h-5" />}
                    {isBank && <Building2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-sm font-black uppercase text-white font-display block">
                      {pm.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                      {isSendMoney && 'M-Pesa Direct Phone'}
                      {isPaybill && 'Lipa na M-Pesa Paybill'}
                      {isTill && 'Buy Goods Till'}
                      {isBank && 'Corporate Bank Account'}
                    </span>
                  </div>
                </div>

                {/* Status Switch Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(pm.id)}
                  className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors border ${
                    pm.isActive
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50 hover:bg-emerald-900/80'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-white'
                  }`}
                  title={pm.isActive ? 'Click to disable for checkout' : 'Click to enable for checkout'}
                >
                  <span className={`w-2 h-2 rounded-full ${pm.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                  <span>{pm.isActive ? 'Active in Checkout' : 'Disabled'}</span>
                </button>
              </div>

              {/* Method Details */}
              <div className="py-3 text-xs space-y-1.5 font-mono text-zinc-300">
                {isSendMoney && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Recipient Phone:</span>
                      <span className="font-bold text-emerald-400">{pm.phoneNumber || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Recipient Name:</span>
                      <span className="font-bold text-white">{pm.recipientName || '-'}</span>
                    </div>
                  </>
                )}

                {isPaybill && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Paybill Business No:</span>
                      <span className="font-bold text-orange-400">{pm.paybillNumber || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Account Number:</span>
                      <span className="font-bold text-white">{pm.accountNumber || '-'}</span>
                    </div>
                    {pm.accountName && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Account Name:</span>
                        <span className="font-bold text-zinc-400">{pm.accountName}</span>
                      </div>
                    )}
                  </>
                )}

                {isTill && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Till Number:</span>
                      <span className="font-bold text-emerald-400 text-sm">{pm.tillNumber || '-'}</span>
                    </div>
                    {pm.tillName && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Till Name:</span>
                        <span className="font-bold text-white">{pm.tillName}</span>
                      </div>
                    )}
                  </>
                )}

                {isBank && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Bank Name:</span>
                      <span className="font-bold text-white">{pm.bankName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Account No:</span>
                      <span className="font-bold text-blue-400">{pm.accountNumber || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Account Name:</span>
                      <span className="font-bold text-zinc-300">{pm.accountName || '-'}</span>
                    </div>
                    {pm.branchName && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Branch:</span>
                        <span className="font-bold text-zinc-400">{pm.branchName}</span>
                      </div>
                    )}
                  </>
                )}

                {pm.description && (
                  <p className="text-[11px] text-zinc-500 font-sans italic pt-1 border-t border-zinc-900">
                    "{pm.description}"
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(pm)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 flex items-center gap-1.5 font-bold uppercase text-[10px] cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-orange-500" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(pm.id, pm.name)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-red-400 border border-zinc-800 flex items-center gap-1.5 font-bold uppercase text-[10px] cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111] text-white max-w-lg w-full p-6 max-h-[92vh] overflow-y-auto border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                  Payment Gateway
                </span>
                <h3 className="font-black uppercase font-display text-lg text-white">
                  {editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMethod} className="space-y-4 text-xs">
              {/* Payment Method Type */}
              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Payment Channel Type:
                </label>
                <select
                  value={formType}
                  onChange={(e) => {
                    const newType = e.target.value as PaymentMethodType;
                    setFormType(newType);
                    setFormName(getDefaultNameForType(newType));
                  }}
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold uppercase focus:outline-none focus:border-orange-500"
                >
                  <option value="send_money">M-Pesa Send Money (Direct Safaricom Number)</option>
                  <option value="paybill">M-Pesa Paybill (Business &amp; Account Number)</option>
                  <option value="till_number">M-Pesa Buy Goods Till (Zero Fee Till)</option>
                  <option value="bank_transfer">Bank Account Transfer (Pesalink / EFT)</option>
                </select>
              </div>

              {/* Display Name */}
              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Method Display Name (Shown to Customers):
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. M-Pesa Send Money"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white font-bold"
                />
              </div>

              {/* Type-Specific Dynamic Fields */}
              {formType === 'send_money' && (
                <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                    Send Money Parameters
                  </span>
                  <div>
                    <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                      Recipient Safaricom Phone Number *:
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhoneNumber}
                      onChange={(e) => setFormPhoneNumber(e.target.value)}
                      placeholder="0728090599"
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                      Recipient Registered Name (Optional):
                    </label>
                    <input
                      type="text"
                      value={formRecipientName}
                      onChange={(e) => setFormRecipientName(e.target.value)}
                      placeholder="e.g. Yvonne K. / Rissau Auto Agency"
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-bold"
                    />
                  </div>
                </div>
              )}

              {formType === 'paybill' && (
                <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 block">
                    Paybill Parameters
                  </span>
                  <div>
                    <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                      Paybill Business Number *:
                    </label>
                    <input
                      type="text"
                      required
                      value={formPaybillNumber}
                      onChange={(e) => setFormPaybillNumber(e.target.value)}
                      placeholder="247247"
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                      Account Number *:
                    </label>
                    <input
                      type="text"
                      required
                      value={formAccountNumber}
                      onChange={(e) => setFormAccountNumber(e.target.value)}
                      placeholder="0728090599"
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-orange-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                      Account Name / Business Name:
                    </label>
                    <input
                      type="text"
                      value={formAccountName}
                      onChange={(e) => setFormAccountName(e.target.value)}
                      placeholder="Rissau Auto Agency"
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-bold"
                    />
                  </div>
                </div>
              )}

              {formType === 'till_number' && (
                <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                    Buy Goods Till Parameters
                  </span>
                  <div>
                    <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                      Till Number *:
                    </label>
                    <input
                      type="text"
                      required
                      value={formTillNumber}
                      onChange={(e) => setFormTillNumber(e.target.value)}
                      placeholder="5428901"
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono font-bold text-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                      Till Name / Business Name:
                    </label>
                    <input
                      type="text"
                      value={formTillName}
                      onChange={(e) => setFormTillName(e.target.value)}
                      placeholder="Rissau Auto Agency"
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-bold"
                    />
                  </div>
                </div>
              )}

              {formType === 'bank_transfer' && (
                <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block">
                    Bank Account Parameters
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                        Bank Name *:
                      </label>
                      <input
                        type="text"
                        required
                        value={formBankName}
                        onChange={(e) => setFormBankName(e.target.value)}
                        placeholder="KCB Bank Kenya"
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                        Branch:
                      </label>
                      <input
                        type="text"
                        value={formBranchName}
                        onChange={(e) => setFormBranchName(e.target.value)}
                        placeholder="Kipande House Branch"
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                      Account Name *:
                    </label>
                    <input
                      type="text"
                      required
                      value={formBankAccountName}
                      onChange={(e) => setFormBankAccountName(e.target.value)}
                      placeholder="Rissau Auto Agency Limited"
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                      Account Number *:
                    </label>
                    <input
                      type="text"
                      required
                      value={formBankAccountNumber}
                      onChange={(e) => setFormBankAccountNumber(e.target.value)}
                      placeholder="1289405821"
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-blue-400 font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Instructions / Guidance Note */}
              <div>
                <label className="block font-black uppercase tracking-wider text-zinc-400 mb-1">
                  Customer Instructions / Note:
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Instant payment with zero buyer transaction fees"
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 text-white text-xs"
                />
              </div>

              {/* Active Toggle */}
              <div className="p-3 bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="font-black uppercase text-white block">
                    Show in Customer Checkout
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    When active, customers can choose this method when checking out.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-5 h-5 accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-black uppercase text-xs border border-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-tighter text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingMethod ? 'Save Changes' : 'Create Payment Method'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
