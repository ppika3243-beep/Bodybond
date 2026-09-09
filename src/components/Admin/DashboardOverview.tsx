import React from 'react';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, XCircle, RotateCcw, ArrowRight, DollarSign, Users, Eye } from 'lucide-react';
import { OrderItem } from './OrderDetailsModal';

interface DashboardOverviewProps {
  orders: OrderItem[];
  loading: boolean;
  onSelectOrder: (order: OrderItem) => void;
  onNavigateTab: (tab: 'orders', statusFilter?: string) => void;
  onStatusChange: (orderDocId: string, newStatus: string) => Promise<void>;
}

export function DashboardOverview({
  orders,
  loading,
  onSelectOrder,
  onNavigateTab,
  onStatusChange
}: DashboardOverviewProps) {
  // Compute counts from real Firestore orders
  const counts = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'Pending').length,
    confirmed: orders.filter(o => o.orderStatus === 'Confirmed').length,
    processing: orders.filter(o => o.orderStatus === 'Processing').length,
    packed: orders.filter(o => o.orderStatus === 'Packed').length,
    shipped: orders.filter(o => o.orderStatus === 'Shipped').length,
    outForDelivery: orders.filter(o => o.orderStatus === 'Out for Delivery').length,
    delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length,
    returned: orders.filter(o => o.orderStatus === 'Returned').length,
  };

  const totalDeliveredRevenue = orders
    .filter(o => o.orderStatus === 'Delivered')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const totalOrderValue = orders
    .filter(o => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Returned')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const recentOrders = orders.slice(0, 6);

  const statusCards = [
    { label: 'Pending', count: counts.pending, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200', statusKey: 'Pending' },
    { label: 'Confirmed', count: counts.confirmed, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', statusKey: 'Confirmed' },
    { label: 'Processing', count: counts.processing, icon: Package, color: 'text-blue-600 bg-blue-50 border-blue-200', statusKey: 'Processing' },
    { label: 'Packed', count: counts.packed, icon: Package, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', statusKey: 'Packed' },
    { label: 'Shipped', count: counts.shipped, icon: Truck, color: 'text-purple-600 bg-purple-50 border-purple-200', statusKey: 'Shipped' },
    { label: 'Out for Delivery', count: counts.outForDelivery, icon: Truck, color: 'text-cyan-600 bg-cyan-50 border-cyan-200', statusKey: 'Out for Delivery' },
    { label: 'Delivered', count: counts.delivered, icon: CheckCircle2, color: 'text-zinc-900 bg-zinc-100 border-zinc-300', statusKey: 'Delivered' },
    { label: 'Cancelled', count: counts.cancelled, icon: XCircle, color: 'text-rose-600 bg-rose-50 border-rose-200', statusKey: 'Cancelled' },
    { label: 'Returned', count: counts.returned, icon: RotateCcw, color: 'text-orange-600 bg-orange-50 border-orange-200', statusKey: 'Returned' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Headline Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div 
          onClick={() => onNavigateTab('orders', 'All')}
          className="bg-brand-white border border-brand-gray p-6 rounded-sm shadow-xs cursor-pointer hover:border-brand-black transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-dark">Total Orders Placed</span>
            <div className="w-10 h-10 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-black">
              <Package size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-brand-black">{counts.total}</div>
          <span className="text-xs text-brand-gray-dark mt-1 inline-flex items-center gap-1 hover:text-brand-pink">
            View all orders <ArrowRight size={12} />
          </span>
        </div>

        <div className="bg-brand-white border border-brand-gray p-6 rounded-sm shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-dark">Delivered Revenue</span>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
              <span className="font-bold text-base">৳</span>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-800">৳{totalDeliveredRevenue.toLocaleString()}</div>
          <span className="text-xs text-brand-gray-dark mt-1 block">From {counts.delivered} completed delivery orders</span>
        </div>

        <div className="bg-brand-white border border-brand-gray p-6 rounded-sm shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-dark">Active Pipeline Value</span>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-brand-black">৳{totalOrderValue.toLocaleString()}</div>
          <span className="text-xs text-brand-gray-dark mt-1 block">Excluding cancelled/returned orders</span>
        </div>
      </div>

      {/* Real Counts Grid by Status */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-black">
            Order Status Breakdown
          </h2>
          <span className="text-xs text-brand-gray-dark">Click card to filter orders</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {statusCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.label}
                onClick={() => onNavigateTab('orders', card.statusKey)}
                className={`text-left p-4 rounded-sm border transition-all hover:shadow-xs ${card.color}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold tracking-tight">{card.label}</span>
                  <Icon size={16} />
                </div>
                <div className="text-2xl font-black">{card.count}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-brand-white border border-brand-gray rounded-sm shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-gray flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-brand-black">Recent Orders</h2>
            <p className="text-brand-gray-dark text-xs">Latest customer activity updated in real-time from Firestore.</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders', 'All')}
            className="text-xs font-bold uppercase tracking-widest text-brand-black hover:text-brand-pink transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            View All ({counts.total}) <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-brand-gray-dark text-sm">Loading latest orders...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-12 text-center text-brand-gray-dark text-sm">
            No customer orders received yet. Once orders are placed via Checkout, they will appear here live.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-brand-gray/40 text-brand-gray-dark text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Order ID</th>
                  <th className="px-6 py-3.5 font-bold">Date & Time</th>
                  <th className="px-6 py-3.5 font-bold">Customer</th>
                  <th className="px-6 py-3.5 font-bold">Total</th>
                  <th className="px-6 py-3.5 font-bold">Status</th>
                  <th className="px-6 py-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-gray/10 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-brand-black">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-gray-dark">
                      {order.date || 'Recent'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-black">{order.customerName}</div>
                      <div className="text-xs text-brand-gray-dark">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-black">
                      ৳{order.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-sm border ${
                        order.orderStatus === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                        order.orderStatus === 'Confirmed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        order.orderStatus === 'Delivered' ? 'bg-zinc-900 text-white border-zinc-900' :
                        order.orderStatus === 'Cancelled' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                        'bg-blue-50 text-blue-800 border-blue-300'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-brand-pink hover:text-brand-black transition-colors"
                      >
                        <Eye size={12} /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
