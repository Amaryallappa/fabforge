import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Shield, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B35] flex items-center justify-center text-white shadow-lg">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Fab<span className="text-[#FF6B35]">Forge</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's premier digital manufacturing network. Upload CAD drawings, receive automated DFM analysis, get instant INR pricing, and track shop-floor production in real-time.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>GST Registered: <strong className="text-slate-200">27AABCF1234F1Z8</strong> (Maharashtra)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ISO 9001:2015 & AS9100D Certified Partner Facilities</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B35]" />
                <span>Hubs: Pune MIDC • Bengaluru Peenya • Chennai Ambattur • Manesar</span>
              </div>
            </div>
          </div>

          {/* Processes */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Manufacturing
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/quote" className="hover:text-[#FF6B35] transition-colors">
                  Sheet Metal Fabrication
                </Link>
              </li>
              <li>
                <Link to="/quote" className="hover:text-[#FF6B35] transition-colors">
                  CNC Machining & Milling
                </Link>
              </li>
              <li>
                <Link to="/quote" className="hover:text-[#FF6B35] transition-colors">
                  Industrial 3D Printing (SLS/FDM)
                </Link>
              </li>
              <li>
                <Link to="/quote" className="hover:text-[#FF6B35] transition-colors">
                  Fiber Laser Cutting
                </Link>
              </li>
              <li>
                <Link to="/quote" className="hover:text-[#FF6B35] transition-colors">
                  Precision Tube Bending
                </Link>
              </li>
              <li>
                <Link to="/quote" className="hover:text-[#FF6B35] transition-colors">
                  Injection Molding & Tooling
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Materials */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Materials
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/materials" className="hover:text-[#FF6B35] transition-colors">
                  SS 304 / 316L Food Grade
                </Link>
              </li>
              <li>
                <Link to="/materials" className="hover:text-[#FF6B35] transition-colors">
                  CRCA Mild Steel (IS 513)
                </Link>
              </li>
              <li>
                <Link to="/materials" className="hover:text-[#FF6B35] transition-colors">
                  Aluminum 6061-T6 / 7075
                </Link>
              </li>
              <li>
                <Link to="/materials" className="hover:text-[#FF6B35] transition-colors">
                  Hardox 400 / AR400
                </Link>
              </li>
              <li>
                <Link to="/materials" className="hover:text-[#FF6B35] transition-colors">
                  Delrin / Acetal & Nylon PA12
                </Link>
              </li>
              <li>
                <Link to="/materials" className="hover:text-[#FF6B35] transition-colors">
                  Pure Copper & Brass CW614N
                </Link>
              </li>
            </ul>
          </div>

          {/* Enterprise & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <a href="tel:+918047192000" className="hover:text-white transition-colors">
                  +91 (80) 4719 2000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <a href="mailto:quotes@fabforge.in" className="hover:text-white transition-colors">
                  quotes@fabforge.in
                </a>
              </li>
              <li className="pt-2">
                <Link
                  to="/track/ORD-IN-2026-001"
                  className="inline-block text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  Track Dispatch Status →
                </Link>
              </li>
              <li>
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                  <p className="text-emerald-400 font-semibold mb-1">WhatsApp Live Desk</p>
                  <p className="text-slate-400">Instant quoting assistance & CAD file review 9 AM - 8 PM IST</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FabForge Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Strict NDA Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">GST Compliance Terms</span>
            <span className="hover:text-slate-400 cursor-pointer">Quality Guarantee (ISO:9001)</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
