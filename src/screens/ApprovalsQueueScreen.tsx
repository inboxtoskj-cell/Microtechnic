import React from 'react';
import { Clock, CheckCircle2, ChevronRight, FileCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { INITIAL_BOM_CASES } from '../data/mockData';

interface ApprovalsQueueProps {
  onOpenApprovalCase: (bomId: string) => void;
}

export const ApprovalsQueueScreen: React.FC<ApprovalsQueueProps> = ({
  onOpenApprovalCase,
}) => {
  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Customer Approvals Queue
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Tracking customer sign-off packages for component substitutions, lifecycle replacements, and engineering changes.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-xs font-semibold border border-blue-200">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>2 Packages Waiting Client Response</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                <th className="py-3 px-4">BOM ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Revision</th>
                <th className="py-3 px-4">Approval Status</th>
                <th className="py-3 px-4 text-right">Items to Approve</th>
                <th className="py-3 px-4">Package Prepared</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr
                onClick={() => onOpenApprovalCase('BOM-1048')}
                className="hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <td className="py-3 px-4 font-mono font-bold text-cyan-700 group-hover:underline">
                  BOM-1048
                </td>
                <td className="py-3 px-4 font-medium text-slate-800">Danfoss Power Solutions</td>
                <td className="py-3 px-4 font-semibold text-slate-900">Smart Hub</td>
                <td className="py-3 px-4 font-mono text-slate-600">Rev 0</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Waiting for Customer
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-bold text-slate-800">4 Changes</td>
                <td className="py-3 px-4 text-slate-500 tabular-nums">08 Oct 2026</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-xs font-semibold text-cyan-600 group-hover:text-cyan-700 flex items-center justify-end gap-1">
                    Review Approval Package <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>

              <tr
                onClick={() => onOpenApprovalCase('BOM-1047')}
                className="hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <td className="py-3 px-4 font-mono font-bold text-cyan-700 group-hover:underline">
                  BOM-1047
                </td>
                <td className="py-3 px-4 font-medium text-slate-800">Kamstrup A/S</td>
                <td className="py-3 px-4 font-semibold text-slate-900">Controller PCB</td>
                <td className="py-3 px-4 font-mono text-slate-600">Rev 3</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Waiting for Customer
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-bold text-slate-800">2 Changes</td>
                <td className="py-3 px-4 text-slate-500 tabular-nums">07 Oct 2026</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-xs font-semibold text-[#2568A3] group-hover:text-[#1e588b] flex items-center justify-end gap-1">
                    Review Approval Package <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>

              <tr
                onClick={() => onOpenApprovalCase('BOM-1046')}
                className="hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <td className="py-3 px-4 font-mono font-bold text-[#2568A3] group-hover:underline">
                  BOM-1046
                </td>
                <td className="py-3 px-4 font-medium text-slate-800">Oticon Medical</td>
                <td className="py-3 px-4 font-semibold text-slate-900">Power Board</td>
                <td className="py-3 px-4 font-mono text-slate-600">Rev 7</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Approved
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-slate-500">0 Pending</td>
                <td className="py-3 px-4 text-slate-500 tabular-nums">05 Oct 2026</td>
                <td className="py-3 px-4 text-right">
                  <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 flex items-center justify-end gap-1">
                    View Approved File <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
