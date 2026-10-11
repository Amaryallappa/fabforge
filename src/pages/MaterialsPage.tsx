import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface MaterialItem {
  id: string;
  name: string;
  code: string;
  category: 'sheet_metal' | 'cnc' | '3d_printing' | 'specialty';
  density: string;
  tensileStrength: string;
  finishOptions: string[];
  estimatedCostInr: string;
  typicalUses: string;
  leadTime: string;
  origin: string;
}

const MATERIALS_CATALOG: MaterialItem[] = [
  {
    id: 'ss304',
    name: 'Stainless Steel 304',
    code: 'AISI 304 / 1.4301',
    category: 'sheet_metal',
    density: '7.93 g/cm³',
    tensileStrength: '505–700 MPa',
    finishOptions: ['2B Mill Finish', 'No. 4 Brushed Hairline', 'Mirror #8', 'Passivated'],
    estimatedCostInr: '₹260 – ₹310 / kg',
    typicalUses: 'Food processing, pharmaceutical equipment, kitchenware, chemical enclosures',
    leadTime: '3-4 Days',
    origin: 'Jindal Stainless / Salem Steel',
  },
  {
    id: 'ss316l',
    name: 'Stainless Steel 316L',
    code: 'AISI 316L / 1.4404',
    category: 'sheet_metal',
    density: '8.00 g/cm³',
    tensileStrength: '485–620 MPa',
    finishOptions: ['2B Finish', 'Electropolished', 'Bead Blasted'],
    estimatedCostInr: '₹340 – ₹420 / kg',
    typicalUses: 'Marine hardware, chemical process tanks, medical devices, high-saline environments',
    leadTime: '3-5 Days',
    origin: 'Jindal Stainless / Imported',
  },
  {
    id: 'crca',
    name: 'CRCA Mild Steel',
    code: 'IS 513 / CR1-CR4',
    category: 'sheet_metal',
    density: '7.85 g/cm³',
    tensileStrength: '270–410 MPa',
    finishOptions: ['Powder Coated', 'Zinc Plated (Yellow/Blue)', 'Black Oxide'],
    estimatedCostInr: '₹72 – ₹85 / kg',
    typicalUses: 'Automotive body brackets, electrical panel boxes, server racks, agricultural chassis',
    leadTime: '2-3 Days',
    origin: 'Tata Steel / JSW Steel',
  },
  {
    id: 'al6061',
    name: 'Aluminum 6061-T6',
    code: 'ASTM B221 / HE20',
    category: 'cnc',
    density: '2.70 g/cm³',
    tensileStrength: '290–310 MPa',
    finishOptions: ['Type II Anodized', 'Hard Anodized (Type III)', 'Bead Blast Ra 1.6'],
    estimatedCostInr: '₹310 – ₹380 / kg',
    typicalUses: 'Drone frames, EV battery enclosures, precision robotics arms, heat sinks',
    leadTime: '3-5 Days',
    origin: 'Hindalco / Nalco',
  },
  {
    id: 'al7075',
    name: 'Aluminum 7075-T6',
    code: 'Aerospace Grade',
    category: 'cnc',
    density: '2.81 g/cm³',
    tensileStrength: '572 MPa',
    finishOptions: ['Hardcoat Anodizing', 'Chemical Film / Alodine'],
    estimatedCostInr: '₹420 – ₹550 / kg',
    typicalUses: 'Aerospace structural mounts, high-stress motorsport gears, defense components',
    leadTime: '4-6 Days',
    origin: 'Imported Cert. / Hindalco',
  },
  {
    id: 'ar400',
    name: 'Hardox 400 / AR400',
    code: 'Abrasion Resistant',
    category: 'sheet_metal',
    density: '7.85 g/cm³',
    tensileStrength: '1250 MPa',
    finishOptions: ['Shot Blasted & Primed', 'As-Cut Edge'],
    estimatedCostInr: '₹120 – ₹160 / kg',
    typicalUses: 'Excavator bucket wear plates, mining chutes, heavy stone crusher liners',
    leadTime: '4-5 Days',
    origin: 'SSAB / JSW Hardox',
  },
  {
    id: 'brass_cw614n',
    name: 'Free-Cutting Brass',
    code: 'CW614N / IS 319 Gr. 1',
    category: 'cnc',
    density: '8.44 g/cm³',
    tensileStrength: '360–500 MPa',
    finishOptions: ['Polished', 'Nickel Plated', 'Chrome Plated'],
    estimatedCostInr: '₹650 – ₹720 / kg',
    typicalUses: 'Plumbing fittings, threaded sensor bushings, precision clockwork, RF connectors',
    leadTime: '3-4 Days',
    origin: 'Jamnagar Brass Clusters',
  },
  {
    id: 'copper_c110',
    name: 'Electrolytic Copper',
    code: 'C11000 / ETP Copper',
    category: 'specialty',
    density: '8.94 g/cm³',
    tensileStrength: '220–380 MPa',
    finishOptions: ['Bright Acid Dip', 'Tin Plated', 'Silver Plated'],
    estimatedCostInr: '₹880 – ₹980 / kg',
    typicalUses: 'EV busbars, power distribution contacts, high-power cooling heat pipes',
    leadTime: '3-5 Days',
    origin: 'Sterlite / Hindalco',
  },
  {
    id: 'nylon_pa12',
    name: 'Nylon PA12 (SLS)',
    code: 'Industrial Polyamide',
    category: '3d_printing',
    density: '1.01 g/cm³',
    tensileStrength: '48 MPa',
    finishOptions: ['Dyed Black', 'Vapor Smoothed', 'Shot Peened'],
    estimatedCostInr: '₹14 – ₹22 / cm³',
    typicalUses: 'Custom drone enclosures, snap-fit prototypes, jigs & fixtures, prosthetic parts',
    leadTime: '2 Days',
    origin: 'Evonik / Arkema India',
  },
  {
    id: 'abs_industrial',
    name: 'Industrial ABS',
    code: 'Acrylonitrile Butadiene Styrene',
    category: '3d_printing',
    density: '1.04 g/cm³',
    tensileStrength: '40 MPa',
    finishOptions: ['Acetone Vapor Polish', 'Textured As-Printed'],
    estimatedCostInr: '₹8 – ₹15 / cm³',
    typicalUses: 'Concept models, automotive interior bezels, electronic housings',
    leadTime: '1-2 Days',
    origin: 'LG Chem / Reliance Polymers',
  },
  {
    id: 'delrin_pom',
    name: 'Delrin / Acetal (POM-C)',
    code: 'Polyoxymethylene',
    category: 'cnc',
    density: '1.41 g/cm³',
    tensileStrength: '65–70 MPa',
    finishOptions: ['As Machined (Smooth Ra 1.6)', 'Natural White / Black'],
    estimatedCostInr: '₹450 – ₹580 / kg',
    typicalUses: 'Low-friction gears, bushings, electrical insulator brackets, conveyor rollers',
    leadTime: '3-4 Days',
    origin: 'DuPont / Ensinger India',
  },
];

