import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, FileSpreadsheet, Eye } from 'lucide-react';
import { INITIAL_BOM_ROWS } from '../data/mockData';

interface FilePreviewProps {
  productName: string;
  revision: string;
  fileName: string;
  onBack: () => void;
  onMapFields: () => void;
}

export const Screen7_FilePreview: React.FC<FilePreviewProps> = ({
  productName,
  revision: _revision,
  fileName,
  onBack,
  onMapFields,
}) => {
  // Raw preview rows (first 9 realistic rows based on prompt)
  const previewRows = INITIAL_BOM_ROWS.slice(0, 9);

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Success Notification Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-emerald-950">
              {productName} BOM uploaded successfully
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-800 mt-0.5">
              <span>File: <strong className="font-semibold">{fileName}</strong></span>
              <span>·</span>
              <span>Rows detected: <strong className="font-semibold tabular-nums">112</strong></span>
              <span>·</span>
              <span>Columns detected: <strong className="font-semibold tabular-nums">9</strong></span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onMapFields}
          className="px-4 py-2 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>Map Fields</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Raw Customer Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-cyan-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Customer File Raw Preview (Unmapped)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Displaying sample 9 of 112 raw rows
          </span>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[460px] scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold whitespace-nowrap">
                <th className="py-2.5 px-3">Item no.</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Value</th>
                <th className="py-2.5 px-3">Package</th>
                <th className="py-2.5 px-3">Position</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3">Manufacturer</th>
                <th className="py-2.5 px-3">Manufacturer no.</th>
                <th className="py-2.5 px-3 text-center">ABC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {previewRows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 text-slate-500">{r.itemNo}</td>
                  <td className="py-2.5 px-3 font-sans text-xs text-slate-900 max-w-xs truncate font-medium">
                    {r.description}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">{r.value || '—'}</td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-[140px] truncate">{r.package || '—'}</td>
                  <td className="py-2.5 px-3 font-semibold text-cyan-700">{r.position}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-800">{r.quantity}</td>
                  <td className="py-2.5 px-3 text-slate-700 font-sans text-xs">
                    {r.manufacturer || <span className="text-slate-400 italic font-mono text-[11px]">blank</span>}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    {r.mpn || <span className="text-slate-400 italic font-mono text-[11px]">blank</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      r.abc === 'A'
                        ? 'bg-rose-100 text-rose-800'
                        : r.abc === 'B'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {r.abc}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onMapFields}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Map Fields</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
