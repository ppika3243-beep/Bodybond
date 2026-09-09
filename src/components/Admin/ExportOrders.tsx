import React, { useState, useMemo } from 'react';
import { Download, FileSpreadsheet, Filter, Calendar, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { OrderItem, STATUS_OPTIONS } from './OrderDetailsModal';

interface ExportOrdersProps {
  orders: OrderItem[];
}

export function ExportOrders({ orders }: ExportOrdersProps) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [exported, setExported] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;

      let matchesDate = true;
      if (dateFilter !== 'all' && order.createdAt) {
        const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
        const now = new Date();
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);

        if (dateFilter === 'today') {
          matchesDate = orderDate.toDateString() === now.toDateString();
        } else if (dateFilter === '7days') {
          matchesDate = diffDays <= 7;
        } else if (dateFilter === '30days') {
          matchesDate = diffDays <= 30;
        }
      }

      return matchesStatus && matchesDate;
    });
  }, [orders, statusFilter, dateFilter]);

  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return;

    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone Number',
      'Delivery Address',
      'Area',
      'District',
      'Product Name',
      'Quantity',
      'Product Price (BDT)',
      'Delivery Charge (BDT)',
      'Total Amount (BDT)',
      'Payment Method',
      'Order Status',
      'Customer Notes',
      'Admin Internal Notes'
    ];

    const rows = filteredOrders.map(order => [
      order.orderId,
      order.date || (order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : ''),
      order.customerName,
      `'${order.phone}`, // Leading apostrophe prevents Excel from stripping leading 0
      order.address,
      order.area || '',
      order.district || '',
      order.productName || 'BODYBOND Body Glue',
      order.quantity,
      order.productPrice || '',
      order.deliveryCharge ?? 0,
      order.totalAmount,
      order.paymentMethod || 'Cash on Delivery',
      order.orderStatus,
      order.notes || '',
      order.adminNotes || ''
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\r\n');

    // Add UTF-8 BOM (\uFEFF) for Excel / Google Sheets compatibility
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const todayStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `bodybond-orders-${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Main Export Card */}
      <div className="bg-brand-white border border-brand-gray rounded-sm shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-brand-gray gap-4">
          <div>
            <h2 className="text-xl font-bold text-brand-black flex items-center gap-2">
              <FileSpreadsheet className="text-emerald-700" size={20} /> Export Orders to CSV
            </h2>
            <p className="text-brand-gray-dark text-xs mt-0.5">
              Download clean spreadsheet data ready for Excel, Google Sheets, or Courier bulk-booking.
            </p>
          </div>

          {exported && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-sm border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
              <Check size={14} /> Download Initiated!
            </span>
          )}
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div>
            <label htmlFor="export-status-select" className="block text-xs font-bold uppercase tracking-widest text-brand-gray-dark mb-2 flex items-center gap-1.5">
              <Filter size={14} /> Filter By Status
            </label>
            <select
              id="export-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-brand-gray rounded-sm py-2.5 px-3 text-xs font-bold uppercase focus:outline-none focus:border-brand-black transition-colors bg-brand-white"
            >
              <option value="All">All Statuses ({orders.length})</option>
              {STATUS_OPTIONS.map(status => {
                const count = orders.filter(o => o.orderStatus === status).length;
                return (
                  <option key={status} value={status}>
                    {status} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label htmlFor="export-date-select" className="block text-xs font-bold uppercase tracking-widest text-brand-gray-dark mb-2 flex items-center gap-1.5">
              <Calendar size={14} /> Date Range
            </label>
            <select
              id="export-date-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full border border-brand-gray rounded-sm py-2.5 px-3 text-xs font-bold uppercase focus:outline-none focus:border-brand-black transition-colors bg-brand-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today Only</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Summary Banner & CTA */}
        <div className="bg-brand-gray/20 border border-brand-gray rounded-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gray-dark block">
              Records Selected for Export
            </span>
            <div className="text-2xl font-black text-brand-black mt-0.5">
              {filteredOrders.length} <span className="text-xs font-semibold text-brand-gray-dark font-sans">orders</span>
            </div>
            {filteredOrders.length > 0 && (
              <span className="text-[11px] text-brand-gray-dark mt-1 block">
                Total value: ৳{filteredOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0).toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleExportCSV}
            disabled={filteredOrders.length === 0}
            className="w-full sm:w-auto px-8 py-3.5 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-widest hover:bg-brand-pink hover:text-brand-black transition-colors rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            <Download size={16} /> Download CSV File
          </button>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="bg-brand-white border border-brand-gray rounded-sm p-6 text-xs space-y-4">
        <h3 className="font-bold uppercase tracking-wider text-brand-black flex items-center gap-2">
          <FileSpreadsheet size={15} /> How to open in Google Sheets or Excel
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-brand-gray-dark">
          <div className="space-y-2">
            <strong className="text-brand-black block">Google Sheets (Recommended)</strong>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Open <strong>sheets.google.com</strong> in your browser.</li>
              <li>Click <strong>File</strong> &gt; <strong>Import</strong>.</li>
              <li>Go to the <strong>Upload</strong> tab and choose the downloaded CSV.</li>
              <li>Leave separator type as <em>Detect automatically</em> and click <strong>Import data</strong>.</li>
            </ol>
          </div>

          <div className="space-y-2">
            <strong className="text-brand-black block">Microsoft Excel</strong>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Double-click the downloaded <code>.csv</code> file to open directly.</li>
              <li>Our file includes a UTF-8 BOM header to prevent character corruption.</li>
              <li>Customer phone numbers are preserved with leading zeros.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
