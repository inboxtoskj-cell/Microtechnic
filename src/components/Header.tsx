import React, { useState } from 'react';
import {
  LogOut,
  ChevronDown,
  PanelLeftOpen,
} from 'lucide-react';

interface HeaderProps {
  currentTab?: 'dashboard' | 'boms' | 'approvals' | 'settings';
  onSelectTab?: (tab: 'dashboard' | 'boms' | 'approvals' | 'settings') => void;
  onNavigateToScreen?: (screenId: string) => void;
  currentScreenId?: string;
  onLogout: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onAddNewBom?: () => void;
  caseInfo?: {
    id: string;
    product: string;
    revision: string;
    customer: string;
  };
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTab,
  onLogout,
  isSidebarCollapsed,
  onToggleSidebar,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Sidebar Toggle (when collapsed) - Heading area left blank */}
        <div className="flex items-center gap-3 min-w-0">
          {onToggleSidebar && isSidebarCollapsed && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4 text-[#2465A1]" />
            </button>
          )}
        </div>

        {/* Right: User Profile */}
        <div className="flex items-center gap-3">
          {/* User profile menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 text-left focus:outline-none group cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#0A2240] text-cyan-300 flex items-center justify-center text-xs font-bold border border-slate-200 group-hover:border-cyan-400 transition-colors">
                HN
              </div>
              <div className="hidden md:flex flex-col text-xs leading-none">
                <span className="font-semibold text-slate-800">Henrik Nielsen</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Micro Technic EMS</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs font-semibold text-slate-800">Henrik Nielsen</div>
                  <div className="text-[11px] text-slate-500">henrik.nielsen@micro-technic.com</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

