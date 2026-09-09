import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'How to Use', path: '/how-to-use' },
    { name: 'Where to Use', path: '/where-to-use' },
    { name: 'How to Remove', path: '/how-to-remove' },
    { name: 'Track Order', path: '/track-order' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-brand-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-brand-black hover:text-brand-pink transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} strokeWidth={2} />
        </button>

        {/* Logo */}
        <Link to="/" className="text-2xl tracking-widest font-bold text-brand-black">
          BODYBOND
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-sm tracking-wide font-medium transition-colors hover:text-brand-pink ${location.pathname === link.path ? 'text-brand-pink' : 'text-brand-black'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex text-xs tracking-wider text-brand-gray-dark uppercase font-medium">
            <span className="cursor-pointer hover:text-brand-black transition-colors">বাংলা</span>
            <span className="mx-2">|</span>
            <span className="text-brand-black">English</span>
          </div>
          
          <Link to="/checkout" className="text-brand-black hover:text-brand-pink transition-colors relative group">
            <ShoppingBag size={22} strokeWidth={1.5} />
            <span className="absolute -top-1.5 -right-2 bg-brand-pink text-brand-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">0</span>
          </Link>

          <Link to="/products/body-glue" className="hidden lg:block bg-brand-black text-brand-white text-sm tracking-wider uppercase font-bold px-6 py-2.5 hover:bg-brand-pink hover:text-brand-black transition-colors">
            Order Now
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-brand-white z-50 flex flex-col h-[100dvh] overflow-hidden"
          >
            <div className="px-6 py-6 flex justify-between items-center border-b border-brand-gray shrink-0">
              <Link to="/" className="text-2xl tracking-widest font-bold text-brand-black truncate">BODYBOND</Link>
              <button onClick={() => setMobileMenuOpen(false)} className="text-brand-black hover:text-brand-pink transition-colors p-2 -mr-2">
                <X size={24} strokeWidth={2} />
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-6 text-lg font-bold overflow-y-auto">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="tracking-wide text-brand-black hover:text-brand-pink transition-colors break-words">
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="mt-auto p-6 border-t border-brand-gray shrink-0 pb-10">
              <div className="flex gap-4 text-sm tracking-wider uppercase mb-6 font-medium">
                <span className="text-brand-gray-dark cursor-pointer hover:text-brand-black">বাংলা</span>
                <span className="text-brand-gray-dark">|</span>
                <span className="text-brand-black">English</span>
              </div>
              <Link to="/products/body-glue" className="block text-center w-full bg-brand-black text-brand-white text-sm font-bold tracking-wider uppercase px-6 py-4 hover:bg-brand-pink hover:text-brand-black transition-colors">
                Order Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
