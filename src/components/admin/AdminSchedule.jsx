import React, { useState } from 'react';
import { Clock, Calendar, Save, Plus, Trash2, Check, AlertCircle, ShieldAlert } from 'lucide-react';
import { saveScheduleSettings } from '../../firebase/db';

export default function AdminSchedule({ scheduleSettings, onRefresh }) {
  const [formData, setFormData] = useState({ ...scheduleSettings });
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleToggleDay = (day) => {
    const current = formData.workingDays || [];
    if (current.includes(day)) {
      setFormData({ ...formData, workingDays: current.filter(d => d !== day) });
    } else {
      setFormData({ ...formData, workingDays: [...current, day] });
    }
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    const current = formData.blockedDates || [];
    const updated = [...current, { date: newBlockedDate, reason: newBlockedReason || 'Parlour Maintenance / Holiday' }];
    setFormData({ ...formData, blockedDates: updated });
    setNewBlockedDate('');
    setNewBlockedReason('');
  };

  const handleRemoveBlockedDate = (index) => {
    const current = formData.blockedDates || [];
    const updated = current.filter((_, i) => i !== index);
    setFormData({ ...formData, blockedDates: updated });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      await saveScheduleSettings({
        ...formData,
        slotIntervalMinutes: Number(formData.slotIntervalMinutes) || 45,
        maxCapacityPerSlot: Number(formData.maxCapacityPerSlot) || 2
      });
      onRefresh();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save schedule settings: ' + err.message);
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
            Appointment Schedule & Slot Capacity
          </h3>
          <p className="text-xs text-espresso-500">
            Configure working hours, break periods, slot intervals, and block unavailable holiday dates.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Check className="w-3.5 h-3.5" /> Updated Live
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300 shadow-luxury space-y-6">
        
        {/* Working Days */}
        <div>
          <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-3">
            Active Working Days of the Week
          </label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => {
              const isSelected = (formData.workingDays || []).includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleToggleDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-espresso-900 text-white shadow-sm ring-1 ring-gold' 
                      : 'bg-champagne-100 text-espresso-600 hover:bg-champagne-200'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Operating Hours & Breaks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-champagne-200">
          <div>
            <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
              Opening Time
            </label>
            <input
              type="time"
              required
              value={formData.openTime || '09:00'}
              onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
              Closing Time
            </label>
            <input
              type="time"
              required
              value={formData.closeTime || '20:00'}
              onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
              Break Start
            </label>
            <input
              type="time"
              value={formData.breakStart || '13:00'}
              onChange={(e) => setFormData({ ...formData, breakStart: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
              Break End
            </label>
            <input
              type="time"
              value={formData.breakEnd || '14:00'}
              onChange={(e) => setFormData({ ...formData, breakEnd: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Intervals & Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-champagne-200">
          <div>
            <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
              Slot Interval (Minutes)
            </label>
            <select
              value={formData.slotIntervalMinutes || 45}
              onChange={(e) => setFormData({ ...formData, slotIntervalMinutes: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
            >
              <option value="30">30 Minutes</option>
              <option value="45">45 Minutes (Standard Luxury)</option>
              <option value="60">60 Minutes</option>
              <option value="90">90 Minutes</option>
            </select>
            <span className="text-[10px] text-espresso-400 mt-1 block">
              Determines time increments shown on the customer booking calendar.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
              Max Concurrent Capacity Per Slot (Suites)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              required
              value={formData.maxCapacityPerSlot || 2}
              onChange={(e) => setFormData({ ...formData, maxCapacityPerSlot: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
            />
            <span className="text-[10px] text-espresso-400 mt-1 block">
              When bookings reach this number for any slot, that slot automatically closes to prevent double-booking.
            </span>
          </div>
        </div>

        {/* Blocked Dates / Holidays */}
        <div className="pt-4 border-t border-champagne-200">
          <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-2">
            Block Specific Dates & Holidays
          </label>
          <p className="text-xs text-espresso-500 mb-3">
            Guests will not be able to choose or reserve slots on blocked dates.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="date"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
            />
            <input
              type="text"
              placeholder="Reason (e.g. Christmas Eve, Renovation)"
              value={newBlockedReason}
              onChange={(e) => setNewBlockedReason(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-champagne-300 text-xs text-espresso-900 bg-white focus:outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={handleAddBlockedDate}
              className="px-5 py-2 rounded-xl bg-champagne-200 hover:bg-gold text-espresso-900 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Block Date</span>
            </button>
          </div>

          {/* List of blocked dates */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {(formData.blockedDates || []).map((b, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-champagne-50 border border-champagne-200 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gold-deep" />
                  <span className="font-semibold text-espresso-900">{b.date}</span>
                  <span className="text-espresso-500">({b.reason})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveBlockedDate(idx)}
                  className="p-1 text-espresso-400 hover:text-rose-600 transition-colors"
                  title="Unblock date"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
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
              <span>Saving Rules...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Appointment Settings</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}

