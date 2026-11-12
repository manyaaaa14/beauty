import React, { useState } from 'react';
import { Save, Check, Settings as SettingsIcon, Globe, MapPin, Phone, Instagram, Sparkles } from 'lucide-react';
import { saveSettings } from '../../firebase/db';

export default function AdminSettings({ settings, onRefresh }) {
  const [formData, setFormData] = useState({ ...settings });
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      await saveSettings(formData);
      onRefresh();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-champagne-300 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-espresso-900">
            Website Identity & Content Settings
          </h3>
          <p className="text-xs text-espresso-500">
            Dynamically update salon brand names, headlines, address, contact channels, and banners.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Check className="w-3.5 h-3.5" /> Changes Published Live
          </span>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300 shadow-luxury space-y-6">
        
        {/* Brand Section */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold text-gold-deep mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Brand Identity & Taglines</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                Parlour Brand Name *
              </label>
              <input
                type="text"
                required
                value={formData.parlourName || ''}
                onChange={(e) => handleChange('parlourName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                Luxury Tagline
              </label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Headlines */}
        <div className="pt-4 border-t border-champagne-200">
          <h4 className="text-xs uppercase tracking-widest font-bold text-gold-deep mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Hero Section Copy</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                Main Hero Headline
              </label>
              <input
                type="text"
                value={formData.heroHeadline || ''}
                onChange={(e) => handleChange('heroHeadline', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                Hero Sub-Headline
              </label>
              <textarea
                rows="2"
                value={formData.heroSubheadline || ''}
                onChange={(e) => handleChange('heroSubheadline', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                Top Announcement Banner
              </label>
              <input
                type="text"
                value={formData.announcement || ''}
                onChange={(e) => handleChange('announcement', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="pt-4 border-t border-champagne-200">
          <h4 className="text-xs uppercase tracking-widest font-bold text-gold-deep mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Salon Concierge Contact & Hours</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                Telephone
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={formData.whatsapp || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                Physical Address
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                Operating Hours Display
              </label>
              <input
                type="text"
                value={formData.openingHours || ''}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* Social & Maps */}
        <div className="pt-4 border-t border-champagne-200">
          <h4 className="text-xs uppercase tracking-widest font-bold text-gold-deep mb-4 flex items-center gap-2">
            <Instagram className="w-4 h-4" />
            <span>Social Links & Google Maps Embed</span>
          </h4>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Instagram Link
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl || ''}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                  Facebook Link
                </label>
                <input
                  type="url"
                  value={formData.facebookUrl || ''}
                  onChange={(e) => handleChange('facebookUrl', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                Google Maps Embed URL (Iframe src)
              </label>
              <input
                type="text"
                value={formData.googleMapsEmbed || ''}
                onChange={(e) => handleChange('googleMapsEmbed', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-900 focus:outline-none focus:border-gold font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-champagne-200 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-full bg-espresso-900 hover:bg-gold hover:text-espresso-900 text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Website Settings</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}

