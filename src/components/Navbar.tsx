import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Menu, X, ArrowRight, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Instant Quote', path: '/quote', highlight: true },
    { label: 'Capabilities', path: '/capabilities' },
    { label: 'Materials', path: '/materials' },
    { label: 'Track Order', path: '/track/ORD-IN-2026-001' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      {/* Top micro banner */}
      <div className="bg-[#1A1A2E] text-slate-200 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 font-medium text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          GST-Compliant B2B & D2C Manufacturing
        </span>
        <span className="hidden sm:inline text-slate-500">•</span>
        <span className="hidden sm:inline text-slate-300">
          Pan-India Express Dispatch in 3-5 Days
        </span>
        <span className="hidden md:inline text-slate-500">•</span>
        <span className="hidden md:inline text-orange-400 font-medium">
          ISO 9001:2015 Verified Supplier Network
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-[#1A1A2E]">
                  Fab<span className="text-[#FF6B35]">Forge</span>
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-orange-100 text-[#FF6B35] tracking-wider uppercase">
                  INDIA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:block">
                On-Demand Precision Manufacturing
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#FF6B35] bg-orange-50'
                      : 'text-slate-700 hover:text-[#FF6B35] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                  {link.highlight && (
                    <span className="text-[10px] bg-[#FF6B35] text-white px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider">
                      Live
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/auth"
              className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
              Sign In
            </Link>
            <Link
              to="/quote"
              className="btn-forge text-sm py-2 px-4 shadow-sm"
            >
              Get Instant Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/quote"
              className="btn-forge text-xs py-1.5 px-3 sm:hidden"
            >
              Quote
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${
                location.pathname === link.path
                  ? 'text-[#FF6B35] bg-orange-50'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700"
            >
              Customer / Supplier Login
            </Link>
            <Link
              to="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-forge w-full text-center text-sm py-2.5"
            >
              Upload CAD & Quote Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
