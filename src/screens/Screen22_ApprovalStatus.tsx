import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Paperclip,
  UploadCloud,
  FileCheck,
  AlertCircle,
  Calendar,
} from 'lucide-react';

interface ApprovalStatusProps {
  productName: string;
  revision: string;
  onBack: () => void;
  onSaveStatus: (statusData: {
    status: string;
    approvalDate: string;
    referenceNote: string;
    evidenceFile: string;
  }) => void;
}

export const Screen22_ApprovalStatus: React.FC<ApprovalStatusProps> = ({
  productName,
  revision,
  onBack,
  onSaveStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('Waiting for Customer');
  const [approvalDate, setApprovalDate] = useState<string>('2026-10-09');
  const [referenceNote, setReferenceNote] = useState<string>('Customer signed off on all 4 alternate component proposals via formal technical signoff.');
  const [evidenceFile, setEvidenceFile] = useState<string>('Smart_Hub_Client_Signoff_Signed.pdf');
  const [hasEvidence, setHasEvidence] = useState<boolean>(true);

  const statuses = [
    'Not Sent',
    'Sent Externally',
    'Waiting for Customer',
    'Approved',
    'Partially Approved',
    'Rejected',
    'Clarification Required',
  ];

  const handleSimulateAttach = () => {
    setEvidenceFile('Customer_Approval_Notice_Hub_Rev0.pdf');
    setHasEvidence(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStatus({
      status: selectedStatus,
      approvalDate: selectedStatus === 'Approved' ? approvalDate : '',
      referenceNote,
      evidenceFile: hasEvidence ? evidenceFile : '',
    });
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Customer Approval Status
        </h1>
        <p className="text-xs text-slate-600">
          Record customer sign-off details and attach approval documentation for audit readiness.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Form Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-5">
          {/* Status selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Approval Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Quick preset button to click "Approved" */}
          {selectedStatus !== 'Approved' && (
            <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 flex items-center justify-between text-xs">
              <span className="text-[#2568A3] font-medium">
                Tip for Demonstration: Set status to <strong>Approved</strong> to complete manufacturing signoff.
              </span>
              <button
                type="button"
                onClick={() => setSelectedStatus('Approved')}
                className="px-3 py-1 bg-[#2568A3] hover:bg-[#1e588b] text-white font-semibold rounded text-xs cursor-pointer shadow-xs"
              >
                Set to Approved
              </button>
            </div>
          )}

          {/* Approval Date (enabled when Approved) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Approval Date {selectedStatus === 'Approved' ? '(Required)' : '(Optional)'}
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={approvalDate}
                onChange={(e) => setApprovalDate(e.target.value)}
                disabled={selectedStatus !== 'Approved'}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Approval Note / Reference */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Approval Note / Reference
            </label>
            <textarea
              rows={3}
              value={referenceNote}
              onChange={(e) => setReferenceNote(e.target.value)}
              placeholder="e.g. Approved by customer engineering via portal signoff / Reference: CR-2026-8041"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Attach Approval Evidence */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Attach Approval Evidence (PDF / Signed Document)
            </label>

            <div
              onClick={handleSimulateAttach}
              className="border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-cyan-50/20 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 mx-auto flex items-center justify-center mb-2">
                <Paperclip className="w-4 h-4" />
              </div>

              {hasEvidence ? (
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 shadow-xs">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>{evidenceFile}</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded">Attached ✓</span>
                </div>
              ) : (
                <div className="text-xs text-slate-600">
                  Click to simulate attaching signed customer approval file
                </div>
              )}
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
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Save Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