export const MaterialsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = MATERIALS_CATALOG.filter((mat) => {
    const matchesSearch =
      mat.name.toLowerCase().includes(search.toLowerCase()) ||
      mat.code.toLowerCase().includes(search.toLowerCase()) ||
      mat.typicalUses.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || mat.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex flex-col font-sans selection:bg-[#FF6B35] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="badge badge-orange mb-2">Domestic Material Sourcing</div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1A1A2E] tracking-tight">
            Materials Library & Live Market Rates
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base">
            Verified engineering metals and polymers with domestic test certifications (MTC). Direct mill pricing from Tata Steel, Jindal, and Hindalco.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card p-4 mb-8 border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by alloy, standard, or use..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#FF6B35]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Materials' },
              { id: 'sheet_metal', label: 'Sheet Metal' },
              { id: 'cnc', label: 'CNC Machining' },
              { id: '3d_printing', label: '3D Printing' },
              { id: 'specialty', label: 'Specialty / Copper' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-[#1A1A2E] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mat) => (
            <div
              key={mat.id}
              className="card p-6 border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{mat.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{mat.code}</p>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-orange-100 text-[#FF6B35] uppercase">
                    {mat.category.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 my-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Density:</span>
                    <span className="font-semibold text-slate-900">{mat.density}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tensile Strength:</span>
                    <span className="font-semibold text-slate-900">{mat.tensileStrength}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Benchmark Price:</span>
                    <span className="font-bold text-[#FF6B35]">{mat.estimatedCostInr}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Mill Source:</span>
                    <span className="font-medium text-slate-700">{mat.origin}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 mb-4">
                  <p>
                    <strong className="text-slate-800">Applications:</strong> {mat.typicalUses}
                  </p>
                  <p>
                    <strong className="text-slate-800">Available Finishes:</strong>{' '}
                    {mat.finishOptions.join(', ')}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  Dispatch in {mat.leadTime}
                </span>
                <Link
                  to="/quote"
                  className="btn-forge text-xs py-1.5 px-3 flex items-center gap-1 shadow-none"
                >
                  Quote in this Material
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Custom material inquiry banner */}
        <div className="mt-12 card p-8 bg-gradient-to-r from-slate-900 to-[#1A1A2E] text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Need Titanium, Inconel, or Custom PEEK?</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              We source specialty and imported alloys directly through audited aerospace and defense suppliers with complete 3.1 chemical & mechanical mill certificates.
            </p>
          </div>
          <Link
            to="/quote"
            className="btn-forge text-xs py-3 px-6 shrink-0"
          >
            Request Custom Alloy Quote
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
};
export default MaterialsPage;
