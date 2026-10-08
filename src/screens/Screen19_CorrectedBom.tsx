import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';
import { INITIAL_BOM_ROWS, BomItem } from '../data/mockData';

interface CorrectedBomProps {
  productName: string;
  revision: string;
  onBack: () => void;
  onReviewCustomerChanges: () => void;
}

export const Screen19_CorrectedBom: React.FC<CorrectedBomProps> = ({
  productName,
  revision,
  onBack,
  onReviewCustomerChanges,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Changed Only' | 'Customer Approval Required' | 'New Items' | 'Resolved'>('All');

  const summary = useMemo(() => {
    return {
      totalLines: INITIAL_BOM_ROWS.length,
      existingItems: INITIAL_BOM_ROWS.filter((r) => r.decisionStatus === 'Existing' || r.bcStatus === 'Existing').length,
      ruleMatched: INITIAL_BOM_ROWS.filter((r) => r.decisionStatus === 'Rule Match' || r.bcStatus === 'Suggested').length,
      newItemCandidates: INITIAL_BOM_ROWS.filter((r) => r.decisionStatus === 'New Item' || !r.bcItemNo).length,
      customerApprovalRequired: INITIAL_BOM_ROWS.filter((r) => r.decisionStatus === 'Alternative Proposed').length,
    };
  }, []);

  const filteredRows = useMemo(() => {
    return INITIAL_BOM_ROWS.filter((r) => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Changed Only') {
        return r.decisionStatus === 'Alternative Proposed' || r.decisionStatus === 'New Item' || r.decisionStatus === 'Rule Match';
      }
      if (activeFilter === 'Customer Approval Required') {
        return r.decisionStatus === 'Alternative Proposed';
      }
      if (activeFilter === 'New Items') {
        return r.decisionStatus === 'New Item' || !r.bcItemNo;
      }
      if (activeFilter === 'Resolved') {
        return r.decisionStatus === 'Existing' || r.decisionStatus === 'Rule Match';
      }
      return true;
    });
  }, [activeFilter]);

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Corrected BOM — {productName}
            </h1>
            <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
              {revision}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Complete Bill of Materials reflecting ERP reconciliation, equivalent rules, and proposed component substitutions.
          </p>
        </div>

        <button
          type="button"
          onClick={onReviewCustomerChanges}
          className="px-5 py-2.5 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-2 cursor-pointer self-start"
        >
          <span>Review Customer Changes (4)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveFilter('All')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
            activeFilter === 'All'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className={activeFilter === 'All' ? 'text-slate-300' : 'text-slate-500'}>Total Lines</div>
          <div className={`text-xl font-bold mt-1 tabular-nums ${activeFilter === 'All' ? 'text-white' : 'text-slate-900'}`}>
            {summary.totalLines}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('Resolved')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
            activeFilter === 'Resolved'
              ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-slate-500">Existing Items</div>
          <div className="text-xl font-bold text-emerald-700 mt-1 tabular-nums">{summary.existingItems}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('Changed Only')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
            activeFilter === 'Changed Only'
              ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-slate-500">Rule Matched</div>
          <div className="text-xl font-bold text-blue-700 mt-1 tabular-nums">{summary.ruleMatched}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('New Items')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
            activeFilter === 'New Items'
              ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-slate-500">New MT Item</div>
          <div className="text-xl font-bold text-amber-700 mt-1 tabular-nums">{summary.newItemCandidates}</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('Customer Approval Required')}
          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
            activeFilter === 'Customer Approval Required'
              ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-slate-500">Customer Approval Needed</div>
          <div className="text-xl font-bold text-rose-700 mt-1 tabular-nums">{summary.customerApprovalRequired}</div>
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Lines:
          </span>
          {(['All', 'Changed Only', 'Customer Approval Required', 'New Items', 'Resolved'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeFilter === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className="text-slate-500 text-[11px]">
          Showing {filteredRows.length} lines
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold whitespace-nowrap">
                <th className="py-2.5 px-3">MT Item No.</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Value</th>
                <th className="py-2.5 px-3">Package</th>
                <th className="py-2.5 px-3">Position</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3">Manufacturer</th>
                <th className="py-2.5 px-3">Manufacturer No.</th>
                <th className="py-2.5 px-3 text-center">ABC</th>
                <th className="py-2.5 px-3">Decision Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((r) => {
                const isNewItem = !r.bcItemNo;
                const displayItemNo = r.bcItemNo || 'NEW';

                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold">
                      <span className={isNewItem ? 'bg-amber-100 text-amber-800 px-2 py-0.5 rounded' : 'text-slate-900'}>
                        {displayItemNo}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 max-w-xs truncate">
                      {r.description}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{r.value || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[130px]">{r.package || '—'}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-cyan-700">
                      {r.position}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-800">
                      {r.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-[130px]">
                      {r.manufacturer || (r.decisionStatus === 'Rule Match' ? 'Approved Equivalent / Generic' : '—')}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-800 truncate max-w-[140px]">
                      {r.mpn || (r.decisionStatus === 'Rule Match' ? '—' : '—')}
                    </td>
                    <td className="py-2.5 px-3 text-center">
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
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                        r.decisionStatus === 'Existing'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : r.decisionStatus === 'Rule Match'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : r.decisionStatus === 'New Item'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {r.decisionStatus || 'Existing'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to New MT Item</span>
        </button>

        <button
          type="button"
          onClick={onReviewCustomerChanges}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Review Customer Changes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
