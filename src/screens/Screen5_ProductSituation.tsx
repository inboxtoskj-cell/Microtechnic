import React from 'react';
import { ArrowLeft, FastForward, FilePlus2, Sparkles, ChevronRight } from 'lucide-react';

interface ProductSituationProps {
  customerName: string;
  onBack: () => void;
  onSelectSituation: (situation: 'existing_approved' | 'existing_new_rev' | 'new_product') => void;
}

export const Screen5_ProductSituation: React.FC<ProductSituationProps> = ({
  customerName,
  onBack,
  onSelectSituation,
}) => {
  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
      {/* Context Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
          Customer: <strong className="text-slate-900">{customerName}</strong>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          What are you working with?
        </h1>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Choose the product situation to route directly to existing manufacturing files or open the new BOM intake flow.
        </p>
      </div>

      {/* Three Large Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Existing Product / Existing Approved BOM */}
        <button
          type="button"
          onClick={() => onSelectSituation('existing_approved')}
          className="p-6 bg-white rounded-xl border border-slate-200 hover:border-cyan-500 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-cyan-50 text-slate-700 group-hover:text-cyan-700 flex items-center justify-center transition-colors mb-4">
              <FastForward className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Option 1
            </div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#2568A3]">
              Existing Product / Existing Approved BOM
            </h3>
            <p className="text-xs text-slate-600 mt-2">
              Previously processed or manufactured product.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2568A3]">
            <span>Fast Route</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 2: Existing Product — New BOM Revision */}
        <button
          type="button"
          onClick={() => onSelectSituation('existing_new_rev')}
          className="p-6 bg-white rounded-xl border border-slate-200 hover:border-[#2568A3] hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-sky-50 text-slate-700 group-hover:text-[#2568A3] flex items-center justify-center transition-colors mb-4">
              <FilePlus2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Option 2
            </div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#2568A3]">
              Existing Product — New BOM Revision
            </h3>
            <p className="text-xs text-slate-600 mt-2">
              Existing product with an updated customer BOM.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2568A3]">
            <span>Revision Intake</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 3: New Product / New BOM (Primary Demo) */}
        <button
          type="button"
          onClick={() => onSelectSituation('new_product')}
          className="p-6 bg-white rounded-xl border-2 border-[#2568A3] shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer relative"
        >
          <div className="absolute -top-3 right-4 px-2 py-0.5 bg-[#2568A3] text-white rounded text-[10px] font-bold uppercase tracking-wider">
            Primary Demo Path
          </div>

          <div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#2568A3] flex items-center justify-center transition-colors mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-[#2568A3] uppercase tracking-wider mb-1">
              Option 3
            </div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#2568A3]">
              New Product / New BOM
            </h3>
            <p className="text-xs text-slate-600 mt-2">
              Completely new product or customer Bill of Materials.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2568A3]">
            <span>Full Workflow</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Back button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customer</span>
        </button>
      </div>
    </div>
  );
};
