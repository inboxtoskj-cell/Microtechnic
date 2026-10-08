import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  Check,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

interface FinalApprovalBomProps {
  customerName: string;
  productName: string;
  revision: string;
  onBack: () => void;
  onMarkReadyForCustomer: () => void;
}

export const Screen21_FinalApprovalBom: React.FC<FinalApprovalBomProps> = ({
  customerName,
  productName,
  revision,
  onBack,
  onMarkReadyForCustomer,
}) => {
  const [isExported, setIsExported] = useState(false);

  const approvalRows = [
    {
      position: 'C43',
      originalComponent: 'ABC123 (Nichicon 100uF 25V Hybrid)',
      proposedComponent: 'ABC124 (Panasonic EEH-ZA1E101XP)',
      changeType: 'Alternative',
      reason: 'Original part obsolete / EOL. High-reliability hybrid polymer cross-referenced.',
    },
    {
      position: 'D10',
      originalComponent: 'Demo Part X (DEMO-ESD-5V-X)',
      proposedComponent: 'Demo Part Y (DEMO-ESD-5V-Y)',
      changeType: 'Alternative',
      reason: 'Equivalent part proposed with lower clamping voltage and secured distribution.',
    },
    {
      position: 'Y1',
      originalComponent: 'ABM8G-16.000MHZ-18-D2Y-T',
      proposedComponent: 'ABM8-16.000MHZ-B2-T',
      changeType: 'Alternative',
      reason: 'Manufacturer discontinued original series; direct drop-in replacement with identical 3.2x2.5mm footprint.',
    },
    {
      position: 'U12',
      originalComponent: 'LMR14030SDDAR',
      proposedComponent: 'LMR33630ADDAR',
      changeType: 'Generation Upgrade',
      reason: 'Original power IC reached NRND status. Successor regulator provides improved efficiency.',
    },
  ];

  const handleExport = () => {
    setIsExported(true);
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Customer Approval BOM — {productName}
            </h1>
            <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
              {revision}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
            <span>Customer: <strong className="text-slate-800">{customerName}</strong></span>
            <span>·</span>
            <span>Client-Facing Package</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Approval BOM</span>
          </button>

          <button
            type="button"
            onClick={onMarkReadyForCustomer}
            className="px-5 py-2.5 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>Mark Ready for Customer</span>
          </button>
        </div>
      </div>

      {/* Export notification toast */}
      {isExported && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>{productName}_Approval_BOM_{revision}.xlsx</strong> exported successfully. Ready for client submission through standard channels.
          </span>
        </div>
      )}

      {/* Clean Customer-Facing Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Client Component Change Requests (4 Positions)
          </div>
          <span className="text-[11px] text-slate-500">
            Micro Technic Engineering Proposal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                <th className="py-2.5 px-3">Position</th>
                <th className="py-2.5 px-3">Original Component</th>
                <th className="py-2.5 px-3">Proposed Component</th>
                <th className="py-2.5 px-3">Change Type</th>
                <th className="py-2.5 px-3">Reason / Engineering Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {approvalRows.map((row) => (
                <tr key={row.position} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-700">
                    {row.position}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {row.originalComponent}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-800 bg-emerald-50/30">
                    {row.proposedComponent}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {row.changeType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {row.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strict Clean Data Boundary Notice */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Customer Presentation Boundary Verified</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          In compliance with Micro Technic data protection standards, this export contains strictly engineering part justifications. Internal supplier prices, Business Central workflows, internal confidence metrics, and internal notes are excluded.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Approval Review</span>
        </button>

        <button
          type="button"
          onClick={onMarkReadyForCustomer}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Proceed to Approval Status Tracking</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
