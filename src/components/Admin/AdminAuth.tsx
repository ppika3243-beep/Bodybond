import React, { useState, useEffect } from 'react';
import { auth } from '../../utils/firebase';
import firebaseConfig from '../../../firebase-applet-config.json';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword,
  updatePassword
} from 'firebase/auth';
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
  Store,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound
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
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Email/Password login state
  const [email, setEmail] = useState('ppika3243@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningInEmail, setIsSigningInEmail] = useState(false);
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);

  // Change password modal state
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setAuthError('Please enter both admin email and password.');
      return;
    }
    try {
      setIsSigningInEmail(true);
      setAuthError('');
      setIsUnauthorizedDomain(false);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      console.error('Email login error:', err);
      if (
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/user-not-found'
      ) {
        setAuthError('Invalid credentials. If you are logging in for the first time, use default password: bodybond2026!');
      } else {
        setAuthError(err.message || 'Failed to sign in.');
      }
    } finally {
      setIsSigningInEmail(false);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setIsSigningInGoogle(true);
      setAuthError('');
      setIsUnauthorizedDomain(false);
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      const isDomainError = 
        err.code === 'auth/unauthorized-domain' || 
        (err.message && err.message.toLowerCase().includes('unauthorized-domain'));

      if (isDomainError) {
        setIsUnauthorizedDomain(true);
        setAuthError(`Domain ${currentDomain} is not authorized in Google OAuth. Please use Email & Password login below!`);
      } else {
        setIsUnauthorizedDomain(false);
        setAuthError(err.message || 'Failed to sign in.');
      }
    } finally {
      setIsSigningInGoogle(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (newPassword.length < 6) {
      setPasswordChangeError('Password must be at least 6 characters long.');
      return;
    }
    try {
      setIsChangingPassword(true);
      setPasswordChangeError('');
      await updatePassword(auth.currentUser, newPassword);
      setPasswordChangeSuccess('Password changed successfully! Keep it safe.');
      setNewPassword('');
      setTimeout(() => {
        setChangePasswordOpen(false);
        setPasswordChangeSuccess('');
      }, 2000);
    } catch (err: any) {
      console.error('Password update error:', err);
      setPasswordChangeError(err.message || 'Failed to update password. You may need to sign in again first.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCopyDomain = () => {
    if (currentDomain) {
      navigator.clipboard.writeText(currentDomain);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
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
      <div className="w-full min-h-screen bg-brand-gray/30 p-4 sm:p-6 flex flex-col items-center justify-center">
        <div className="bg-brand-white p-6 sm:p-10 shadow-sm border border-brand-gray max-w-md w-full text-center">
          <div className="w-14 h-14 bg-brand-pink-light rounded-full flex items-center justify-center mx-auto mb-4 text-brand-black">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-black mb-1">BODYBOND Admin</h1>
          <p className="text-brand-gray-dark text-xs mb-6 leading-relaxed">
            Restricted access. Sign in with your administrator credentials to manage products, settings, and orders.
          </p>
          
          {authError && (
            <div className="bg-red-50 text-red-700 p-3.5 mb-5 text-xs border border-red-200 text-left rounded-sm space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div className="font-semibold text-red-800 leading-snug">{authError}</div>
              </div>

              {isUnauthorizedDomain && (
                <div className="pt-2 border-t border-red-200/80 space-y-2 text-[11px] text-red-900">
                  <p className="font-medium">
                    Tip: You do not need to configure Firebase domains if you use the <strong>Email &amp; Password</strong> form below!
                  </p>
                  <p className="text-gray-700">
                    Default login: <span className="font-mono font-bold">ppika3243@gmail.com</span> / <span className="font-mono font-bold">bodybond2026!</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Email / Password Sign In Form (Bypasses all domain authorization issues) */}
          <form onSubmit={handleEmailLogin} className="space-y-3.5 text-left mb-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-black mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-dark" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ppika3243@gmail.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-brand-gray rounded-sm focus:outline-none focus:border-brand-black bg-brand-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-black">
                  Admin Password
                </label>
                <span className="text-[10px] text-brand-gray-dark">
                  Default: <span className="font-mono font-semibold">bodybond2026!</span>
                </span>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-dark" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm border border-brand-gray rounded-sm focus:outline-none focus:border-brand-black bg-brand-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-dark hover:text-brand-black"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSigningInEmail}
              className="w-full bg-brand-black text-brand-white py-3 text-xs font-bold tracking-widest uppercase hover:bg-brand-pink hover:text-brand-black transition-colors rounded-sm shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <KeyRound size={14} />
              <span>{isSigningInEmail ? 'Signing in...' : 'Sign in with Password'}</span>
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-gray"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-brand-gray-dark">
              <span className="bg-brand-white px-2">OR ALTERNATIVE</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleLogin}
            disabled={isSigningInGoogle}
            className="w-full border border-brand-gray bg-brand-white text-brand-black py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-brand-gray/30 transition-colors rounded-sm shadow-xs flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{isSigningInGoogle ? 'Connecting...' : 'Sign in with Google'}</span>
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

          <button
            onClick={() => setChangePasswordOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-brand-white/70 hover:text-brand-white transition-colors uppercase tracking-wider py-1 px-2 rounded-sm hover:bg-brand-white/10"
            title="Change Admin Password"
          >
            <KeyRound size={13} /> Change Password
          </button>

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
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setChangePasswordOpen(true);
                  }}
                  className="w-full min-h-[44px] flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gray-dark hover:text-brand-black text-left"
                >
                  <KeyRound size={16} /> Change Password
                </button>

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

      {/* Change Password Modal */}
      {changePasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-brand-white max-w-sm w-full p-6 shadow-xl border border-brand-gray relative">
            <button
              onClick={() => {
                setChangePasswordOpen(false);
                setPasswordChangeError('');
                setPasswordChangeSuccess('');
              }}
              className="absolute right-4 top-4 text-brand-gray-dark hover:text-brand-black"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2 text-brand-black">
              <KeyRound size={20} />
              <h3 className="text-base font-bold uppercase tracking-wider">Change Password</h3>
            </div>

            <p className="text-xs text-brand-gray-dark mb-4 leading-relaxed">
              Set a new secure admin password for <strong className="text-brand-black">{user.email}</strong>.
            </p>

            {passwordChangeError && (
              <div className="bg-red-50 text-red-700 p-3 mb-4 text-xs border border-red-200">
                {passwordChangeError}
              </div>
            )}

            {passwordChangeSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-3 mb-4 text-xs border border-emerald-200">
                {passwordChangeSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-black mb-1">
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-brand-gray rounded-sm focus:outline-none focus:border-brand-black"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setChangePasswordOpen(false);
                    setPasswordChangeError('');
                    setPasswordChangeSuccess('');
                  }}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider border border-brand-gray text-brand-black hover:bg-brand-gray/20 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest bg-brand-black text-brand-white hover:bg-brand-pink hover:text-brand-black rounded-sm disabled:opacity-50"
                >
                  {isChangingPassword ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

