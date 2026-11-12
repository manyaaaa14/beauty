import React from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Clock4, 
  XCircle, 
  Scissors, 
  Tag, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles,
  Trash2,
  Award
} from 'lucide-react';
import { clearAllDemoData } from '../../firebase/db';

export default function AdminDashboard({ 
  bookings = [], 
  services = [], 
  packages = [], 
  offers = [], 
  experience = [],
  parlourName = 'GLAMMORA',
  onSelectTab,
  onRefreshData 
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  const totalBookings = bookings.length;
  const todayAppointments = bookings.filter(b => b.date === todayStr);
  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  const completedBookings = bookings.filter(b => b.status === 'Completed');
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled');
  
  const totalRevenue = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((acc, curr) => acc + (Number(curr.finalAmount) || 0), 0);

  const activeOffersCount = offers.filter(o => o.active !== false).length;

  const handleClearDemoData = async () => {
    if (window.confirm('Remove the built-in sample records? Your own services, packages, offers, and bookings will be kept.')) {
      try {
        await clearAllDemoData();
        await onRefreshData();
        alert('Demo records have been removed. Your own content is unchanged.');
      } catch (err) {
        alert(`Failed to remove demo records: ${err.message}`);
      }
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      sub: `${confirmedBookings.length} confirmed`,
      icon: Calendar,
      color: 'bg-espresso-900 text-white',
      iconColor: 'text-gold'
    },
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      sub: 'Scheduled for today',
      icon: Clock,
      color: 'bg-white text-espresso-900 border border-champagne-300',
      iconColor: 'text-gold-deep'
    },
    {
      title: 'Pending Approvals',
      value: pendingBookings.length,
      sub: 'Awaiting confirmation',
      icon: Clock4,
      color: 'bg-amber-50 text-amber-900 border border-amber-200',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Confirmed Reservations',
      value: confirmedBookings.length,
      sub: 'Active bookings',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-900 border border-emerald-200',
      iconColor: 'text-emerald-600'
    },
    {
      title: 'Total Revenue Value',
      value: `$${totalRevenue.toLocaleString()}`,
      sub: 'Combined booked volume',
      icon: DollarSign,
      color: 'bg-gradient-to-r from-[#231713] to-[#3D2B24] text-white',
      iconColor: 'text-gold'
    },
    {
      title: 'Active Services',
      value: services.length,
      sub: `${packages.length} VIP Packages`,
      icon: Scissors,
      color: 'bg-white text-espresso-900 border border-champagne-300',
      iconColor: 'text-gold-deep'
    },
    {
      title: 'Active Offers',
      value: activeOffersCount,
      sub: 'Live coupon campaigns',
      icon: Tag,
      color: 'bg-white text-espresso-900 border border-champagne-300',
      iconColor: 'text-gold-deep'
    },
    {
      title: 'Experience Pillars',
      value: experience.length,
      sub: 'Custom standards',
      icon: Award,
      color: 'bg-white text-espresso-900 border border-champagne-300',
      iconColor: 'text-gold-deep'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-[#231713] via-[#3D2B24] to-[#231713] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-luxury border border-gold/30">
        <div>
          <span className="text-gold tracking-[0.3em] uppercase text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Executive Overview
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mt-1">
            Welcome to {parlourName} Management Suite
          </h2>
          <p className="text-champagne-300/80 text-xs sm:text-sm mt-1 max-w-xl">
            Manage your salon services, packages, discounts, experience pillars, and customer reservations in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onSelectTab('services')}
            className="px-5 py-2.5 rounded-full bg-gold text-espresso-900 hover:brightness-110 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            + Add Service
          </button>
          
          <button
            onClick={() => onSelectTab('packages')}
            className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
          >
            + Add Package
          </button>

          {/* Clear Demo Data Button */}
          <button
            onClick={handleClearDemoData}
            className="px-4 py-2.5 rounded-full bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs uppercase tracking-wider font-semibold border border-rose-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Remove all demo data and start clean"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Demo Data</span>
          </button>

        </div>
      </div>

      {/* 8 Stats Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-luxury ${stat.color}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
                  {stat.title}
                </span>
                <div className={`w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center ${stat.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="font-serif text-3xl font-bold tracking-tight mb-1">
                {stat.value}
              </div>

              <span className="text-[11px] opacity-70 font-medium">
                {stat.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings Table Preview */}
      <div className="bg-white rounded-3xl border border-champagne-300 shadow-luxury overflow-hidden">
        <div className="p-6 border-b border-champagne-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-espresso-900">
              Recent Appointments
            </h3>
            <p className="text-xs text-espresso-500">
              Latest client reservations across all services and suites.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('bookings')}
            className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-gold-deep hover:text-espresso-900 transition-colors cursor-pointer"
          >
            <span>View All ({bookings.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          {bookings.length === 0 ? (
            <div className="text-center py-12 p-6">
              <Calendar className="w-8 h-8 text-champagne-400 mx-auto mb-2" />
              <p className="font-serif text-base text-espresso-800">No appointments recorded yet</p>
              <p className="text-xs text-espresso-500 mt-1">New reservations made by customers will automatically appear here.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-espresso-800">
              <thead className="bg-[#FAF7F2] text-espresso-500 uppercase tracking-wider text-[10px] border-b border-champagne-200">
                <tr>
                  <th className="px-6 py-3.5">Reference</th>
                  <th className="px-6 py-3.5">Guest</th>
                  <th className="px-6 py-3.5">Treatment</th>
                  <th className="px-6 py-3.5">Date & Slot</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-champagne-200">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-champagne-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-espresso-900">
                      {b.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-espresso-900">{b.customerName}</p>
                      <p className="text-[11px] text-espresso-400">{b.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-espresso-900 line-clamp-1">{b.itemName}</p>
                      <span className="text-[10px] text-espresso-400 capitalize">{b.itemType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium">{b.date}</p>
                      <p className="text-[11px] text-gold-deep">{b.time}</p>
                    </td>
                    <td className="px-6 py-4 font-serif font-bold text-sm">
                      ${Number(b.finalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        b.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
