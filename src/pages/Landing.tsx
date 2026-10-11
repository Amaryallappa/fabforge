import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UploadCloud, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Truck,
  Sparkles,
  Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC] flex flex-col font-sans selection:bg-[#FF6B35] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-bg pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF6B35] text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-4 h-4" />
                Made for Indian Hardware Innovators & MSMEs
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A1A2E] tracking-tight leading-[1.12]">
                On-Demand <span className="gradient-text">Manufacturing</span> Across India.
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Upload your <span className="font-semibold text-slate-900">STEP, DXF, or STL</span> models. Receive instant DFM feasibility checks, dynamic INR pricing, and track shop-floor production in real-time. Guaranteed delivery within 3–5 business days.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  to="/quote"
                  className="btn-forge text-base py-3.5 px-7 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-5 h-5" />
                  Upload CAD & Get Instant Quote
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/capabilities"
                  className="btn-outline text-base py-3.5 px-6 flex items-center justify-center gap-2"
                >
                  Explore Capabilities
                </Link>
              </div>

              {/* Micro Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Strict Mutual NDA
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  18% GST Input Credit Invoicing
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Free CMM Inspection Reports
                </span>
              </div>
            </div>

            {/* Right Interactive Upload Preview Card */}
            <div className="lg:col-span-5">
              <div className="card p-6 sm:p-8 bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-2xl relative">
                <div className="absolute -top-3 right-6 bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  Instant AI Engine
                </div>

                <div className="border-2 border-dashed border-orange-200 rounded-xl p-8 text-center bg-orange-50/30 hover:bg-orange-50/60 transition-colors group cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-[#FF6B35]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Drop your 2D / 3D CAD File
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Supports .STEP, .STP, .DXF, .DWG, .STL, .SLDPRT (Up to 100MB)
                  </p>
                  <Link
                    to="/quote"
                    className="btn-forge text-xs py-2.5 px-5 mx-auto"
                  >
                    Select CAD File
                  </Link>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Laser Cut Lead</p>
                    <p className="text-sm font-bold text-slate-900">48-72 Hrs</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Min. Tolerance</p>
                    <p className="text-sm font-bold text-slate-900">±0.025 mm</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Min Order Qty</p>
                    <p className="text-sm font-bold text-slate-900">1 Part</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Proof Stats Bar */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="border-r last:border-none border-slate-100">
              <p className="text-3xl font-black text-[#1A1A2E]">500+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Audited Machine Shops
              </p>
            </div>
            <div className="border-r last:border-none border-slate-100">
              <p className="text-3xl font-black text-[#FF6B35]">₹0</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Tooling Cost on Prototypes
              </p>
            </div>
            <div className="border-r last:border-none border-slate-100">
              <p className="text-3xl font-black text-[#1A1A2E]">99.4%</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                On-Time Quality Dispatch
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-[#1A1A2E]">50,000+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Custom Parts Delivered
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-[#FAFBFC]">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="badge badge-orange mb-3">Seamless Digital Workflow</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight">
              From CAD to Physical Part in 4 Simple Steps
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Say goodbye to chasing 15 vendors for quotes over email and phone calls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="card p-6 text-center relative hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FF6B35] font-black text-lg flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Upload CAD</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drag-and-drop your 3D STEP or 2D DXF files. Upload securely under automatic mutual NDA.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card p-6 text-center relative hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 font-black text-lg flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Instant DFM & Quote</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose material, thickness, and post-processing. See real-time INR prices with full GST breakdown.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card p-6 text-center relative hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 font-black text-lg flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Precision Production</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated dispatch to top-tier machine shops in Pune, Bangalore, or Chennai with continuous QA.
              </p>
            </div>

            {/* Step 4 */}
            <div className="card p-6 text-center relative hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 font-black text-lg flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Inspected & Delivered</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parts pass rigorous CMM inspection and are securely packed with full test reports & tax invoices.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/quote" className="btn-forge">
              Start Your First Quote Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Manufacturing Capabilities */}
      <section className="section bg-white border-t border-slate-200">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="badge badge-orange mb-2">End-to-End Capabilities</div>
              <h2 className="text-3xl font-extrabold text-[#1A1A2E] tracking-tight">
                Industrial Processes Tailored for Every Scale
              </h2>
            </div>
            <Link to="/capabilities" className="text-sm font-bold text-[#FF6B35] hover:underline flex items-center gap-1 mt-4 md:mt-0">
              View all 8 manufacturing capabilities →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sheet metal */}
            <div className="card p-6 border-slate-200 hover:border-orange-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Sheet Metal & Laser Cutting</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  High-speed fiber laser cutting (up to 20mm SS/MS), CNC press brake bending, hardware insertion (PEM), and powder coating.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Tolerances: ±0.1 mm</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Materials: CRCA, SS 304/316, Al 6061</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Lead Time: 3-5 Business Days</div>
                </div>
              </div>
              <Link to="/quote" className="mt-6 text-xs font-bold text-[#FF6B35] flex items-center gap-1">
                Configure Sheet Metal →
              </Link>
            </div>

            {/* CNC Machining */}
            <div className="card p-6 border-slate-200 hover:border-orange-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">CNC Milling & Turning</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  3-axis, 4-axis, and 5-axis CNC machining for complex aerospace, robotics, and automotive precision components.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Tolerances: ±0.015 mm</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Surface Finish: Ra 0.8 µm standard</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Post-Ops: Hard Anodizing, Black Oxide</div>
                </div>
              </div>
              <Link to="/quote" className="mt-6 text-xs font-bold text-[#FF6B35] flex items-center gap-1">
                Configure CNC Parts →
              </Link>
            </div>

            {/* 3D Printing */}
            <div className="card p-6 border-slate-200 hover:border-orange-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Industrial 3D Printing</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Selective Laser Sintering (SLS), Stereolithography (SLA), and FDM for rapid functional prototyping and end-use plastics.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Materials: Nylon PA12, Resin, ABS, PC</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Turnaround: 24 to 48 Hours</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Zero Tooling Expense</div>
                </div>
              </div>
              <Link to="/quote" className="mt-6 text-xs font-bold text-[#FF6B35] flex items-center gap-1">
                Configure 3D Prints →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* India Advantage / Trust */}
      <section className="section bg-[#1A1A2E] text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-3 py-1 rounded-full border border-orange-800">
              Why Indian Engineers Choose FabForge
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 tracking-tight">
              Domestic Reliability Without the Import Headaches
            </h2>
            <p className="text-slate-400 mt-3 text-sm">
              Avoid lengthy customs clearance, 40% import duties, and unreliable overseas communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl">
              <Building2 className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">100% GST Invoicing</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Claim full 18% Input Tax Credit (ITC) directly on all prototypes and production volumes. Native tax-compliant invoices generated instantly.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Strict IP & NDA Safeguards</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your proprietary CAD files remain encrypted and are shared exclusively with pre-screened partner shops bound by legally enforceable NDAs.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-2xl">
              <Truck className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Express Pan-India Logistics</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Air-cargo and surface express partnerships with Blue Dart & Delhivery ensure guaranteed doorstep delivery across Tier 1, 2, and 3 industrial belts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF6B35] to-[#E5561F] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to manufacture your first part?
          </h2>
          <p className="text-orange-100 max-w-2xl mx-auto text-base sm:text-lg">
            Upload your CAD file right now. Get instant DFM analysis and order parts in less than 5 minutes.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quote"
              className="bg-[#1A1A2E] hover:bg-[#252540] text-white text-base font-bold py-3.5 px-8 rounded-xl shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-5 h-5 text-orange-400" />
              Launch Instant Quoter
            </Link>
            <Link
              to="/materials"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-base font-bold py-3.5 px-8 rounded-xl border border-white/30 transition-all flex items-center justify-center"
            >
              Browse Materials (16+)
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default Landing;
