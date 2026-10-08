import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Coins,
  RefreshCw,
  Plus,
  Minus,
  FileText,
  Boxes,
} from 'lucide-react';
import { INITIAL_SE_ENRICHED_DATA, SiliconExpertComponent } from '../data/siliconExpertData';

interface SiliconExpertResultsProps {
  productName?: string;
  revision?: string;
  onBack: () => void;
  onMatchBusinessCentral: () => void;
}

export const Screen14_SiliconExpertResults: React.FC<SiliconExpertResultsProps> = ({
  productName = 'Smart Hub',
  revision = 'Rev 0',
  onBack,
  onMatchBusinessCentral,
}) => {
  // Filter and Search States
  const [activeFilter, setActiveFilter] = useState<'All' | 'Validated' | 'Lifecycle Issue' | 'Alternative Found' | 'Unresolved'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer States
  const [selectedComponent, setSelectedComponent] = useState<SiliconExpertComponent | null>(INITIAL_SE_ENRICHED_DATA[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  // Filtered dataset
  const filteredComponents = useMemo(() => {
    return INITIAL_SE_ENRICHED_DATA.filter((item) => {
      // Tab filter
      if (activeFilter === 'Validated' && item.status !== 'Validated') return false;
      if (activeFilter === 'Lifecycle Issue' && item.status !== 'Lifecycle Issue') return false;
      if (activeFilter === 'Alternative Found' && item.status !== 'Alternative Found') return false;
      if (activeFilter === 'Unresolved' && item.status !== 'Unresolved') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPosition = item.position.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesOrigMpn = item.originalMpn.toLowerCase().includes(q);
        const matchesValMpn = item.validatedMpn.toLowerCase().includes(q);
        const matchesMfr = item.manufacturer.toLowerCase().includes(q);
        const matchesAltMpn = item.altMpn.toLowerCase().includes(q);
        const matchesAltMfr = item.altManufacturer.toLowerCase().includes(q);
        const matchesRisk = item.riskAlert.toLowerCase().includes(q);
        const matchesAvail = item.availability.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesPkg = item.package.toLowerCase().includes(q);
        if (
          !matchesPosition &&
          !matchesDesc &&
          !matchesOrigMpn &&
          !matchesValMpn &&
          !matchesMfr &&
          !matchesAltMpn &&
          !matchesAltMfr &&
          !matchesRisk &&
          !matchesAvail &&
          !matchesCat &&
          !matchesPkg
        ) {
          return false;
        }
      }

      return true;
    });
  }, [activeFilter, searchQuery]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: 112,
      validated: 98,
      lifecycleIssues: 4,
      alternatives: 8,
      unresolved: 2,
    };
  }, []);

  const handleExportFiltered = () => {
    const header = 'Position,Description,Original MPN,Validated MPN,Manufacturer,Alternative MPN,Alternative Mfr,Risk Alert,Availability,Datasheet,Lifecycle,Indicative Price,Status\n';
    const rows = filteredComponents.map((c) => 
      `"${c.position}","${c.description}","${c.originalMpn}","${c.validatedMpn}","${c.manufacturer}","${c.altMpn}","${c.altManufacturer}","${c.riskAlert}","${c.availability}","${c.datasheetTitle}","${c.lifecycle}","${c.indicativePrice}","${c.status}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${productName.replace(/\s+/g, '_')}_SiliconExpert_Enriched.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6 relative font-sans text-slate-800">
      {/* ================= HEADER & NAV ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            SiliconExpert Enriched Component Data
          </h1>
          <p className="text-xs text-slate-600 max-w-3xl">
            Full SiliconExpert view with original BOM fields, parametric validation, alternative MPNs, manufacturer risk alerts, technical datasheets, and global inventory telemetry for <span className="font-semibold text-slate-900">{productName} ({revision})</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportFiltered}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Enriched CSV</span>
          </button>
        </div>
      </div>

      {/* ================= FILTER WIDGET STRIP ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        {/* All Items */}
        <button
          type="button"
          onClick={() => setActiveFilter('All')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative ${
            activeFilter === 'All'
              ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-indigo-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-xs ${activeFilter === 'All' ? 'text-indigo-900' : 'text-slate-600'}`}>
              Total BOM Items
            </span>
            <Layers className={`w-3.5 h-3.5 ${activeFilter === 'All' ? 'text-indigo-600' : 'text-slate-400'}`} />
          </div>
          <div className={`text-xl font-bold mt-1.5 tabular-nums ${activeFilter === 'All' ? 'text-indigo-700' : 'text-slate-900'}`}>
            {counts.all}
          </div>
          <div className={`text-[10px] mt-0.5 ${activeFilter === 'All' ? 'text-indigo-600' : 'text-slate-400'}`}>
            All enriched lines
          </div>
          {activeFilter === 'All' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
          )}
        </button>

        {/* Validated Items */}
        <button
          type="button"
          onClick={() => setActiveFilter('Validated')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative ${
            activeFilter === 'Validated'
              ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-xs ${activeFilter === 'Validated' ? 'text-emerald-900' : 'text-slate-600'}`}>
              Validated Items
            </span>
            <CheckCircle2 className={`w-3.5 h-3.5 ${activeFilter === 'Validated' ? 'text-emerald-600' : 'text-emerald-500'}`} />
          </div>
          <div className="text-xl font-bold text-emerald-700 mt-1.5 tabular-nums">
            {counts.validated}
          </div>
          <div className={`text-[10px] mt-0.5 ${activeFilter === 'Validated' ? 'text-emerald-700' : 'text-slate-400'}`}>
            Parametrically confirmed
          </div>
          {activeFilter === 'Validated' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        {/* Lifecycle Issues */}
        <button
          type="button"
          onClick={() => setActiveFilter('Lifecycle Issue')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative ${
            activeFilter === 'Lifecycle Issue'
              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-xs ${activeFilter === 'Lifecycle Issue' ? 'text-amber-900' : 'text-slate-600'}`}>
              Lifecycle Issues
            </span>
            <AlertTriangle className={`w-3.5 h-3.5 ${activeFilter === 'Lifecycle Issue' ? 'text-amber-600' : 'text-amber-500'}`} />
          </div>
          <div className="text-xl font-bold text-amber-700 mt-1.5 tabular-nums">
            {counts.lifecycleIssues}
          </div>
          <div className={`text-[10px] mt-0.5 ${activeFilter === 'Lifecycle Issue' ? 'text-amber-700' : 'text-slate-400'}`}>
            NRND / EOL alerts
          </div>
          {activeFilter === 'Lifecycle Issue' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        {/* Alternatives Found */}
        <button
          type="button"
          onClick={() => setActiveFilter('Alternative Found')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative ${
            activeFilter === 'Alternative Found'
              ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-blue-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-xs ${activeFilter === 'Alternative Found' ? 'text-blue-900' : 'text-slate-600'}`}>
              Alternatives Found
            </span>
            <RefreshCw className={`w-3.5 h-3.5 ${activeFilter === 'Alternative Found' ? 'text-blue-600' : 'text-blue-500'}`} />
          </div>
          <div className="text-xl font-bold text-blue-700 mt-1.5 tabular-nums">
            {counts.alternatives}
          </div>
          <div className={`text-[10px] mt-0.5 ${activeFilter === 'Alternative Found' ? 'text-blue-700' : 'text-slate-400'}`}>
            Pin-compatible drop-in
          </div>
          {activeFilter === 'Alternative Found' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
          )}
        </button>

        {/* Unresolved */}
        <button
          type="button"
          onClick={() => setActiveFilter('Unresolved')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative ${
            activeFilter === 'Unresolved'
              ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-rose-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-xs ${activeFilter === 'Unresolved' ? 'text-rose-900' : 'text-slate-600'}`}>
              Unresolved
            </span>
            <HelpCircle className={`w-3.5 h-3.5 ${activeFilter === 'Unresolved' ? 'text-rose-600' : 'text-rose-500'}`} />
          </div>
          <div className="text-xl font-bold text-rose-700 mt-1.5 tabular-nums">
            {counts.unresolved}
          </div>
          <div className={`text-[10px] mt-0.5 ${activeFilter === 'Unresolved' ? 'text-rose-700' : 'text-slate-400'}`}>
            Manual scrub required
          </div>
          {activeFilter === 'Unresolved' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
      </div>

      {/* ================= SEARCH & TOOLBAR ================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs space-y-4 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Active Filter State Info */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">
              Showing <span className="font-bold text-slate-900">{filteredComponents.length}</span> {filteredComponents.length === 1 ? 'item' : 'items'}
            </span>
            {activeFilter !== 'All' && (
              <button
                type="button"
                onClick={() => setActiveFilter('All')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer ml-1"
              >
                Reset filter ({activeFilter})
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search MPN, Alternative, Risk, Inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ================= FULL SILICONEXPERT ENRICHED TABLE ================= */}
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
            <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs">
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-3.5 whitespace-nowrap">Position</th>
                <th className="py-3 px-3 min-w-[180px]">Description</th>
                <th className="py-3 px-3 whitespace-nowrap">Original MPN</th>
                <th className="py-3 px-3 whitespace-nowrap">Validated MPN</th>
                <th className="py-3 px-3 whitespace-nowrap">Manufacturer</th>
                <th className="py-3 px-3 whitespace-nowrap bg-blue-100/70 text-blue-900 border-x border-blue-200">
                  Alternative MPN
                </th>
                <th className="py-3 px-3 whitespace-nowrap bg-blue-100/70 text-blue-900 border-r border-blue-200">
                  Alternative Mfr
                </th>
                <th className="py-3 px-3 min-w-[170px] bg-amber-100/70 text-amber-950 border-r border-amber-200">
                  Risk / Alert
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Lifecycle</th>
                <th className="py-3 px-3 whitespace-nowrap">Indicative Price</th>
                <th className="py-3 px-3 whitespace-nowrap">Status</th>
                <th className="py-3 px-3 text-right whitespace-nowrap sticky right-0 bg-slate-100 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComponents.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    No components match the selected filter or search query.
                  </td>
                </tr>
              ) : (
                filteredComponents.map((row) => {
                  const isSelected = selectedComponent?.id === row.id && isDrawerOpen;
                  const isAlternativeFound = row.status === 'Alternative Found';

                  return (
                    <tr
                      key={row.id}
                      onClick={() => {
                        setSelectedComponent(row);
                        setIsDrawerOpen(true);
                      }}
                      className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/70 font-medium' : ''
                      }`}
                    >
                      {/* Position */}
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {row.position}
                      </td>

                      {/* Description */}
                      <td className="py-3 px-3 max-w-[200px] truncate text-slate-700 font-medium" title={row.description}>
                        {row.description}
                      </td>

                      {/* Original MPN */}
                      <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap" title={row.originalMpn}>
                        {row.originalMpn}
                      </td>

                      {/* Validated MPN */}
                      <td className="py-3 px-3 font-mono font-bold text-blue-700 whitespace-nowrap" title={row.validatedMpn}>
                        {row.validatedMpn}
                      </td>

                      {/* Manufacturer */}
                      <td className="py-3 px-3 text-slate-800 whitespace-nowrap" title={row.manufacturer}>
                        {row.manufacturer}
                      </td>

                      {/* 1. Alternative MPN - provided ONLY for Alternative Found status, no copy logo */}
                      <td className="py-3 px-3 font-mono text-blue-800 whitespace-nowrap bg-blue-50/30 border-x border-blue-100 font-medium">
                        {isAlternativeFound && row.altMpn ? (
                          <span className="font-semibold text-blue-900">{row.altMpn}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* 2. Alternative Manufacturer - provided ONLY for Alternative Found status */}
                      <td className="py-3 px-3 text-slate-700 whitespace-nowrap bg-blue-50/30 border-r border-blue-100">
                        {isAlternativeFound && row.altManufacturer ? (
                          <span className="font-medium text-slate-800">{row.altManufacturer}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* 3. Risk / Alert */}
                      <td className="py-3 px-3 whitespace-nowrap bg-amber-50/20 border-r border-amber-100">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            row.riskLevel === 'Low'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : row.riskLevel === 'Medium'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : row.riskLevel === 'High'
                              ? 'bg-orange-50 text-orange-800 border-orange-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {row.riskLevel === 'Low' ? (
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <ShieldAlert className="w-3 h-3 text-amber-600" />
                          )}
                          <span className="max-w-[150px] truncate" title={row.riskAlert}>
                            {row.riskAlert}
                          </span>
                        </span>
                      </td>

                      {/* Lifecycle */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            row.lifecycle === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : row.lifecycle === 'NRND'
                              ? 'bg-amber-100 text-amber-800'
                              : row.lifecycle === 'EOL'
                              ? 'bg-rose-100 text-rose-800'
                              : row.lifecycle === 'Obsolete'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {row.lifecycle}
                        </span>
                      </td>

                      {/* Indicative Price */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {row.indicativePrice}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold ${
                            row.status === 'Validated'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : row.status === 'Lifecycle Issue'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : row.status === 'Alternative Found'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {row.status === 'Validated' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {row.status === 'Lifecycle Issue' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                          {row.status === 'Alternative Found' && <RefreshCw className="w-3 h-3 text-blue-600" />}
                          {row.status === 'Unresolved' && <HelpCircle className="w-3 h-3 text-rose-600" />}
                          <span>{row.status}</span>
                        </span>
                      </td>

                      {/* Details Button (Sticky on right) */}
                      <td className="py-3 px-3 text-right whitespace-nowrap sticky right-0 bg-white/95 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedComponent(row);
                            setIsDrawerOpen(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <span>Showing {filteredComponents.length} components with SiliconExpert intelligence</span>
          <span className="text-[11px]">
            Scroll horizontally to view Alternative MPN, Alternative Mfr, and Risk / Alert
          </span>
        </div>
      </div>

      {/* ================= COMPONENT DETAILS DRAWER (EXPANDABLE SLIDE-OVER) ================= */}
      {isDrawerOpen && selectedComponent && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[560px] bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col font-sans animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                SiliconExpert Component Details
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedComponent.position} • {selectedComponent.validatedMpn}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs divide-y divide-slate-100">
            {/* CALLOUT: ALTERNATIVE COMPONENT & CROSS */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span>Alternative Recommendation</span>
              </div>
              <div className="bg-blue-50/60 p-3.5 rounded-lg border border-blue-200 space-y-2.5">
                {selectedComponent.status === 'Alternative Found' ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Alternative MPN:</span>
                        <div className="mt-0.5">
                          <span className="font-mono font-bold text-blue-900 text-sm">
                            {selectedComponent.altMpn || '—'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Alternative Manufacturer:</span>
                        <span className="font-semibold text-slate-900 mt-0.5 block">
                          {selectedComponent.altManufacturer || '—'}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-blue-200/60 text-[11px] flex items-center justify-between">
                      <span className="text-slate-600">Cross Type:</span>
                      <span className="font-semibold text-blue-800">
                        {selectedComponent.altStatus || 'Direct Drop-in Equivalent'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-600 text-xs py-1">
                    No alternative required — status is <span className="font-semibold text-slate-800">{selectedComponent.status}</span>.
                  </div>
                )}
              </div>
            </div>

            {/* CALLOUT: RISK / ALERT & LIFECYCLE */}
            <div className="space-y-2.5 pt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Risk / Alert & Lifecycle</span>
              </div>
              <div className="bg-amber-50/50 p-3.5 rounded-lg border border-amber-200 space-y-2.5">
                <div>
                  <span className="text-slate-500 block text-[11px]">Alert Summary:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        selectedComponent.riskLevel === 'Low'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : selectedComponent.riskLevel === 'Medium'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                      }`}
                    >
                      {selectedComponent.riskLevel} Risk
                    </span>
                    <span className="font-semibold text-slate-900 text-xs">
                      {selectedComponent.riskAlert}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-amber-200/60">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Lifecycle Status:</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{selectedComponent.lifecycle}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Obsolete / EOL Status:</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {selectedComponent.obsoleteStatus || 'Active Production'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Last Time Buy (LTB):</span>
                    <span className="font-medium text-slate-800 mt-0.5 block">
                      {selectedComponent.lastTimeBuy || 'Not Applicable'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Years to EOL / Horizon:</span>
                    <span className="font-medium text-slate-800 mt-0.5 block">
                      {selectedComponent.yearsToEol || '> 10 Years'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CALLOUT: INVENTORY & AVAILABILITY */}
            <div className="space-y-2.5 pt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-600" />
                <span>Availability / Inventory Telemetry</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[11px]">Authorized Inventory:</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {selectedComponent.availability}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Factory Lead Time:</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {selectedComponent.leadTimeWeeks ? `${selectedComponent.leadTimeWeeks} weeks` : '10-14 weeks'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Indicative Unit Price:</span>
                  <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                    {selectedComponent.indicativePrice}
                  </span>
                </div>
              </div>
            </div>

            {/* CALLOUT: DATASHEET / TECHNICAL DATA */}
            <div className="space-y-2.5 pt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Datasheet / Technical Data</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{selectedComponent.datasheetTitle}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Verified manufacturer specifications & pinout</div>
                </div>
                <a
                  href={selectedComponent.datasheetUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
                >
                  <span>Open PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* SECTION A — COMPONENT IDENTIFICATION */}
            <div className="space-y-3 pt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-600" />
                <span>Component Identification</span>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div className="col-span-2">
                  <span className="text-slate-500 block">Description:</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{selectedComponent.description}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Manufacturer:</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{selectedComponent.manufacturer}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Validated MPN:</span>
                  <span className="font-mono font-bold text-slate-900 mt-0.5 block">{selectedComponent.validatedMpn}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Original Customer MPN:</span>
                  <span className="font-mono text-slate-700 mt-0.5 block">{selectedComponent.originalMpn}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Package / Housing:</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {selectedComponent.packageHousing || selectedComponent.package}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION C — COMPLIANCE */}
            <div className="space-y-3 pt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Environmental Compliance</span>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">RoHS:</span>
                  <span className="font-semibold text-emerald-800 mt-0.5 block">{selectedComponent.rohs}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">REACH:</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{selectedComponent.reach}</span>
                </div>
              </div>
            </div>

            {/* SECTION F — ADDITIONAL SILICONEXPERT DATA */}
            <div className="space-y-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAdditionalFields(!showAdditionalFields)}
                className="w-full flex items-center justify-between text-xs font-semibold text-[#2568A3] bg-sky-50/70 hover:bg-sky-100 p-2.5 rounded-lg border border-sky-200 transition-colors cursor-pointer"
              >
                <span>
                  {showAdditionalFields ? '− Hide Additional Parametric Fields' : '+ Show Additional Parametric Fields'}
                </span>
                {showAdditionalFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdditionalFields && (
                <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200 animate-in fade-in duration-150">
                  {Object.entries(selectedComponent.additionalFields).map(([key, val]) => (
                    <div key={key} className="p-2 bg-white rounded border border-slate-200/80">
                      <span className="text-slate-500 text-[10px] block">{key}</span>
                      <span className="font-medium text-slate-900 text-xs mt-0.5 block">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= BOTTOM FOOTER ACTIONS ================= */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to SiliconExpert Upload</span>
        </button>

        <button
          type="button"
          onClick={onMatchBusinessCentral}
          className="px-6 py-2.5 text-xs font-semibold bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white rounded-md transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <span>Continue to Business Central Processing</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
