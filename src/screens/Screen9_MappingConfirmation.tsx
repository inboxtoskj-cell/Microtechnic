import React from 'react';
import { ArrowLeft, Check, CheckCircle2, ArrowRight } from 'lucide-react';
import { FieldMapping } from '../data/mockData';

interface MappingConfirmationProps {
  mappings: FieldMapping[];
  onBackToMapping: () => void;
  onConfirmMapping: () => void;
}

export const Screen9_MappingConfirmation: React.FC<MappingConfirmationProps> = ({
  mappings,
  onBackToMapping,
  onConfirmMapping,
}) => {
  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header - Left Aligned */}
      <div className="space-y-1 text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Review Field Mapping
        </h1>
        <p className="text-xs text-slate-600">
          Please verify that the raw customer spreadsheet fields have been correctly correlated with Micro Technic standard fields.
        </p>
      </div>

      {/* Two-Column Mapping Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-6 space-y-6">
        <div className="divide-y divide-slate-100">
          {mappings.map((m) => (
            <div
              key={m.customerColumn}
              className="py-3 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {m.customerColumn}
                </span>
                <span className="text-slate-400">({m.sampleValue})</span>
              </div>

              <div className="flex items-center gap-2 font-medium">
                <span className="text-slate-400">→</span>
                <span className="text-cyan-700 font-semibold bg-cyan-50 px-2.5 py-1 rounded border border-cyan-200">
                  {m.mappedField}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBackToMapping}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Mapping</span>
        </button>

        <button
          type="button"
          onClick={onConfirmMapping}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Confirm Mapping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
