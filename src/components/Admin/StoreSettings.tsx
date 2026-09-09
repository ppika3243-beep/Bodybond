import React, { useState, useEffect } from 'react';
import { Truck, Phone, MessageSquare, Mail, Info, Check, Save, RotateCcw } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../utils/firebase';
import { PRODUCT_CONFIG } from '../../config';

export interface StoreSettingsData {
  deliveryInside: number;
  deliveryOutside: number;
  whatsappNumber?: string;
  contactPhone?: string;
  contactEmail?: string;
  deliveryInfo?: string;
}

export function StoreSettings() {
  const [deliveryInside, setDeliveryInside] = useState<number>(PRODUCT_CONFIG.deliveryInside);
  const [deliveryOutside, setDeliveryOutside] = useState<number>(PRODUCT_CONFIG.deliveryOutside);
  const [whatsappNumber, setWhatsappNumber] = useState('+8801700000000');
  const [contactPhone, setContactPhone] = useState('+8801700000000');
  const [contactEmail, setContactEmail] = useState('support@bodybond.com');
  const [deliveryInfo, setDeliveryInfo] = useState('Inside Dhaka delivery within 24-48 hours. Outside Dhaka standard delivery takes 2-4 business days.');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'general');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as StoreSettingsData;
        if (typeof data.deliveryInside === 'number') setDeliveryInside(data.deliveryInside);
        if (typeof data.deliveryOutside === 'number') setDeliveryOutside(data.deliveryOutside);
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
        if (data.contactPhone) setContactPhone(data.contactPhone);
        if (data.contactEmail) setContactEmail(data.contactEmail);
        if (data.deliveryInfo) setDeliveryInfo(data.deliveryInfo);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'settings/general');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const payload: StoreSettingsData = {
        deliveryInside: Number(deliveryInside),
        deliveryOutside: Number(deliveryOutside),
        ...(whatsappNumber.trim() ? { whatsappNumber: whatsappNumber.trim() } : {}),
        ...(contactPhone.trim() ? { contactPhone: contactPhone.trim() } : {}),
        ...(contactEmail.trim() ? { contactEmail: contactEmail.trim() } : {}),
        ...(deliveryInfo.trim() ? { deliveryInfo: deliveryInfo.trim() } : {})
      };

      await setDoc(doc(db, 'settings', 'general'), payload, { merge: true });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/general');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setDeliveryInside(0);
    setDeliveryOutside(130);
    setWhatsappNumber('+8801700000000');
    setContactPhone('+8801700000000');
    setContactEmail('support@bodybond.com');
    setDeliveryInfo('Inside Dhaka delivery within 24-48 hours. Outside Dhaka standard delivery takes 2-4 business days.');
  };

  if (loading) {
    return (
      <div className="bg-brand-white border border-brand-gray p-12 text-center text-brand-gray-dark text-sm rounded-sm">
        Loading store configuration...
      </div>
    );
  }

  return (
    <div className="bg-brand-white border border-brand-gray rounded-sm shadow-sm p-6 sm:p-8 relative">
      {saving && (
        <div className="absolute inset-0 bg-brand-white/80 z-10 flex items-center justify-center">
          <p className="font-bold uppercase tracking-widest text-brand-pink">Saving settings...</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-brand-gray gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-black">Store Configuration & Delivery</h2>
          <p className="text-brand-gray-dark text-xs mt-0.5">
            Manage live shipping rates, customer support contacts, and fulfillment instructions.
          </p>
        </div>

        {saveSuccess && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-sm border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
            <Check size={14} /> Settings Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Delivery Charges */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-4 flex items-center gap-2">
            <Truck size={16} /> Delivery Charges (BDT ৳)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-brand-gray/20 p-5 rounded-sm border border-brand-gray">
            <div>
              <label htmlFor="delivery-inside-input" className="block text-xs font-bold tracking-wider uppercase mb-1.5 text-brand-gray-dark">
                Inside Dhaka Fee (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-gray-dark">৳</span>
                <input
                  id="delivery-inside-input"
                  type="number"
                  min={0}
                  value={deliveryInside}
                  onChange={(e) => setDeliveryInside(Number(e.target.value))}
                  required
                  className="w-full pl-8 pr-4 py-2.5 bg-brand-white border border-brand-gray focus:border-brand-black outline-none text-sm font-bold rounded-sm transition-colors"
                />
              </div>
              <span className="text-[11px] text-brand-gray-dark mt-1 block">
                Default is ৳0 (Free Delivery promotion).
              </span>
            </div>

            <div>
              <label htmlFor="delivery-outside-input" className="block text-xs font-bold tracking-wider uppercase mb-1.5 text-brand-gray-dark">
                Outside Dhaka Fee (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-gray-dark">৳</span>
                <input
                  id="delivery-outside-input"
                  type="number"
                  min={0}
                  value={deliveryOutside}
                  onChange={(e) => setDeliveryOutside(Number(e.target.value))}
                  required
                  className="w-full pl-8 pr-4 py-2.5 bg-brand-white border border-brand-gray focus:border-brand-black outline-none text-sm font-bold rounded-sm transition-colors"
                />
              </div>
              <span className="text-[11px] text-brand-gray-dark mt-1 block">
                Default is ৳130 across all Bangladesh districts.
              </span>
            </div>
          </div>
        </div>

        {/* Customer Support Contacts */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-4 flex items-center gap-2">
            <Phone size={16} /> Customer Support & Contact Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label htmlFor="whatsapp-number-input" className="block text-xs font-bold tracking-wider uppercase mb-1.5 text-brand-gray-dark flex items-center gap-1">
                <MessageSquare size={13} /> WhatsApp Number
              </label>
              <input
                id="whatsapp-number-input"
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+8801700000000"
                className="w-full px-3 py-2.5 border border-brand-gray focus:border-brand-black outline-none text-xs rounded-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact-phone-input" className="block text-xs font-bold tracking-wider uppercase mb-1.5 text-brand-gray-dark flex items-center gap-1">
                <Phone size={13} /> Hotline Phone
              </label>
              <input
                id="contact-phone-input"
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+8801700000000"
                className="w-full px-3 py-2.5 border border-brand-gray focus:border-brand-black outline-none text-xs rounded-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact-email-input" className="block text-xs font-bold tracking-wider uppercase mb-1.5 text-brand-gray-dark flex items-center gap-1">
                <Mail size={13} /> Support Email
              </label>
              <input
                id="contact-email-input"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="support@bodybond.com"
                className="w-full px-3 py-2.5 border border-brand-gray focus:border-brand-black outline-none text-xs rounded-sm transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Delivery Policy Note */}
        <div>
          <label htmlFor="delivery-info-textarea" className="block text-xs font-bold tracking-widest uppercase mb-1.5 text-brand-gray-dark flex items-center gap-1.5">
            <Info size={14} /> Delivery Notice & Terms
          </label>
          <textarea
            id="delivery-info-textarea"
            rows={2}
            value={deliveryInfo}
            onChange={(e) => setDeliveryInfo(e.target.value)}
            className="w-full p-3 border border-brand-gray focus:border-brand-black outline-none text-xs rounded-sm transition-colors"
            placeholder="Delivery timeline notice displayed to customers..."
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4 border-t border-brand-gray">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 border border-brand-gray text-brand-gray-dark hover:text-brand-black text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={13} /> Reset to Defaults
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-widest hover:bg-brand-pink hover:text-brand-black transition-colors rounded-sm flex items-center justify-center gap-2 disabled:opacity-70 shadow-xs"
          >
            <Save size={15} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
