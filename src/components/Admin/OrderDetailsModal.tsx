import React, { useState } from 'react';
import { X, Phone, MessageSquare, MapPin, Package, CreditCard, Clock, Check, Copy, AlertCircle, FileText, Send } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../utils/firebase';

export interface OrderItem {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  area?: string;
  district?: string;
  productId?: string;
  productName?: string;
  quantity: number;
  productPrice?: number;
  deliveryCharge?: number;
  totalAmount: number;
  paymentMethod?: string;
  orderStatus: string;
  notes?: string;
  adminNotes?: string;
  date?: string;
  createdAt?: any;
}

interface OrderDetailsModalProps {
  order: OrderItem | null;
  onClose: () => void;
  onStatusChange: (orderDocId: string, newStatus: string) => Promise<void>;
}

export const STATUS_OPTIONS = [
  'Pending',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Returned'
];

export function OrderDetailsModal({ order, onClose, onStatusChange }: OrderDetailsModalProps) {
  if (!order) return null;

  const [copied, setCopied] = useState(false);
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSuccess, setNotesSuccess] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Normalize phone for WhatsApp link: if starts with 01, prepend 88
  const cleanPhone = order.phone.replace(/[^0-9]/g, '');
  const waNumber = cleanPhone.startsWith('01') ? `88${cleanPhone}` : cleanPhone;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${order.customerName}, this is regarding your BODYBOND order #${order.orderId}.`)}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAdminNotes = async () => {
    setSavingNotes(true);
    setNotesSuccess(false);
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        adminNotes: adminNotes.trim()
      });
      setNotesSuccess(true);
      setTimeout(() => setNotesSuccess(false), 2500);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${order.id}`);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleStatusSelect = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      await onStatusChange(order.id, newStatus);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Processing':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Packed':
        return 'bg-indigo-50 text-indigo-800 border-indigo-300';
      case 'Shipped':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'Out for Delivery':
        return 'bg-cyan-50 text-cyan-800 border-cyan-300';
      case 'Delivered':
        return 'bg-zinc-900 text-white border-zinc-900';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'Returned':
        return 'bg-orange-50 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-brand-white border border-brand-gray w-full max-w-2xl rounded-sm shadow-xl overflow-hidden relative my-8">
        
        {/* Header */}
        <div className="bg-brand-black text-brand-white p-6 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold tracking-tight">{order.orderId}</span>
              <button 
                onClick={handleCopyId}
                className="text-xs bg-brand-white/10 hover:bg-brand-white/20 px-2 py-1 rounded transition-colors flex items-center gap-1"
                title="Copy Order ID"
              >
                {copied ? <><Check size={12} className="text-brand-pink" /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>
            <p className="text-xs text-brand-white/70 mt-1 flex items-center gap-1.5">
              <Clock size={12} /> Placed on: {order.date || 'Recent'}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-sm bg-brand-white/10 hover:bg-brand-white/20 flex items-center justify-center text-brand-white transition-colors"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-160px)] overflow-y-auto">
          
          {/* Status Quick Control */}
          <div className="bg-brand-gray/20 p-4 rounded-sm border border-brand-gray flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-dark block mb-1">
                Current Order Status
              </span>
              <span className={`inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-sm border ${getStatusBadgeStyle(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="modal-status-select" className="text-xs font-bold uppercase tracking-wider text-brand-black">Update Status:</label>
              <select
                id="modal-status-select"
                value={order.orderStatus}
                disabled={updatingStatus}
                onChange={(e) => handleStatusSelect(e.target.value)}
                className="border border-brand-gray bg-brand-white rounded-sm py-2 px-3 text-xs font-bold focus:outline-none focus:border-brand-black transition-colors"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="border border-brand-gray rounded-sm p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray-dark flex items-center gap-2">
              <MapPin size={15} /> Customer & Delivery Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-brand-gray-dark block">Customer Name</span>
                <span className="font-bold text-brand-black text-base">{order.customerName}</span>
              </div>

              <div>
                <span className="text-xs text-brand-gray-dark block">Phone Number</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <a 
                    href={`tel:${order.phone}`}
                    className="font-bold text-brand-black hover:text-brand-pink underline flex items-center gap-1"
                  >
                    <Phone size={14} /> {order.phone}
                  </a>
                  <a 
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 transition-colors"
                    title="Message customer on WhatsApp"
                  >
                    <MessageSquare size={12} /> WhatsApp
                  </a>
                </div>
              </div>

              <div className="sm:col-span-2">
                <span className="text-xs text-brand-gray-dark block">Delivery Address</span>
                <p className="font-medium text-brand-black mt-0.5 whitespace-pre-wrap">{order.address}</p>
                <div className="flex gap-2 mt-2">
                  {order.area && (
                    <span className="text-xs bg-brand-gray/40 text-brand-black px-2 py-0.5 rounded-sm font-semibold">
                      Area: {order.area}
                    </span>
                  )}
                  {order.district && (
                    <span className="text-xs bg-brand-gray/40 text-brand-black px-2 py-0.5 rounded-sm font-semibold">
                      District: {order.district}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items & Financials */}
          <div className="border border-brand-gray rounded-sm p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray-dark flex items-center gap-2">
              <Package size={15} /> Order Items & Payment
            </h3>

            <div className="border-b border-brand-gray pb-4">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-brand-black">{order.productName || 'BODYBOND Body Glue'}</span>
                  <span className="text-xs text-brand-gray-dark block">Qty: {order.quantity}</span>
                </div>
                <span className="font-bold text-brand-black">
                  ৳{order.productPrice ? order.productPrice * order.quantity : '—'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-brand-gray-dark pt-1">
              <div className="flex justify-between">
                <span>Subtotal ({order.quantity} item{order.quantity > 1 ? 's' : ''}):</span>
                <span className="font-medium text-brand-black">
                  ৳{order.productPrice ? order.productPrice * order.quantity : order.totalAmount - (order.deliveryCharge || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge ({order.area || 'Standard'}):</span>
                <span className="font-medium text-brand-black">
                  {order.deliveryCharge === 0 ? 'FREE (৳0)' : `৳${order.deliveryCharge || 0}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-medium text-brand-black flex items-center gap-1">
                  <CreditCard size={12} /> {order.paymentMethod || 'Cash on Delivery (COD)'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-brand-black border-t border-brand-gray pt-2 mt-2">
                <span>Total Amount Due:</span>
                <span className="text-brand-pink font-extrabold text-base">৳{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Customer Order Notes */}
          {order.notes && (
            <div className="border border-amber-200 bg-amber-50/60 rounded-sm p-4 text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider mb-1">
                <FileText size={14} /> Customer Checkout Note
              </span>
              <p className="text-amber-800 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}

          {/* Private Admin Notes */}
          <div className="border border-brand-gray rounded-sm p-5 space-y-3 bg-brand-white">
            <div className="flex justify-between items-center">
              <label htmlFor="admin-notes-textarea" className="text-xs font-bold uppercase tracking-widest text-brand-black flex items-center gap-2">
                <FileText size={15} /> Internal Admin Notes (Private)
              </label>
              {notesSuccess && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check size={13} /> Notes saved
                </span>
              )}
            </div>
            <textarea
              id="admin-notes-textarea"
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Private notes (e.g. Customer requested call before delivery, address verified, Courier tracking ID)..."
              className="w-full p-3 border border-brand-gray focus:border-brand-black outline-none text-xs rounded-sm transition-colors"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveAdminNotes}
                disabled={savingNotes}
                className="bg-brand-black text-brand-white px-4 py-2 text-xs font-bold tracking-wider uppercase hover:bg-brand-pink hover:text-brand-black transition-colors rounded-sm flex items-center gap-1.5 disabled:opacity-70"
              >
                <Send size={12} /> {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-brand-gray/30 p-4 border-t border-brand-gray flex justify-between items-center">
          <span className="text-xs text-brand-gray-dark">
            Doc ID: <span className="font-mono text-[11px]">{order.id}</span>
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-widest hover:bg-brand-pink hover:text-brand-black transition-colors rounded-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
