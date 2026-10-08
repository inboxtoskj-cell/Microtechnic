import React from 'react';
import { Settings, ShieldCheck, Database, Cpu, Check, Layers, AlertCircle } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          System Settings & Business Rules
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Configure ERP Business Central connector parameters, SiliconExpert batch specifications, and Micro Technic ABC classification thresholds.
        </p>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Business Central Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Microsoft Business Central</h3>
                <div className="text-[11px] text-slate-500">ERP Item Master & Inventory</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Connected
            </span>
          </div>

          <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">ERP Tenant:</span>
              <span className="font-mono text-slate-800">micro-technic-prod-eu1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Default Company:</span>
              <span className="text-slate-800 font-medium">Micro Technic A/S (Denmark)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sync Mode:</span>
              <span className="text-slate-800">Two-way verified staging (Human gate)</span>
            </div>
          </div>
        </div>

        {/* SiliconExpert Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">SiliconExpert Intelligence</h3>
                <div className="text-[11px] text-slate-500">Part Scrubbing & Lifecycle DB</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
              Ready
            </span>
          </div>

          <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Exchange Protocol:</span>
              <span className="text-slate-800 font-medium">Manual Batch File (.xlsx)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Attributes Tracked:</span>
              <span className="text-slate-800">Lifecycle, EOL, RoHS, Cross-Ref, Lead Time</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Routing Policy:</span>
              <span className="text-slate-800 font-semibold text-cyan-800">Selective (Active ICs only)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ABC Rules Specification */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-cyan-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Micro Technic ABC Component Rules Policy
          </h2>
        </div>

        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/20 space-y-1">
            <div className="font-bold text-rose-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-rose-600 text-white font-bold flex items-center justify-center text-xs">A</span>
              <span>Exact Component Required</span>
            </div>
            <p className="text-[11px] text-slate-700 pl-7">
              Exact component required. No substitution should be automatically accepted. If sourcing is difficult, human/customer decision is required.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/20 space-y-1">
            <div className="font-bold text-amber-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-amber-600 text-white font-bold flex items-center justify-center text-xs">B</span>
              <span>Alternative May Be Proposed</span>
            </div>
            <p className="text-[11px] text-slate-700 pl-7">
              Alternative may be proposed. The requested component is preferred, but an appropriate alternative can be reviewed and proposed.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/20 space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">C</span>
              <span>Equivalent Choice Allowed</span>
            </div>
            <p className="text-[11px] text-slate-700 pl-7">
              Equivalent choice is allowed within required specifications. For some passive components, matching may be based on characteristics such as value + package/footprint.
            </p>
          </div>

          <div className="text-[11px] text-slate-500 italic pt-1">
            * Additional component-specific rules may apply based on customer quality agreement (CQMS) and automotive/medical IPC class standards.
          </div>
        </div>
      </div>
    </div>
  );
};
