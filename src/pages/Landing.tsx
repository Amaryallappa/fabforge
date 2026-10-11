import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Check,
  FileCheck,
  Clock,
  Award,
  Factory
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  // Interactive demo preview state
  const [selectedProcess, setSelectedProcess] = useState<'sheet_metal' | 'cnc' | '3d_printing'>('sheet_metal');
  const [sampleLoaded, setSampleLoaded] = useState(false);

  const processEstimates = {
    sheet_metal: { unit: '₹431', total: '₹4,310 (10 pcs)', lead: '3 Days', mat: 'SS 304 (2.0mm)' },
    cnc: { unit: '₹890', total: '₹8,900 (10 pcs)', lead: '4 Days', mat: 'Al 6061-T6' },
    '3d_printing': { unit: '₹320', total: '₹3,200 (10 pcs)', lead: '2 Days', mat: 'Nylon PA12' },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-mesh border-b border-slate-200/80 py-12 lg:py-20">
        <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Headline & Action */}
            <div className="space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-600 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
                India's First On-Demand Digital Manufacturing Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.12]">
                On-Demand <span className="gradient-text">Manufacturing</span> Across India.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Upload your <span className="font-bold text-slate-900">STEP, DXF, or STL</span> models. Receive instant DFM feasibility checks, dynamic INR pricing, and track shop-floor production in real-time. Guaranteed delivery within 3–5 business days.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                <Link
                  to="/quote"
                  className="btn-forge-primary text-sm py-3.5 px-6 shadow-md flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload CAD & Get Instant Quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/capabilities"
                  className="btn-forge-secondary text-sm py-3.5 px-6 flex items-center justify-center gap-2"
                >
                  Explore 8 Capabilities
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Strict Mutual NDA
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  18% GST Input Credit (ITC)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Free CMM Inspection Reports
                </span>
              </div>
            </div>

            {/* Right Column: Interactive AI CAD Terminal */}
            <div className="w-full">
              <div className="card-premium p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xl relative overflow-hidden">
                
                {/* Header with live status */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      AI DFM & Quoting Terminal
                    </span>
                  </div>
                  <span className="badge-pill badge-pill-green text-[10px]">
                    <Zap className="w-3 h-3" /> Live Engine
                  </span>
                </div>

                {/* Dropzone Container */}
                <div className="border-2 border-dashed border-orange-200/90 rounded-2xl p-6 sm:p-8 text-center bg-orange-50/20 hover:bg-orange-50/40 transition-colors">
                  {!sampleLoaded ? (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-orange-100/80 text-[#FF5722] flex items-center justify-center mx-auto mb-3 shadow-xs">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                        Drop your 2D / 3D CAD Drawing
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">
                        Supports .STEP, .STP, .DXF, .DWG, .STL, .SLDPRT (Up to 100MB)
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Link
                          to="/quote"
                          className="btn-forge-primary text-xs py-2 px-4"
                        >
                          Select CAD File
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSampleLoaded(true)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors"
                        >
                          Load Sample Bracket.step
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-left">
                        <div className="flex items-center gap-3">
                          <FileCheck className="w-6 h-6 text-emerald-600" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">chassis_mounting_bracket_v2.step</p>
                            <p className="text-[11px] text-emerald-700 font-medium">✓ DFM Check Passed • Zero thin-wall errors</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSampleLoaded(false)}
                          className="text-xs text-slate-400 hover:text-red-500 font-bold"
                        >
                          Reset
                        </button>
                      </div>

                      {/* Process switcher */}
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        {[
                          { id: 'sheet_metal', label: 'Sheet Metal' },
                          { id: 'cnc', label: 'CNC Mill' },
                          { id: '3d_printing', label: '3D Print' },
                        ].map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedProcess(p.id as any)}
                            className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all ${
                              selectedProcess === p.id
                                ? 'bg-[#FF5722] text-white border-[#FF5722] shadow-xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>

                      {/* Live Price Estimation Bar */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="text-slate-500 block text-[11px]">Material & Est. Unit:</span>
                          <strong className="text-slate-900 font-bold">
                            {processEstimates[selectedProcess].mat} • {processEstimates[selectedProcess].unit}
                          </strong>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 block text-[11px]">Est. Dispatch:</span>
                          <strong className="text-emerald-600 font-bold">
                            {processEstimates[selectedProcess].lead}
                          </strong>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate('/quote')}
                        className="w-full btn-forge-primary text-xs py-2.5 flex items-center justify-center gap-1.5"
                      >
                        Proceed to Full Quoting Engine
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Micro Metric Pills below */}
                <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-500 font-medium">Laser Cut Turnaround</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">48–72 Hrs</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-500 font-medium">Min. Tolerance</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">±0.025 mm</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-500 font-medium">Min. Order Qty</p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">1 Part (₹0 Tooling)</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Proof Metric Cards */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="card-premium p-6 border-slate-200/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF5722] flex items-center justify-center shrink-0">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#0F172A]">500+</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Audited Machine Shops
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Pune, Peenya, Ambattur, NCR</p>
              </div>
            </div>

            <div className="card-premium p-6 border-slate-200/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#FF5722]">₹0</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Tooling on Prototypes
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Direct CNC & laser cutting</p>
              </div>
            </div>

            <div className="card-premium p-6 border-slate-200/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#0F172A]">99.4%</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  On-Time Dispatch
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Air & express surface cargo</p>
              </div>
            </div>

            <div className="card-premium p-6 border-slate-200/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#0F172A]">50,000+</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Custom Parts Made
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Robotics, drones, EV, IoT</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works - 4 Step Workflow */}
      <section className="py-16 lg:py-24 bg-[#F8FAFC]">
        <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-pill badge-pill-orange mb-3">Seamless Digital Workflow</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
              From CAD to Physical Part in 4 Simple Steps
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              Say goodbye to chasing 15 vendors for quotes over email and phone calls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="card-premium p-6 sm:p-7 relative flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-orange-200 block mb-3 font-mono">01</span>
                <h3 className="text-base font-bold text-slate-900 mb-2">Upload CAD Drawing</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Drag and drop 3D STEP or 2D DXF files. Automatically protected under mutual Non-Disclosure Agreement.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-orange-600">
                Auto File Repair & DFM →
              </div>
            </div>

            {/* Step 2 */}
            <div className="card-premium p-6 sm:p-7 relative flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-blue-200 block mb-3 font-mono">02</span>
                <h3 className="text-base font-bold text-slate-900 mb-2">Instant DFM & INR Quote</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Configure raw materials, thickness, surface finishes. See live itemized pricing with CGST/SGST/IGST breakdown.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-blue-600">
                18% Input Tax Credit →
              </div>
            </div>

            {/* Step 3 */}
            <div className="card-premium p-6 sm:p-7 relative flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-emerald-200 block mb-3 font-mono">03</span>
                <h3 className="text-base font-bold text-slate-900 mb-2">Shop-Floor Production</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dispatched to audited CNC milling or fiber laser cutting cells in Pune, Bangalore, or NCR with live milestone updates.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-emerald-600">
                WhatsApp Live Updates →
              </div>
            </div>

            {/* Step 4 */}
            <div className="card-premium p-6 sm:p-7 relative flex flex-col justify-between">
              <div>
                <span className="text-3xl font-black text-purple-200 block mb-3 font-mono">04</span>
                <h3 className="text-base font-bold text-slate-900 mb-2">CMM Metrology & Delivery</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Components undergo calibrated CMM dimensional inspection and are securely crated with test certificates & tax invoices.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-purple-600">
                Inspection Sheet Included →
              </div>
            </div>

          </div>

          <div className="text-center mt-12">
            <Link to="/quote" className="btn-forge-primary text-sm py-3 px-7">
              Start Your First CAD Quote Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Manufacturing Capabilities */}
      <section className="py-16 lg:py-24 bg-white border-t border-slate-200/80">
        <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="badge-pill badge-pill-orange mb-2">Manufacturing Spectrum</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                Industrial Processes Engineered for Every Scale
              </h2>
            </div>
            <Link to="/capabilities" className="text-xs font-bold text-[#FF5722] hover:underline flex items-center gap-1 mt-4 md:mt-0">
              View all 8 manufacturing capabilities →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Sheet Metal */}
            <div className="card-premium p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF5722] flex items-center justify-center mb-5">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Sheet Metal & Laser Cutting</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  High-speed fiber laser cutting (up to 20mm SS/MS), CNC press brake bending, hardware insertion (PEM), and powder coating.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Tolerances: ±0.1 mm</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Materials: CRCA, SS 304/316, Al 6061</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Turnaround: 3–5 Business Days</div>
                </div>
              </div>
              <Link to="/quote" className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-[#FF5722] flex items-center gap-1">
                Configure Sheet Metal →
              </Link>
            </div>

            {/* CNC Machining */}
            <div className="card-premium p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">CNC Milling & Turning</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  3-axis, 4-axis, and 5-axis CNC machining for complex aerospace, robotics, and automotive precision components.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Tolerances: ±0.015 mm</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Surface Finish: Ra 0.8 µm standard</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Post-Ops: Hard Anodizing, Black Oxide</div>
                </div>
              </div>
              <Link to="/quote" className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-[#FF5722] flex items-center gap-1">
                Configure CNC Parts →
              </Link>
            </div>

            {/* 3D Printing */}
            <div className="card-premium p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Industrial 3D Printing</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Selective Laser Sintering (SLS), Stereolithography (SLA), and FDM for rapid functional prototyping and end-use plastics.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Materials: Nylon PA12, Resin, ABS, PC</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Turnaround: 24 to 48 Hours</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Zero Tooling Cost</div>
                </div>
              </div>
              <Link to="/quote" className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-[#FF5722] flex items-center gap-1">
                Configure 3D Prints →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* India Advantage / Trust Section */}
      <section className="py-16 lg:py-24 bg-[#0F172A] text-white">
        <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-3.5 py-1.5 rounded-full border border-orange-800">
              Why Indian Engineers Choose FabForge
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-4 tracking-tight">
              Domestic Reliability Without Import Headaches
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              Avoid lengthy customs clearance, 40% import duties, and unreliable overseas communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 border border-slate-700/80 p-8 rounded-2xl">
              <Building2 className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">100% GST Invoicing</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Claim full 18% Input Tax Credit (ITC) directly on all prototypes and production volumes. Native tax-compliant invoices generated instantly.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 p-8 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Strict IP & NDA Safeguards</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your proprietary CAD files remain encrypted and are shared exclusively with pre-screened partner shops bound by legally enforceable NDAs.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 p-8 rounded-2xl">
              <Truck className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Express Pan-India Logistics</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Air-cargo and surface express partnerships with Blue Dart & Delhivery ensure guaranteed doorstep delivery across Tier 1, 2, and 3 industrial belts.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* High-converting Bottom CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-[#FF5722] via-[#F4511E] to-[#E64A19] text-white">
        <div className="w-full max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to manufacture your first part?
          </h2>
          <p className="text-orange-100 max-w-2xl mx-auto text-base sm:text-lg">
            Upload your CAD file right now. Get instant DFM analysis and order parts in less than 5 minutes.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quote"
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-bold py-3.5 px-8 rounded-xl shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4 text-orange-400" />
              Launch Instant Quoter
            </Link>
            <Link
              to="/materials"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-sm font-bold py-3.5 px-8 rounded-xl border border-white/30 transition-all flex items-center justify-center"
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
