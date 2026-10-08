import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Download, UploadCloud, CheckCircle2, FileSpreadsheet, ExternalLink, Clock } from 'lucide-react';

interface SiliconExpertProcessingProps {
  onBack: () => void;
  onContinue: () => void;
}

export const Screen13_SiliconExpertProcessing: React.FC<SiliconExpertProcessingProps> = ({
  onBack,
  onContinue,
}) => {
  const [step1Exported, setStep1Exported] = useState(false);
  const [step3Uploaded, setStep3Uploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleExport = () => {
    setStep1Exported(true);
  };

  const handleUploadResult = () => {
    setUploadedFileName('Smart_Hub_SiliconExpert_Result.xlsx');
    setStep3Uploaded(true);
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Component Intelligence — SiliconExpert
        </h1>
        <p className="text-xs text-slate-600">
          71 BOM lines selected for SiliconExpert validation/enrichment. Follow the manual batch exchange workflow.
        </p>
      </div>

      {/* Workflow Tracker Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 pb-6">
          {/* Tracker 1 */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step1Exported ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {step1Exported ? <CheckCircle2 className="w-5 h-5" /> : '1'}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">Input File Export</div>
              <div className="text-[11px] text-slate-500">
                {step1Exported ? 'Exported ✓' : 'Pending export'}
              </div>
            </div>
          </div>

          {/* Tracker 2 */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step1Exported ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">SiliconExpert Portal</div>
              <div className="text-[11px] text-slate-500">
                External batch processing
              </div>
            </div>
          </div>

          {/* Tracker 3 */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step3Uploaded ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {step3Uploaded ? <CheckCircle2 className="w-5 h-5" /> : '3'}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">Result Ingestion</div>
              <div className="text-[11px] text-slate-500">
                {step3Uploaded ? 'Uploaded ✓' : 'Waiting for file'}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Interactive Workflow */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step 1</div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Prepare file for SiliconExpert
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Generates a standardized input spreadsheet formatted specifically for SiliconExpert batch scrubbing.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExport}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
                step1Exported
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-xs'
              }`}
            >
              {step1Exported ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>File Exported ✓</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Export Input File</span>
                </>
              )}
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step 2</div>
            <h3 className="text-sm font-bold text-slate-900">
              External Processing Instruction
            </h3>
            <p className="text-xs text-slate-600">
              Upload the exported file into SiliconExpert and process the BOM. Ensure lifecycle, RoHS, alternate part suggestions, and parametric attributes are included in the export.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step 3</div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Upload SiliconExpert Result
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Ingest the enriched result file to merge validated part numbers, lifecycles, and risk metrics.
              </p>
              {step3Uploaded && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{uploadedFileName}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleUploadResult}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
                step3Uploaded
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white shadow-xs'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>{step3Uploaded ? 'Result Uploaded ✓' : 'Upload SiliconExpert Result'}</span>
            </button>
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
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={!step3Uploaded}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Continue to Results</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
