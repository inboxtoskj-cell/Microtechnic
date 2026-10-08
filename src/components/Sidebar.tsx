import React from 'react';
import {
  LayoutDashboard,
  Layers,
  FileCheck,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { MicroTechnicLogo } from './MicroTechnicLogo';

export type NavTab = 'dashboard' | 'boms' | 'approvals' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onAddNewBom?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'boms' as NavTab,
      label: 'BOM',
      icon: Layers,
    },
    {
      id: 'approvals' as NavTab,
      label: 'Customer Approval',
      icon: FileCheck,
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`sticky top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out shrink-0 select-none ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      } bg-[#2568A3] text-white shadow-lg`}
    >
      {/* Top Header / Brand Section - white background with white right border */}
      <div
        className={`h-16 bg-white flex items-center border-b border-slate-200 border-r border-white px-3.5 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {/* Logo Zone: Uses the actual company logo */}
        {isCollapsed ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="focus:outline-none focus:ring-2 focus:ring-slate-300 rounded-lg cursor-pointer transition-transform hover:scale-105"
            title="Expand Sidebar (Micro Technic)"
          >
            {/* Only Logo Visible when minimized */}
            <div className="p-0.5 flex items-center justify-center">
              <MicroTechnicLogo variant="mark" className="h-9" />
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onSelectTab('dashboard')}
              className="focus:outline-none focus:ring-2 focus:ring-slate-300 rounded-lg cursor-pointer text-left"
              title="Micro Technic BOM Intelligence"
            >
              {/* Actual Company Logo - increased size */}
              <div className="flex items-center">
                <MicroTechnicLogo variant="full" className="h-10" />
              </div>
            </button>
          </div>
        )}

        {/* Top Collapse/Expand Toggle Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ${
            isCollapsed ? 'hidden' : 'block'
          }`}
          title="Minimise Sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Modules List - with blue right border */}
      <div className="flex-1 flex flex-col min-h-0 border-r border-[#1e588b]">
        <nav className="p-2 space-y-1.5 mt-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                className={`w-full flex items-center rounded-lg transition-all text-xs cursor-pointer ${
                  isCollapsed ? 'justify-center py-3 px-2' : 'gap-3 px-3.5 py-2.5'
                }`}
              >
                <Icon
                  className={`shrink-0 transition-transform ${
                    isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                  } ${isActive ? 'text-white stroke-[2.2]' : 'text-sky-200'}`}
                />

                {!isCollapsed && (
                  <span className="truncate text-left flex-1">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
