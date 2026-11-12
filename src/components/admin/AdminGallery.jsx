import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Eye, Check } from 'lucide-react';
import { saveGalleryItem, deleteGalleryItem } from '../../firebase/db';

export default function AdminGallery({ gallery = [], onRefresh }) {
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ['Bridal', 'Hair', 'Skin & Facials', 'Nails', 'Makeup'];

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      category: 'Bridal',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
      description: 'Airbrush glow and bespoke styling.'
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingItem.title.trim() || !editingItem.image.trim()) return;

    setLoading(true);
    try {
      await saveGalleryItem(editingItem);
      setEditingItem(null);
      onRefresh();
    } catch (err) {
      alert('Failed to save gallery item: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete photo "${title}" from portfolio?`)) {
      try {
        await deleteGalleryItem(id);
        onRefresh();
      } catch (err) {
        alert('Failed to delete item: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-champagne-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-espresso-900">
            Portfolio & Transformations Gallery ({gallery.length})
          </h3>
          <p className="text-xs text-espresso-500">
            Showcase editorial artistry, client transformations, and runway styling.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-full bg-espresso-900 hover:bg-gold hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden border border-champagne-300 shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
          >
            <div className="relative h-56 overflow-hidden bg-champagne-200">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#231713]/85 text-champagne-100 text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full">
                {item.category}
              </div>
            </div>

            <div className="p-5 flex items-center justify-between">
              <div>
                <h4 className="font-serif text-base font-bold text-espresso-900 line-clamp-1">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-espresso-500 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDelete(item.id, item.title)}
                className="p-2 rounded-lg hover:bg-rose-50 text-espresso-400 hover:text-rose-600 transition-colors"
                title="Delete photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold/40 shadow-2xl space-y-4">
            <h4 className="font-serif text-2xl font-bold text-espresso-900">
              Add Photo to Gallery
            </h4>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Royal Regal Bridal Silhouette"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Description / Artistry Notes
                </label>
                <textarea
                  rows="2"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
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
                  {loading ? 'Adding...' : 'Add to Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

