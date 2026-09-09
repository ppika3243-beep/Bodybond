import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Truck, ShieldCheck, Lock, Search, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCT_CONFIG } from '../config';
import { db, handleFirestoreError, OperationType } from '../utils/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<null | 'tracking' | 'not-found' | 'error'>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setOrderData(null);

    try {
      const cleanOrderId = orderId.trim();
      const cleanPhone = phone.trim().replace(/[^0-9a-zA-Z]/g, '');
      const docId = `${cleanOrderId}_${cleanPhone}`;
      let docSnap = await getDoc(doc(db, 'orders', docId));

      // Fallback for any legacy docId format
      if (!docSnap.exists() && phone.trim() !== cleanPhone) {
        docSnap = await getDoc(doc(db, 'orders', `${cleanOrderId}_${phone.trim()}`));
      }

      if (docSnap.exists()) {
        setOrderData(docSnap.data());
        setStatus('tracking');
      } else {
        setStatus('not-found');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const renderStatusTimeline = (currentStatus: string) => {
    const statuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    
    // Check if cancelled or returned
    if (currentStatus === 'Cancelled') {
      return (
        <div className="relative pl-8 border-l-2 border-red-500 py-2">
          <div className="absolute -left-[9px] top-3 bg-red-500 h-4 w-4 rounded-full border-4 border-brand-white"></div>
          <h3 className="font-bold text-red-600">Order Cancelled</h3>
          <p className="text-sm text-brand-gray-dark mt-1">This order has been cancelled.</p>
        </div>
      );
    }
    
    if (currentStatus === 'Returned') {
      return (
        <div className="relative pl-8 border-l-2 border-red-500 py-2">
          <div className="absolute -left-[9px] top-3 bg-red-500 h-4 w-4 rounded-full border-4 border-brand-white"></div>
          <h3 className="font-bold text-red-600">Order Returned</h3>
          <p className="text-sm text-brand-gray-dark mt-1">This order has been returned.</p>
        </div>
      );
    }

    let currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex === -1) currentIndex = 0;

    return (
      <div className="relative pl-8 border-l-2 border-brand-pink space-y-8 pb-4">
        <div className="relative">
          <div className={`absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-brand-white ${currentIndex >= 0 ? 'bg-brand-pink' : 'bg-brand-gray'}`}></div>
          <h3 className={`font-bold ${currentIndex >= 0 ? 'text-brand-black' : 'text-brand-gray-dark'}`}>Order Placed</h3>
          <p className="text-sm text-brand-gray-dark mt-1">We have received your order.</p>
        </div>
        <div className="relative">
          <div className={`absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-brand-white ${currentIndex >= 2 ? 'bg-brand-pink' : 'bg-brand-gray'}`}></div>
          <h3 className={`font-bold ${currentIndex >= 2 ? 'text-brand-black' : 'text-brand-gray-dark'}`}>Processing</h3>
          <p className="text-sm text-brand-gray-dark mt-1">Your item is being processed and packed.</p>
        </div>
        <div className="relative">
          <div className={`absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-brand-white ${currentIndex >= 5 ? 'bg-brand-pink' : 'bg-brand-gray'}`}></div>
          <h3 className={`font-bold ${currentIndex >= 5 ? 'text-brand-black' : 'text-brand-gray-dark'}`}>Out for Delivery</h3>
          <p className="text-sm text-brand-gray-dark mt-1">Courier is on the way.</p>
        </div>
        {currentIndex >= 6 && (
          <div className="relative">
            <div className={`absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-brand-white bg-brand-black`}></div>
            <h3 className={`font-bold text-brand-black`}>Delivered</h3>
            <p className="text-sm text-brand-gray-dark mt-1">Package has been delivered.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen py-24 px-6 bg-brand-white">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl md:text-5xl mb-6 text-center">Track Your Order</h1>
        <p className="text-center text-brand-gray-dark font-medium mb-12">Enter your Order ID and Phone Number to check your delivery status.</p>
        
        <div className="bg-brand-gray/30 p-8 md:p-12 border border-brand-gray mb-12">
          <form onSubmit={handleTrack} className="space-y-6">
            <div>
              <label className="block text-sm font-bold tracking-widest uppercase mb-2">Order ID</label>
              <input 
                type="text" 
                placeholder="e.g. BB-12345" 
                className="w-full p-4 border border-brand-gray focus:border-brand-black outline-none transition-colors bg-brand-white text-brand-black placeholder:text-brand-gray-dark"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold tracking-widest uppercase mb-2">Phone Number</label>
              <input 
                type="tel" 
                placeholder="e.g. 01711223344" 
                className="w-full p-4 border border-brand-gray focus:border-brand-black outline-none transition-colors bg-brand-white text-brand-black placeholder:text-brand-gray-dark"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-black text-brand-white py-5 text-sm font-bold tracking-widest uppercase hover:bg-brand-pink hover:text-brand-black transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : <><Search size={18} /> Track Order</>}
            </button>
          </form>
        </div>

        {status === 'not-found' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 p-6 border border-red-200 text-red-700 flex items-start gap-3">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold mb-1">Order Not Found</h3>
              <p className="text-sm">Please check your Order ID and Phone Number and try again.</p>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 p-6 border border-red-200 text-red-700 flex items-start gap-3">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold mb-1">Tracking Error</h3>
              <p className="text-sm">An error occurred while tracking your order. Please try again later.</p>
            </div>
          </motion.div>
        )}

        {status === 'tracking' && orderData && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-white p-8 border-2 border-brand-black">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Truck size={20} className="text-brand-pink" /> Delivery Status
            </h2>
            
            <div className="mb-8 p-4 bg-brand-gray/20 rounded-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-brand-gray-dark uppercase tracking-widest">Order ID</span>
                <span className="font-bold">{orderData.orderId}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-brand-gray-dark uppercase tracking-widest">Product</span>
                <span className="font-medium text-sm">{orderData.quantity}x {orderData.productName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-brand-gray-dark uppercase tracking-widest">Total</span>
                <span className="font-bold text-brand-pink">{PRODUCT_CONFIG.currency}{orderData.totalAmount}</span>
              </div>
            </div>

            {renderStatusTimeline(orderData.orderStatus)}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function Checkout() {
  const [area, setArea] = useState('inside');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [productData, setProductData] = useState<any>(null);
  const [settingsData, setSettingsData] = useState<any>(null);
  
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    const fetchProductAndSettings = async () => {
      try {
        const docRef = doc(db, 'products', 'body-glue');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProductData(docSnap.data());
        }

        const settingsSnap = await getDoc(doc(db, 'settings', 'general'));
        if (settingsSnap.exists()) {
          setSettingsData(settingsSnap.data());
        }
      } catch (err) {
        console.error('Failed to load product/settings data in checkout', err);
      }
    };
    fetchProductAndSettings();
  }, []);

  const deliveryInside = typeof settingsData?.deliveryInside === 'number' 
    ? settingsData.deliveryInside 
    : PRODUCT_CONFIG.deliveryInside;
  const deliveryOutside = typeof settingsData?.deliveryOutside === 'number' 
    ? settingsData.deliveryOutside 
    : PRODUCT_CONFIG.deliveryOutside;
  const deliveryFee = area === 'inside' ? deliveryInside : deliveryOutside;
  const itemPrice = productData?.price ?? PRODUCT_CONFIG.price;
  const productName = productData?.name ?? 'BODYBOND Body Glue';
  const primaryImageUrl = productData?.images?.find((img: any) => img.isPrimary)?.url 
    ?? (productData?.images?.[0]?.url ?? '/assets/product-front.jpg');
  const total = (itemPrice * quantity) + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate a realistic order ID
      const newOrderId = `BB-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Clean phone number for Firestore docId to guarantee strict alphanumeric format
      const cleanPhone = phone.trim().replace(/[^0-9a-zA-Z]/g, '');
      const docId = `${newOrderId}_${cleanPhone || phone.trim()}`;
      
      const orderData = {
        orderId: newOrderId,
        createdAt: serverTimestamp(),
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        area: area === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka',
        district: area === 'inside' ? 'Dhaka' : 'Other',
        productId: 'body-glue',
        productName: productName,
        quantity,
        productPrice: itemPrice,
        deliveryCharge: deliveryFee,
        totalAmount: total,
        paymentMethod: 'Cash on Delivery',
        orderStatus: 'Pending',
        notes: notes.trim()
      };

      await setDoc(doc(db, 'orders', docId), orderData);
      setSuccessOrderId(newOrderId);
      
    } catch (err) {
      console.error('Checkout error', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successOrderId) {
    return (
      <div className="w-full min-h-screen py-32 px-6 flex items-center justify-center bg-brand-white">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center bg-brand-gray/30 p-12 border border-brand-gray">
          <div className="w-20 h-20 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-8 text-brand-black">
            <ShieldCheck size={40} strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed</h1>
          <p className="text-brand-gray-dark font-medium mb-8 leading-relaxed">
            Thank you! Your order for BODYBOND Body Glue has been successfully placed. We will process it shortly.
          </p>
          <div className="bg-brand-white p-6 border border-brand-gray mb-8">
            <div className="text-sm text-brand-gray-dark mb-1 font-bold tracking-widest uppercase">Order ID</div>
            <div className="text-2xl font-bold text-brand-black">{successOrderId}</div>
          </div>
          <Link to="/" className="inline-block border-2 border-brand-black text-brand-black px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-brand-black hover:text-brand-white transition-colors">
            Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-16 md:py-24 px-6 bg-brand-gray/30">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl mb-12 text-center">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Form */}
          <div className="lg:w-2/3 bg-brand-white p-8 md:p-12 border border-brand-gray shadow-sm">
            <h2 className="text-xl font-bold mb-8 pb-4 border-b-2 border-brand-gray uppercase tracking-widest text-sm">Delivery Information</h2>
            
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-brand-gray-dark">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-4 border border-brand-gray focus:border-brand-black outline-none transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-brand-gray-dark">Phone Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-4 border border-brand-gray focus:border-brand-black outline-none transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-brand-gray-dark">Delivery Area *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`border-2 p-4 cursor-pointer transition-colors ${area === 'inside' ? 'border-brand-black bg-brand-gray/20' : 'border-brand-gray hover:border-brand-black/30'}`}>
                    <input type="radio" name="area" value="inside" checked={area === 'inside'} onChange={() => setArea('inside')} className="hidden" />
                    <div className="font-bold mb-1">Inside Dhaka</div>
                    <div className="text-brand-pink font-bold text-sm">{PRODUCT_CONFIG.deliveryInside === 0 ? 'Free Delivery' : `${PRODUCT_CONFIG.currency}${PRODUCT_CONFIG.deliveryInside}`}</div>
                  </label>
                  <label className={`border-2 p-4 cursor-pointer transition-colors ${area === 'outside' ? 'border-brand-black bg-brand-gray/20' : 'border-brand-gray hover:border-brand-black/30'}`}>
                    <input type="radio" name="area" value="outside" checked={area === 'outside'} onChange={() => setArea('outside')} className="hidden" />
                    <div className="font-bold mb-1">Outside Dhaka</div>
                    <div className="text-brand-pink font-bold text-sm">{PRODUCT_CONFIG.currency}{PRODUCT_CONFIG.deliveryOutside}</div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-brand-gray-dark">Full Address *</label>
                <textarea 
                  required 
                  rows={3} 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-4 border border-brand-gray focus:border-brand-black outline-none transition-colors resize-none" 
                  placeholder="House/Flat No, Road Name, Area..." 
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-brand-gray-dark">Order Notes (Optional)</label>
                <textarea 
                  rows={2} 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-4 border border-brand-gray focus:border-brand-black outline-none transition-colors resize-none" 
                  placeholder="Special instructions for delivery..." 
                />
              </div>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:w-1/3">
            <div className="bg-brand-black text-brand-white p-8 md:p-10 sticky top-32">
              <h2 className="text-xl font-bold mb-8 pb-4 border-b border-brand-white/20 uppercase tracking-widest text-sm">Order Summary</h2>
              
              <div className="flex gap-4 mb-8 pb-8 border-b border-brand-white/20">
                <div className="w-20 h-24 bg-brand-white relative overflow-hidden flex items-center justify-center shrink-0">
                  <img src={primaryImageUrl} alt={productName} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold mb-2">{productName}</h3>
                  <p className="text-brand-white/60 text-sm mb-4">{PRODUCT_CONFIG.currency}{itemPrice}</p>
                  
                  <div className="flex items-center gap-4 border border-brand-white/30 w-fit">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 hover:bg-brand-white/10 transition-colors">-</button>
                    <span className="text-sm font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 hover:bg-brand-white/10 transition-colors">+</button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm font-medium border-b border-brand-white/20 pb-8 mb-8">
                <div className="flex justify-between">
                  <span className="text-brand-white/70">Subtotal</span>
                  <span>{PRODUCT_CONFIG.currency}{itemPrice * quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-white/70">Delivery</span>
                  <span>{deliveryFee === 0 ? 'Free' : `${PRODUCT_CONFIG.currency}${deliveryFee}`}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total</span>
                <span className="text-brand-pink">{PRODUCT_CONFIG.currency}{total}</span>
              </div>
              <p className="text-xs text-brand-white/50 mb-8 text-center font-medium">
                Estimated Delivery: {area === 'inside' ? '2 days' : '3-4 days'}
              </p>

              <div className="bg-brand-white/10 p-4 mb-8 text-sm font-medium flex items-center justify-center gap-2">
                <Lock size={16} className="text-brand-pink" /> Cash on Delivery Only
              </div>

              <button 
                form="checkout-form" 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-pink text-brand-black py-5 text-sm font-bold tracking-widest uppercase hover:bg-brand-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
