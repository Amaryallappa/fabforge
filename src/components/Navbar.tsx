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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      {/* Top micro banner */}
      <div className="bg-[#0F172A] text-slate-300 text-xs py-2 px-4 hidden sm:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Pan-India Fabrication Network
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Dispatch in 3–5 Business Days</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>GSTIN: 27AABCF1234F1Z8</span>
            <span className="text-slate-600">•</span>
            <span>ISO 9001:2015 Certified Facilities</span>
            <span className="text-slate-600">•</span>
            <span className="text-orange-400 font-semibold">Toll-Free: 1800-419-2000</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FF8A65] flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-all">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">
                  Fab<span className="text-[#FF5722]">Forge</span>
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-orange-100 text-[#FF5722] tracking-wider uppercase">
                  INDIA
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                On-Demand Precision Manufacturing
              </span>
            </div>
          </Link>

          {/* Desktop Nav Pills */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-[#FF5722] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {link.label}
                  {link.highlight && (
                    <span className="text-[9px] bg-[#FF5722] text-white px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider">
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
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              Sign In
            </Link>
            <Link
              to="/quote"
              className="btn-forge-primary text-xs py-2.5 px-4 shadow-sm"
            >
              Get Instant Quote
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/quote"
              className="btn-forge-primary text-xs py-2 px-3 sm:hidden"
            >
              Quote
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                location.pathname === link.path
                  ? 'text-[#FF5722] bg-orange-50 font-bold'
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
              className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
            >
              Customer / Supplier Login
            </Link>
            <Link
              to="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-forge-primary w-full text-center text-sm py-2.5"
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
