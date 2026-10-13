import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  FileCheck2, 
  Download, 
  Search, 
  MessageSquare,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const TrackOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchId, setSearchId] = useState(orderId || 'ORD-IN-2026-001');

  const steps = [
    {
      title: 'Order & Payment Confirmed',
      desc: 'Paid via Razorpay UPI • GST invoice generated',
      date: '10 Oct, 02:30 PM',
      done: true,
    },
    {
      title: 'Raw Material Allocated & MTC Verified',
      desc: 'SS 304 2.0mm sheet staged from Jindal Stainless stock',
      date: '10 Oct, 05:15 PM',
      done: true,
    },
    {
      title: 'CNC Laser Cutting & Bending in Progress',
      desc: 'Trumpf 6kW Fiber Laser cell at Whitefield Bengaluru hub',
      date: '11 Oct, 11:00 AM',
      current: true,
      done: false,
    },
    {
      title: 'CMM Metrology & Powder Coating',
      desc: '100% dimensional inspection + surface finishing',
      date: 'Estimated: 12 Oct',
      done: false,
    },
    {
      title: 'Dispatched via Express Air Cargo',
      desc: 'Blue Dart AWB #849204810 • 24hr delivery',
      date: 'Estimated: 13 Oct',
      done: false,
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    toast.success(`Tracking fetched for ${searchId}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Top Search Bar */}
        <div className="card p-4 sm:p-6 mb-8 border-slate-200">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter Order Ref (e.g. ORD-IN-2026-001)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#FF6B35]"
              />
            </div>
            <button
              type="submit"
              className="btn-forge text-xs py-2.5 px-6 shadow-sm"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Order Details Header */}
        <div className="card p-6 sm:p-8 mb-8 border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Manufacturing Order
                </span>
                <span className="badge badge-orange font-mono text-xs">
                  {searchId}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Precision Sheet Metal Assembly
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Placed on 10 Oct 2026 • Destination: <strong className="text-slate-800">Whitefield, Bengaluru, KA 560066</strong>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/918088201429?text=Hi%20Amar,%20tracking%20update%20for%20${searchId}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Operator (Amar)
              </a>

              <Link
                to="/quote"
                className="btn-outline text-xs py-2 px-4"
              >
                Reorder Parts
              </Link>
            </div>
          </div>

          {/* Quick specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 block">Process</span>
              <span className="font-bold text-slate-900">Fiber Laser + CNC Bending</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 block">Material & Spec</span>
              <span className="font-bold text-slate-900">SS 304 (2.0mm thickness)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 block">Quantity</span>
              <span className="font-bold text-slate-900">25 units (Batch 1)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 block">Expected Dispatch</span>
              <span className="font-bold text-emerald-600">13 Oct (On Schedule)</span>
            </div>
          </div>
        </div>

        {/* Live Milestone Timeline */}
        <div className="card p-6 sm:p-8 mb-8 border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#FF6B35]" />
            Live Shop-Floor Milestones
          </h2>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8">
            {steps.map((st, idx) => (
              <div key={idx} className="relative">
                {/* Node icon */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                    st.done
                      ? 'bg-emerald-500 border-white text-white shadow'
                      : st.current
                      ? 'bg-[#FF6B35] border-white text-white shadow-md animate-pulse ring-4 ring-orange-100'
                      : 'bg-slate-200 border-white text-slate-400'
                  }`}
                >
                  {st.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : st.current ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3
                    className={`text-sm font-bold ${
                      st.current ? 'text-[#FF6B35]' : st.done ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {st.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    {st.date}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Downloadable Quality Reports */}
        <div className="card p-6 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Certificates & Documents
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Download Mill Test Certificate (MTC), CMM dimensional report, and GST Tax Invoice
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toast.success('Downloading Mill Test Certificate (EN 10204 3.1)...')}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />
              MTC 3.1 Cert
            </button>
            <button
              onClick={() => toast.success('Downloading Final GST Tax Invoice...')}
              className="px-3.5 py-2 rounded-xl bg-[#1A1A2E] text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              GST Tax Invoice
            </button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};
export default TrackOrder;
