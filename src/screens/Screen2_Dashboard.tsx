import React from 'react';
import {
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { INITIAL_BOM_CASES, BomCase } from '../data/mockData';

interface DashboardProps {
  onOpenBomCase: (bomId: string) => void;
  onViewAllBoms: () => void;
  onAddNewBom?: () => void;
  onOpenMyTasks?: () => void;
  bomCases?: BomCase[];
}

export const Screen2_Dashboard: React.FC<DashboardProps> = ({
  onOpenBomCase,
  onViewAllBoms,
  bomCases,
}) => {
  const displayCases = bomCases && bomCases.length > 0 ? bomCases : INITIAL_BOM_CASES;

  const getStatusBadge = (status: BomCase['status']) => {
    switch (status) {
      case 'Business Central Enrichment':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            Business Central Enrichment
          </span>
        );
      case 'BOM Review':
      case 'Review Required':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            BOM Review
          </span>
        );
      case 'SiliconExpert Enrichment':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-cyan-50 text-cyan-800 border border-cyan-200">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
            SiliconExpert Enrichment
          </span>
        );
      case 'Map & Check':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
            Map & Check
          </span>
        );
      case 'Add BOM':
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Add BOM
          </span>
        );
      case 'Customer Approval':
      case 'Waiting for Customer Approval':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-500" />
            Customer Approval
          </span>
        );
      case 'Approved':
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          BOM Intelligence Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Automated customer BOM intake, SiliconExpert validation, Business Central matching, and exception review.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Active BOMs</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">8</div>
            <div className="text-[11px] text-slate-400 mt-1">In intake & matching pipeline</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-amber-800">Need Review</div>
            <div className="text-2xl font-bold text-amber-700 mt-1 tabular-nums">3</div>
            <div className="text-[11px] text-amber-600 mt-1">Exceptions & missing parts</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-blue-200/80 bg-blue-50/20 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-blue-800">Waiting Approval</div>
            <div className="text-2xl font-bold text-blue-700 mt-1 tabular-nums">2</div>
            <div className="text-[11px] text-blue-600 mt-1">Packages ready for customer</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-emerald-800">Approved</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">12</div>
            <div className="text-[11px] text-emerald-600 mt-1">Ready for Supplier RFQ</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Clean Full-Width Recent BOM Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Recent BOM</h2>
          </div>
          <button
            type="button"
            onClick={onViewAllBoms}
            className="text-xs font-semibold text-[#2568A3] hover:text-[#1e588b] flex items-center gap-1 cursor-pointer"
          >
            <span>View all BOMs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <th className="py-3 px-6">BOM ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Last Activity</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayCases.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onOpenBomCase(item.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-6 font-semibold text-[#2568A3] group-hover:underline">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-6 text-slate-700 font-medium">
                    {item.customerName}
                  </td>
                  <td className="py-3.5 px-6 text-slate-900">
                    <span className="font-medium">{item.productName}</span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-500 tabular-nums">
                    {item.lastActivityDate}
                  </td>
                  <td className="py-3.5 px-6">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="inline-flex items-center text-xs font-semibold text-[#2568A3] group-hover:text-[#1e588b]">
                      Open BOM <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
