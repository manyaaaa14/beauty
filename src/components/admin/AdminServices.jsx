import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Scissors, 
  Clock, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Image as ImageIcon 
} from 'lucide-react';
import { saveService, deleteService } from '../../firebase/db';

export default function AdminServices({ services = [], onRefresh }) {
  const [editingService, setEditingService] = useState(null); // null when not modal open
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['Hair', 'Skin & Facials', 'Makeup & Bridal', 'Nails & Spa'];

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingService({
      name: '',
      category: 'Hair',
      description: '',
      price: 80,
      duration: 60,
      image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
      published: true
    });
  };

  const handleOpenEdit = (srv) => {
    setIsNew(false);
    setEditingService({ ...srv });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingService.name.trim()) return;

    setLoading(true);
    try {
      await saveService({
        ...editingService,
        price: Number(editingService.price) || 0,
        duration: Number(editingService.duration) || 30
      });
      setEditingService(null);
      onRefresh();
    } catch (err) {
      alert('Failed to save service: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (srv) => {
    try {
      await saveService({ ...srv, published: !srv.published });
      onRefresh();
    } catch (err) {
      alert('Failed to update publish state: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently remove "${name}" from salon services?`)) {
      try {
        await deleteService(id);
        onRefresh();
      } catch (err) {
        alert('Failed to delete service: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="bg-white rounded-3xl p-6 border border-champagne-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-espresso-900">
            Salon Services Catalogue ({services.length})
          </h3>
          <p className="text-xs text-espresso-500">
            Configure luxury treatments, duration times, prices and live publish visibility.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-full bg-espresso-900 hover:bg-gold hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className={`bg-white rounded-2xl overflow-hidden border shadow-sm transition-all flex flex-col justify-between ${
              srv.published === false ? 'opacity-60 border-gray-300' : 'border-champagne-300 hover:shadow-luxury'
            }`}
          >
            {/* Image Preview */}
            <div className="relative h-44 overflow-hidden bg-champagne-200">
              <img
                src={srv.image}
                alt={srv.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#231713]/85 text-champagne-100">
                  {srv.category}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                  srv.published !== false ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-white'
                }`}>
                  {srv.published !== false ? 'Published' : 'Hidden'}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm">
                ${srv.price}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-serif text-base font-bold text-espresso-900 line-clamp-1 mb-1">
                  {srv.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-gold-deep mb-2 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{srv.duration} Minutes</span>
                </div>
                <p className="text-xs text-espresso-600 line-clamp-2 mb-4">
                  {srv.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-champagne-200 flex items-center justify-between">
                <button
                  onClick={() => handleTogglePublish(srv)}
                  className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                    srv.published !== false 
                      ? 'text-espresso-500 hover:text-espresso-800' 
                      : 'text-emerald-700 bg-emerald-50'
                  }`}
                  title={srv.published !== false ? 'Unpublish from website' : 'Publish to website'}
                >
                  {srv.published !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="p-2 rounded-lg hover:bg-champagne-200 text-espresso-700 hover:text-espresso-900 transition-colors"
                    title="Edit Service"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(srv.id, srv.name)}
                    className="p-2 rounded-lg hover:bg-rose-50 text-espresso-400 hover:text-rose-600 transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gold/40 shadow-2xl space-y-4 my-8">
            <h4 className="font-serif text-2xl font-bold text-espresso-900">
              {isNew ? 'Create New Service' : 'Edit Service Details'}
            </h4>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  placeholder="e.g. 24K Gold Cellular Facial"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="5"
                    required
                    value={editingService.duration}
                    onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Price ($ USD) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={editingService.price}
                  onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Image URL (High-Res Photography) *
                </label>
                <input
                  type="url"
                  required
                  value={editingService.image}
                  onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="publishedCheck"
                  checked={editingService.published !== false}
                  onChange={(e) => setEditingService({ ...editingService, published: e.target.checked })}
                  className="w-4 h-4 text-gold rounded border-champagne-300"
                />
                <label htmlFor="publishedCheck" className="text-xs text-espresso-800 font-medium">
                  Publish publicly on customer website
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-champagne-200">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-5 py-2.5 rounded-full border border-champagne-300 text-espresso-600 text-xs uppercase tracking-wider font-semibold hover:bg-champagne-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-2.5 rounded-full bg-espresso-900 hover:bg-gold hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

