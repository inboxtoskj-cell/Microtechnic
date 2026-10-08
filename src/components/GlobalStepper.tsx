import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

export interface WorkflowStage {
  id: number;
  name: string;
  sublabel: string;
  startScreen: string;
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  { id: 1, name: '1. Add BOM', sublabel: 'Customer & Product', startScreen: 'screen-4' },
  { id: 2, name: '2. Map & Check', sublabel: 'Mapping & Validation', startScreen: 'screen-8' },
  { id: 3, name: '3. SiliconExpert', sublabel: 'Component Enrichment', startScreen: 'screen-13' },
  { id: 4, name: '4. Business Central', sublabel: 'ERP Component Match', startScreen: 'screen-14b' },
  { id: 5, name: '5. BOM Review', sublabel: 'Enriched BOM Review', startScreen: 'screen-16' },
];

interface StepperProps {
  currentStageId: number;
  currentScreenId: string;
  onNavigateToScreen: (screenId: string) => void;
  showCaseInfo?: boolean;
  caseInfo?: {
    id: string;
    product: string;
    revision: string;
    customer: string;
    productionQty?: number;
    totalLines?: number;
  };
}

export const GlobalStepper: React.FC<StepperProps> = ({
  currentStageId,
  currentScreenId: _currentScreenId,
  onNavigateToScreen,
  showCaseInfo = true,
  caseInfo,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Division 1: Customer Journey / Workflow Steps */}
      <div className="w-full px-6 sm:px-8 lg:px-10 py-3 overflow-x-auto scrollbar-thin">
        <div className="flex items-center min-w-[760px] justify-between">
          {WORKFLOW_STAGES.map((stage, idx) => {
            const isCompleted = currentStageId > stage.id;
            const isCurrent = currentStageId === stage.id;

            return (
              <React.Fragment key={stage.id}>
                <button
                  type="button"
                  onClick={() => onNavigateToScreen(stage.startScreen)}
                  className={`group flex items-center gap-2.5 text-left py-1 px-2 rounded transition-colors ${
                    isCurrent
                      ? 'text-[#2568A3] font-semibold'
                      : isCompleted
                      ? 'text-slate-700 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={`Navigate to ${stage.name} (${stage.sublabel})`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#2568A3] text-white shadow-sm ring-2 ring-sky-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 group-hover:border-slate-300'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : stage.id}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[12px] font-medium tracking-tight">
                      {stage.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {stage.sublabel}
                    </span>
                  </div>
                </button>

                {idx < WORKFLOW_STAGES.length - 1 && (
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 mx-1 ${
                      currentStageId > stage.id ? 'text-emerald-500' : 'text-slate-300'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Division 2: Separate division BELOW Customer Journey / Steps for Active Case information */}
      {showCaseInfo && caseInfo && (
        <div className="w-full border-t border-slate-200 bg-slate-50/90 px-6 sm:px-8 lg:px-10 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-500 font-medium text-[11px]">Active Case:</span>
              <strong className="text-slate-900 font-bold">{caseInfo.id || 'BOM-1048'}</strong>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Customer:</span>
              <strong className="text-slate-900 font-semibold">{caseInfo.customer || 'Danfoss Power Solutions'}</strong>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Product:</span>
              <strong className="text-slate-900 font-semibold">{caseInfo.product || 'Smart Hub'}</strong>
              {caseInfo.revision && (
                <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-mono text-[10px] font-bold border border-slate-300/60">
                  {caseInfo.revision.startsWith('Rev') ? caseInfo.revision : `Rev ${caseInfo.revision}`}
                </span>
              )}
            </div>
          </div>

          <div className="text-slate-500 text-[11px] flex items-center gap-2.5">
            <span>
              Target Production: <strong className="text-slate-700 font-semibold">{(caseInfo.productionQty || 1000).toLocaleString()} pcs</strong>
            </span>
            <span className="text-slate-300">·</span>
            <span>
              Total Items: <strong className="text-slate-700 font-semibold">{caseInfo.totalLines || 112}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
