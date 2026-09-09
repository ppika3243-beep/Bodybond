import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye, Phone, MapPin, Calendar, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { OrderItem, STATUS_OPTIONS } from './OrderDetailsModal';

interface OrdersTableProps {
  orders: OrderItem[];
  loading: boolean;
  onSelectOrder: (order: OrderItem) => void;
  onStatusChange: (orderDocId: string, newStatus: string) => Promise<void>;
  initialStatusFilter?: string;
}

export function OrdersTable({
  orders,
  loading,
  onSelectOrder,
  onStatusChange,
  initialStatusFilter = 'All'
}: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search matching
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term || 
        order.orderId?.toLowerCase().includes(term) ||
        order.phone?.toLowerCase().includes(term) ||
        order.customerName?.toLowerCase().includes(term) ||
        order.address?.toLowerCase().includes(term);

      // Status matching
      const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;

      // Date matching
      let matchesDate = true;
      if (dateFilter !== 'all' && order.createdAt) {
        const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - orderDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (dateFilter === 'today') {
          matchesDate = orderDate.toDateString() === now.toDateString();
        } else if (dateFilter === '7days') {
          matchesDate = diffDays <= 7;
        } else if (dateFilter === '30days') {
          matchesDate = diffDays <= 30;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const handleInlineStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await onStatusChange(orderId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'border-amber-400 text-amber-900 bg-amber-50';
      case 'Confirmed':
        return 'border-emerald-400 text-emerald-900 bg-emerald-50';
      case 'Processing':
        return 'border-blue-400 text-blue-900 bg-blue-50';
      case 'Packed':
        return 'border-indigo-400 text-indigo-900 bg-indigo-50';
      case 'Shipped':
        return 'border-purple-400 text-purple-900 bg-purple-50';
      case 'Out for Delivery':
        return 'border-cyan-400 text-cyan-900 bg-cyan-50';
      case 'Delivered':
        return 'border-zinc-900 text-white bg-zinc-900';
      case 'Cancelled':
        return 'border-rose-400 text-rose-900 bg-rose-50';
      case 'Returned':
        return 'border-orange-400 text-orange-900 bg-orange-50';
      default:
        return 'border-brand-gray text-brand-black bg-brand-white';
    }
  };

  return (
    <div className="bg-brand-white border border-brand-gray rounded-sm shadow-sm overflow-hidden">
      
      {/* Search and Filters Header */}
      <div className="p-4 sm:p-6 border-b border-brand-gray space-y-4 bg-brand-white">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-dark" size={18} />
            <input 
              type="text"
              placeholder="Search by Order ID, Customer Name, or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-brand-gray rounded-sm text-sm focus:outline-none focus:border-brand-black transition-colors"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-gray-dark hover:text-brand-black font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <Filter size={16} className="text-brand-gray-dark shrink-0" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto border border-brand-gray rounded-sm py-2.5 px-3 text-xs font-bold uppercase focus:outline-none focus:border-brand-black transition-colors bg-brand-white"
              >
                <option value="All">All Statuses</option>
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
              <Calendar size={16} className="text-brand-gray-dark shrink-0" />
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="w-full sm:w-auto border border-brand-gray rounded-sm py-2.5 px-3 text-xs font-bold uppercase focus:outline-none focus:border-brand-black transition-colors bg-brand-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Quick Reset */}
        <div className="flex justify-between items-center text-xs text-brand-gray-dark pt-1">
          <span>
            Showing <strong className="text-brand-black">{filteredOrders.length}</strong> of {orders.length} orders
            {statusFilter !== 'All' && ` (Filtered by: ${statusFilter})`}
          </span>
          {(searchTerm || statusFilter !== 'All' || dateFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setDateFilter('all');
              }}
              className="text-xs font-bold text-brand-pink hover:text-brand-black uppercase tracking-wider"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Desktop Table & Mobile Cards */}
      {loading ? (
        <div className="p-16 text-center text-brand-gray-dark">
          <p className="text-sm font-medium">Loading orders from Firestore...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-16 text-center text-brand-gray-dark space-y-3">
          <AlertCircle className="mx-auto text-brand-gray-dark" size={32} />
          <p className="font-bold text-brand-black">No orders found</p>
          <p className="text-xs max-w-sm mx-auto">
            {orders.length === 0
              ? 'No customer orders have been placed yet.'
              : 'Try adjusting your search keywords, status filter, or date range.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table (hidden on small screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-brand-gray/40 text-brand-gray-dark text-xs uppercase tracking-wider border-b border-brand-gray">
                <tr>
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Order Details</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-gray/10 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-brand-black">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-gray-dark">
                      {order.date || 'Recent'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-brand-black font-bold">{order.customerName}</div>
                      <div className="text-brand-gray-dark text-xs font-mono">{order.phone}</div>
                      <div className="text-brand-gray-dark text-xs truncate max-w-[200px]" title={order.address}>
                        {order.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-brand-black">৳{order.totalAmount}</div>
                      <div className="text-brand-gray-dark text-xs">
                        {order.quantity}x {order.productName || 'Body Glue'}
                      </div>
                      <div className="text-brand-gray-dark text-[11px]">
                        {order.area || 'Inside Dhaka'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.orderStatus}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleInlineStatusChange(order.id, e.target.value)}
                        className={`px-2.5 py-1.5 text-xs font-bold rounded-sm border cursor-pointer focus:outline-none ${getStatusColor(order.orderStatus)}`}
                      >
                        {STATUS_OPTIONS.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-brand-pink hover:text-brand-black transition-colors"
                      >
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards (shown only on small screens) */}
          <div className="md:hidden divide-y divide-brand-gray">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-4 space-y-3 bg-brand-white">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-brand-black text-sm block">
                      {order.orderId}
                    </span>
                    <span className="text-[11px] text-brand-gray-dark block">
                      {order.date || 'Recent'}
                    </span>
                  </div>

                  <span className="font-extrabold text-brand-pink text-base">
                    ৳{order.totalAmount}
                  </span>
                </div>

                <div className="bg-brand-gray/20 p-3 rounded-sm text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-brand-gray-dark font-medium">Customer:</span>
                    <strong className="text-brand-black">{order.customerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-gray-dark font-medium">Phone:</span>
                    <a href={`tel:${order.phone}`} className="font-mono text-brand-black font-semibold underline">
                      {order.phone}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-gray-dark font-medium">Items:</span>
                    <span className="text-brand-black font-medium">{order.quantity}x {order.productName || 'Body Glue'}</span>
                  </div>
                  <div className="text-[11px] text-brand-gray-dark truncate pt-1 border-t border-brand-gray">
                    {order.address}, {order.area}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <select 
                    value={order.orderStatus}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleInlineStatusChange(order.id, e.target.value)}
                    className={`flex-1 py-2 px-2.5 text-xs font-bold rounded-sm border focus:outline-none min-h-[44px] ${getStatusColor(order.orderStatus)}`}
                  >
                    {STATUS_OPTIONS.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => onSelectOrder(order)}
                    className="min-h-[44px] px-4 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-brand-pink hover:text-brand-black transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Eye size={14} /> Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}
