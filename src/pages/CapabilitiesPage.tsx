import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Microscope,
  Box
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface CapabilityCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  envelope: string;
  tolerances: string;
  leadTime: string;
  machinery: string;
  bestFor: string[];
}

const CAPABILITIES: CapabilityCard[] = [
  {
    id: 'sheet_metal',
    title: 'Sheet Metal & Fiber Laser Cutting',
    subtitle: 'High-speed flat cutting, CNC press brake forming, and PEM hardware insertion',
    description: 'Equipped with Bystronic and Trumpf 6kW to 12kW fiber lasers capable of cutting up to 20mm mild steel and 15mm stainless steel with zero burr edges. Integrated with multi-axis CNC bending brakes.',
    envelope: '3000 mm × 1500 mm (Bed Size)',
    tolerances: '±0.1 mm (Laser) / ±0.2 mm (Bending)',
    leadTime: '3-4 Business Days',
    machinery: 'Trumpf TruLaser, Bystronic Bending Brakes',
    bestFor: ['Enclosures', 'Chassis', 'Mounting Brackets', 'Server Racks', 'Industrial Panels'],
  },
  {
    id: 'cnc_machining',
    title: 'Precision CNC Milling & Lathe Turning',
    subtitle: '3, 4, and 5-axis simultaneous high-precision metal and polymer machining',
    description: 'High-speed machining centers delivering mirror-smooth surface finishes, tight bore alignments, and complex contoured geometries in aluminum, stainless steel, brass, and engineering plastics.',
    envelope: '1000 mm × 600 mm × 500 mm',
    tolerances: '±0.015 mm (Standard) / ±0.005 mm (Precision)',
    leadTime: '4-6 Business Days',
    machinery: 'Haas VF-4SS, Mazak VTC, Doosan CNC Lathes',
    bestFor: ['Robotics Joints', 'EV Motor Housings', 'Drone Hubs', 'Hydraulic Manifolds'],
  },
  {
    id: '3d_printing',
    title: 'Industrial Additive Manufacturing / 3D Printing',
    subtitle: 'Production-grade SLS, SLA, and Metal DMLS for prototypes and end-use parts',
    description: 'Utilizing Selective Laser Sintering (SLS) for isotropic Nylon PA12 functional parts, Stereolithography (SLA) for micro-detailed prototypes, and Direct Metal Laser Sintering (DMLS) for titanium implants.',
    envelope: '380 mm × 380 mm × 300 mm',
    tolerances: '±0.2 mm or ±0.002 mm/mm',
    leadTime: '2-3 Business Days',
    machinery: 'EOS P 396 (SLS), Formlabs 3L (SLA)',
    bestFor: ['Complex Internal Channels', 'Lightweight Topology', 'Rapid Fitment Testing'],
  },
  {
    id: 'tube_cutting',
    title: 'CNC Fiber Laser Tube Cutting',
    subtitle: 'Beveling, slotting, and profiling on round, square, and rectangular tubes',
    description: 'Dedicated rotary tube lasers capable of cutting intricate interlocks, saddle joints, and slots directly into structural pipes, drastically reducing welding alignment labor.',
    envelope: 'Ø20 mm to Ø220 mm × 6000 mm Length',
    tolerances: '±0.15 mm',
    leadTime: '3-5 Business Days',
    machinery: 'Han\'s Laser Tube Master 6020',
    bestFor: ['Spaceframe Chassis', 'Roll Cages', 'Furniture Frames', 'Architectural Trusses'],
  },
  {
    id: 'injection_molding',
    title: 'Plastic Injection Molding & Rapid Tooling',
    subtitle: 'From bridge aluminum tooling (500-50,000 parts) to hardened steel mass production',
    description: 'Complete mould design, moldflow analysis, domestic tool manufacturing, and cleanroom plastic injection molding. Compatible with ABS, Polycarbonate, POM, and glass-filled Nylon.',
    envelope: 'Up to 600 Ton Clamping Force',
    tolerances: 'DIN 16742 Standard (±0.05 mm)',
    leadTime: '12-18 Business Days (First Offs)',
    machinery: 'Toshiba & L&T All-Electric Injection Presses',
    bestFor: ['Consumer Electronics Shells', 'Medical Casings', 'Automotive Knobs'],
  },
  {
    id: 'surface_finishing',
    title: 'Surface Finishing & Chemical Treatment',
    subtitle: 'In-house automated powder coating, anodizing, plating, and laser etching',
    description: 'Protect your parts against corrosion and wear with automated 7-tank pre-treatment lines, Type II and Type III Hard Anodizing, zinc electroplating, and electro-polishing.',
    envelope: 'Tanks up to 2500 mm Length',
    tolerances: 'Film thickness controlled to ±5 µm',
    leadTime: '1-2 Days (Add-on)',
    machinery: 'Nordson Automated Powder Coating Booths',
    bestFor: ['Aesthetic Enclosures', 'Outdoor Corrosion Resistance', 'Part Branding'],
  },
  {
    id: 'welding_assembly',
    title: 'Certified TIG/MIG Welding & Sub-Assembly',
    subtitle: 'AWS & ASME certified welders for structural assemblies and turnkey box-builds',
    description: 'Comprehensive mechanical assembly including rivet nut insertion, stud welding, spot welding, ultrasonic plastic welding, hardware integration, and end-of-line functional testing.',
    envelope: 'Full Skid / Structural Frame Assemblies',
    tolerances: 'ISO 13920 Welding Tolerance Class B',
    leadTime: '5-8 Business Days',
    machinery: 'Fronius Pulse TIG/MIG Robotic Welding Cells',
    bestFor: ['Heavy Machinery Skids', 'Telecom Racks', 'EV Battery Modules'],
  },
  {
    id: 'quality_inspection',
    title: 'CMM Metrology & Quality Assurance',
    subtitle: 'Mitutoyo coordinate measuring machines (CMM) and optical 3D scanning',
    description: 'Every production batch undergoes 100% first-article inspection (FAI) and statistically controlled sampling with Zeiss and Mitutoyo CMMs. We provide full dimensional inspection sheets, material MTC, and RoHs compliance certificates.',
    envelope: '1200 mm × 2000 mm × 1000 mm',
    tolerances: 'Volumetric Accuracy 1.5 µm',
    leadTime: 'Included with all orders',
    machinery: 'Mitutoyo Crysta-Apex CMM, Keyence Optical Micrometer',
    bestFor: ['Aerospace AS9100', 'Medical ISO 13485', 'Automotive IATF 16949'],
  },
];

