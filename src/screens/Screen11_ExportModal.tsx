import React, { useState } from 'react';
import { Download, CheckCircle2, FileSpreadsheet, X, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueToValidation: () => void;
}

export const Screen11_ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onContinueToValidation,
}) => {
  const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx');
  const [isExported, setIsExported] = useState(false);

  if (!isOpen) return null;

  const fieldsIncluded = [
    'Item Number',
    'Description',
    'Value',
    'Package / Footprint',
    'Reference Position',
    'Quantity',
    'Manufacturer',
    'Manufacturer Part Number',
    'ABC Classification',
  ];

  const handleExport = () => {
    setIsExported(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Export Standardized BOM
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Clean Micro Technic schema ready for engineering or archive.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-700 font-medium">
            Your BOM has been standardized using the confirmed field mapping.
          </p>

          {/* Fields list */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Fields Included in Output File:
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
              {fieldsIncluded.map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Format selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Output Format:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('xlsx')}
                className={`p-3 rounded-lg border text-left flex items-center justify-between text-xs font-semibold cursor-pointer transition-colors ${
                  format === 'xlsx'
                    ? 'border-cyan-600 bg-cyan-50/50 text-cyan-900 ring-1 ring-cyan-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Excel (.xlsx)</span>
                </div>
                {format === 'xlsx' && <span className="text-[10px] bg-[#2568A3] text-white px-1.5 py-0.5 rounded">Selected</span>}
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-lg border text-left flex items-center justify-between text-xs font-semibold cursor-pointer transition-colors ${
                  format === 'csv'
                    ? 'border-[#2568A3] bg-sky-50/50 text-[#2568A3] ring-1 ring-[#2568A3]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">CSV</span>
                  <span>CSV (.csv)</span>
                </div>
                {format === 'csv' && <span className="text-[10px] bg-[#2568A3] text-white px-1.5 py-0.5 rounded">Selected</span>}
              </button>
            </div>
          </div>

          {/* Toast on export */}
          {isExported && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Smart_Hub_Standardized_BOM.{format}</strong> exported successfully.
              </span>
            </div>
          )}
        </div>

        {/* Modal footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {!isExported ? (
              <button
                type="button"
                onClick={handleExport}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export File</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onContinueToValidation}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>Continue to Validation</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
