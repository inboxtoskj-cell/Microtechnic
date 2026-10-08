import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Search,
  PlusCircle,
  HelpCircle,
  Filter,
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import { INITIAL_BOM_ROWS, BomItem } from '../data/mockData';

interface ExceptionWorkbenchProps {
  onBack: () => void;
  onSaveAndContinue: () => void;
  onCandidateCreatedCountChange?: (count: number) => void;
}

export const Screen17_ExceptionWorkbench: React.FC<ExceptionWorkbenchProps> = ({
  onBack,
  onSaveAndContinue,
  onCandidateCreatedCountChange,
}) => {
  // 9 realistic exception rows
  const initialExceptions: BomItem[] = [
    { ...INITIAL_BOM_ROWS[5], exceptionReason: 'No BC Match' }, // J32
    { ...INITIAL_BOM_ROWS[6], exceptionReason: 'No BC Match' }, // J33
    { ...INITIAL_BOM_ROWS[10], exceptionReason: 'EOL' },         // U12 (Buck reg EOL)
    { ...INITIAL_BOM_ROWS[14], exceptionReason: 'No BC Match' }, // L3 (Inductor)
    { ...INITIAL_BOM_ROWS[15], exceptionReason: 'EOL' },         // Y1 (Crystal obsolete)
    { ...INITIAL_BOM_ROWS[18], exceptionReason: 'Multiple Matches' }, // C99
    { ...INITIAL_BOM_ROWS[19], exceptionReason: 'Missing Data' },      // TP1-TP12
    { ...INITIAL_BOM_ROWS[20], exceptionReason: 'Alternative' },       // D10
    {
      id: 'ex-9',
      itemNo: '1025',
      position: 'C70',
      description: 'Polymer Capacitor 100uF SMD',
      value: '100uF',
      package: 'SMD',
      quantity: 1,
      manufacturer: 'Panasonic',
      mpn: 'ABC456',
      abc: 'B',
      status: 'Complete',
      suggestedRoute: 'Validate with SiliconExpert',
      seValidatedMpn: 'ABC456-PAN',
      seValidatedMfr: 'Panasonic',
      seCategory: 'Capacitor',
      seLifecycle: 'Active',
      seRohs: 'Compliant',
      seAlternative: 'Nichicon ULR2A101',
      bcItemNo: '',
      bcDescription: '',
      bcCategory: 'CAP',
      matchType: 'No Match',
      matchConfidence: 'None',
      bcStatus: 'No Match',
      ruleApplied: 'B-Class Preferred New Item',
      decision: 'Human Review',
      decisionStatus: 'New Item',
      exceptionReason: 'Alternative',
      isResolved: false,
    },
  ];

  const [exceptions, setExceptions] = useState<BomItem[]>(initialExceptions);
  const [selectedId, setSelectedId] = useState<string>(initialExceptions[0].id);
  const [filterReason, setFilterReason] = useState<string>('All');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [bcSearchQuery, setBcSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedItem = useMemo(() => {
    return exceptions.find((e) => e.id === selectedId) || exceptions[0];
  }, [exceptions, selectedId]);

  const filteredList = useMemo(() => {
    if (filterReason === 'All') return exceptions;
    return exceptions.filter((e) => e.exceptionReason === filterReason);
  }, [exceptions, filterReason]);

  const resolvedCount = exceptions.filter((e) => e.isResolved).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Actions
  const handleCreateCandidate = () => {
    setExceptions((prev) =>
      prev.map((item) =>
        item.id === selectedId
          ? {
              ...item,
              isResolved: true,
              decision: 'Candidate Created',
              decisionStatus: 'New Item',
            }
          : item
      )
    );
    showToast(`Created NEW MT ITEM for ${selectedItem.mpn || selectedItem.description}. Pending Business Central item creation.`);
    onCandidateCreatedCountChange?.(8);
  };

  const handleToggleManualReview = () => {
    setExceptions((prev) =>
      prev.map((item) =>
        item.id === selectedId
          ? {
              ...item,
              decision: item.decision === 'Human Review' ? 'Resolved' : 'Human Review',
              isResolved: item.decision === 'Human Review',
            }
          : item
      )
    );
    showToast(`Status updated for position ${selectedItem.position}`);
  };

  const handleLinkBcItem = (mockBcItemNo: string, mockBcDesc: string) => {
    setExceptions((prev) =>
      prev.map((item) =>
        item.id === selectedId
          ? {
              ...item,
              bcItemNo: mockBcItemNo,
              bcDescription: mockBcDesc,
              bcStatus: 'Existing',
              isResolved: true,
              decision: 'Resolved',
            }
          : item
      )
    );
    setIsSearchModalOpen(false);
    showToast(`Linked ${mockBcItemNo} to position ${selectedItem.position} successfully`);
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Exception Workbench
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              9 Items Require Review
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Human-in-the-loop operational workbench: Resolve unmatched components, obsolete parts, and substitution proposals before final BOM generation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Resolved: <strong className="text-emerald-700 font-bold tabular-nums">{resolvedCount}</strong> / 9
          </div>
          <button
            type="button"
            onClick={onSaveAndContinue}
            className="px-5 py-2.5 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Save & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
        <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter Exceptions:
        </span>

        {[
          { key: 'All', label: 'All 9', count: 9 },
          { key: 'No BC Match', label: 'No BC Match', count: 3 },
          { key: 'EOL', label: 'EOL', count: 2 },
          { key: 'Alternative', label: 'Alternative', count: 2 },
          { key: 'Missing Data', label: 'Missing Data', count: 1 },
          { key: 'Multiple Matches', label: 'Multiple Matches', count: 1 },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilterReason(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterReason === f.key
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{f.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              filterReason === f.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Exception List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              Exceptions Queue ({filteredList.length})
            </span>
            <span className="text-[11px] text-slate-400">
              Click to inspect
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {filteredList.map((item) => {
              const isSelected = item.id === selectedId;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-3.5 cursor-pointer transition-colors relative flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-cyan-50/70 border-l-4 border-l-cyan-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {item.position}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        item.abc === 'A'
                          ? 'bg-rose-100 text-rose-800'
                          : item.abc === 'B'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.abc}
                      </span>
                      {item.isResolved && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          <Check className="w-2.5 h-2.5" /> Resolved
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-700 font-medium truncate">
                      {item.description}
                    </div>

                    <div className="text-[11px] font-mono text-slate-500 truncate">
                      {item.mpn || item.value}
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap shrink-0 ${
                    item.exceptionReason === 'No BC Match'
                      ? 'bg-amber-100 text-amber-800'
                      : item.exceptionReason === 'EOL'
                      ? 'bg-rose-100 text-rose-800'
                      : item.exceptionReason === 'Alternative'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {item.exceptionReason}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Selected Exception Unified Context (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Header of selected item */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Position Reference:
                </span>
                <span className="font-mono text-lg font-bold text-slate-900">
                  {selectedItem.position}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  selectedItem.abc === 'A'
                    ? 'bg-rose-100 text-rose-800'
                    : selectedItem.abc === 'B'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Class {selectedItem.abc}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                {selectedItem.description}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500">Quantity</span>
              <div className="text-lg font-bold text-slate-800 tabular-nums">
                {selectedItem.quantity} pcs
              </div>
            </div>
          </div>

          {/* 3 Unified Pillar Cards: Customer BOM | SiliconExpert | Business Central */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Pillar 1: CUSTOMER BOM */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                Customer BOM
              </div>
              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="text-slate-400 text-[11px] block">Description:</span>
                  <span className="font-semibold text-slate-800">{selectedItem.description}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Manufacturer:</span>
                  <span className="font-semibold text-slate-800">{selectedItem.manufacturer || 'Not Specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Requested MPN:</span>
                  <span className="font-mono font-semibold text-slate-900">{selectedItem.mpn || selectedItem.value}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">ABC Rule:</span>
                  <span className="font-medium text-slate-800">
                    {selectedItem.abc === 'A' && 'A — Exact component required'}
                    {selectedItem.abc === 'B' && 'B — Alternative may be proposed'}
                    {selectedItem.abc === 'C' && 'C — Equivalent choice allowed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pillar 2: SILICONEXPERT */}
            <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/30 space-y-2">
              <div className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                SiliconExpert
              </div>
              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="text-slate-400 text-[11px] block">Validation Status:</span>
                  <span className="font-semibold text-emerald-700">Confirmed & Enriched</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Lifecycle:</span>
                  <span className={`font-bold ${
                    selectedItem.seLifecycle === 'Active'
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}>
                    {selectedItem.seLifecycle || 'Active'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Verified MPN:</span>
                  <span className="font-mono font-semibold text-cyan-900">{selectedItem.seValidatedMpn || selectedItem.mpn}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Cross-Reference / Alt:</span>
                  <span className="font-medium text-blue-700">{selectedItem.seAlternative || 'None'}</span>
                </div>
              </div>
            </div>

            {/* Pillar 3: BUSINESS CENTRAL */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-slate-600" />
                Business Central
              </div>
              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="text-slate-400 text-[11px] block">Exact Item:</span>
                  <span className="font-semibold text-rose-700">
                    {selectedItem.bcItemNo ? selectedItem.bcItemNo : 'Not Found in Master'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">BC Description:</span>
                  <span className="text-slate-700">{selectedItem.bcDescription || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Match Status:</span>
                  <span className="font-semibold text-slate-800">{selectedItem.bcStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Inventory Action:</span>
                  <span className="text-slate-700">Requires human determination</span>
                </div>
              </div>
            </div>
          </div>

          {/* SYSTEM CONCLUSION BOX */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              SYSTEM CONCLUSION
            </div>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              {selectedItem.position === 'J32' || selectedItem.position === 'J33'
                ? 'Exact component required (Class A). No existing Micro Technic item found. A new Business Central item candidate must be approved.'
                : selectedItem.seLifecycle === 'EOL' || selectedItem.seLifecycle === 'Obsolete'
                ? `Original component is ${selectedItem.seLifecycle}. Alternative ${selectedItem.seAlternative} proposed for customer approval review.`
                : selectedItem.exceptionReason === 'Multiple Matches'
                ? 'Multiple Business Central items match the required parameters. Engineering confirmation required to pick the active stock item.'
                : 'Insufficient parametric data or new component required. Human decision required before manufacturing release.'}
            </p>
          </div>

          {/* THREE INTERACTIVE ACTION BUTTONS */}
          <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCreateCandidate}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-md text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Item Candidate</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-md text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Search BC Again</span>
            </button>

            <button
              type="button"
              onClick={handleToggleManualReview}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>{selectedItem.isResolved ? 'Re-open for Review' : 'Mark Reviewed / Manual Action'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Search BC Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-600" />
                Search Business Central Item Master
              </h3>
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={bcSearchQuery}
                  onChange={(e) => setBcSearchQuery(e.target.value)}
                  placeholder="Search item number, description or MPN..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="text-xs text-slate-500">
                Matching items in Micro Technic Business Central:
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div
                  onClick={() => handleLinkBcItem('MT-CONN-100P-DF40', 'CONN RCPT 100POS SMD Hirose DF40')}
                  className="p-3 rounded-lg border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/30 cursor-pointer text-xs transition-colors"
                >
                  <div className="flex justify-between font-mono font-bold text-cyan-800">
                    <span>MT-CONN-100P-DF40</span>
                    <span className="text-emerald-600">Stock: 2,400</span>
                  </div>
                  <div className="text-slate-800 mt-0.5">CONN RCPT 100POS SMD Hirose DF40 Series</div>
                  <div className="text-[11px] text-slate-500">MPN: DF40HC(3.0)-100DS-0.4V(58)</div>
                </div>

                <div
                  onClick={() => handleLinkBcItem('MT-CONN-100P-GEN', '100POS 0.4mm Mezzanine Equivalent')}
                  className="p-3 rounded-lg border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/30 cursor-pointer text-xs transition-colors"
                >
                  <div className="flex justify-between font-mono font-bold text-slate-700">
                    <span>MT-CONN-100P-GEN</span>
                    <span className="text-slate-500">Stock: 0</span>
                  </div>
                  <div className="text-slate-800 mt-0.5">100POS 0.4mm Mezzanine Equivalent Header</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rules Analysis</span>
        </button>

        <button
          type="button"
          onClick={onSaveAndContinue}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Save & Continue to New Item Candidates</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
