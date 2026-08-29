import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plane, LogOut, User, Shield, BookOpen, Lock } from 'lucide-react';
import AuthModal from './AuthModal';
import { Button } from './ui/Button';
import { getFrozenPrices } from '../utils/pricingEngine';

export default function Navbar({ isAdmin, setIsAdmin, onOpenAdminModal, user, setUser }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFreezesCount, setActiveFreezesCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveFreezesCount(getFrozenPrices().length);
    const interval = setInterval(() => {
      setActiveFreezesCount(getFrozenPrices().length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('mmt_user', JSON.stringify(userData));
    if (userData.role === 'ADMIN') {
      setIsAdmin(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('mmt_user');
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'backdrop-blur-md bg-white/80 border-b border-slate-200/80 shadow-md py-3' 
            : 'bg-white border-b border-slate-200 py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 text-slate-900 group">
            <Plane className="w-8 h-8 text-red-500 transform group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">MakeMy<span className="text-red-500">Tour</span></span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-700">
            <Link 
              to="/" 
              className={`hover:text-blue-600 transition-colors ${location.pathname === '/' ? 'text-blue-600 font-bold' : ''}`}
            >
              Flights & Hotels
            </Link>
            <Link 
              to="/flight-tracker" 
              className={`hover:text-blue-600 transition-colors flex items-center gap-1.5 ${location.pathname === '/flight-tracker' ? 'text-blue-600 font-bold' : ''}`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Flight Status
            </Link>
            <Link 
              to="/blog" 
              className={`hover:text-blue-600 transition-colors flex items-center gap-1.5 ${location.pathname === '/blog' ? 'text-blue-600 font-bold' : ''}`}
            >
              <BookOpen className="w-4 h-4 text-blue-500" />
              Travel Blog
            </Link>

            {activeFreezesCount > 0 && (
              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-extrabold text-xs shadow-sm hover:bg-rose-200 transition-colors"
                title="View your frozen price locks"
              >
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>{activeFreezesCount} Frozen Fare{activeFreezesCount > 1 ? 's' : ''}</span>
              </Link>
            )}
          </nav>

          {/* User & Auth Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAdminModal}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-3 py-1.5 rounded-md tracking-wider uppercase shadow-sm transition-colors cursor-pointer"
            >
              ADMIN
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-sm flex items-center justify-center border border-slate-300 transition-colors shadow-sm cursor-pointer"
                  title={`${user.firstName || ''} ${user.lastName || ''}`}
                >
                  {(user.firstName || user.name || 'U').charAt(0).toUpperCase()}
                </button>

                {/* Profile Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-slate-100 text-slate-700"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      Profile & Bookings
                    </Link>
                    {user.role === 'ADMIN' && (
                      <button
                        onClick={() => { setShowDropdown(false); onOpenAdminModal(); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-slate-100 text-slate-700 text-left"
                      >
                        <Shield className="w-4 h-4 text-amber-500" />
                        Admin Controls
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-red-50 text-red-600 border-t border-slate-100 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="default"
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm px-5 py-2.5 rounded-lg shadow-sm"
              >
                Sign Up / Sign In
              </Button>
            )}
          </div>

        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
