import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Filter,
  Check,
  AlertCircle,
} from 'lucide-react';
import { INITIAL_BOM_ROWS, BomItem } from '../data/mockData';
import { Screen11_ExportModal } from './Screen11_ExportModal';

interface BomDataCheckProps {
  productName: string;
  onBack: () => void;
  onContinue: () => void;
}

export const Screen10_BomDataCheck: React.FC<BomDataCheckProps> = ({
  productName,
  onBack,
  onContinue,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Complete' | 'Partial' | 'Needs Attention'>('ALL');
  const [issueFilter, setIssueFilter] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Dynamic item counts derived from the full 112-item dataset
  const totalCount = INITIAL_BOM_ROWS.length;
  const completeCount = useMemo(
    () => INITIAL_BOM_ROWS.filter((r) => r.status === 'Complete').length,
    []
  );
  const partialCount = useMemo(
    () => INITIAL_BOM_ROWS.filter((r) => r.status === 'Partial').length,
    []
  );
  const needsAttentionCount = useMemo(
    () => INITIAL_BOM_ROWS.filter((r) => r.status === 'Needs Attention').length,
    []
  );

  // Issues counts from dataset
  const issueCounts = useMemo(() => {
    return {
      mfrMissing: INITIAL_BOM_ROWS.filter((r) => !r.manufacturer).length,
      mpnMissing: INITIAL_BOM_ROWS.filter((r) => !r.mpn).length,
      packageMissing: INITIAL_BOM_ROWS.filter((r) => !r.package).length,
      abcMissing: INITIAL_BOM_ROWS.filter((r) => !r.abc).length,
      possibleDuplicate: INITIAL_BOM_ROWS.filter(
        (r) =>
          r.description.toLowerCase().includes('duplicate') ||
          r.exceptionReason === 'Multiple Matches'
      ).length,
    };
  }, []);

  const filteredRows = useMemo(() => {
    return INITIAL_BOM_ROWS.filter((row) => {
      if (statusFilter !== 'ALL' && row.status !== statusFilter) {
        return false;
      }
      if (issueFilter === 'mfrMissing' && row.manufacturer !== '') {
        return false;
      }
      if (issueFilter === 'mpnMissing' && row.mpn !== '') {
        return false;
      }
      if (issueFilter === 'packageMissing' && row.package !== '') {
        return false;
      }
      if (issueFilter === 'abcMissing' && Boolean(row.abc)) {
        return false;
      }
      if (
        issueFilter === 'possibleDuplicate' &&
        !(
          row.description.toLowerCase().includes('duplicate') ||
          row.exceptionReason === 'Multiple Matches'
        )
      ) {
        return false;
      }
      return true;
    });
  }, [statusFilter, issueFilter]);

  const handleCardClick = (targetStatus: 'Complete' | 'Partial' | 'Needs Attention') => {
    setIssueFilter(null);
    setStatusFilter((prev) => (prev === targetStatus ? 'ALL' : targetStatus));
  };

  const handleIssueClick = (issueKey: string) => {
    setStatusFilter('ALL');
    setIssueFilter((prev) => (prev === issueKey ? null : issueKey));
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {productName} — BOM Data Check
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Automated schema parsing evaluated item completeness and surfaced missing parametric fields.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Standardized BOM</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total BOM Items */}
        <div
          onClick={() => {
            setStatusFilter('ALL');
            setIssueFilter(null);
          }}
          className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all ${
            statusFilter === 'ALL' && issueFilter === null
              ? 'ring-2 ring-cyan-500 border-cyan-500'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-xs font-medium text-slate-500">Total BOM Items</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Click to show all items</div>
        </div>

        {/* Complete */}
        <div
          onClick={() => handleCardClick('Complete')}
          className={`p-4 rounded-xl border bg-emerald-50/30 shadow-xs cursor-pointer transition-all ${
            statusFilter === 'Complete'
              ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/60'
              : 'border-emerald-200/80 hover:border-emerald-300'
          }`}
        >
          <div className="text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <span>Complete</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">{completeCount}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">MPN, Mfr & Footprint verified</div>
        </div>

        {/* Partial */}
        <div
          onClick={() => handleCardClick('Partial')}
          className={`p-4 rounded-xl border bg-amber-50/30 shadow-xs cursor-pointer transition-all ${
            statusFilter === 'Partial'
              ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/60'
              : 'border-amber-200/80 hover:border-amber-300'
          }`}
        >
          <div className="text-xs font-semibold text-amber-800 flex items-center justify-between">
            <span>Partial</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1 tabular-nums">{partialCount}</div>
          <div className="text-[11px] text-amber-600 mt-0.5">Missing Mfr / Part Number</div>
        </div>

        {/* Needs Attention */}
        <div
          onClick={() => handleCardClick('Needs Attention')}
          className={`p-4 rounded-xl border bg-rose-50/30 shadow-xs cursor-pointer transition-all ${
            statusFilter === 'Needs Attention'
              ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/60'
              : 'border-rose-200/80 hover:border-rose-300'
          }`}
        >
          <div className="text-xs font-semibold text-rose-800 flex items-center justify-between">
            <span>Needs Attention</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1 tabular-nums">{needsAttentionCount}</div>
          <div className="text-[11px] text-rose-600 mt-0.5">Ambiguous or duplicate refs</div>
        </div>
      </div>

      {/* Issue Groups Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Quick Issue Filters: Click any category to isolate matching items
          </span>
          {(statusFilter !== 'ALL' || issueFilter !== null) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('ALL');
                setIssueFilter(null);
              }}
              className="text-xs text-cyan-600 hover:underline font-normal cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleIssueClick('mfrMissing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
              issueFilter === 'mfrMissing'
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Manufacturer Missing:</span>
            <strong className="tabular-nums font-bold text-amber-700">{issueCounts.mfrMissing}</strong>
          </button>

          <button
            type="button"
            onClick={() => handleIssueClick('mpnMissing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
              issueFilter === 'mpnMissing'
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Manufacturer Part Number Missing:</span>
            <strong className="tabular-nums font-bold text-amber-700">{issueCounts.mpnMissing}</strong>
          </button>

          <button
            type="button"
            onClick={() => handleIssueClick('packageMissing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
              issueFilter === 'packageMissing'
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Package / Footprint Missing:</span>
            <strong className="tabular-nums font-bold text-slate-700">{issueCounts.packageMissing}</strong>
          </button>

          <button
            type="button"
            onClick={() => handleIssueClick('abcMissing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
              issueFilter === 'abcMissing'
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>ABC Missing:</span>
            <strong className="tabular-nums font-bold text-slate-700">{issueCounts.abcMissing}</strong>
          </button>

          <button
            type="button"
            onClick={() => handleIssueClick('possibleDuplicate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
              issueFilter === 'possibleDuplicate'
                ? 'bg-rose-100 border-rose-300 text-rose-900 font-semibold shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Possible Duplicate:</span>
            <strong className="tabular-nums font-bold text-rose-700">{issueCounts.possibleDuplicate}</strong>
          </button>
        </div>
      </div>

      {/* Filtered Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="font-semibold text-slate-700">
            BOM Items ({filteredRows.length} displayed)
          </div>
          <span className="text-slate-500 text-[11px]">
            Active filter: {statusFilter !== 'ALL' ? statusFilter : issueFilter || 'All Records'}
          </span>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold whitespace-nowrap">
                <th className="py-2.5 px-3">Position</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Value</th>
                <th className="py-2.5 px-3">Package</th>
                <th className="py-2.5 px-3">Manufacturer</th>
                <th className="py-2.5 px-3">MPN</th>
                <th className="py-2.5 px-3 text-center">ABC</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-cyan-700 font-mono">
                    {r.position}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 max-w-xs truncate">
                    {r.description}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{r.value || '—'}</td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-[150px] truncate">{r.package || '—'}</td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {r.manufacturer || (
                      <span className="text-amber-600 font-mono text-[11px] bg-amber-50 px-1.5 py-0.5 rounded">
                        blank
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-800">
                    {r.mpn || (
                      <span className="text-amber-600 font-mono text-[11px] bg-amber-50 px-1.5 py-0.5 rounded">
                        blank
                      </span>
                    )}
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
                      r.status === 'Complete'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : r.status === 'Partial'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
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
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Continue to SiliconExpert Enrichment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modal instance */}
      <Screen11_ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onContinueToValidation={() => {
          setIsExportModalOpen(false);
          onContinue();
        }}
      />
    </div>
  );
};
