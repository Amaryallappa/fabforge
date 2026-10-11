import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  FileText, 
  TrendingUp, 
  Plus, 
  Download, 
  ShieldCheck, 
  Building, 
  CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { formatINR } from '../lib/gst';

interface QuoteRecord {
  id: string;
  file_name: string;
  process: string;
  material: string;
  quantity: number;
  price_inr: number;
  status: 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'delivered';
  created_at: string;
}

export const Dashboard: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteRecord[]>([
    {
      id: 'ORD-IN-2026-001',
      file_name: 'bracket-chassis-v3.step',
      process: 'Sheet Metal',
      material: 'SS 304 (2.0mm)',
      quantity: 25,
      price_inr: 14750,
      status: 'in_production',
      created_at: '2026-10-10',
    },
    {
      id: 'ORD-IN-2026-002',
      file_name: 'drone-motor-mount.step',
      process: 'CNC Machining',
      material: 'Al 6061-T6',
      quantity: 8,
      price_inr: 8960,
      status: 'shipped',
      created_at: '2026-10-08',
    },
    {
      id: 'QT-2026-089',
      file_name: 'sensor-housing-cover.stl',
      process: '3D Printing',
      material: 'Nylon PA12',
      quantity: 5,
      price_inr: 3250,
      status: 'confirmed',
      created_at: '2026-10-05',
    },
  ]);

  // Load quotes from Supabase if connected
  useEffect(() => {
    async function fetchQuotes() {
      try {
        const { data } = await supabase
          .from('quotes')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (data && data.length > 0) {
          // Merge with mock
          setQuotes((prev) => [
            ...data.map((d: any) => ({
              id: d.id.slice(0, 15),
              file_name: d.file_name,
              process: d.process,
              material: d.material,
              quantity: d.quantity,
              price_inr: d.price_inr,
              status: d.status,
              created_at: new Date(d.created_at).toLocaleDateString(),
            })),
            ...prev,
          ]);
        }
      } catch (e) {
        // Local state preserved
      }
    }
    fetchQuotes();
  }, []);

  const getStatusBadge = (status: QuoteRecord['status']) => {
    switch (status) {
      case 'in_production':
        return <span className="badge badge-orange">In Production</span>;
      case 'shipped':
        return <span className="badge badge-blue">Shipped (Blue Dart)</span>;
      case 'delivered':
        return <span className="badge badge-green">Delivered</span>;
      case 'confirmed':
        return <span className="badge badge-green">Confirmed</span>;
      default:
        return <span className="badge bg-slate-100 text-slate-700">Pending Review</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex flex-col font-sans selection:bg-[#FF6B35] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A2E] tracking-tight">
              Customer & Procurement Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Organization: <strong className="text-slate-800">AeroDynamics Robotics Pvt Ltd</strong> • GSTIN: <strong className="text-slate-800">27AABCA5555A1Z2</strong>
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/quote"
              className="btn-forge text-xs sm:text-sm py-2.5 px-4 shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              New CAD Instant Quote
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="card p-5 border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Live in Production
              </span>
              <Package className="w-4 h-4 text-[#FF6B35]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">2 Orders</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              On track for dispatch this week
            </p>
          </div>

          <div className="card p-5 border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Quotations
              </span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{quotes.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Instant DFM analysis archived
            </p>
          </div>

          <div className="card p-5 border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Spend (INR)
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">₹26,960</p>
            <p className="text-[11px] text-slate-500 mt-1">
              FY 2026-27 domestic procurement
            </p>
          </div>

          <div className="card p-5 border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                GST Input Credit
              </span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">₹4,852</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              18% ITC claimable in GSTR-2B
            </p>
          </div>
        </div>

        {/* Recent Orders & Quotes Table */}
        <div className="card border-slate-200 overflow-hidden mb-8 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Recent Fabrication Orders & Quotes
            </h2>
            <Link to="/quote" className="text-xs font-bold text-[#FF6B35] hover:underline">
              Create New +
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order / Quote ID</th>
                  <th>CAD File & Spec</th>
                  <th>Process</th>
                  <th>Quantity</th>
                  <th>Amount (INR)</th>
                  <th>Production Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="font-mono text-xs font-bold text-slate-800">
                      {item.id}
                    </td>
                    <td>
                      <p className="font-semibold text-slate-900 text-xs">{item.file_name}</p>
                      <p className="text-[11px] text-slate-500">{item.material}</p>
                    </td>
                    <td className="text-xs text-slate-700">{item.process}</td>
                    <td className="text-xs font-bold text-slate-900">{item.quantity}</td>
                    <td className="text-xs font-black text-slate-900">
                      {formatINR(item.price_inr)}
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/track/${item.id}`}
                          className="px-2.5 py-1 rounded-md bg-orange-50 text-[#FF6B35] hover:bg-orange-100 text-xs font-bold transition-colors"
                        >
                          Track
                        </Link>
                        <button
                          onClick={() => toast.success(`Downloaded GST Invoice for ${item.id}`)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="Download Tax Invoice"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GST & Supplier Hub Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Building className="w-5 h-5 text-[#FF6B35]" />
              <h3 className="text-sm font-bold text-slate-900">
                Primary Delivery Address & Billing
              </h3>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1 text-slate-600">
              <p className="font-bold text-slate-800">AeroDynamics Robotics Pvt Ltd</p>
              <p>Plot 42, EPIP Industrial Zone, Whitefield</p>
              <p>Bengaluru, Karnataka - 560066</p>
              <p className="pt-2 font-mono text-[11px] text-slate-500">
                GSTIN: 27AABCA5555A1Z2 • State Code: 29 (Karnataka)
              </p>
            </div>
          </div>

          <div className="card p-6 border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Assigned Account Manager
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Need high-volume quotation discount or custom DFM advice? Your dedicated FabForge application engineer is on standby.
              </p>
              <div className="text-xs text-slate-700 space-y-1">
                <p><strong>Engineer:</strong> Vikram Deshmukh (Pune MIDC Hub)</p>
                <p><strong>Direct Line:</strong> +91 (80) 4719 2000 (Ext. 402)</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <a
                href="https://wa.me/918047192000?text=Hi%20FabForge,%20I%20need%20custom%20DFM%20consultation"
                target="_blank"
                rel="noreferrer"
                className="btn-outline w-full text-xs py-2 text-center block"
              >
                Chat on WhatsApp Business
              </a>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};
export default Dashboard;
