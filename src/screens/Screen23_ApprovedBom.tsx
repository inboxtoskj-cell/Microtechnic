import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  Check,
  Sparkles,
  Layers,
  Database,
  ShieldCheck,
} from 'lucide-react';

interface ApprovedBomProps {
  customerName: string;
  productName: string;
  revision: string;
  approvalDate: string;
  onBack: () => void;
  onContinueToSupplierQuotations?: () => void;
}

export const Screen23_ApprovedBom: React.FC<ApprovedBomProps> = ({
  customerName,
  productName,
  revision,
  approvalDate = '09 Oct 2026',
  onBack,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const checklistItems = [
    'Customer BOM received',
    'Field mapping completed',
    'BOM data checked',
    'SiliconExpert validation completed where required',
    'Business Central matching completed',
    'Exceptions reviewed',
    'Customer changes approved',
  ];

  const handleExportFinalBom = () => {
    setToastMessage(`Exported: ${productName}_Final_Approved_BOM_${revision}.xlsx`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportBcFile = () => {
    setToastMessage(`Exported ERP Sync File: MicroTechnic_BC_Import_${productName}.xml`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
      {/* Large Success Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              STATUS: PRODUCTION APPROVED
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              CUSTOMER APPROVED BOM
            </h1>
            <p className="text-sm text-emerald-100 max-w-xl">
              Micro Technic BOM Intelligence has successfully reconciled all 112 lines. Component substitutions have been formally approved by the client.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/15 text-xs space-y-1.5 shrink-0 min-w-[200px]">
            <div className="text-emerald-200">Customer: <strong className="text-white">{customerName}</strong></div>
            <div className="text-emerald-200">Product: <strong className="text-white">{productName}</strong></div>
            <div className="text-emerald-200">BOM Revision: <strong className="text-white">{revision}</strong></div>
            <div className="text-emerald-200">Approval Date: <strong className="text-white">{approvalDate || '09 Oct 2026'}</strong></div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 font-medium">Total Components</div>
          <div className="text-3xl font-bold text-slate-900 mt-1 tabular-nums">112</div>
          <div className="text-[11px] text-slate-500 mt-1">100% lines matched & routed</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 font-medium">New MT Items</div>
          <div className="text-3xl font-bold text-cyan-700 mt-1 tabular-nums">8</div>
          <div className="text-[11px] text-slate-500 mt-1">Prepared for ERP creation</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 font-medium">Approved Changes</div>
          <div className="text-3xl font-bold text-emerald-700 mt-1 tabular-nums">4</div>
          <div className="text-[11px] text-slate-500 mt-1">Substitutions signed off</div>
        </div>
      </div>

      {/* Manufacturing Readiness Checklist */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Manufacturing Readiness Audit Checklist
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {checklistItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-emerald-950 font-medium"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Export Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Status Tracking</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportFinalBom}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Final BOM (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={handleExportBcFile}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Export BC File (.xml)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
