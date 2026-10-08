import React from 'react';
import { ArrowLeft, Clock, ShoppingCart, CheckCircle2 } from 'lucide-react';

interface SupplierQuotationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupplierQuotationsModal: React.FC<SupplierQuotationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-slate-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 mb-1">
              <Clock className="w-3 h-3" /> Part 2 — Next Prototype Phase
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Supplier Quotations Management
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              To be added in the next prototype phase following client validation of Part 1 (BOM Intelligence).
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 space-y-3 text-xs text-slate-600">
          <div className="font-semibold text-slate-800">
            Upcoming Part 2 Scope will include:
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>Automated RFQ distribution to authorized electronics distributors (Arrow, Avnet, DigiKey, Mouser, Future Electronics).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>Multi-tier volume price break analysis for 1,000 / 5,000 / 25,000 unit manufacturing runs.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>Lead time optimization and Micro Technic buffer stock reconciliation.</span>
            </li>
          </ul>
        </div>

        <div className="p-4 bg-white border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to BOM Intelligence
          </button>
        </div>
      </div>
    </div>
  );
};
