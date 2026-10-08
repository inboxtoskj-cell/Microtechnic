import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  PlusCircle,
  Check,
} from 'lucide-react';
import { INITIAL_BOM_ROWS, BomItem } from '../data/mockData';

interface BusinessCentralMatchingProps {
  onBack: () => void;
  onContinueToRules: () => void;
  onCreateCandidateFor?: (item: BomItem) => void;
}

export const Screen15_BusinessCentralMatching: React.FC<BusinessCentralMatchingProps> = ({
  onBack,
  onContinueToRules,
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Existing' | 'Suggested' | 'No Match' | 'Conflict'>('All');
  const [selectedRow, setSelectedRow] = useState<BomItem | null>(null);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const summary = useMemo(() => {
    return {
      total: INITIAL_BOM_ROWS.length,
      existingItems: INITIAL_BOM_ROWS.filter((r) => r.bcStatus === 'Existing').length,
      ruleMatches: INITIAL_BOM_ROWS.filter((r) => r.bcStatus === 'Suggested').length,
      newCandidates: INITIAL_BOM_ROWS.filter((r) => r.bcStatus === 'No Match').length,
      needReview: INITIAL_BOM_ROWS.filter((r) => r.bcStatus === 'Conflict').length,
    };
  }, []);

  const filteredRows = useMemo(() => {
    return INITIAL_BOM_ROWS.filter((r) => {
      if (statusFilter === 'All') return true;
      return r.bcStatus === statusFilter;
    });
  }, [statusFilter]);

  const handleExportData = () => {
    const headers = [
      'Position',
      'Description',
      'Value',
      'Package',
      'Qty',
      'Original Manufacturer',
      'Original MPN',
      'ABC Class',
      'Validated Manufacturer',
      'Validated MPN',
      'SE Category',
      'SE Lifecycle',
      'SE RoHS',
      'SE Alternative',
      'MT Item No',
      'BC Description',
      'BC Category',
      'Match Type',
      'Match Confidence',
      'BC Status',
    ];

    const rows = filteredRows.map((r) => [
      r.position,
      `"${(r.description || '').replace(/"/g, '""')}"`,
      r.value || '',
      r.package || '',
      r.quantity,
      `"${(r.manufacturer || '').replace(/"/g, '""')}"`,
      r.mpn || '',
      r.abc,
      `"${(r.seValidatedMfr || '').replace(/"/g, '""')}"`,
      r.seValidatedMpn || '',
      r.seCategory || '',
      r.seLifecycle || '',
      r.seRohs || '',
      `"${(r.seAlternative || '').replace(/"/g, '""')}"`,
      r.bcItemNo || '',
      `"${(r.bcDescription || '').replace(/"/g, '""')}"`,
      r.bcCategory || '',
      r.matchType || '',
      r.matchConfidence || '',
      r.bcStatus || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Smart_Hub_Business_Central_Matches.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
    }, 3500);
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Business Central Matching
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Reconciles customer Bill of Materials and SiliconExpert validation against Micro Technic ERP items.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {exportSuccess && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exported {filteredRows.length} items to CSV</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-300 shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Top Filter Widget: All Items, Existing, Rule Matches, New Item Candidates, Need Review / Conflict */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        {/* All Items */}
        <button
          type="button"
          onClick={() => setStatusFilter('All')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative ${
            statusFilter === 'All'
              ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-indigo-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-xs ${statusFilter === 'All' ? 'text-indigo-900' : 'text-slate-600'}`}>
              All Items
            </span>
            <Layers className={`w-3.5 h-3.5 ${statusFilter === 'All' ? 'text-indigo-600' : 'text-slate-400'}`} />
          </div>
          <div className={`text-xl font-bold mt-1.5 tabular-nums ${statusFilter === 'All' ? 'text-indigo-700' : 'text-slate-900'}`}>
            {summary.total}
          </div>
          <div className={`text-[10px] mt-0.5 ${statusFilter === 'All' ? 'text-indigo-600' : 'text-slate-400'}`}>
            All BOM components
          </div>
          {statusFilter === 'All' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
          )}
        </button>

        {/* Existing */}
        <button
          type="button"
          onClick={() => setStatusFilter('Existing')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative ${
            statusFilter === 'Existing'
              ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-xs ${statusFilter === 'Existing' ? 'text-emerald-900' : 'text-slate-600'}`}>
              Existing
            </span>
            <CheckCircle2 className={`w-3.5 h-3.5 ${statusFilter === 'Existing' ? 'text-emerald-600' : 'text-emerald-500'}`} />
          </div>
          <div className="text-xl font-bold text-emerald-700 mt-1.5 tabular-nums">
            {summary.existingItems}
          </div>
          <div className={`text-[10px] mt-0.5 ${statusFilter === 'Existing' ? 'text-emerald-700' : 'text-slate-400'}`}>
            Exact BC item master found
          </div>
          {statusFilter === 'Existing' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        {/* Rule Matches */}
        <button
          type="button"
          onClick={() => setStatusFilter('Suggested')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative ${
            statusFilter === 'Suggested'
              ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-blue-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-xs ${statusFilter === 'Suggested' ? 'text-blue-900' : 'text-slate-600'}`}>
              Rule Matches
            </span>
            <Sparkles className={`w-3.5 h-3.5 ${statusFilter === 'Suggested' ? 'text-blue-600' : 'text-blue-500'}`} />
          </div>
          <div className="text-xl font-bold text-blue-700 mt-1.5 tabular-nums">
            {summary.ruleMatches}
          </div>
          <div className={`text-[10px] mt-0.5 ${statusFilter === 'Suggested' ? 'text-blue-700' : 'text-slate-400'}`}>
            Value + Package equivalent
          </div>
          {statusFilter === 'Suggested' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
          )}
        </button>

        {/* NEW MT ITEM */}
        <button
          type="button"
          onClick={() => setStatusFilter('No Match')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative ${
            statusFilter === 'No Match'
              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-xs ${statusFilter === 'No Match' ? 'text-amber-900' : 'text-slate-600'}`}>
              New MT Item
            </span>
            <PlusCircle className={`w-3.5 h-3.5 ${statusFilter === 'No Match' ? 'text-amber-600' : 'text-amber-500'}`} />
          </div>
          <div className="text-xl font-bold text-amber-700 mt-1.5 tabular-nums">
            {summary.newCandidates}
          </div>
          <div className={`text-[10px] mt-0.5 ${statusFilter === 'No Match' ? 'text-amber-700' : 'text-slate-400'}`}>
            Requires ERP item creation
          </div>
          {statusFilter === 'No Match' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        {/* Need Review / Conflict */}
        <button
          type="button"
          onClick={() => setStatusFilter('Conflict')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer relative ${
            statusFilter === 'Conflict'
              ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-rose-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-xs ${statusFilter === 'Conflict' ? 'text-rose-900' : 'text-slate-600'}`}>
              Need Review / Conflict
            </span>
            <AlertTriangle className={`w-3.5 h-3.5 ${statusFilter === 'Conflict' ? 'text-rose-600' : 'text-rose-500'}`} />
          </div>
          <div className="text-xl font-bold text-rose-700 mt-1.5 tabular-nums">
            {summary.needReview}
          </div>
          <div className={`text-[10px] mt-0.5 ${statusFilter === 'Conflict' ? 'text-rose-700' : 'text-slate-400'}`}>
            EOL or alternate proposal
          </div>
          {statusFilter === 'Conflict' && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
      </div>

      {/* Table Item Count & Filter State */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-0.5">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-slate-900 font-semibold">{filteredRows.length}</strong> of{' '}
            <strong className="text-slate-900 font-semibold">{summary.total}</strong> components
          </span>
          {statusFilter !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
              Filtered by:{' '}
              {statusFilter === 'Suggested'
                ? 'Rule Matches'
                : statusFilter === 'No Match'
                ? 'NEW MT ITEM'
                : statusFilter === 'Conflict'
                ? 'Need Review / Conflict'
                : statusFilter}
              <button
                type="button"
                onClick={() => setStatusFilter('All')}
                className="hover:text-rose-600 font-bold ml-0.5 cursor-pointer"
                title="Clear filter"
              >
                ×
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Wide Grouped Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs min-w-[1300px]">
            {/* Super Header with 3 Groups */}
            <thead className="sticky top-0 z-20 shadow-xs">
              <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
                <th colSpan={8} className="py-2 px-3 bg-slate-100 text-slate-700 border-r border-slate-300">
                  GROUP 1: CUSTOMER BOM
                </th>
                <th colSpan={6} className="py-2 px-3 bg-cyan-100 text-cyan-950 border-r border-slate-300">
                  GROUP 2: SILICONEXPERT ENRICHMENT
                </th>
                <th colSpan={6} className="py-2 px-3 bg-emerald-100 text-emerald-950">
                  GROUP 3: BUSINESS CENTRAL MATCHING
                </th>
              </tr>

              {/* Grouped Columns Header */}
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold whitespace-nowrap">
                {/* Group 1 Columns */}
                <th className="py-2.5 px-3 w-24 border-r border-slate-200">Position</th>
                <th className="py-2.5 px-3 min-w-[200px] max-w-[240px] border-r border-slate-200">Description</th>
                <th className="py-2.5 px-3 min-w-[100px] border-r border-slate-200">Value</th>
                <th className="py-2.5 px-3">Package</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3">Original Mfr</th>
                <th className="py-2.5 px-3">Original MPN</th>
                <th className="py-2.5 px-3 text-center border-r border-slate-300">ABC</th>

                {/* Group 2 Columns */}
                <th className="py-2.5 px-3">Validated Mfr</th>
                <th className="py-2.5 px-3">Validated MPN</th>
                <th className="py-2.5 px-3">SE Category</th>
                <th className="py-2.5 px-3">Lifecycle</th>
                <th className="py-2.5 px-3">RoHS</th>
                <th className="py-2.5 px-3 border-r border-slate-300">Alternative</th>

                {/* Group 3 Columns */}
                <th className="py-2.5 px-3">MT Item No.</th>
                <th className="py-2.5 px-3 max-w-[180px]">BC Description</th>
                <th className="py-2.5 px-3">BC Category</th>
                <th className="py-2.5 px-3">Match Type</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">BC Status</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((r) => {
                const isSelected = selectedRow?.id === r.id;

                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedRow(r)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-cyan-50/50 ring-1 ring-cyan-500' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-semibold text-cyan-700 border-r border-slate-200">
                      {r.position}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 min-w-[200px] max-w-[240px] truncate border-r border-slate-200" title={r.description}>
                      {r.description}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 min-w-[100px] border-r border-slate-200">{r.value || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[130px]">{r.package || '—'}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-800">{r.quantity}</td>
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-[120px]">
                      {r.manufacturer || <span className="text-slate-400 italic">blank</span>}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 truncate max-w-[130px]">
                      {r.mpn || <span className="text-slate-400 italic">blank</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-300">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        r.abc === 'A'
                          ? 'bg-rose-100 text-rose-800'
                          : r.abc === 'B'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.abc}
                      </span>
                    </td>

                    {/* Group 2 */}
                    <td className="py-2.5 px-3 text-slate-800 truncate max-w-[120px]">{r.seValidatedMfr || '—'}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-cyan-800 truncate max-w-[140px]">{r.seValidatedMpn || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-700">{r.seCategory || '—'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        r.seLifecycle === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.seLifecycle === 'EOL'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {r.seLifecycle || '—'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{r.seRohs || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[120px] border-r border-slate-300">{r.seAlternative || '—'}</td>

                    {/* Group 3 */}
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {r.bcItemNo || <span className="text-slate-400 italic font-normal">blank</span>}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-[180px]">
                      {r.bcDescription || <span className="text-slate-400 italic">blank</span>}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {r.bcCategory || <span className="text-slate-400 italic">—</span>}
                    </td>
                    <td className="py-2.5 px-3 font-medium">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        r.matchType === 'Exact MPN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.matchType === 'Value + Package'
                          ? 'bg-blue-100 text-blue-800'
                          : r.matchType === 'Exact Required'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {r.matchType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {r.matchConfidence}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                        r.bcStatus === 'Existing'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : r.bcStatus === 'Suggested'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : r.bcStatus === 'No Match'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {r.bcStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Business Central Processing</span>
        </button>

        <button
          type="button"
          onClick={onContinueToRules}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Continue to BOM Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
