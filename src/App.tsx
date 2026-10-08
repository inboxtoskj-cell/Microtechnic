import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GlobalStepper } from './components/GlobalStepper';

// Screens
import { Screen1_Login } from './screens/Screen1_Login';
import { Screen2_Dashboard } from './screens/Screen2_Dashboard';
import { Screen3_BomListing } from './screens/Screen3_BomListing';
import { Screen4_CustomerSelection } from './screens/Screen4_CustomerSelection';
import { Screen5_ProductSituation } from './screens/Screen5_ProductSituation';
import { Screen6A_FastRoute } from './screens/Screen6A_FastRoute';
import { Screen6B_NewBomDetails } from './screens/Screen6B_NewBomDetails';
import { Screen7_FilePreview } from './screens/Screen7_FilePreview';
import { Screen8_FieldMapping } from './screens/Screen8_FieldMapping';
import { Screen9_MappingConfirmation } from './screens/Screen9_MappingConfirmation';
import { Screen10_BomDataCheck } from './screens/Screen10_BomDataCheck';
import { Screen11_ExportModal } from './screens/Screen11_ExportModal';
import { Screen12_ComponentRouting } from './screens/Screen12_ComponentRouting';
import { Screen13_SiliconExpertEnrichment } from './screens/Screen13_SiliconExpertEnrichment';
import { Screen13_SiliconExpertProcessing } from './screens/Screen13_SiliconExpertProcessing';
import { Screen14_SiliconExpertResults } from './screens/Screen14_SiliconExpertResults';
import { Screen14B_BusinessCentralProcessing } from './screens/Screen14B_BusinessCentralProcessing';
import { Screen15_BusinessCentralMatching } from './screens/Screen15_BusinessCentralMatching';
import { Screen16_BomReview } from './screens/Screen16_BomReview';
import { Screen16_RulesDecisionAnalysis } from './screens/Screen16_RulesDecisionAnalysis';
import { Screen17_ExceptionWorkbench } from './screens/Screen17_ExceptionWorkbench';
import { Screen18_NewItemCandidates } from './screens/Screen18_NewItemCandidates';
import { Screen19_CorrectedBom } from './screens/Screen19_CorrectedBom';
import { Screen20_CustomerApprovalReview } from './screens/Screen20_CustomerApprovalReview';
import { Screen21_FinalApprovalBom } from './screens/Screen21_FinalApprovalBom';
import { Screen22_ApprovalStatus } from './screens/Screen22_ApprovalStatus';
import { Screen23_ApprovedBom } from './screens/Screen23_ApprovedBom';
import { ApprovalsQueueScreen } from './screens/ApprovalsQueueScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SupplierQuotationsModal } from './components/SupplierQuotationsModal';
import { DEFAULT_MAPPINGS, FieldMapping, INITIAL_BOM_CASES } from './data/mockData';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'boms' | 'approvals' | 'settings'>('dashboard');
  const [currentScreen, setCurrentScreen] = useState<string>('screen-2');
  const [isCreatingNewBom, setIsCreatingNewBom] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Active BOM Case State
  const [caseMeta, setCaseMeta] = useState({
    id: 'BOM-1048',
    customer: 'Danfoss Power Solutions',
    product: 'Smart Hub',
    revision: 'Rev 0',
    productionQty: 1000,
    totalLines: 112,
    fileName: 'Micro Technic BOM.xlsx',
    approvalDate: '09 Oct 2026',
    approvalStatus: 'Waiting for Customer',
  });

  const [activeMappings, setActiveMappings] = useState<FieldMapping[]>(DEFAULT_MAPPINGS);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isQuotationsModalOpen, setIsQuotationsModalOpen] = useState(false);

  // Compute active stage ID for the Global Stepper
  const getStageId = (screenId: string): number => {
    switch (screenId) {
      case 'screen-4':
      case 'screen-5':
      case 'screen-6a':
      case 'screen-6b':
      case 'screen-7':
        return 1; // 1. Add New BOM
      case 'screen-8':
      case 'screen-9':
      case 'screen-10':
      case 'screen-11':
      case 'screen-12':
        return 2; // 2. Map & Check BOM
      case 'screen-13':
      case 'screen-14':
        return 3; // 3. SiliconExpert Enrichment
      case 'screen-14b':
      case 'screen-15':
        return 4; // 4. Business Central Matching
      case 'screen-16':
      case 'screen-17':
      case 'screen-18':
      case 'screen-19':
      case 'screen-20':
      case 'screen-21':
      case 'screen-22':
      case 'screen-23':
        return 5; // 5. BOM Review
      default:
        return 1;
    }
  };

  const isCaseWorkflowActive = [
    'screen-4',
    'screen-5',
    'screen-6a',
    'screen-6b',
    'screen-7',
    'screen-8',
    'screen-9',
    'screen-10',
    'screen-12',
    'screen-13',
    'screen-14',
    'screen-14b',
    'screen-15',
    'screen-16',
    'screen-17',
    'screen-18',
    'screen-19',
    'screen-20',
    'screen-21',
    'screen-22',
    'screen-23',
  ].includes(currentScreen);

  // Handlers
  const handleAddNewBom = () => {
    setIsCreatingNewBom(true);
    setCurrentScreen('screen-4');
  };

  const handleOpenBomCase = (bomId: string, targetScreen: string = 'screen-15') => {
    setIsCreatingNewBom(false);
    const foundCase = INITIAL_BOM_CASES.find((c) => c.id === bomId);
    if (foundCase) {
      setCaseMeta({
        id: foundCase.id,
        customer: foundCase.customerName,
        product: foundCase.productName,
        revision: foundCase.revision,
        productionQty: foundCase.productionQty,
        totalLines: foundCase.totalItems,
        fileName: 'Micro Technic BOM.xlsx',
        approvalDate: '09 Oct 2026',
        approvalStatus: foundCase.status,
      });
    } else {
      setCaseMeta((prev) => ({ ...prev, id: bomId }));
    }
    setCurrentScreen(targetScreen);
  };

  const handleSignIn = () => {
    setIsLoggedIn(true);
    setCurrentScreen('screen-2');
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('screen-1');
  };

  const handleSelectTab = (tab: 'dashboard' | 'boms' | 'approvals' | 'settings') => {
    setCurrentTab(tab);
    if (tab === 'dashboard') setCurrentScreen('screen-2');
    if (tab === 'boms') setCurrentScreen('screen-3');
    if (tab === 'approvals') setCurrentScreen('approvals-queue');
    if (tab === 'settings') setCurrentScreen('settings-view');
  };

  const isNewBomCreationScreen = [
    'screen-4',
    'screen-5',
    'screen-6a',
    'screen-6b',
    'screen-7',
    'screen-8',
    'screen-9',
  ].includes(currentScreen);

  const shouldShowActiveCaseBar = !isCreatingNewBom && !isNewBomCreationScreen;

  // If user is not logged in, render Screen 1 Login
  if (!isLoggedIn || currentScreen === 'screen-1') {
    return <Screen1_Login onSignIn={handleSignIn} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-cyan-500 selection:text-white">
      {/* Collapsible Left Sidebar Panel */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onAddNewBom={handleAddNewBom}
        onLogout={handleLogout}
      />

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Main Top Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          onNavigateToScreen={(scr) => setCurrentScreen(scr)}
          currentScreenId={currentScreen}
          onLogout={handleLogout}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onAddNewBom={handleAddNewBom}
          caseInfo={{
            id: caseMeta.id,
            product: caseMeta.product,
            revision: caseMeta.revision,
            customer: caseMeta.customer,
          }}
        />

        {/* Global 6-Stage Case Stepper (Active during BOM processing) */}
        {isCaseWorkflowActive && (
        <GlobalStepper
          currentStageId={getStageId(currentScreen)}
          currentScreenId={currentScreen}
          onNavigateToScreen={(scr) => setCurrentScreen(scr)}
          showCaseInfo={true}
          caseInfo={{
            id: caseMeta.id,
            product: caseMeta.product,
            revision: caseMeta.revision,
            customer: caseMeta.customer,
            productionQty: caseMeta.productionQty,
            totalLines: caseMeta.totalLines,
          }}
        />
      )}

      {/* Main Body Viewport */}
      <main className="flex-1 pb-16">
        {/* Screen 2: Dashboard */}
        {currentScreen === 'screen-2' && (
          <Screen2_Dashboard
            onAddNewBom={handleAddNewBom}
            onOpenBomCase={(bomId) => handleOpenBomCase(bomId, 'screen-17')}
            onViewAllBoms={() => {
              setCurrentTab('boms');
              setCurrentScreen('screen-3');
            }}
          />
        )}

        {/* Screen 3: BOM Listing */}
        {currentScreen === 'screen-3' && (
          <Screen3_BomListing
            onAddNewBom={handleAddNewBom}
            onOpenBomCase={(bomId) => handleOpenBomCase(bomId, 'screen-15')}
          />
        )}

        {/* Screen 4: Customer Selection & Product Intake */}
        {currentScreen === 'screen-4' && (
          <Screen4_CustomerSelection
            onBack={() => setCurrentScreen('screen-2')}
            initialCustomer={caseMeta.customer}
            onContinue={(payload) => {
              setCaseMeta((prev) => ({
                ...prev,
                customer: payload.customer,
                product: payload.productName,
                revision: payload.revision,
                productionQty: payload.productionQty,
                fileName: payload.fileName || prev.fileName,
              }));

              if (payload.situation === 'existing_approved') {
                setCurrentScreen('screen-6a');
              } else {
                setCurrentScreen('screen-8');
              }
            }}
          />
        )}

        {/* Screen 5: Fallback to Screen 4 */}
        {currentScreen === 'screen-5' && (
          <Screen4_CustomerSelection
            onBack={() => setCurrentScreen('screen-2')}
            initialCustomer={caseMeta.customer}
            onContinue={(payload) => {
              setCaseMeta((prev) => ({
                ...prev,
                customer: payload.customer,
                product: payload.productName,
                revision: payload.revision,
                productionQty: payload.productionQty,
                fileName: payload.fileName || prev.fileName,
              }));

              if (payload.situation === 'existing_approved') {
                setCurrentScreen('screen-6a');
              } else {
                setCurrentScreen('screen-8');
              }
            }}
          />
        )}

        {/* Screen 6A: Existing Product Fast Route */}
        {currentScreen === 'screen-6a' && (
          <Screen6A_FastRoute
            customerName={caseMeta.customer}
            onBack={() => setCurrentScreen('screen-4')}
            onUseExistingBom={() => {
              // Direct release to approved BOM summary
              setCurrentScreen('screen-23');
            }}
            onUploadNewRevision={() => setCurrentScreen('screen-6b')}
            onRunComponentRefresh={() => setCurrentScreen('screen-12')}
          />
        )}

        {/* Screen 6B: New / Revised BOM Details */}
        {currentScreen === 'screen-6b' && (
          <Screen6B_NewBomDetails
            customerName={caseMeta.customer}
            initialProductName={caseMeta.product}
            initialRevision={caseMeta.revision}
            initialProductionQty={caseMeta.productionQty}
            isRevision={caseMeta.revision !== 'Rev 0'}
            onBack={() => setCurrentScreen('screen-4')}
            onUploadBom={(meta) => {
              setCaseMeta((prev) => ({
                ...prev,
                product: meta.productName,
                revision: meta.revision,
                productionQty: meta.productionQty,
                fileName: meta.fileName,
              }));
              setCurrentScreen('screen-7');
            }}
          />
        )}

        {/* Screen 7: Uploaded File Preview */}
        {currentScreen === 'screen-7' && (
          <Screen7_FilePreview
            productName={caseMeta.product}
            revision={caseMeta.revision}
            fileName={caseMeta.fileName}
            onBack={() => setCurrentScreen('screen-4')}
            onMapFields={() => setCurrentScreen('screen-8')}
          />
        )}

        {/* Screen 8: Field Mapping */}
        {currentScreen === 'screen-8' && (
          <Screen8_FieldMapping
            customerName={caseMeta.customer}
            onBack={() => setCurrentScreen('screen-4')}
            onConfirmMapping={(mappings, _saveTemplate) => {
              setActiveMappings(mappings);
              setCurrentScreen('screen-9');
            }}
          />
        )}

        {/* Screen 9: Mapping Confirmation */}
        {currentScreen === 'screen-9' && (
          <Screen9_MappingConfirmation
            mappings={activeMappings}
            onBackToMapping={() => setCurrentScreen('screen-8')}
            onConfirmMapping={() => setCurrentScreen('screen-10')}
          />
        )}

        {/* Screen 10: BOM Data Check */}
        {currentScreen === 'screen-10' && (
          <Screen10_BomDataCheck
            productName={caseMeta.product}
            onBack={() => setCurrentScreen('screen-9')}
            onContinue={() => setCurrentScreen('screen-13')}
          />
        )}

        {/* Screen 11: Export Modal */}
        <Screen11_ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onContinueToValidation={() => {
            setIsExportModalOpen(false);
            setCurrentScreen('screen-13');
          }}
        />

        {/* Screen 12: Component Routing */}
        {currentScreen === 'screen-12' && (
          <Screen12_ComponentRouting
            onBack={() => setCurrentScreen('screen-10')}
            onContinue={(_selectedCount) => setCurrentScreen('screen-13')}
          />
        )}

        {/* Screen 13: SiliconExpert Enrichment (Step 3: Intake & Upload) */}
        {currentScreen === 'screen-13' && (
          <Screen13_SiliconExpertEnrichment
            productName={caseMeta.product}
            revision={caseMeta.revision}
            onBack={() => setCurrentScreen('screen-10')}
            onContinueToEnrichedView={() => setCurrentScreen('screen-14')}
          />
        )}

        {/* Screen 14: SiliconExpert Enriched View (Step 3: Enriched BOM Results) */}
        {currentScreen === 'screen-14' && (
          <Screen14_SiliconExpertResults
            productName={caseMeta.product}
            revision={caseMeta.revision}
            onBack={() => setCurrentScreen('screen-13')}
            onMatchBusinessCentral={() => setCurrentScreen('screen-14b')}
          />
        )}

        {/* Screen 14B: Business Central Processing (Step 4: Intake & Upload) */}
        {currentScreen === 'screen-14b' && (
          <Screen14B_BusinessCentralProcessing
            productName={caseMeta.product}
            revision={caseMeta.revision}
            onBack={() => setCurrentScreen('screen-14')}
            onContinueToMatching={() => setCurrentScreen('screen-15')}
          />
        )}

        {/* Screen 15: Business Central Matching (Step 4: Review BC Matches) */}
        {currentScreen === 'screen-15' && (
          <Screen15_BusinessCentralMatching
            onBack={() => setCurrentScreen('screen-14b')}
            onContinueToRules={() => setCurrentScreen('screen-16')}
            onCreateCandidateFor={() => setCurrentScreen('screen-18')}
          />
        )}

        {/* Screen 16: BOM Review (Step 5 Intelligent Spreadsheet Workspace) */}
        {/* Screen 16: BOM Review (Step 5 Intelligent Spreadsheet Workspace - Final Step) */}
        {currentScreen === 'screen-16' && (
          <Screen16_BomReview
            productName={caseMeta.product}
            revision={caseMeta.revision}
            customerName={caseMeta.customer}
            onBack={() => setCurrentScreen('screen-15')}
            onSaveAndFinish={() => {
              setCurrentScreen('screen-2');
              setCurrentTab('dashboard');
            }}
          />
        )}

        {/* Screen 17: Exception Workbench */}
        {currentScreen === 'screen-17' && (
          <Screen17_ExceptionWorkbench
            onBack={() => setCurrentScreen('screen-16')}
            onSaveAndContinue={() => setCurrentScreen('screen-18')}
          />
        )}

        {/* Screen 18: New Item Candidates */}
        {currentScreen === 'screen-18' && (
          <Screen18_NewItemCandidates
            onBack={() => setCurrentScreen('screen-17')}
            onContinue={() => setCurrentScreen('screen-19')}
          />
        )}

        {/* Screen 19: Corrected BOM */}
        {currentScreen === 'screen-19' && (
          <Screen19_CorrectedBom
            productName={caseMeta.product}
            revision={caseMeta.revision}
            onBack={() => setCurrentScreen('screen-18')}
            onReviewCustomerChanges={() => setCurrentScreen('screen-20')}
          />
        )}

        {/* Screen 20: Customer Approval Review */}
        {currentScreen === 'screen-20' && (
          <Screen20_CustomerApprovalReview
            onBack={() => setCurrentScreen('screen-16')}
            onGenerateApprovalBom={() => setCurrentScreen('screen-21')}
          />
        )}

        {/* Screen 21: Final Approval BOM */}
        {currentScreen === 'screen-21' && (
          <Screen21_FinalApprovalBom
            customerName={caseMeta.customer}
            productName={caseMeta.product}
            revision={caseMeta.revision}
            onBack={() => setCurrentScreen('screen-16')}
            onMarkReadyForCustomer={() => setCurrentScreen('screen-22')}
          />
        )}

        {/* Screen 22: Approval Status */}
        {currentScreen === 'screen-22' && (
          <Screen22_ApprovalStatus
            productName={caseMeta.product}
            revision={caseMeta.revision}
            onBack={() => setCurrentScreen('screen-21')}
            onSaveStatus={(statusData) => {
              setCaseMeta((prev) => ({
                ...prev,
                approvalStatus: statusData.status,
                approvalDate: statusData.approvalDate,
              }));
              setCurrentScreen('screen-23');
            }}
          />
        )}

        {/* Screen 23: Approved BOM Summary */}
        {currentScreen === 'screen-23' && (
          <Screen23_ApprovedBom
            customerName={caseMeta.customer}
            productName={caseMeta.product}
            revision={caseMeta.revision}
            approvalDate={caseMeta.approvalDate}
            onBack={() => setCurrentScreen('screen-22')}
            onContinueToSupplierQuotations={() => setIsQuotationsModalOpen(true)}
          />
        )}

        {/* Approvals Queue Tab Screen */}
        {currentScreen === 'approvals-queue' && (
          <ApprovalsQueueScreen
            onOpenApprovalCase={(bomId) => handleOpenBomCase(bomId, 'screen-21')}
          />
        )}

        {/* Settings Tab Screen */}
        {currentScreen === 'settings-view' && <SettingsScreen />}
      </main>

      {/* Supplier Quotations Modal (Part 2 Scope) */}
      <SupplierQuotationsModal
        isOpen={isQuotationsModalOpen}
        onClose={() => setIsQuotationsModalOpen(false)}
      />
      </div>
    </div>
  );
}
