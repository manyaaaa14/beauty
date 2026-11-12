import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Gift, 
  Clock, 
  Check, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { savePackage, deletePackage } from '../../firebase/db';

export default function AdminPackages({ packages = [], onRefresh }) {
  const [editingPkg, setEditingPkg] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [servicesInput, setServicesInput] = useState('');

  const handleOpenAdd = () => {
    setIsNew(true);
    setServicesInput('24K Gold Cellular Facial\nCaviar & Keratin Scalp Spa\nRose Quartz Velvet Manicure');
    setEditingPkg({
      name: '',
      tagline: 'VIP Transformation Package',
      originalPrice: 350,
      discountedPrice: 260,
      savings: 90,
      validity: 'Valid for 6 months after booking',
      duration: 180,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      active: true,
      badge: 'Special Edition'
    });
  };

  const handleOpenEdit = (pkg) => {
    setIsNew(false);
    setServicesInput((pkg.includedServices || []).join('\n'));
    setEditingPkg({ ...pkg });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingPkg.name.trim()) return;

    setLoading(true);
    const includedServices = servicesInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const orig = Number(editingPkg.originalPrice) || 0;
    const disc = Number(editingPkg.discountedPrice) || 0;
    const savings = Math.max(0, orig - disc);

    try {
      await savePackage({
        ...editingPkg,
        includedServices,
        originalPrice: orig,
        discountedPrice: disc,
        savings,
        duration: Number(editingPkg.duration) || 120
      });
      setEditingPkg(null);
      onRefresh();
    } catch (err) {
      alert('Failed to save package: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (pkg) => {
    try {
      await savePackage({ ...pkg, active: !pkg.active });
      onRefresh();
    } catch (err) {
      alert('Failed to update package status: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently remove package "${name}"?`)) {
      try {
        await deletePackage(id);
        onRefresh();
      } catch (err) {
        alert('Failed to delete package: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="bg-white rounded-3xl p-6 border border-champagne-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-espresso-900">
            VIP Salon Packages ({packages.length})
          </h3>
          <p className="text-xs text-espresso-500">
            Multi-ritual bundles, bridal programs, savings badges, and validity rules.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-full bg-espresso-900 hover:bg-gold hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Package</span>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-2xl overflow-hidden border shadow-sm transition-all flex flex-col justify-between ${
              pkg.active === false ? 'opacity-60 border-gray-300' : 'border-champagne-300 hover:shadow-luxury'
            }`}
          >
            {/* Header Image */}
            <div className="relative h-48 overflow-hidden bg-champagne-200">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {pkg.badge && (
                <div className="absolute top-3 left-3 bg-gold text-espresso-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {pkg.badge}
                </div>
              )}

              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                  pkg.active !== false ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-white'
                }`}>
                  {pkg.active !== false ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="absolute bottom-3 left-4 text-white">
                <p className="text-xs text-champagne-300 uppercase tracking-wider">{pkg.tagline}</p>
                <h4 className="font-serif text-lg font-bold">{pkg.name}</h4>
              </div>
            </div>

            {/* Inclusions */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-champagne-200 mb-4">
                  <div>
                    <span className="font-serif text-2xl font-bold text-espresso-900">
                      ${pkg.discountedPrice}
                    </span>
                    <span className="text-xs text-espresso-400 line-through ml-2">
                      ${pkg.originalPrice}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Save ${pkg.savings || (pkg.originalPrice - pkg.discountedPrice)}
                  </span>
                </div>

                <p className="text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-2">
                  Inclusions ({(pkg.includedServices || []).length}):
                </p>
                <ul className="space-y-1 mb-4 text-xs text-espresso-600">
                  {(pkg.includedServices || []).map((s, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-gold-deep flex-shrink-0" />
                      <span className="truncate">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-champagne-200 flex items-center justify-between">
                <button
                  onClick={() => handleToggleActive(pkg)}
                  className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                    pkg.active !== false ? 'text-espresso-500 hover:text-espresso-800' : 'text-emerald-700 bg-emerald-50'
                  }`}
                  title={pkg.active !== false ? 'Deactivate package' : 'Activate package'}
                >
                  {pkg.active !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(pkg)}
                    className="p-2 rounded-lg hover:bg-champagne-200 text-espresso-700 hover:text-espresso-900 transition-colors"
                    title="Edit Package"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(pkg.id, pkg.name)}
                    className="p-2 rounded-lg hover:bg-rose-50 text-espresso-400 hover:text-rose-600 transition-colors"
                    title="Delete Package"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Package Modal */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gold/40 shadow-2xl space-y-4 my-8">
            <h4 className="font-serif text-2xl font-bold text-espresso-900">
              {isNew ? 'Create VIP Package' : 'Edit Package Details'}
            </h4>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Package Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingPkg.name}
                  onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                  placeholder="e.g. The Royal Bridal Symphony"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={editingPkg.tagline}
                  onChange={(e) => setEditingPkg({ ...editingPkg, tagline: e.target.value })}
                  placeholder="e.g. The Ultimate Wedding Day Indulgence"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Original Price ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingPkg.originalPrice}
                    onChange={(e) => setEditingPkg({ ...editingPkg, originalPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Discounted Price ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingPkg.discountedPrice}
                    onChange={(e) => setEditingPkg({ ...editingPkg, discountedPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="30"
                    step="15"
                    value={editingPkg.duration}
                    onChange={(e) => setEditingPkg({ ...editingPkg, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingPkg.badge || ''}
                    onChange={(e) => setEditingPkg({ ...editingPkg, badge: e.target.value })}
                    placeholder="e.g. Most Popular"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={editingPkg.image}
                  onChange={(e) => setEditingPkg({ ...editingPkg, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 bg-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Included Services (One per line) *
                </label>
                <textarea
                  rows="4"
                  required
                  value={servicesInput}
                  onChange={(e) => setServicesInput(e.target.value)}
                  placeholder="Enter services included in this package..."
                  className="w-full px-3.5 py-2 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activePkgCheck"
                  checked={editingPkg.active !== false}
                  onChange={(e) => setEditingPkg({ ...editingPkg, active: e.target.checked })}
                  className="w-4 h-4 text-gold rounded border-champagne-300"
                />
                <label htmlFor="activePkgCheck" className="text-xs text-espresso-800 font-medium">
                  Active and available for customer reservations
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-champagne-200">
                <button
                  type="button"
                  onClick={() => setEditingPkg(null)}
                  className="px-5 py-2.5 rounded-full border border-champagne-300 text-espresso-600 text-xs uppercase tracking-wider font-semibold hover:bg-champagne-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-2.5 rounded-full bg-espresso-900 hover:bg-gold hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

