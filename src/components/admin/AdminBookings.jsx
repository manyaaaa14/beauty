import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  Clock4, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  FileEdit, 
  Phone, 
  Mail, 
  User, 
  Tag, 
  Download,
  AlertCircle
} from 'lucide-react';
import { updateBookingStatus, deleteBooking } from '../../firebase/db';

export default function AdminBookings({ bookings = [], onRefresh }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  
  // Modals state
  const [selectedBookingForNotes, setSelectedBookingForNotes] = useState(null);
  const [internalNotes, setInternalNotes] = useState('');

  const [selectedBookingForReschedule, setSelectedBookingForReschedule] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch = 
        (b.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
        (b.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (b.customerPhone || '').includes(search);

      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchesDate = !dateFilter || b.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, search, statusFilter, dateFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, { status: newStatus });
      onRefresh();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedBookingForNotes) return;
    try {
      await updateBookingStatus(selectedBookingForNotes.id, { notes: internalNotes });
      setSelectedBookingForNotes(null);
      onRefresh();
    } catch (err) {
      alert('Failed to save notes: ' + err.message);
    }
  };

  const handleSaveReschedule = async () => {
    if (!selectedBookingForReschedule || !rescheduleDate || !rescheduleTime) return;
    try {
      await updateBookingStatus(selectedBookingForReschedule.id, { 
        date: rescheduleDate, 
        time: rescheduleTime 
      });
      setSelectedBookingForReschedule(null);
      onRefresh();
    } catch (err) {
      alert('Failed to reschedule: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Permanently remove reservation #${id}? This action cannot be undone.`)) {
      try {
        await deleteBooking(id);
        onRefresh();
      } catch (err) {
        alert('Failed to delete booking: ' + err.message);
      }
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) return;
    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Email', 'Item', 'Date', 'Time', 'Amount', 'Status'];
    const rows = filteredBookings.map(b => [
      b.id,
      `"${b.customerName}"`,
      `"${b.customerPhone}"`,
      `"${b.customerEmail || ''}"`,
      `"${b.itemName}"`,
      b.date,
      b.time,
      b.finalAmount,
      b.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `parlour_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="bg-white rounded-3xl p-6 border border-champagne-300 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Guest name, Reference ID or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-900 focus:outline-none focus:border-gold"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-800 bg-white focus:outline-none focus:border-gold font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-800 bg-white focus:outline-none focus:border-gold"
          />

          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="p-2 text-espresso-400 hover:text-espresso-800 text-xs"
              title="Clear date filter"
            >
              Clear
            </button>
          )}

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-champagne-200 hover:bg-gold text-espresso-900 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>

      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-champagne-300 shadow-luxury overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 p-6">
            <Calendar className="w-10 h-10 text-champagne-400 mx-auto mb-3" />
            <h4 className="font-serif text-lg text-espresso-800">No reservations found</h4>
            <p className="text-xs text-espresso-500 mt-1">Try modifying your search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-espresso-800">
              <thead className="bg-[#FAF7F2] text-espresso-500 uppercase tracking-wider text-[10px] border-b border-champagne-200">
                <tr>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Guest Information</th>
                  <th className="px-6 py-4">Reserved Treatment</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-champagne-200">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-champagne-50/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-espresso-900 whitespace-nowrap">
                      {b.id}
                      {b.couponCode && (
                        <span className="block text-[9px] text-emerald-700 font-sans font-medium">
                          🏷️ {b.couponCode}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-espresso-900">{b.customerName}</p>
                      <p className="text-[11px] text-espresso-500">{b.customerPhone}</p>
                      {b.customerEmail && (
                        <p className="text-[10px] text-espresso-400 truncate max-w-[150px]">{b.customerEmail}</p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-espresso-900 line-clamp-1">{b.itemName}</p>
                      <span className="text-[10px] text-espresso-400 uppercase tracking-wider">{b.itemType}</span>
                      {b.notes && (
                        <span className="block text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-1 max-w-[180px] truncate" title={b.notes}>
                          Note: {b.notes}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-medium text-espresso-900">
                        <Calendar className="w-3 h-3 text-gold-deep" />
                        <span>{b.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gold-deep mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{b.time}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-serif text-sm font-bold text-espresso-900">
                        ${Number(b.finalAmount).toFixed(2)}
                      </span>
                      {b.discountAmount > 0 && (
                        <span className="block text-[10px] text-emerald-700">
                          -${b.discountAmount.toFixed(2)} saved
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer ${
                          b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          b.status === 'Completed' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                          b.status === 'Cancelled' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                          'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Reschedule Button */}
                        <button
                          onClick={() => {
                            setSelectedBookingForReschedule(b);
                            setRescheduleDate(b.date);
                            setRescheduleTime(b.time);
                          }}
                          className="p-1.5 rounded-lg hover:bg-champagne-200 text-espresso-600 hover:text-espresso-900 transition-colors"
                          title="Reschedule Appointment"
                        >
                          <Clock className="w-4 h-4 text-gold-deep" />
                        </button>

                        {/* Internal Notes Button */}
                        <button
                          onClick={() => {
                            setSelectedBookingForNotes(b);
                            setInternalNotes(b.notes || '');
                          }}
                          className="p-1.5 rounded-lg hover:bg-champagne-200 text-espresso-600 hover:text-espresso-900 transition-colors"
                          title="Staff Notes"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-espresso-400 hover:text-rose-600 transition-colors"
                          title="Delete Reservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Internal Staff Notes Modal */}
      {selectedBookingForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold/40 shadow-2xl">
            <h4 className="font-serif text-xl font-bold text-espresso-900 mb-1">
              Internal Staff Notes
            </h4>
            <p className="text-xs text-espresso-500 mb-4">
              Private notes for reservation <strong>#{selectedBookingForNotes.id}</strong> ({selectedBookingForNotes.customerName}).
            </p>

            <textarea
              rows="4"
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="e.g. Guest prefers room temperature jasmine tea. Sensitive to strong fragrances..."
              className="w-full p-3.5 rounded-xl border border-champagne-300 text-xs sm:text-sm text-espresso-800 bg-white focus:outline-none focus:border-gold"
            />

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedBookingForNotes(null)}
                className="px-4 py-2 rounded-full border border-champagne-300 text-espresso-600 text-xs uppercase tracking-wider font-semibold hover:bg-champagne-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-6 py-2 rounded-full bg-espresso-900 text-white hover:bg-gold hover:text-espresso-900 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {selectedBookingForReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold/40 shadow-2xl space-y-4">
            <h4 className="font-serif text-xl font-bold text-espresso-900">
              Reschedule Appointment
            </h4>
            <p className="text-xs text-espresso-500">
              Modifying schedule for <strong>{selectedBookingForReschedule.customerName}</strong> (#{selectedBookingForReschedule.id}).
            </p>

            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                New Date
              </label>
              <input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-champagne-300 text-xs text-espresso-800 bg-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-800 uppercase tracking-wider mb-1">
                New Time Slot
              </label>
              <input
                type="text"
                placeholder="e.g. 11:30 AM"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-champagne-300 text-xs text-espresso-800 bg-white focus:outline-none focus:border-gold"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedBookingForReschedule(null)}
                className="px-4 py-2 rounded-full border border-champagne-300 text-espresso-600 text-xs uppercase tracking-wider font-semibold hover:bg-champagne-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReschedule}
                className="px-6 py-2 rounded-full bg-espresso-900 text-white hover:bg-gold hover:text-espresso-900 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                Update Schedule
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

