import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { INITIAL_BOM_ROWS, BomItem } from '../data/mockData';

interface RulesDecisionAnalysisProps {
  onBack: () => void;
  onReviewExceptions: () => void;
}

export const Screen16_RulesDecisionAnalysis: React.FC<RulesDecisionAnalysisProps> = ({
  onBack,
  onReviewExceptions,
}) => {
  const [selectedRow, setSelectedRow] = useState<BomItem>(INITIAL_BOM_ROWS[5]); // Default J32

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Micro Technic Rules & Decisions
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Automated application of engineering component rules, ABC substitution logic, and risk filters.
          </p>
        </div>

        <button
          type="button"
          onClick={onReviewExceptions}
          className="px-5 py-2.5 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-2 cursor-pointer self-start"
        >
          <span>Review Exceptions (9)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Rules Evaluation Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Rules Applied Across BOM Lines
          </span>
          <span className="text-[11px] text-slate-500">
            Click any line to see rule justification & engineering context
          </span>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[480px] scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold whitespace-nowrap">
                <th className="py-2.5 px-3">Position</th>
                <th className="py-2.5 px-3">Component / MPN</th>
                <th className="py-2.5 px-3 text-center">ABC</th>
                <th className="py-2.5 px-3">Business Central Result</th>
                <th className="py-2.5 px-3">Rule Applied</th>
                <th className="py-2.5 px-3">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {INITIAL_BOM_ROWS.slice(0, 12).map((r) => {
                const isSelected = selectedRow.id === r.id;

                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedRow(r)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-cyan-50/50 ring-1 ring-cyan-500' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-semibold text-cyan-700">
                      {r.position}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-900 truncate max-w-xs">{r.description}</div>
                      <div className="text-[11px] font-mono text-slate-500">{r.mpn || r.value || 'Generic'}</div>
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
                    <td className="py-2.5 px-3 text-slate-700">
                      {r.bcStatus === 'Existing' && <span className="font-semibold text-emerald-700">{r.bcItemNo} (Existing Exact Item)</span>}
                      {r.bcStatus === 'Suggested' && <span className="font-semibold text-blue-700">{r.bcItemNo} (Rule Suggested)</span>}
                      {r.bcStatus === 'No Match' && <span className="text-amber-700 font-medium">No Item in Business Central</span>}
                      {r.bcStatus === 'Conflict' && <span className="text-rose-700 font-medium">Alternative Available / EOL</span>}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">
                      {r.ruleApplied}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                        r.decision === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : r.decision === 'Rule Matched'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : r.decision === 'Human Review'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {r.decision}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation Panel */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">
              Rule Execution Justification:
            </span>
            <span className="font-mono font-bold text-cyan-800 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
              {selectedRow.position} — {selectedRow.description}
            </span>
          </div>

          <span className="text-xs font-semibold text-slate-600">
            Decision: <strong className="text-cyan-800">{selectedRow.decision}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase">1. Customer Data</div>
            <div className="text-slate-800">
              Position: <strong className="text-slate-900">{selectedRow.position}</strong> (Qty {selectedRow.quantity})
            </div>
            <div className="text-slate-600 text-[11px]">
              MPN: <span className="font-mono">{selectedRow.mpn || 'blank'}</span>
            </div>
            <div className="text-slate-600 text-[11px]">
              ABC Class: <span className="font-bold">{selectedRow.abc}</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase">2. Rule Applied</div>
            <div className="font-semibold text-slate-900">{selectedRow.ruleApplied}</div>
            <div className="text-slate-600 text-[11px]">
              Governed by Micro Technic EMS Component Quality Policy Rev 2026.
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase">3. System Result</div>
            <div className="text-slate-800 font-medium">
              {selectedRow.bcStatus === 'Existing' && 'Exact match in BC. No human intervention needed.'}
              {selectedRow.bcStatus === 'Suggested' && 'Matched on value + package footprint.'}
              {selectedRow.bcStatus === 'No Match' && 'Item missing from Business Central inventory master.'}
              {selectedRow.bcStatus === 'Conflict' && 'Component obsolete or cross-referenced.'}
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase">4. Action Required</div>
            <div className="text-slate-800">
              {selectedRow.decision === 'Human Review' && (
                <span className="text-amber-800 font-semibold">
                  Skilled engineer must review in Exception Workbench.
                </span>
              )}
              {selectedRow.decision === 'Customer Approval' && (
                <span className="text-rose-800 font-semibold">
                  Prepare proposed substitution for customer approval BOM.
                </span>
              )}
              {selectedRow.decision === 'Resolved' && (
                <span className="text-emerald-800 font-semibold">
                  Automatically ready for production BOM.
                </span>
              )}
              {selectedRow.decision === 'Rule Matched' && (
                <span className="text-blue-800 font-semibold">
                  Standard passive equivalent accepted.
                </span>
              )}
            </div>
          </div>
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
          <span>Back to Business Central Matching</span>
        </button>

        <button
          type="button"
          onClick={onReviewExceptions}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Review Exceptions (9 Items)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
