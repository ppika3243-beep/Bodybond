import React, { useState, useEffect } from 'react';
import { auth } from '../../utils/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { 
  LogOut, 
  LayoutDashboard, 
  Package, 
  Tag, 
  Settings, 
  FileSpreadsheet, 
  Menu, 
  X, 
  ShieldCheck, 
  Store 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export type AdminTab = 'dashboard' | 'orders' | 'products' | 'settings' | 'export';

export interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: AdminTab;
  onTabChange?: (tab: AdminTab) => void;
  pendingCount?: number;
  totalCount?: number;
}

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}

export function AdminLayout({ 
  children, 
  activeTab = 'dashboard', 
  onTabChange, 
  pendingCount = 0, 
  totalCount = 0 
}: AdminLayoutProps) {
  const { user, loading } = useAdminAuth();
  const [authError, setAuthError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setAuthError('');
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Failed to sign in.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as AdminTab, label: 'Orders', icon: Package, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'products' as AdminTab, label: 'Product Manager', icon: Tag },
    { id: 'settings' as AdminTab, label: 'Store Settings', icon: Settings },
    { id: 'export' as AdminTab, label: 'Export Orders', icon: FileSpreadsheet },
  ];

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-brand-white">
        <p className="text-brand-gray-dark font-medium tracking-widest uppercase text-sm animate-pulse">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-brand-gray/30 p-6 flex flex-col items-center justify-center">
        <div className="bg-brand-white p-8 sm:p-12 shadow-sm border border-brand-gray max-w-md w-full text-center">
          <div className="w-16 h-16 bg-brand-pink-light rounded-full flex items-center justify-center mx-auto mb-6 text-brand-black">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-black mb-2">BODYBOND Admin</h1>
          <p className="text-brand-gray-dark text-xs sm:text-sm mb-8 leading-relaxed">
            Restricted access. Sign in with an authorized Google administrator account to access store controls and customer orders.
          </p>
          
          {authError && (
            <div className="bg-red-50 text-red-600 p-3 mb-6 text-xs sm:text-sm border border-red-200 text-left">
              {authError}
            </div>
          )}

          <button 
            onClick={handleLogin}
            className="w-full bg-brand-black text-brand-white py-4 text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-brand-pink hover:text-brand-black transition-colors rounded-sm shadow-xs"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-brand-gray/20">
      {/* Top Admin Bar */}
      <header className="bg-brand-black text-brand-white px-4 sm:px-6 py-3.5 flex justify-between items-center sticky top-[72px] z-40 border-b border-brand-gray-dark/40 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger toggle */}
          {onTabChange && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -ml-2 text-brand-white hover:text-brand-pink transition-colors focus:outline-none"
              aria-label="Toggle admin navigation drawer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-widest uppercase text-sm">BODYBOND</span>
            <span className="text-[10px] bg-brand-pink text-brand-black font-extrabold px-1.5 py-0.5 rounded-xs tracking-wider uppercase">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-brand-white/60 hidden lg:inline font-mono">
            {user.email}
          </span>

          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-brand-white/70 hover:text-brand-white transition-colors uppercase tracking-wider"
          >
            <Store size={13} /> View Store
          </Link>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-pink hover:text-brand-white transition-colors py-1.5 px-2.5 rounded-sm hover:bg-brand-white/10"
            title="Sign out of Admin Panel"
          >
            <LogOut size={14} /> <span className="hidden xs:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-120px)]">
        
        {/* Desktop Sidebar (visible on md screens and larger) */}
        {onTabChange && (
          <aside className="hidden md:flex flex-col w-64 shrink-0 bg-brand-white border-r border-brand-gray p-6 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gray-dark block mb-3 px-3">
                Navigation
              </span>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-3 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors text-left ${
                        isActive 
                          ? 'bg-brand-black text-brand-white' 
                          : 'text-brand-gray-dark hover:text-brand-black hover:bg-brand-gray/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive 
                            ? 'bg-brand-pink text-brand-black' 
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Store Quick Status in Sidebar */}
            <div className="pt-6 border-t border-brand-gray text-xs space-y-2 mt-auto">
              <div className="flex justify-between text-brand-gray-dark">
                <span>Orders Tracked:</span>
                <strong className="text-brand-black">{totalCount}</strong>
              </div>
              <div className="flex justify-between text-brand-gray-dark">
                <span>Pending Action:</span>
                <strong className="text-amber-700">{pendingCount}</strong>
              </div>
            </div>
          </aside>
        )}

        {/* Mobile Slide-in Drawer */}
        {mobileMenuOpen && onTabChange && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
            <div className="w-4/5 max-w-xs bg-brand-white h-full p-6 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-brand-gray">
                  <span className="font-extrabold tracking-widest uppercase text-sm text-brand-black">
                    Admin Menu
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-brand-gray-dark hover:text-brand-black"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full min-h-[44px] flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors text-left ${
                          isActive 
                            ? 'bg-brand-black text-brand-white' 
                            : 'text-brand-gray-dark hover:text-brand-black hover:bg-brand-gray/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-brand-gray space-y-3">
                <Link
                  to="/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full min-h-[44px] flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gray-dark hover:text-brand-black"
                >
                  <Store size={16} /> Open Customer Storefront
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full min-h-[44px] bg-brand-gray/30 text-red-600 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider rounded-sm"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>

            <div 
              className="flex-1" 
              onClick={() => setMobileMenuOpen(false)} 
            />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

