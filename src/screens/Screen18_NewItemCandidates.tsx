import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  Clock,
  GitMerge,
  Ban,
  Info,
  ShieldCheck,
  Check,
} from 'lucide-react';

export interface NewItemCandidate {
  id: string;
  description: string;
  manufacturer: string;
  mpn: string;
  value: string;
  package: string;
  category: string;
  abc: 'A' | 'B' | 'C';
  lifecycle: 'Active' | 'NRND' | 'EOL';
  status: 'Pending' | 'Approved Candidate' | 'On Hold' | 'Merged' | 'Rejected';
  position: string;
}

interface NewItemCandidatesProps {
  onBack: () => void;
  onContinue: () => void;
}

export const Screen18_NewItemCandidates: React.FC<NewItemCandidatesProps> = ({
  onBack,
  onContinue,
}) => {
  const [candidates, setCandidates] = useState<NewItemCandidate[]>([
    {
      id: 'cand-1',
      description: '100-pos Connector SMD Gold',
      manufacturer: 'Hirose Electric Co Ltd',
      mpn: 'DF40HC(3.0)-100DS-0.4V(58)',
      value: 'High_Speed',
      package: 'SMD',
      category: 'Connector',
      abc: 'A',
      lifecycle: 'Active',
      status: 'Pending',
      position: 'J32, J33',
    },
    {
      id: 'cand-2',
      description: 'Polymer Capacitor 100uF 25V SMD',
      manufacturer: 'Panasonic',
      mpn: 'ABC456',
      value: '100uF',
      package: 'SMD-8x10',
      category: 'Capacitor',
      abc: 'B',
      lifecycle: 'Active',
      status: 'Pending',
      position: 'C70',
    },
    {
      id: 'cand-3',
      description: 'Shielded Power Inductor 4.7uH',
      manufacturer: 'Coilcraft',
      mpn: 'XAL4030-472MEC',
      value: '4.7uH',
      package: 'SMD-4040',
      category: 'Inductor',
      abc: 'B',
      lifecycle: 'Active',
      status: 'Approved Candidate',
      position: 'L3',
    },
    {
      id: 'cand-4',
      description: 'Ultra-Low Noise High-Side Switch',
      manufacturer: 'Texas Instruments',
      mpn: 'TPS22918DBVR',
      value: '5.5V 2A',
      package: 'SOT-23-6',
      category: 'Power IC',
      abc: 'B',
      lifecycle: 'Active',
      status: 'Pending',
      position: 'U8',
    },
    {
      id: 'cand-5',
      description: 'RF Antenna U.FL Connector Coaxial',
      manufacturer: 'Hirose',
      mpn: 'U.FL-R-SMT-1(10)',
      value: '50 Ohm',
      package: 'SMD-3x3',
      category: 'Connector',
      abc: 'A',
      lifecycle: 'Active',
      status: 'Pending',
      position: 'ANT1',
    },
    {
      id: 'cand-6',
      description: 'High-Precision Temp Sensor I2C',
      manufacturer: 'Sensirion AG',
      mpn: 'SHTC3',
      value: '±0.2°C',
      package: 'DFN-4',
      category: 'Sensor',
      abc: 'B',
      lifecycle: 'Active',
      status: 'Pending',
      position: 'U29',
    },
    {
      id: 'cand-7',
      description: 'Precision Voltage Reference 2.5V',
      manufacturer: 'Analog Devices',
      mpn: 'ADR4525BRZ',
      value: '2.500V',
      package: 'SOIC-8',
      category: 'Analog IC',
      abc: 'A',
      lifecycle: 'Active',
      status: 'Pending',
      position: 'U3',
    },
    {
      id: 'cand-8',
      description: 'Current Sense Resistor 0.010 Ohm 1%',
      manufacturer: 'Vishay Dale',
      mpn: 'WSL2512R0100FEA',
      value: '10mR 1W',
      package: '2512',
      category: 'Resistor',
      abc: 'B',
      lifecycle: 'Active',
      status: 'Pending',
      position: 'R100',
    },
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState<NewItemCandidate>(candidates[0]);

  const handleUpdateStatus = (newStatus: NewItemCandidate['status']) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === selectedCandidate.id ? { ...c, status: newStatus } : c
      )
    );
    setSelectedCandidate((prev) => ({ ...prev, status: newStatus }));
  };

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            New MT Item Candidates
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Explicit governance checkpoint: Micro Technic items are never silently created in Business Central without engineering review.
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="px-5 py-2.5 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-2 cursor-pointer self-start"
        >
          <span>Continue to Corrected BOM</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Candidates Table + Action Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              NEW MT ITEM ({candidates.length})
            </span>
            <span className="text-[11px] text-slate-500">
              Click candidate to decide action
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Manufacturer</th>
                  <th className="py-2.5 px-3">MPN</th>
                  <th className="py-2.5 px-3">Value</th>
                  <th className="py-2.5 px-3">Package</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">ABC</th>
                  <th className="py-2.5 px-3">Lifecycle</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((c) => {
                  const isSelected = selectedCandidate.id === c.id;

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCandidate(c)}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        isSelected ? 'bg-cyan-50/50 ring-1 ring-cyan-500' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-medium text-slate-900 max-w-[150px] truncate">
                        {c.description}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 max-w-[120px] truncate">
                        {c.manufacturer}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-cyan-800 max-w-[140px] truncate">
                        {c.mpn}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{c.value}</td>
                      <td className="py-2.5 px-3 text-slate-600">{c.package}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{c.category}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          c.abc === 'A'
                            ? 'bg-rose-100 text-rose-800'
                            : c.abc === 'B'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {c.abc}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-700">
                        {c.lifecycle}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                          c.status === 'Approved Candidate'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                            : c.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : c.status === 'On Hold'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Decision Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">
              Candidate Decision Panel
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {selectedCandidate.mpn}
            </h3>
            <p className="text-xs text-slate-500">
              {selectedCandidate.description} ({selectedCandidate.manufacturer})
            </p>
          </div>

          <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Positions:</span>
              <span className="font-mono font-bold text-slate-800">{selectedCandidate.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ABC Class:</span>
              <span className="font-bold text-slate-800">Class {selectedCandidate.abc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ERP Item Category:</span>
              <span className="font-mono text-slate-800">{selectedCandidate.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Status:</span>
              <span className="font-semibold text-cyan-800">{selectedCandidate.status}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              Select Candidate Action:
            </div>

            <button
              type="button"
              onClick={() => handleUpdateStatus('Approved Candidate')}
              className="w-full py-2 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve as New Item Candidate</span>
            </button>

            <button
              type="button"
              onClick={() => handleUpdateStatus('On Hold')}
              className="w-full py-2 px-3 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Hold for Engineering Verification</span>
            </button>

            <button
              type="button"
              onClick={() => handleUpdateStatus('Merged')}
              className="w-full py-2 px-3 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <GitMerge className="w-3.5 h-3.5 text-[#2568A3]" />
              <span>Merge with Existing Item</span>
            </button>

            <button
              type="button"
              onClick={() => handleUpdateStatus('Rejected')}
              className="w-full py-2 px-3 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Reject Candidate</span>
            </button>
          </div>

          <div className="p-3 bg-cyan-50/50 rounded-lg border border-cyan-100 flex items-start gap-2 text-[11px] text-cyan-900">
            <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <span>
              Once approved, item candidates flow into the Corrected BOM with placeholder identifier <strong>NEW</strong> for subsequent master data staging.
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exception Workbench</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Continue to Corrected BOM</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
