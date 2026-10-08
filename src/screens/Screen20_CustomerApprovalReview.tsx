import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Check,
  Info,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface CustomerApprovalReviewProps {
  onBack: () => void;
  onGenerateApprovalBom: () => void;
}

export const Screen20_CustomerApprovalReview: React.FC<CustomerApprovalReviewProps> = ({
  onBack,
  onGenerateApprovalBom,
}) => {
  const approvalItems = [
    {
      position: 'C43',
      originalComponent: 'ABC123 (Nichicon 100uF 25V)',
      proposedComponent: 'ABC124 (Panasonic EEH-ZA1E101XP)',
      abc: 'B',
      reason: 'Original component is EOL / Obsolete in SiliconExpert database',
    },
    {
      position: 'D10',
      originalComponent: 'Demo Manufacturer Part X (DEMO-ESD-5V-X)',
      proposedComponent: 'Demo Manufacturer Part Y (DEMO-ESD-5V-Y)',
      abc: 'B',
      reason: 'Equivalent alternative proposed with lower clamping voltage and active supply chain',
    },
    {
      position: 'Y1',
      originalComponent: 'ABM8G-16.000MHZ-18-D2Y-T (Abracon 16MHz)',
      proposedComponent: 'ABM8-16.000MHZ-B2-T (Abracon upgraded series)',
      abc: 'B',
      reason: 'Original crystal oscillator series discontinued; direct form-fit-function replacement',
    },
    {
      position: 'U12',
      originalComponent: 'LMR14030SDDAR (Texas Instruments 36V 3A)',
      proposedComponent: 'LMR33630ADDAR (Pin-compatible generation upgrade)',
      abc: 'B',
      reason: 'Original regulator NRND / End of Life; pin-compatible drop-in alternative proposed',
    },
  ];

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Customer Approval Review
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Only component changes that require customer confirmation are shown.
          </p>
        </div>

        <button
          type="button"
          onClick={onGenerateApprovalBom}
          className="px-5 py-2.5 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-2 cursor-pointer self-start"
        >
          <span>Generate Approval BOM</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Review Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Proposed Component Changes Requiring Client Sign-Off (4 items)
          </span>
          <span className="text-[11px] text-slate-500">
            Governed by Class B customer approval rule
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                <th className="py-2.5 px-3">Position</th>
                <th className="py-2.5 px-3">Original Component</th>
                <th className="py-2.5 px-3">Proposed Component</th>
                <th className="py-2.5 px-3 text-center">ABC</th>
                <th className="py-2.5 px-3">Reason / Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {approvalItems.map((item) => (
                <tr key={item.position} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-700">
                    {item.position}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {item.originalComponent}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-emerald-800 bg-emerald-50/40">
                    {item.proposedComponent}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {item.abc}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Separate Informational Box: Internal-Only Updates Not Shown to Customer */}
      <div className="p-4 bg-slate-100/80 rounded-xl border border-slate-200 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-slate-600" />
          <span>Internal-only updates not shown to customer:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-600 font-medium">
          <div className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>MT item number assignment</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Business Central category</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Internal match confidence</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Internal workflow notes</span>
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
          <span>Back to Corrected BOM</span>
        </button>

        <button
          type="button"
          onClick={onGenerateApprovalBom}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Generate Approval BOM</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
