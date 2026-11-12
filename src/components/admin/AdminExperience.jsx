import React, { useState } from 'react';
import { Plus, Edit, Trash2, Award, Sparkles, Shield, Check } from 'lucide-react';
import { saveExperienceItem, deleteExperienceItem } from '../../firebase/db';
export default function AdminExperience({ experience = [], onRefresh }) {
  const [editingItem, setEditingItem] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingItem({
      title: '',
      description: '',
      badge: 'Haute Standard'
    });
  };

  const handleOpenEdit = (item) => {
    setIsNew(false);
    setEditingItem({ ...item });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingItem.title.trim()) return;

    setLoading(true);
    try {
      await saveExperienceItem(editingItem);
      setEditingItem(null);
      onRefresh();
    } catch (err) {
      alert('Failed to save experience item: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Permanently remove "${title}" from salon experience pillars?`)) {
      try {
        await deleteExperienceItem(id);
        onRefresh();
      } catch (err) {
        alert('Failed to delete item: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-champagne-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-espresso-900">
            Salon Experience & Why Choose Us ({experience.length})
          </h3>
          <p className="text-xs text-espresso-500">
            Customize the 6 core pillars, hospital-grade safety notes, and bespoke salon standards shown on the homepage.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-full bg-espresso-900 hover:bg-gold hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience Card</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experience.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 border border-champagne-300 shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-champagne-200/80 border border-gold/40 flex items-center justify-center text-gold-deep">
                  <Award className="w-5 h-5" />
                </div>

                {item.badge && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gold-deep bg-champagne-100 px-2.5 py-0.5 rounded-full border border-champagne-300">
                    {item.badge}
                  </span>
                )}
              </div>

              <h4 className="font-serif text-lg font-bold text-espresso-900 mb-2">
                {item.title}
              </h4>

              <p className="text-xs text-espresso-600 leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-champagne-200 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 rounded-lg hover:bg-champagne-200 text-espresso-700 hover:text-espresso-900 transition-colors"
                title="Edit Card"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(item.id, item.title)}
                className="p-2 rounded-lg hover:bg-rose-50 text-espresso-400 hover:text-rose-600 transition-colors"
                title="Delete Card"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold/40 shadow-2xl space-y-4">
            <h4 className="font-serif text-2xl font-bold text-espresso-900">
              {isNew ? 'Add Experience Pillar' : 'Edit Experience Details'}
            </h4>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Card Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Master European Artisans"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Badge Tag (Optional)
                </label>
                <input
                  type="text"
                  value={editingItem.badge || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                  placeholder="e.g. Haute Standard, VIP Privacy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Explain why guests choose this standard..."
                  className="w-full px-3.5 py-2 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-champagne-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 rounded-full border border-champagne-300 text-espresso-600 text-xs uppercase tracking-wider font-semibold hover:bg-champagne-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-2.5 rounded-full bg-espresso-900 hover:bg-gold hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
