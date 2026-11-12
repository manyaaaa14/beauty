import React, { useState, useMemo } from 'react';
import { Search, User, Phone, Mail, Calendar, DollarSign, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminCustomers({ bookings = [] }) {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Group unique customers from bookings by phone
  const customers = useMemo(() => {
    const map = new Map();

    bookings.forEach((b) => {
      const phoneKey = (b.customerPhone || '').replace(/\D/g, '') || b.customerName;
      if (!map.has(phoneKey)) {
        map.set(phoneKey, {
          id: phoneKey,
          name: b.customerName,
          phone: b.customerPhone,
          email: b.customerEmail || 'Not provided',
          bookings: [b],
          totalSpend: Number(b.finalAmount) || 0,
          lastVisit: b.date
        });
      } else {
        const existing = map.get(phoneKey);
        existing.bookings.push(b);
        existing.totalSpend += Number(b.finalAmount) || 0;
        if (b.date > existing.lastVisit) {
          existing.lastVisit = b.date;
        }
      }
    });

    return Array.from(map.values());
  }, [bookings]);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header and Search */}
      <div className="bg-white rounded-3xl p-6 border border-champagne-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-espresso-900">
            Guest Directory & VIP Profiles ({customers.length})
          </h3>
          <p className="text-xs text-espresso-500">
            Secure client portfolio, appointment frequencies, and lifetime value.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-champagne-300 text-xs text-espresso-900 focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-champagne-300 shadow-luxury overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 p-6">
            <User className="w-10 h-10 text-champagne-400 mx-auto mb-3" />
            <h4 className="font-serif text-lg text-espresso-800">No client records found</h4>
            <p className="text-xs text-espresso-500 mt-1">Guest profiles are generated automatically upon reservations.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-espresso-800">
              <thead className="bg-[#FAF7F2] text-espresso-500 uppercase tracking-wider text-[10px] border-b border-champagne-200">
                <tr>
                  <th className="px-6 py-4">Guest Profile</th>
                  <th className="px-6 py-4">Contact Phone</th>
                  <th className="px-6 py-4">Total Reservations</th>
                  <th className="px-6 py-4">Lifetime Spend</th>
                  <th className="px-6 py-4">Recent Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-champagne-200">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-champagne-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-champagne-200 flex items-center justify-center font-serif text-xs font-bold text-espresso-900">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-espresso-900">{c.name}</p>
                          <p className="text-[11px] text-espresso-400">{c.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono">
                      {c.phone}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-espresso-900">{c.bookings.length}</span> visits
                    </td>

                    <td className="px-6 py-4 font-serif font-bold text-sm text-gold-deep">
                      ${c.totalSpend.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-espresso-600">
                      {c.lastVisit}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3.5 py-1.5 rounded-full border border-champagne-300 hover:border-gold hover:bg-champagne-200 text-espresso-800 text-[11px] uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                      >
                        History ({c.bookings.length})
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Booking History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-gold/40 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-champagne-200">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold-deep font-bold">
                  Client Profile & Reservation History
                </span>
                <h4 className="font-serif text-2xl font-bold text-espresso-900">
                  {selectedCustomer.name}
                </h4>
                <p className="text-xs text-espresso-500 mt-0.5">
                  {selectedCustomer.phone} • {selectedCustomer.email}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-espresso-400 block font-semibold">Total Value</span>
                <span className="font-serif text-xl font-bold text-gold-deep">
                  ${selectedCustomer.totalSpend.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-espresso-800">
                All Recorded Visits ({selectedCustomer.bookings.length})
              </h5>

              {selectedCustomer.bookings.map((b) => (
                <div key={b.id} className="p-3.5 rounded-2xl bg-white border border-champagne-300 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-espresso-400 block">Ref: {b.id}</span>
                    <p className="font-semibold text-espresso-900">{b.itemName}</p>
                    <p className="text-[11px] text-espresso-500">{b.date} • {b.time}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-sm block">${Number(b.finalAmount).toFixed(2)}</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                      b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      b.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end border-t border-champagne-200">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-6 py-2 rounded-full bg-espresso-900 text-white font-semibold text-xs uppercase tracking-wider hover:bg-gold hover:text-espresso-900 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

