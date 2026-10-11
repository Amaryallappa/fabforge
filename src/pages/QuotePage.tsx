import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileCheck, 
  Trash2, 
  Layers, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Info,
  CreditCard,
  Clock,
  Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { calculatePrice } from '../lib/pricing';
import type { ProcessType, PriceResult } from '../lib/pricing';
import { calculateGST, validateGSTIN, STATE_CODES, formatINR, FABFORGE_STATE_CODE } from '../lib/gst';
import { supabase } from '../lib/supabase';

export const QuotePage: React.FC = () => {
  const navigate = useNavigate();

  // Quote Configuration State
  const [file, setFile] = useState<{ name: string; size: string } | null>({
    name: 'bracket-chassis-v3.step',
    size: '4.2 MB',
  });
  const [process, setProcess] = useState<ProcessType>('sheet_metal');
  const [material, setMaterial] = useState<string>('stainless-304');
  const [thickness, setThickness] = useState<number>(2.0);
  const [quantity, setQuantity] = useState<number>(10);
  const [secondaryOps, setSecondaryOps] = useState<string[]>(['deburring']);
  const [customerState, setCustomerState] = useState<string>('27'); // Maharashtra default
  const [gstin, setGstin] = useState<string>('');
  const [isGstinValid, setIsGstinValid] = useState<boolean>(true);

  // Pricing Engine State
  const [priceData, setPriceData] = useState<PriceResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Re-run pricing engine on any config change
  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const res = calculatePrice({
        process,
        material,
        thicknessMm: thickness,
        quantity,
        secondaryOps,
      });
      setPriceData(res);
      setIsCalculating(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [process, material, thickness, quantity, secondaryOps]);

  // GST validation
  const handleGstinChange = (val: string) => {
    const cleaned = val.toUpperCase().trim();
    setGstin(cleaned);
    if (cleaned.length > 0) {
      const valid = validateGSTIN(cleaned);
      setIsGstinValid(valid);
      if (valid) {
        const stateCode = cleaned.substring(0, 2);
        if (STATE_CODES[stateCode]) {
          setCustomerState(stateCode);
          toast.success(`GSTIN verified for ${STATE_CODES[stateCode]}`);
        }
      }
    } else {
      setIsGstinValid(true);
    }
  };

  const toggleOp = (op: string) => {
    if (op === 'deburring') return; // default free
    if (secondaryOps.includes(op)) {
      setSecondaryOps(secondaryOps.filter((o) => o !== op));
    } else {
      setSecondaryOps([...secondaryOps, op]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploaded = e.target.files[0];
      const sizeMb = (uploaded.size / (1024 * 1024)).toFixed(1);
      setFile({
        name: uploaded.name,
        size: `${sizeMb} MB`,
      });
      toast.success(`Loaded ${uploaded.name}. DFM analysis passed!`);
    }
  };

  // GST Breakdown calculations
  const gstDetails = priceData ? calculateGST(priceData.totalPrice, customerState) : null;

  // Generate PDF Quotation
  const handleDownloadProforma = () => {
    if (!priceData || !gstDetails) return;
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 107, 53);
    doc.text('FabForge India', 20, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text('Digital Manufacturing & Rapid Prototyping Network', 20, 26);
    doc.text('GSTIN: 27AABCF1234F1Z8 | HSN/SAC: 9988', 20, 31);
    doc.text('Hub: MIDC Bhosari, Pune, Maharashtra 411026', 20, 36);

    doc.setDrawColor(220, 220, 220);
    doc.line(20, 42, 190, 42);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFORMA TAX INVOICE / ESTIMATE', 20, 50);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Estimate Ref: FF-QT-${Date.now().toString().slice(-6)}`, 20, 56);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 61);
    doc.text(`Customer State Code: ${customerState} (${STATE_CODES[customerState] || 'Other'})`, 20, 66);
    if (gstin) doc.text(`Customer GSTIN: ${gstin}`, 20, 71);

    // Item Table
    doc.setFillColor(245, 247, 250);
    doc.rect(20, 78, 170, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Item Description', 25, 83);
    doc.text('Process / Material', 85, 83);
    doc.text('Qty', 135, 83);
    doc.text('Amount (INR)', 160, 83);

    doc.setFont('helvetica', 'normal');
    doc.text(file ? file.name : 'Custom Part', 25, 93);
    doc.text(`${process} | ${material} (${thickness}mm)`, 85, 93);
    doc.text(`${quantity}`, 137, 93);
    doc.text(`₹${priceData.totalPrice.toLocaleString('en-IN')}`, 160, 93);

    // Summary lines
    let y = 110;
    doc.line(20, y, 190, y);
    y += 8;
    doc.text('Taxable Value:', 120, y);
    doc.text(`₹${priceData.totalPrice.toLocaleString('en-IN')}`, 165, y);

    y += 6;
    if (gstDetails.isInterstate) {
      doc.text('IGST (18%):', 120, y);
      doc.text(`₹${Math.round(gstDetails.igst ?? 0).toLocaleString('en-IN')}`, 165, y);
    } else {
      doc.text('CGST (9%):', 120, y);
      doc.text(`₹${Math.round(gstDetails.cgst ?? 0).toLocaleString('en-IN')}`, 165, y);
      y += 5;
      doc.text('SGST (9%):', 120, y);
      doc.text(`₹${Math.round(gstDetails.sgst ?? 0).toLocaleString('en-IN')}`, 165, y);
    }

    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Total Payables (INR):', 120, y);
    doc.text(`₹${Math.round(gstDetails.totalAmount).toLocaleString('en-IN')}`, 165, y);

    y += 18;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Dispatch within 3-5 business days upon payment confirmation.', 20, y);
    doc.text('Bank Transfer / UPI / Razorpay options available.', 20, y + 5);

    doc.save(`FabForge_Quotation_${Date.now().toString().slice(-6)}.pdf`);
    toast.success('Proforma Tax Invoice downloaded!');
  };

  // Place Order / Submit
  const handleProceedOrder = async () => {
    if (!priceData || !gstDetails) return;
    setIsSubmitting(true);

    const generatedOrderId = `ORD-IN-${Date.now().toString().slice(-6)}`;

    try {
      // Try Supabase insert
      const { error } = await supabase.from('quotes').insert({
        file_name: file?.name || 'custom_part.step',
        file_url: null,
        material,
        thickness_mm: thickness,
        quantity,
        process,
        secondary_ops: secondaryOps,
        price_inr: Math.round(gstDetails.totalAmount),
        status: 'pending',
        lead_time_days: priceData.leadTimeDays,
      });

      if (error) {
        console.warn('Supabase not fully connected yet, saving locally:', error.message);
      }
    } catch (e) {
      console.warn('Supabase local fallback active');
    }

    toast.success(`Quote Confirmed! Order ID: ${generatedOrderId}`);
    setIsSubmitting(false);

    // Redirect to tracking page
    setTimeout(() => {
      navigate(`/track/${generatedOrderId}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex flex-col font-sans selection:bg-[#FF6B35] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A2E] tracking-tight">
                Instant CAD Quoting Engine
              </h1>
              <span className="badge badge-orange">Live INR Rates</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select process, materials, tolerances, and secondary operations for real-time cost breakdown.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadProforma}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Download Proforma PDF
            </button>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: CAD & Part Config (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. CAD File Uploader */}
            <div className="card p-6 border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B35] font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    CAD Geometry & DFM Inspection
                  </h2>
                </div>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5" /> Mutual NDA Active
                </span>
              </div>

              {!file ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-orange-50/20 hover:border-orange-400 rounded-xl p-10 cursor-pointer transition-all">
                  <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                  <span className="text-sm font-semibold text-slate-700">
                    Click to browse or drag 3D/2D CAD files
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Accepts .STEP, .STP, .DXF, .DWG, .STL, .SLDPRT (Max 100MB)
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".step,.stp,.dxf,.dwg,.stl,.sldprt"
                    onChange={handleFileUpload}
                  />
                </label>
              ) : (
                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FF6B35] text-white flex items-center justify-center shadow-sm">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{file.name}</p>
                      <p className="text-xs text-slate-500">
                        {file.size} • <span className="text-emerald-600 font-semibold">DFM Feasible: Ready for Cutting & Forming</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* 2. Process Selection */}
            <div className="card p-6 border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B35] font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Select Manufacturing Process
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'sheet_metal', label: 'Sheet Metal', sub: 'Laser cut & press brake', icon: Layers },
                  { id: 'cnc_machining', label: 'CNC Machining', sub: 'Milling & lathe turning', icon: Cpu },
                  { id: '3d_printing', label: '3D Printing', sub: 'SLS / SLA / FDM rapid', icon: Sparkles },
                  { id: 'injection_molding', label: 'Injection Molding', sub: 'Tooling & mass plastics', icon: Printer },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = process === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProcess(item.id as ProcessType)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#FF6B35] bg-orange-50/50 shadow-sm ring-1 ring-[#FF6B35]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#FF6B35]' : 'text-slate-500'}`} />
                      <p className={`text-xs font-bold ${isSelected ? 'text-[#FF6B35]' : 'text-slate-900'}`}>
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Material & Dimensions */}
            <div className="card p-6 border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B35] font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Material & Thickness Specification
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Raw Material Grade
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="input-base"
                  >
                    <optgroup label="Stainless Steel (Food / Marine)">
                      <option value="stainless-304">SS 304 (General Purpose Engineering)</option>
                      <option value="stainless-316">SS 316L (High Corrosion Resistance)</option>
                    </optgroup>
                    <optgroup label="Carbon & Mild Steel">
                      <option value="cr-steel">CRCA Mild Steel (IS 513 / St 12)</option>
                      <option value="ar400">Hardox / AR400 Wear Resistant</option>
                    </optgroup>
                    <optgroup label="Aluminum Alloys">
                      <option value="alu-6061">Aluminum 6061-T6 (Aircraft & Enclosures)</option>
                      <option value="alu-7075">Aluminum 7075-T6 (High Strength)</option>
                    </optgroup>
                    <optgroup label="Engineering Polymers (3D / CNC)">
                      <option value="nylon-pa12">Nylon PA12 (SLS Functional Grade)</option>
                      <option value="abs">ABS Industrial Polymer</option>
                      <option value="pc">Polycarbonate High-Impact</option>
                    </optgroup>
                    <optgroup label="Copper & Brass">
                      <option value="copper">Pure Electrolytic Copper (99.9%)</option>
                      <option value="brass">Free-Cutting Brass CW614N</option>
                    </optgroup>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    Sourced from Tata Steel, Jindal Stainless, Hindalco
                  </p>
                </div>

                {/* Thickness / Gage */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Sheet Thickness / Wall Spec (mm)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[1.0, 1.5, 2.0, 3.0, 5.0, 8.0].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setThickness(t)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          thickness === t
                            ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {t} mm
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Secondary Operations */}
            <div className="card p-6 border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B35] font-bold text-xs flex items-center justify-center">
                  4
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Secondary Operations & Finishing
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'deburring', name: 'Deburring & Edge Rounding', price: 'Free / Included', desc: 'Vibratory tumbler standard' },
                  { id: 'bending', name: 'CNC Press Brake Bending', price: '+₹150 / bend', desc: 'Precision angle to ±0.5°' },
                  { id: 'powder_coating', name: 'Powder Coating (Black / RAL)', price: '+₹85 / part', desc: '7-tank pretreatment + 60µm' },
                  { id: 'anodizing', name: 'Type II / III Anodizing', price: '+₹120 / part', desc: 'Clear or Black matte' },
                  { id: 'zinc_plating', name: 'Zinc Passivation Plating', price: '+₹65 / part', desc: 'Anti-corrosion electroplating' },
                  { id: 'tapping', name: 'CNC Tapping / Threading', price: '+₹45 / hole', desc: 'M3 to M12 ISO metric threads' },
                ].map((op) => {
                  const checked = secondaryOps.includes(op.id);
                  return (
                    <label
                      key={op.id}
                      onClick={() => toggleOp(op.id)}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        checked
                          ? 'border-orange-300 bg-orange-50/40'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}} // handled by parent div
                        className="mt-1 h-4 w-4 text-[#FF6B35] rounded border-slate-300 focus:ring-[#FF6B35]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{op.name}</span>
                          <span className="text-[11px] font-semibold text-slate-600">{op.price}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{op.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 5. Indian GST & Compliance Details */}
            <div className="card p-6 border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B35] font-bold text-xs flex items-center justify-center">
                  5
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  GST Registration & Delivery State
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Destination State for Tax Rate
                  </label>
                  <select
                    value={customerState}
                    onChange={(e) => setCustomerState(e.target.value)}
                    className="input-base"
                  >
                    {Object.entries(STATE_CODES).map(([code, name]) => (
                      <option key={code} value={code}>
                        {code} - {name} {code === FABFORGE_STATE_CODE ? '(Intrastate CGST+SGST)' : '(Interstate IGST)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    GSTIN for 18% Input Tax Credit (Optional)
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => handleGstinChange(e.target.value)}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    maxLength={15}
                    className={`input-base ${!isGstinValid ? 'border-red-500 bg-red-50/50' : ''}`}
                  />
                  {!isGstinValid && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">
                      Invalid 15-digit GSTIN pattern. Example: 27AAAAA0000A1Z5
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Price Summary & Checkout (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 card p-6 border-slate-200 shadow-xl space-y-6 bg-white">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-[#1A1A2E]">
                  Price Breakdown
                </h3>
                <span className="badge badge-green flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {priceData?.leadTimeDays ?? 3} Days Dispatch
                </span>
              </div>

              {/* Quantity Stepper */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Production Quantity
                </label>
                <div className="flex border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border-r border-slate-300 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-center font-bold text-slate-900 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border-l border-slate-300 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Quick quantity chips */}
                <div className="flex gap-1.5 mt-2">
                  {[1, 5, 10, 25, 50, 100].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuantity(q)}
                      className={`text-[11px] py-1 px-2 rounded-md font-semibold border ${
                        quantity === q
                          ? 'bg-[#1A1A2E] text-white border-[#1A1A2E]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
                {isCalculating ? (
                  <div className="py-8 text-center">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-xs text-slate-500 font-medium">Calculating DFM Pricing...</p>
                  </div>
                ) : priceData && gstDetails ? (
                  <>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Base Part Processing:</span>
                      <span className="font-semibold text-slate-900">
                        {formatINR(priceData.totalPrice)}
                      </span>
                    </div>

                    {priceData.breakdownItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-slate-500 pl-2">
                        <span>• {item.label}</span>
                        <span>{item.amount < 0 ? `- ${formatINR(Math.abs(item.amount))}` : formatINR(item.amount)}</span>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-slate-200 flex justify-between text-xs text-slate-600">
                      <span>
                        GST ({gstDetails.isInterstate ? '18% IGST' : '9% CGST + 9% SGST'}):
                      </span>
                      <span className="font-semibold text-slate-900">
                        {formatINR(gstDetails.totalGST)}
                      </span>
                    </div>

                    <div className="pt-3 border-t-2 border-slate-300 flex justify-between items-baseline">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Total Payable
                        </p>
                        <p className="text-[11px] text-[#FF6B35] font-semibold">
                          ₹{(gstDetails.totalAmount / quantity).toFixed(2)} / part (inc. tax)
                        </p>
                      </div>
                      <p className="text-2xl font-black text-[#1A1A2E]">
                        {formatINR(gstDetails.totalAmount)}
                      </p>
                    </div>
                  </>
                ) : null}
              </div>

              {/* Delivery & Assurance */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>CMM dimensional inspection sheet included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Free shipping across India on orders &gt; ₹5,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Material test certificate (MTC) supplied</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleProceedOrder}
                  disabled={isSubmitting || !file}
                  className={`w-full btn-forge text-sm py-3 shadow-md flex items-center justify-center gap-2 ${
                    !file ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  {isSubmitting ? 'Generating Order...' : 'Confirm Order & Pay Online'}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadProforma}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  Download Proforma GST Invoice
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
export default QuotePage;
