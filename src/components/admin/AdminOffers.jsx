import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  Clock, 
  Percent, 
  DollarSign, 
  Check, 
  X, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { saveOffer, deleteOffer } from '../../firebase/db';

export default function AdminOffers({ offers = [], onRefresh }) {
  const [editingOffer, setEditingOffer] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingOffer({
      code: 'LUXE10',
      title: 'Seasonal Privilege Discount',
      description: 'Receive 10% privilege reduction on all bespoke rituals.',
      discountType: 'percentage',
      discountValue: 10,
      minSpend: 50,
      maxDiscount: 40,
      expiryDate: '2026-12-31',
      active: true,
      usageLimit: 100,
      usedCount: 0,
      badge: 'Limited Offer'
    });
  };

  const handleOpenEdit = (off) => {
    setIsNew(false);
    setEditingOffer({ ...off });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingOffer.code.trim()) return;

    setLoading(true);
    try {
      await saveOffer({
        ...editingOffer,
        discountValue: Number(editingOffer.discountValue) || 0,
        minSpend: Number(editingOffer.minSpend) || 0,
        maxDiscount: Number(editingOffer.maxDiscount) || 0,
        usageLimit: Number(editingOffer.usageLimit) || 100
      });
      setEditingOffer(null);
      onRefresh();
    } catch (err) {
      alert('Failed to save offer: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (off) => {
    try {
      await saveOffer({ ...off, active: !off.active });
      onRefresh();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Permanently remove promotion code "${code}"?`)) {
      try {
        await deleteOffer(id);
        onRefresh();
      } catch (err) {
        alert('Failed to delete offer: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="bg-white rounded-3xl p-6 border border-champagne-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-espresso-900">
            Offers & Discount Coupons ({offers.length})
          </h3>
          <p className="text-xs text-espresso-500">
            Create coupon codes, percentage or fixed deductions, spend thresholds, and countdown expiries.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-full bg-espresso-900 hover:bg-gold hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((off) => (
          <div
            key={off.id}
            className={`bg-white rounded-2xl p-6 border shadow-sm transition-all flex flex-col justify-between ${
              off.active === false ? 'opacity-60 border-gray-300' : 'border-champagne-300 hover:shadow-luxury'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm uppercase tracking-wider font-bold text-espresso-900 bg-champagne-200/80 px-2.5 py-1 rounded-lg border border-gold/40">
                  {off.code}
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                  off.active !== false ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-white'
                }`}>
                  {off.active !== false ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-serif text-2xl font-bold text-gold-deep">
                  {off.discountType === 'percentage' ? `${off.discountValue}% OFF` : `$${off.discountValue} FLAT OFF`}
                </span>
              </div>

              <h4 className="font-serif text-base font-bold text-espresso-900 mb-1">
                {off.title}
              </h4>

              <p className="text-xs text-espresso-600 line-clamp-2 mb-4">
                {off.description}
              </p>

              <div className="space-y-1 text-[11px] text-espresso-500 bg-champagne-50 p-3 rounded-xl border border-champagne-200">
                <p>Min Spend: <strong>${off.minSpend || 0}</strong></p>
                {off.maxDiscount > 0 && <p>Max Discount Cap: <strong>${off.maxDiscount}</strong></p>}
                {off.expiryDate && <p>Expires On: <strong>{off.expiryDate}</strong></p>}
                <p>Used: <strong>{off.usedCount || 0} / {off.usageLimit || '∞'} times</strong></p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-champagne-200 flex items-center justify-between mt-4">
              <button
                onClick={() => handleToggleActive(off)}
                className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                  off.active !== false ? 'text-espresso-500 hover:text-espresso-800' : 'text-emerald-700 bg-emerald-50'
                }`}
                title={off.active !== false ? 'Deactivate promo' : 'Activate promo'}
              >
                {off.active !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(off)}
                  className="p-2 rounded-lg hover:bg-champagne-200 text-espresso-700 hover:text-espresso-900 transition-colors"
                  title="Edit Offer"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(off.id, off.code)}
                  className="p-2 rounded-lg hover:bg-rose-50 text-espresso-400 hover:text-rose-600 transition-colors"
                  title="Delete Offer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Offer Modal */}
      {editingOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gold/40 shadow-2xl space-y-4 my-8">
            <h4 className="font-serif text-2xl font-bold text-espresso-900">
              {isNew ? 'Create New Promo Code' : 'Edit Promotion'}
            </h4>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingOffer.code}
                    onChange={(e) => setEditingOffer({ ...editingOffer, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. VIPGUEST"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 font-mono text-xs sm:text-sm text-espresso-900 bg-white uppercase focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingOffer.badge || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, badge: e.target.value })}
                    placeholder="e.g. First Visit"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingOffer.title}
                  onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  placeholder="e.g. Welcome Privilege Discount"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Discount Type
                  </label>
                  <select
                    value={editingOffer.discountType}
                    onChange={(e) => setEditingOffer({ ...editingOffer, discountType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingOffer.discountValue}
                    onChange={(e) => setEditingOffer({ ...editingOffer, discountValue: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Min Spend ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingOffer.minSpend}
                    onChange={(e) => setEditingOffer({ ...editingOffer, minSpend: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Max Discount Cap ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingOffer.maxDiscount}
                    onChange={(e) => setEditingOffer({ ...editingOffer, maxDiscount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={editingOffer.expiryDate}
                    onChange={(e) => setEditingOffer({ ...editingOffer, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Usage Limit (Count)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingOffer.usageLimit}
                    onChange={(e) => setEditingOffer({ ...editingOffer, usageLimit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Terms / Description
                </label>
                <textarea
                  rows="2"
                  value={editingOffer.description}
                  onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeOfferCheck"
                  checked={editingOffer.active !== false}
                  onChange={(e) => setEditingOffer({ ...editingOffer, active: e.target.checked })}
                  className="w-4 h-4 text-gold rounded border-champagne-300"
                />
                <label htmlFor="activeOfferCheck" className="text-xs text-espresso-800 font-medium">
                  Active & claimable by guests
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-champagne-200">
                <button
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="px-5 py-2.5 rounded-full border border-champagne-300 text-espresso-600 text-xs uppercase tracking-wider font-semibold hover:bg-champagne-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-2.5 rounded-full bg-espresso-900 hover:bg-gold hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

