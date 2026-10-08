import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, CheckSquare, Square, Info, ShieldCheck, Filter, AlertCircle } from 'lucide-react';
import { INITIAL_BOM_ROWS } from '../data/mockData';

interface ComponentRoutingProps {
  onBack: () => void;
  onContinue: (selectedLinesCount: number) => void;
}

export const Screen12_ComponentRouting: React.FC<ComponentRoutingProps> = ({
  onBack,
  onContinue,
}) => {
  const [filterRoute, setFilterRoute] = useState<'All' | 'Existing' | 'SiliconExpert' | 'Rule Matching' | 'Manual'>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    // Select the 71 lines intended for SiliconExpert by default (validate + enrich)
    return INITIAL_BOM_ROWS.filter(
      (r) =>
        r.suggestedRoute === 'Validate with SiliconExpert' ||
        r.suggestedRoute === 'Enrich with SiliconExpert'
    ).map((r) => r.id);
  });

  const routingCounts = {
    existing: 28,
    validateSe: 47,
    enrichSe: 24,
    ruleMatching: 10,
    manual: 3,
  };

  const filteredRows = useMemo(() => {
    return INITIAL_BOM_ROWS.filter((r) => {
      if (filterRoute === 'All') return true;
      if (filterRoute === 'Existing') return r.suggestedRoute === 'Existing MT Item';
      if (filterRoute === 'SiliconExpert')
        return (
          r.suggestedRoute === 'Validate with SiliconExpert' ||
          r.suggestedRoute === 'Enrich with SiliconExpert'
        );
      if (filterRoute === 'Rule Matching') return r.suggestedRoute === 'MT Rule Matching';
      if (filterRoute === 'Manual') return r.suggestedRoute === 'Manual Clarification';
      return true;
    });
  }, [filterRoute]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    const allFilteredIds = filteredRows.map((r) => r.id);
    const areAllSelected = allFilteredIds.every((id) => selectedIds.includes(id));
    if (areAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Component Routing
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            The BOM lines have been grouped based on the information currently available.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-50 border border-cyan-200 rounded-lg text-xs font-semibold text-cyan-800">
          <span>71 of 112 lines selected for SiliconExpert</span>
        </div>
      </div>

      {/* Routing Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Existing MT Item */}
        <button
          type="button"
          onClick={() => setFilterRoute('Existing')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filterRoute === 'Existing'
              ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500">Existing Trusted MT Item</div>
          <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
            {routingCounts.existing}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 leading-snug">
            Use existing Business Central item
          </div>
        </button>

        {/* Validate SE */}
        <button
          type="button"
          onClick={() => setFilterRoute('SiliconExpert')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filterRoute === 'SiliconExpert'
              ? 'border-cyan-600 bg-cyan-50/70 ring-1 ring-cyan-500 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500">Validate with SE</div>
          <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
            {routingCounts.validateSe}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 leading-snug">
            Validate/enrich identified component
          </div>
        </button>

        {/* Enrich SE */}
        <button
          type="button"
          onClick={() => setFilterRoute('SiliconExpert')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filterRoute === 'SiliconExpert'
              ? 'border-cyan-600 bg-cyan-50/70 ring-1 ring-cyan-500 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500">Enrich with SE</div>
          <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
            {routingCounts.enrichSe}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 leading-snug">
            Complete missing component info
          </div>
        </button>

        {/* Rule Matching */}
        <button
          type="button"
          onClick={() => setFilterRoute('Rule Matching')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filterRoute === 'Rule Matching'
              ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500">MT Rule Matching</div>
          <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
            {routingCounts.ruleMatching}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 leading-snug">
            Value + package matching
          </div>
        </button>

        {/* Manual Clarification */}
        <button
          type="button"
          onClick={() => setFilterRoute('Manual')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filterRoute === 'Manual'
              ? 'border-rose-600 bg-rose-50/70 ring-1 ring-rose-500 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500">Manual Clarification</div>
          <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
            {routingCounts.manual}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 leading-snug">
            Insufficient info for safe processing
          </div>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> View:
          </span>
          {(['All', 'Existing', 'SiliconExpert', 'Rule Matching', 'Manual'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterRoute(tab)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                filterRoute === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="text-slate-500 text-[11px] flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-600" />
          <span>Notice: SiliconExpert validation is only routed to active & uncertain semiconductors/ICs.</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={filteredRows.every((r) => selectedIds.includes(r.id))}
                    onChange={selectAllFiltered}
                    className="w-3.5 h-3.5 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3">Position</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">MPN</th>
                <th className="py-2.5 px-3 text-center">ABC</th>
                <th className="py-2.5 px-3">Suggested Route</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((r) => {
                const isSelected = selectedIds.includes(r.id);

                return (
                  <tr
                    key={r.id}
                    onClick={() => toggleSelect(r.id)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-cyan-50/20' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(r.id)}
                        className="w-3.5 h-3.5 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-cyan-700">
                      {r.position}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 max-w-sm truncate">
                      {r.description}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">
                      {r.mpn || <span className="text-slate-400 italic">blank</span>}
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
                    <td className="py-2.5 px-3 font-medium">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                        r.suggestedRoute === 'Existing MT Item'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : r.suggestedRoute === 'Validate with SiliconExpert'
                          ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                          : r.suggestedRoute === 'Enrich with SiliconExpert'
                          ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                          : r.suggestedRoute === 'MT Rule Matching'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {r.suggestedRoute}
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
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={() => onContinue(selectedIds.length || 71)}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Continue with Selected Lines ({selectedIds.length || 71})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
