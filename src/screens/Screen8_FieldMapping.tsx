import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowRightLeft, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { DEFAULT_MAPPINGS, TARGET_FIELD_OPTIONS, FieldMapping } from '../data/mockData';

interface FieldMappingProps {
  customerName: string;
  onBack: () => void;
  onConfirmMapping: (mappings: FieldMapping[], saveTemplate: boolean) => void;
}

export const Screen8_FieldMapping: React.FC<FieldMappingProps> = ({
  customerName,
  onBack,
  onConfirmMapping,
}) => {
  const [mappings, setMappings] = useState<FieldMapping[]>(DEFAULT_MAPPINGS);
  const [saveTemplate, setSaveTemplate] = useState(true);

  const handleFieldChange = (customerCol: string, newTarget: string) => {
    setMappings((prev) =>
      prev.map((item) =>
        item.customerColumn === customerCol ? { ...item, mappedField: newTarget } : item
      )
    );
  };

  const handleResetDefaults = () => {
    setMappings(DEFAULT_MAPPINGS);
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Map Customer Fields
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Map each customer file column to the correct Micro Technic standard field.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors self-start cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Mapping Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[480px] scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-4 w-1/3">Customer File Column</th>
                <th className="py-3 px-4 w-1/3">Sample Value</th>
                <th className="py-3 px-4 w-1/3">Map To (Micro Technic Standard)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mappings.map((row) => (
                <tr key={row.customerColumn} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {row.customerColumn}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px] max-w-xs truncate">
                    {row.sampleValue}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={row.mappedField}
                      onChange={(e) => handleFieldChange(row.customerColumn, e.target.value)}
                      className={`w-full px-2.5 py-1.5 rounded-md border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors ${
                        row.mappedField === 'Ignore this field'
                          ? 'border-slate-300 bg-slate-100 text-slate-500 italic'
                          : 'border-cyan-300 bg-cyan-50/40 text-slate-900 font-semibold'
                      }`}
                    >
                      {TARGET_FIELD_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mapping status bar */}
        <div className="p-3.5 px-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end text-xs text-slate-500 font-medium">
          <span>9 of 9 columns mapped</span>
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
          onClick={() => onConfirmMapping(mappings, false)}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Save Mapping & Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