export const CapabilitiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#FF5722] selection:text-white">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="badge badge-orange mb-3">Audited Manufacturing Network</div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1A1A2E] tracking-tight">
            Manufacturing Capabilities
          </h1>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            From single-piece rapid prototypes to high-volume contract manufacturing. Powered by over 500 audited Indian supplier machine shops.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.id}
              className="card p-6 sm:p-8 border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {cap.title}
                  </h3>
                  <span className="badge badge-blue text-[11px]">
                    {cap.leadTime}
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#FF6B35] mb-3">
                  {cap.subtitle}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {cap.description}
                </p>

                {/* Specs Matrix */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl text-xs mb-6">
                  <div>
                    <span className="text-slate-500 font-medium block">Working Envelope:</span>
                    <strong className="text-slate-900 font-bold">{cap.envelope}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Tolerances:</span>
                    <strong className="text-slate-900 font-bold">{cap.tolerances}</strong>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-medium block">Key Machinery:</span>
                    <span className="text-slate-800 font-medium">{cap.machinery}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {cap.bestFor.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Instant DFM Supported
                </span>
                <Link
                  to="/quote"
                  className="btn-forge text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm"
                >
                  Quote this Process
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quality guarantee section */}
        <div className="mt-16 card p-8 bg-white border border-slate-200 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FF6B35] flex items-center justify-center shrink-0">
                <Microscope className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">CMM Inspection Included</h4>
                <p className="text-xs text-slate-500">Every batch is dimensionally verified with calibrated coordinate measuring machines.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Zero-Defect Guarantee</h4>
                <p className="text-xs text-slate-500">Parts out of drawing specification are reworked or refunded at 100% of order value.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Industrial Packaging</h4>
                <p className="text-xs text-slate-500">Anti-rust VCI film, custom foam inserts, and heavy-duty corrugated export crating.</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};
export default CapabilitiesPage;
