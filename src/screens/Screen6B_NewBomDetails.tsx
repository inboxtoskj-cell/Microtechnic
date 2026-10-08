import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, UploadCloud, FileSpreadsheet, Check, Sparkles } from 'lucide-react';

interface NewBomDetailsProps {
  customerName: string;
  initialProductName?: string;
  initialRevision?: string;
  initialProductionQty?: number;
  isRevision?: boolean;
  onBack: () => void;
  onUploadBom: (bomMeta: {
    productName: string;
    revision: string;
    productionQty: number;
    fileName: string;
  }) => void;
}

export const Screen6B_NewBomDetails: React.FC<NewBomDetailsProps> = ({
  customerName,
  initialProductName,
  initialRevision,
  initialProductionQty,
  isRevision = false,
  onBack,
  onUploadBom,
}) => {
  const [productName, setProductName] = useState(initialProductName || 'Smart Hub');
  const [revision, setRevision] = useState(
    initialRevision || (isRevision ? 'Rev 1' : 'Rev 0')
  );
  const [productionQty, setProductionQty] = useState(initialProductionQty || 1000);
  const [fileName, setFileName] = useState('Micro Technic BOM.xlsx');
  const [isSimulatedUploaded, setIsSimulatedUploaded] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUploadBom({
      productName,
      revision: revision.startsWith('Rev') ? revision : `Rev ${revision}`,
      productionQty,
      fileName,
    });
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
          Customer: <strong className="text-slate-900">{customerName}</strong>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {isRevision ? 'Upload Revised BOM' : 'New Product / BOM Setup'}
        </h1>
        <p className="text-xs text-slate-600">
          Enter product parameters and upload the customer's raw spreadsheet.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Metadata Inputs */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                BOM Revision
              </label>
              <input
                type="text"
                value={revision}
                onChange={(e) => setRevision(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Requested Production Quantity
              </label>
              <input
                type="number"
                value={productionQty}
                onChange={(e) => setProductionQty(Number(e.target.value))}
                required
                min={1}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
          <label className="block text-xs font-semibold text-slate-700">
            Bill of Materials File (Excel / CSV)
          </label>

          <div
            onClick={() => setIsSimulatedUploaded(true)}
            className="border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-cyan-50/20 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-cyan-100 text-slate-600 group-hover:text-cyan-700 mx-auto flex items-center justify-center transition-colors mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="text-sm font-semibold text-slate-800">
              Drag Excel file here or <span className="text-cyan-600 underline">Browse File</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Supported formats: XLSX, XLS, CSV (Max file size: 25MB)
            </p>

            {isSimulatedUploaded && (
              <div className="mt-4 inline-flex items-center gap-2.5 px-3 py-1.5 bg-white rounded-lg border border-emerald-200 text-xs font-medium text-emerald-800 shadow-xs">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Selected: <strong className="font-semibold">{fileName}</strong></span>
                <span className="text-emerald-500">✓ Ready</span>
              </div>
            )}
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
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Upload BOM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
