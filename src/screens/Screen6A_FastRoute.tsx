import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, RefreshCw, UploadCloud, FileCheck, ArrowRight } from 'lucide-react';

interface FastRouteProps {
  customerName: string;
  onBack: () => void;
  onUseExistingBom: () => void;
  onUploadNewRevision: () => void;
  onRunComponentRefresh: () => void;
}

export const Screen6A_FastRoute: React.FC<FastRouteProps> = ({
  customerName,
  onBack,
  onUseExistingBom,
  onUploadNewRevision,
  onRunComponentRefresh,
}) => {
  const [selectedProduct, setSelectedProduct] = useState('Smart Controller PCB');

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
          Customer: <strong className="text-slate-900">{customerName}</strong>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Existing Product Fast Route
        </h1>
        <p className="text-xs text-slate-600">
          This product has already been manufactured by Micro Technic. You can bypass manual mapping and reuse the approved master file.
        </p>
      </div>

      {/* Product Selection & Master Details */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Product
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="Smart Controller PCB">Smart Controller PCB</option>
            <option value="Industrial Telemetry Unit">Industrial Telemetry Unit</option>
            <option value="Power Filter Assembly">Power Filter Assembly</option>
          </select>
        </div>

        {/* Master File Card */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-slate-500">Existing BOM Revision</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">Rev 4</div>
          </div>
          <div>
            <div className="text-slate-500">MT Product No.</div>
            <div className="text-sm font-mono font-bold text-slate-800 mt-0.5">MT-PRD-00291</div>
          </div>
          <div>
            <div className="text-slate-500">Status</div>
            <div className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded text-[11px] mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approved BOM
            </div>
          </div>
        </div>
      </div>

      {/* Choices Grid */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Choose Fast Action
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Action 1: Use Existing BOM */}
          <button
            type="button"
            onClick={onUseExistingBom}
            className="p-5 bg-white rounded-xl border border-slate-200 hover:border-cyan-600 hover:shadow-sm text-left flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-700">
                Use Existing BOM
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Directly release approved Rev 4 without re-parsing.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-cyan-600 mt-4 flex items-center gap-1">
              Select <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* Action 2: Upload New Revision */}
          <button
            type="button"
            onClick={onUploadNewRevision}
            className="p-5 bg-white rounded-xl border border-slate-200 hover:border-cyan-600 hover:shadow-sm text-left flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-700">
                Upload New Revision
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Upload updated Rev 5 file and delta check changes.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-cyan-600 mt-4 flex items-center gap-1">
              Select <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* Action 3: Run Component Refresh */}
          <button
            type="button"
            onClick={onRunComponentRefresh}
            className="p-5 bg-white rounded-xl border border-slate-200 hover:border-cyan-600 hover:shadow-sm text-left flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-700">
                Run Component Refresh
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Re-check SiliconExpert lifecycle, EOL, and BC stock on existing components.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-cyan-600 mt-4 flex items-center gap-1">
              Select <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>

      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Situation</span>
        </button>
      </div>
    </div>
  );
};
