import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { INITIAL_BOM_CASES, BomCase } from '../data/mockData';

interface BomListingProps {
  onAddNewBom: () => void;
  onOpenBomCase: (bomId: string) => void;
  bomCases?: BomCase[];
}

export const Screen3_BomListing: React.FC<BomListingProps> = ({
  onAddNewBom,
  onOpenBomCase,
  bomCases,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [customerFilter, setCustomerFilter] = useState('ALL');

  const baseCases = bomCases && bomCases.length > 0 ? bomCases : INITIAL_BOM_CASES;

  const filteredCases = useMemo(() => {
    return baseCases.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || item.status === statusFilter;

      const matchesCustomer =
        customerFilter === 'ALL' || item.customerName === customerFilter;

      return matchesSearch && matchesStatus && matchesCustomer;
    });
  }, [baseCases, searchTerm, statusFilter, customerFilter]);

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
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            BOM Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Master repository of processed and in-progress customer Bill of Materials.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddNewBom}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New BOM</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search BOM ID, product or customer..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Add BOM">Add BOM</option>
              <option value="Map & Check">Map & Check</option>
              <option value="SiliconExpert Enrichment">SiliconExpert Enrichment</option>
              <option value="Business Central Enrichment">Business Central Enrichment</option>
              <option value="BOM Review">BOM Review</option>
              <option value="Customer Approval">Customer Approval</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          {/* Customer filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Customer:</span>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="ALL">All Customers</option>
              <option value="Danfoss Power Solutions">Danfoss Power Solutions</option>
              <option value="Kamstrup A/S">Kamstrup A/S</option>
              <option value="Oticon Medical">Oticon Medical</option>
              <option value="Grundfos Pumps">Grundfos Pumps</option>
              <option value="Terma Space & Defense">Terma Space & Defense</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span>Showing <strong>{filteredCases.length}</strong> of {baseCases.length} BOMs</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium whitespace-nowrap">
                <th className="py-3 px-4">BOM ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4 text-right">Items</th>
                <th className="py-3 px-4 text-right">Items Needing Review</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => onOpenBomCase(b.id)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-semibold text-cyan-700 group-hover:underline">
                    {b.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {b.customerName}
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-medium">
                    {b.productName}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-700 tabular-nums">
                    {b.totalItems}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {b.itemsNeedingReview > 0 ? (
                      <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        {b.itemsNeedingReview}
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-medium">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 tabular-nums">
                    {b.createdDate}
                  </td>
                  <td className="py-3 px-4 text-slate-500 tabular-nums">
                    {b.lastActivityDate}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(b.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center text-xs font-semibold text-[#2568A3] group-hover:text-[#1e588b]">
                      Open <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
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
