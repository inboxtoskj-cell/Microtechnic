import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  UploadCloud,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  FileCheck,
  Check,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';

interface BusinessCentralProcessingProps {
  productName?: string;
  revision?: string;
  onBack: () => void;
  onContinueToMatching: () => void;
}

export const Screen14B_BusinessCentralProcessing: React.FC<BusinessCentralProcessingProps> = ({
  productName = 'Smart Hub',
  revision = 'Rev 0',
  onBack,
  onContinueToMatching,
}) => {
  // Step 1: Export State
  const [hasExported, setHasExported] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Step 3: Upload State
  const [hasUploadedResult, setHasUploadedResult] = useState(true); // Default true for ready-to-test prototype, can re-upload
  const [uploadedResultFileName, setUploadedResultFileName] = useState('Smart_Hub_Business_Central_Result.xlsx');
  const [isDragging, setIsDragging] = useState(false);
  const resultFileInputRef = useRef<HTMLInputElement>(null);

  // Handle Export Simulation
  const handleExportBcFile = () => {
    setHasExported(true);
    setExportNotice('Smart_Hub_Business_Central_Input.xlsx prepared successfully');

    // Simulate file download trigger
    const dummyContent =
      'Micro Technic Business Central Import\nItem,Position,Description,Original MPN,Validated MPN,Manufacturer,Category,Lifecycle,Status\n';
    const blob = new Blob([dummyContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Smart_Hub_Business_Central_Input.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Result Upload Simulation
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedResultFileName(e.dataTransfer.files[0].name);
      setHasUploadedResult(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedResultFileName(e.target.files[0].name);
      setHasUploadedResult(true);
    }
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6 font-sans text-slate-800">
      {/* ================= SCREEN TITLE & SUBTITLE ================= */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Business Central Processing
        </h1>
        <p className="text-xs text-slate-600 max-w-3xl">
          Prepare the enriched BOM for Business Central, import the processed result, and review the Micro Technic item matches.
        </p>
      </div>

      {/* ================= SECTION 1: ENRICHED BOM READY ================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Step 1 : Enriched BOM Ready for Business Central
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">BOM Preparation</span>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">Product:</span>
            <strong className="text-sm font-bold text-slate-900 mt-0.5 block">{productName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">BOM Revision:</span>
            <strong className="text-sm font-mono font-bold text-slate-900 mt-0.5 block">{revision}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Total BOM Lines:</span>
            <strong className="text-sm font-bold text-slate-900 mt-0.5 block">112</strong>
          </div>
        </div>

        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={handleExportBcFile}
            className="px-5 py-2.5 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Business Central File</span>
          </button>
        </div>

        {exportNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 font-medium animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}
      </div>

      {/* ================= SECTION 2: MANUAL BUSINESS CENTRAL PROCESS ================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Step 2 : Process in Business Central
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Manual ERP Workflow</span>
        </div>

        {/* Kept step 3 with no numbering */}
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 border border-blue-200/60">
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900">
              Import and Process in Business Central
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload the prepared file into Business Central to identify Micro Technic internal item numbers, then export and download the processed result.
            </p>
          </div>
        </div>
      </div>

      {/* ================= SECTION 3: UPLOAD BUSINESS CENTRAL RESULT ================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Step 3: Upload Business Central File here!
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">ERP Result Intake</span>
        </div>

        <input
          ref={resultFileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => resultFileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
            isDragging
              ? 'border-blue-600 bg-blue-50/50'
              : 'border-slate-300 bg-slate-50/60 hover:border-blue-500 hover:bg-blue-50/20'
          }`}
        >
          <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
            <UploadCloud className="w-6 h-6 stroke-[1.8]" />
          </div>

          <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            UPLOAD BUSINESS CENTRAL RESULT
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Drag the Business Central result Excel here
          </p>

          <div className="text-xs text-slate-400 my-1.5 font-medium">or</div>

          <div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resultFileInputRef.current?.click();
              }}
              className="px-5 py-2 text-xs font-semibold text-[#2568A3] bg-white border border-sky-200 hover:bg-sky-50 rounded-md transition-colors cursor-pointer shadow-2xs"
            >
              Browse File
            </button>
          </div>

          <div className="text-[11px] text-slate-400 mt-2.5">
            Supported: XLSX / XLS / CSV (e.g. {uploadedResultFileName})
          </div>
        </div>
      </div>

      {/* ================= FOOTER ACTIONS ================= */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to SiliconExpert Results</span>
        </button>

        <button
          type="button"
          onClick={onContinueToMatching}
          disabled={!hasUploadedResult}
          className={`px-6 py-2.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 shadow-xs ${
            hasUploadedResult
              ? 'bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>View Business Central Matches</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
