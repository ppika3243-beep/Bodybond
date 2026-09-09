import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold tracking-widest mb-6">BODYBOND</h2>
            <p className="text-brand-white/70 text-sm leading-relaxed max-w-xs mb-8">
              Your Outfit. Your Confidence. Your Hold. Gentle clothing and body adhesive for a secure, confident look.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-brand-white/70 hover:text-brand-pink transition-colors">
                <Instagram size={22} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-brand-white/70 hover:text-brand-pink transition-colors">
                <Facebook size={22} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase mb-6 text-brand-white">Shop</h3>
            <ul className="space-y-4 text-sm text-brand-white/70 font-medium">
              <li><Link to="/products/body-glue" className="hover:text-brand-pink transition-colors">BODYBOND Body Glue</Link></li>
              <li><Link to="/shop" className="hover:text-brand-pink transition-colors">All Products</Link></li>
              <li><Link to="/track-order" className="hover:text-brand-pink transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Guide */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase mb-6 text-brand-white">Guide</h3>
            <ul className="space-y-4 text-sm text-brand-white/70 font-medium">
              <li><Link to="/how-to-use" className="hover:text-brand-pink transition-colors">How to Use</Link></li>
              <li><Link to="/where-to-use" className="hover:text-brand-pink transition-colors">Where to Use</Link></li>
              <li><Link to="/how-to-remove" className="hover:text-brand-pink transition-colors">How to Remove</Link></li>
              <li><Link to="/faq" className="hover:text-brand-pink transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase mb-6 text-brand-white">Support</h3>
            <ul className="space-y-4 text-sm text-brand-white/70 font-medium">
              <li><Link to="/contact" className="hover:text-brand-pink transition-colors">Contact Us</Link></li>
              <li><Link to="/return-policy" className="hover:text-brand-pink transition-colors">Return Policy</Link></li>
              <li><Link to="/cancellation-policy" className="hover:text-brand-pink transition-colors">Cancellation Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-brand-pink transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-pink transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-brand-white/10 pt-8 text-xs text-brand-white/40">
          <p>&copy; {new Date().getFullYear()} BODYBOND. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0 tracking-widest uppercase font-bold">
            <span className="cursor-pointer hover:text-brand-pink transition-colors">বাংলা</span>
            <span>|</span>
            <span className="text-brand-pink">English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
