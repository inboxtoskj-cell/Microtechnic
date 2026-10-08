import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Save,
  HelpCircle,
  FileSpreadsheet,
  X,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  ChevronRight,
  Layers,
  Edit3,
  Copy,
  PlusCircle,
  CheckSquare,
  FileDown,
} from 'lucide-react';
import { INITIAL_BOM_ROWS, BomItem } from '../data/mockData';
import { INITIAL_SE_ENRICHED_DATA } from '../data/siliconExpertData';

export interface BomReviewRow {
  id: string;
  // Group 1: Customer BOM
  position: string;
  description: string;
  value: string;
  package: string;
  qty: number;
  originalMfr: string;
  originalMpn: string;
  isCustomerMpnMissing: boolean;
  abc: 'A' | 'B' | 'C';

  // Group 2: SiliconExpert Enrichment
  validatedMfr: string;
  validatedMpn: string;
  seCategory: string;
  lifecycle: 'Active' | 'EOL' | 'NRND' | 'Incomplete' | 'Unknown' | 'Obsolete';
  rohs: 'Compliant' | 'Non-Compliant' | 'Unknown';
  alternative: string;
  indicativePrice: string;
  leadTime: string;

  // Group 3: Business Central Matching
  mtItemNo: string;
  bcDescription: string;
  bcCategory: string;
  matchType: string;
  bcStatus: 'Existing Item' | 'Rule Match' | 'No Match' | 'Conflict' | 'Alternative Available' | 'No reliable match';

  // Group 4: Review & Action
  reviewStatus: 'Resolved' | 'Needs Action' | 'Technical Review' | 'Data Clarification';
  actionRequired: 'None' | 'New MT Item' | 'Select MT Item' | 'Clarify Data' | 'Alternative Review';
  decision: string;

  // Drawer specifics & flags
  isDuplicate?: boolean;
  flagReason?: string;
  drawerType?: 'NO_MT_ITEM' | 'MULTIPLE_MATCH' | 'MISSING_DATA' | 'EOL_ALTERNATIVE';
  possibleMatches?: Array<{ id: string; name: string; mfr: string; mpn: string }>;
}

interface BomReviewProps {
  productName?: string;
  revision?: string;
  customerName?: string;
  onBack: () => void;
  onContinueToFinalBom?: () => void;
  onSaveAndFinish?: () => void;
}

type FilterChip =
  | 'All'
  | 'Resolved'
  | 'Needs Action'
  | 'NEW MT Item'
  | 'Duplicate Item'
  | 'Missing MPN'
  | 'EOL'
  | 'Alternative';

// Helper to synthesize realistic SiliconExpert part numbers for components with missing customer MPN
function getSeSuggestedPartForMissing(item: BomItem): { mfr: string; mpn: string; cat: string } {
  const desc = (item.description || '').toLowerCase();
  const val = (item.value || '').toLowerCase();
  const pkg = (item.package || '').toLowerCase();

  if (desc.includes('capacitor') || desc.includes('cap') || val.includes('f')) {
    if (val.includes('100nf')) {
      return { mfr: 'Murata Electronics', mpn: 'GRM188R71H104KA93D', cat: 'MLCC 0603 50V' };
    }
    if (val.includes('16pf')) {
      return { mfr: 'Murata Electronics', mpn: 'GRM1555C1H160JA01D', cat: 'MLCC 0402 50V' };
    }
    if (val.includes('22pf')) {
      return { mfr: 'Murata Electronics', mpn: 'GRM1555C1H220JA01D', cat: 'MLCC 0402 50V' };
    }
    if (val.includes('10uf')) {
      return { mfr: 'Samsung Electro-Mech', mpn: 'CL21A106KPFNNNE', cat: 'MLCC 0805 10V' };
    }
    if (val.includes('22uf')) {
      return { mfr: 'Murata Electronics', mpn: 'GRM21BR61C226ME44L', cat: 'MLCC 0805 16V' };
    }
    if (val.includes('4.7uf')) {
      return { mfr: 'Murata Electronics', mpn: 'GRM188R61A475KE15D', cat: 'MLCC 0603 10V' };
    }
    if (val.includes('1uf')) {
      return { mfr: 'Murata Electronics', mpn: 'GRM188R71C105KA12D', cat: 'MLCC 0603 16V' };
    }
    if (val.includes('1000uf')) {
      return { mfr: 'TDK / EPCOS', mpn: 'B41231C7109M002', cat: 'Aluminum Electrolytic' };
    }
    if (val.includes('100uf')) {
      return { mfr: 'Panasonic', mpn: 'EEH-ZA1E101XP', cat: 'Polymer Hybrid SMD' };
    }
    return { mfr: 'Murata Electronics', mpn: 'GRM188R71H103KA01D', cat: 'MLCC Ceramic' };
  }

  if (desc.includes('resistor') || desc.includes('res') || val.includes('k') || val.includes('r') || val.includes('ohm')) {
    if (val.includes('10k')) {
      return { mfr: 'Yageo', mpn: 'RC0402FR-0710KL', cat: 'Chip Resistor 0402 1%' };
    }
    if (val.includes('1k')) {
      return { mfr: 'Yageo', mpn: 'RC0402FR-071KL', cat: 'Chip Resistor 0402 1%' };
    }
    if (val.includes('4.7k')) {
      return { mfr: 'Yageo', mpn: 'RC0402FR-074K7L', cat: 'Chip Resistor 0402 1%' };
    }
    if (val.includes('47k')) {
      return { mfr: 'Yageo', mpn: 'RC0402FR-0747KL', cat: 'Chip Resistor 0402 1%' };
    }
    if (val.includes('100r') || val.includes('100 ohm')) {
      return { mfr: 'Yageo', mpn: 'RC0402FR-07100RL', cat: 'Chip Resistor 0402 1%' };
    }
    if (val.includes('330r')) {
      return { mfr: 'Yageo', mpn: 'RC0402FR-07330RL', cat: 'Chip Resistor 0402 1%' };
    }
    if (val.includes('0r') || val.includes('jumper')) {
      return { mfr: 'Yageo', mpn: 'RC0402JR-070RL', cat: 'Zero Ohm Jumper 0402' };
    }
    return { mfr: 'Yageo', mpn: 'RC0402FR-0710KL', cat: 'Chip Resistor 0402' };
  }

  if (desc.includes('diode') || val.includes('bas70') || val.includes('bat54')) {
    if (val.includes('bas70') || desc.includes('bas70')) {
      return { mfr: 'Diodes Incorporated', mpn: 'BAS70-04-7-F', cat: 'Schottky Diode SOT-23' };
    }
    if (val.includes('bat54') || desc.includes('bat54')) {
      return { mfr: 'Diodes Incorporated', mpn: 'BAT54C-7-F', cat: 'Schottky Barrier SOT-23' };
    }
    return { mfr: 'Vishay', mpn: '1N4148WS-E3-08', cat: 'Switching Diode SOD-323' };
  }

  if (desc.includes('test point') || item.position.startsWith('TP')) {
    return { mfr: 'Keystone Electronics', mpn: '5015', cat: 'Surface Mount Test Point' };
  }

  if (desc.includes('inductor')) {
    return { mfr: 'Bourns Inc.', mpn: 'SDR0604-100ML', cat: 'Power Inductor SMD' };
  }

  return { mfr: 'Industry Standard', mpn: 'STD-' + (item.value || 'GENERIC'), cat: 'Discrete Component' };
}

// Helper to retrieve realistic SiliconExpert pricing and lead time for export & display
function getSePricingAndLeadTime(row: {
  position: string;
  description?: string;
  originalMpn?: string;
  validatedMpn?: string;
  seCategory?: string;
}): { price: string; leadTime: string } {
  const match = INITIAL_SE_ENRICHED_DATA.find(
    (se) =>
      se.position.toLowerCase() === row.position.toLowerCase() ||
      (row.validatedMpn && se.validatedMpn && se.validatedMpn.toLowerCase() === row.validatedMpn.toLowerCase()) ||
      (row.originalMpn && se.originalMpn && se.originalMpn.toLowerCase() === row.originalMpn.toLowerCase())
  );
  if (match) {
    return {
      price: match.indicativePrice || 'DKK 2.50',
      leadTime: match.leadTimeWeeks ? `${match.leadTimeWeeks} Weeks` : '8 Weeks',
    };
  }

  const desc = (row.description || '').toLowerCase();
  const cat = (row.seCategory || '').toLowerCase();
  if (desc.includes('connector') || cat.includes('connector')) {
    return { price: 'DKK 18.50', leadTime: '14 Weeks' };
  }
  if (desc.includes('diode') || desc.includes('transistor') || desc.includes('mosfet')) {
    return { price: 'DKK 1.20', leadTime: '10 Weeks' };
  }
  if (desc.includes('ic') || desc.includes('mcu') || desc.includes('controller') || desc.includes('processor')) {
    return { price: 'DKK 34.80', leadTime: '18 Weeks' };
  }
  if (desc.includes('inductor') || desc.includes('coil')) {
    return { price: 'DKK 4.50', leadTime: '12 Weeks' };
  }
  if (desc.includes('capacitor') || desc.includes('resistor')) {
    return { price: 'DKK 0.35', leadTime: '6 Weeks' };
  }
  return { price: 'DKK 2.80', leadTime: '8 Weeks' };
}

// Build 112 full enriched BOM rows from INITIAL_BOM_ROWS
function buildInitialReviewRows(): BomReviewRow[] {
  return INITIAL_BOM_ROWS.map((item, index) => {
    const isCustomerMpnMissing = !item.mpn || item.mpn.trim() === '' || item.mpn === '—';
    const isMfrMissing = !item.manufacturer || item.manufacturer.trim() === '' || item.manufacturer === '—';

    // SE Enrichment
    let valMfr = item.seValidatedMfr && item.seValidatedMfr !== '—' ? item.seValidatedMfr : '';
    let valMpn = item.seValidatedMpn && item.seValidatedMpn !== '—' ? item.seValidatedMpn : '';
    let seCat = item.seCategory || '';

    // If missing in customer BOM, synthesize realistic SE enriched part
    if (isCustomerMpnMissing) {
      const seFallback = getSeSuggestedPartForMissing(item);
      if (!valMpn) valMpn = seFallback.mpn;
      if (!valMfr) valMfr = seFallback.mfr;
      if (!seCat) seCat = seFallback.cat;
    } else {
      if (!valMfr) valMfr = item.manufacturer;
      if (!valMpn) valMpn = item.mpn;
    }

    // Business Central matching
    let mtItem = item.bcItemNo || '';
    let bcDesc = item.bcDescription || '';
    let bcCat = item.bcCategory || 'CAP';
    let matchType: string = item.matchType || (isCustomerMpnMissing ? 'Value + Package' : 'Exact MPN');
    let bcStatus: BomReviewRow['bcStatus'] = 'Existing Item';

    // Determine initial review status & attention requirements
    let reviewStatus: BomReviewRow['reviewStatus'] = 'Resolved';
    let actionRequired: BomReviewRow['actionRequired'] = 'None';
    let decision = '—';
    let isDuplicate = false;
    let drawerType: BomReviewRow['drawerType'] | undefined;
    let flagReason: string | undefined;
    let possibleMatches: BomReviewRow['possibleMatches'] | undefined;

    // SCENARIO 3 & NEW MT ITEMS: No MT Item in BC
    if (
      item.position === 'J32' ||
      item.position === 'J33' ||
      item.position === 'L3' ||
      item.position === 'U19' ||
      item.exceptionReason === 'No BC Match' ||
      item.bcStatus === 'No Match' ||
      (!mtItem && !isCustomerMpnMissing)
    ) {
      reviewStatus = 'Needs Action';
      actionRequired = 'New MT Item';
      bcStatus = 'No Match';
      matchType = 'None';
      mtItem = '—';
      drawerType = 'NO_MT_ITEM';
      flagReason = `The customer-specified component (${valMpn}) is validated by SiliconExpert, but does not yet exist in Micro Technic's Business Central catalogue.`;
    }

    // SCENARIO 4 & DUPLICATE / MULTIPLE MATCHES
    else if (
      item.position === 'C8, C9' ||
      item.position === 'C99' ||
      item.position === 'D12' ||
      item.position === 'R95' ||
      item.exceptionReason === 'Multiple Matches' ||
      (item.bcStatus === 'Conflict' && !item.seLifecycle?.includes('EOL'))
    ) {
      reviewStatus = 'Technical Review';
      actionRequired = 'Select MT Item';
      bcStatus = 'Conflict';
      matchType = 'Multiple Matches';
      isDuplicate = true;
      drawerType = 'MULTIPLE_MATCH';

      if (item.position === 'C8, C9') {
        mtItem = '3 Possible Matches';
        bcDesc = '16pF 0402 Ceramic Capacitor (3 options)';
        flagReason = 'More than one existing Micro Technic item could satisfy this component requirement.';
        possibleMatches = [
          { id: 'MT-2201', name: '16pF 0402 Ceramic Capacitor 50V C0G', mfr: 'Murata', mpn: 'GRM1555C1H160JA01D' },
          { id: 'MT-2207', name: '16pF 0402 Ceramic Capacitor 50V NP0', mfr: 'Yageo', mpn: 'CC0402JRNPO9BN160' },
          { id: 'MT-2241', name: '16pF 0402 Ceramic Capacitor 50V C0G', mfr: 'Samsung', mpn: 'CL05C160JB5NNNC' },
        ];
      } else if (item.position === 'C99') {
        mtItem = '2 Possible Matches';
        bcDesc = '10nF 1kV High Voltage Cap (2 options)';
        flagReason = 'Multiple candidate items identified with differing dielectric ratings in Business Central.';
        possibleMatches = [
          { id: 'MT-2310', name: '10nF 1kV X7R 1206', mfr: 'TDK', mpn: 'C3216X7R3A103K160AA' },
          { id: 'MT-2314', name: '10nF 1kV X7R 1206 125C', mfr: 'Murata', mpn: 'GRM31BR73A103KW01L' },
        ];
      } else if (item.position === 'D12') {
        mtItem = '2 Possible Matches';
        bcDesc = '5.1V Zener Diode SOT-23 (2 options)';
        flagReason = 'Duplicate references found in Business Central; select preferred stock standard.';
        possibleMatches = [
          { id: 'MT-3105', name: 'BZX84C5V1 Zener 5.1V SOT-23', mfr: 'Nexperia', mpn: 'BZX84-C5V1,215' },
          { id: 'MT-3108', name: 'BZX84C5V1-7-F Zener 5.1V SOT-23', mfr: 'Diodes Inc', mpn: 'BZX84C5V1-7-F' },
        ];
      } else {
        mtItem = '2 Possible Matches';
        bcDesc = `${item.description} (2 options)`;
        flagReason = 'Duplicate match candidates in BC matching both thick film and thin film options.';
        possibleMatches = [
          { id: 'MT-2004', name: '4.7k 0402 1% Thick Film Resistor', mfr: 'Yageo', mpn: 'RC0402FR-074K7L' },
          { id: 'MT-2009', name: '4.7k 0402 0.1% Precision Thin Film', mfr: 'Panasonic', mpn: 'ERA-2AEB472X' },
        ];
      }
    }

    // SCENARIO 6 & EOL / ALTERNATIVE
    else if (
      item.position === 'U12' ||
      item.position === 'Y1' ||
      item.position === 'Q14' ||
      item.position === 'D10' ||
      item.seLifecycle === 'EOL' ||
      item.seLifecycle === 'Obsolete' ||
      item.exceptionReason === 'EOL' ||
      item.exceptionReason === 'Alternative'
    ) {
      reviewStatus = 'Technical Review';
      actionRequired = 'Alternative Review';
      bcStatus = 'Alternative Available';
      matchType = 'Alternative Cross-ref';
      drawerType = 'EOL_ALTERNATIVE';

      if (item.position === 'U12') {
        valMfr = 'Texas Instruments';
        valMpn = 'ABC123';
        mtItem = 'MT-6732 (for ABC124)';
        bcDesc = 'Alternative ABC124 exists in BC as MT-6732';
        flagReason = 'The original component is obsolete (EOL). SiliconExpert confirmed active pin-compatible replacement ABC124.';
      } else if (item.position === 'Y1') {
        mtItem = 'MT-8015';
        bcDesc = 'Successor ABM8-16.000MHZ-B2-T in stock';
        flagReason = 'Original crystal series reached Obsolete/EOL status. Successor ABM8 series identified.';
      } else if (item.position === 'Q14') {
        mtItem = 'MT-3125';
        bcDesc = 'SI2301CDS-T1-GE3 Active MOSFET';
        flagReason = 'Original component marked NRND with impending EOL notice. Active replacement available.';
      } else {
        mtItem = 'MT-3045';
        bcDesc = 'PESD5V0X1BCAL Low Clamping Voltage';
        flagReason = 'Alternative part proposed with lower clamping voltage and secured distribution.';
      }
    }

    // SCENARIO 5 & MISSING / UNCLEAR DATA
    else if (
      item.position === 'D8-D15' ||
      item.position === 'TP1-TP12' ||
      item.position === 'C109' ||
      item.position === 'L12' ||
      item.position === 'CN4' ||
      item.exceptionReason === 'Missing Data'
    ) {
      reviewStatus = 'Data Clarification';
      actionRequired = 'Clarify Data';
      bcStatus = 'No reliable match';
      matchType = 'None';
      mtItem = '—';
      drawerType = 'MISSING_DATA';
      flagReason = 'There is not enough information or footprint specification in the customer data to confidently select an existing Micro Technic item.';
    }

    // CLEAN RESOLVED ROWS (Exact Matches & C-Class Rule Matches)
    else {
      reviewStatus = 'Resolved';
      actionRequired = 'None';
      if (isCustomerMpnMissing) {
        bcStatus = 'Rule Match';
        matchType = 'Value + Package';
        decision = 'Rule Match';
      } else {
        bcStatus = 'Existing Item';
        matchType = 'Exact Manufacturer + MPN';
        decision = '—';
      }
    }

    return {
      id: item.id || `row-${index}`,
      position: item.position,
      description: item.description,
      value: item.value || '—',
      package: item.package || '—',
      qty: item.quantity || 1,
      originalMfr: item.manufacturer || '—',
      originalMpn: item.mpn || '—',
      isCustomerMpnMissing,
      abc: item.abc || 'C',

      validatedMfr: valMfr || '—',
      validatedMpn: valMpn || '—',
      seCategory: seCat || 'Passive',
      lifecycle: (item.seLifecycle as any) || 'Active',
      rohs: (item.seRohs as any) || 'Compliant',
      alternative: item.seAlternative || '—',
      indicativePrice: getSePricingAndLeadTime({
        position: item.position,
        description: item.description,
        originalMpn: item.mpn,
        validatedMpn: valMpn,
        seCategory: seCat,
      }).price,
      leadTime: getSePricingAndLeadTime({
        position: item.position,
        description: item.description,
        originalMpn: item.mpn,
        validatedMpn: valMpn,
        seCategory: seCat,
      }).leadTime,

      mtItemNo: mtItem || '—',
      bcDescription: bcDesc || (item.description || '—'),
      bcCategory: bcCat,
      matchType,
      bcStatus,

      reviewStatus,
      actionRequired,
      decision,

      isDuplicate,
      drawerType,
      flagReason,
      possibleMatches,
    };
  });
}

export const Screen16_BomReview: React.FC<BomReviewProps> = ({
  productName = 'Smart Hub',
  revision = 'Rev 0',
  customerName = 'Nordic Tech Solutions',
  onBack,
  onContinueToFinalBom,
  onSaveAndFinish,
}) => {
  // Master full BOM rows dataset (112 items)
  const [rows, setRows] = useState<BomReviewRow[]>(() => buildInitialReviewRows());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'action_required' | 'full_bom'>('action_required');
  const [activeChip, setActiveChip] = useState<FilterChip>('All');
  const [selectedDrawerRow, setSelectedDrawerRow] = useState<BomReviewRow | null>(null);

  // Modal / Drawer inputs
  const [selectedMatchOption, setSelectedMatchOption] = useState<string>('MT-2201');
  const [manualClarificationInput, setManualClarificationInput] = useState<string>('Diodes Inc / BAS70-04-7-F');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Dynamic Summary Counts
  const totalBomLines = rows.length;
  const resolvedCount = useMemo(() => rows.filter((r) => r.reviewStatus === 'Resolved').length, [rows]);
  const needAttentionCount = totalBomLines - resolvedCount;

  // Widget badge counts
  const widgetCounts = useMemo(() => {
    return {
      all: viewMode === 'action_required' ? needAttentionCount : totalBomLines,
      newMtItem: rows.filter((r) => r.actionRequired === 'New MT Item' || r.bcStatus === 'No Match' || r.mtItemNo === '—').length,
      duplicateItem: rows.filter((r) => r.isDuplicate || r.actionRequired === 'Select MT Item' || r.matchType === 'Multiple Matches' || r.bcStatus === 'Conflict').length,
      missingMpn: rows.filter((r) => r.isCustomerMpnMissing).length,
      eol: rows.filter((r) => r.lifecycle === 'EOL' || r.lifecycle === 'Obsolete').length,
      alternative: rows.filter((r) => r.actionRequired === 'Alternative Review' || r.bcStatus === 'Alternative Available' || (r.alternative && r.alternative !== '—' && !r.alternative.includes('None'))).length,
      resolved: rows.filter((r) => r.reviewStatus === 'Resolved').length,
    };
  }, [rows, viewMode, needAttentionCount, totalBomLines]);

  // Filter logic across all dimensions
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // 1. Text Search across Position, Customer Mfr, Customer MPN, Validated Mfr, Validated MPN, MT Item, Description
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          row.position.toLowerCase().includes(q) ||
          row.originalMfr.toLowerCase().includes(q) ||
          row.validatedMfr.toLowerCase().includes(q) ||
          row.originalMpn.toLowerCase().includes(q) ||
          row.validatedMpn.toLowerCase().includes(q) ||
          row.mtItemNo.toLowerCase().includes(q) ||
          row.description.toLowerCase().includes(q) ||
          row.bcDescription.toLowerCase().includes(q);

        if (!matchesQuery) return false;
      }

      // 2. View Mode (when activeChip is 'All')
      if (activeChip === 'All') {
        if (viewMode === 'action_required') {
          return row.reviewStatus !== 'Resolved';
        }
        return true;
      }

      // 3. Sub-filter Chips
      switch (activeChip) {
        case 'Resolved':
          return row.reviewStatus === 'Resolved';
        case 'Needs Action':
          return row.reviewStatus !== 'Resolved';
        case 'NEW MT Item':
          return row.actionRequired === 'New MT Item' || row.bcStatus === 'No Match' || row.mtItemNo === '—';
        case 'Duplicate Item':
          return (
            row.isDuplicate ||
            row.actionRequired === 'Select MT Item' ||
            row.matchType === 'Multiple Matches' ||
            row.bcStatus === 'Conflict'
          );
        case 'Missing MPN':
          return row.isCustomerMpnMissing;
        case 'EOL':
          return row.lifecycle === 'EOL' || row.lifecycle === 'Obsolete';
        case 'Alternative':
          return (
            row.actionRequired === 'Alternative Review' ||
            row.bcStatus === 'Alternative Available' ||
            (row.alternative && row.alternative !== '—' && !row.alternative.includes('None'))
          );
        default:
          return true;
      }
    });
  }, [rows, viewMode, searchQuery, activeChip]);

  // Drawer handlers
  const handleOpenReviewDrawer = (row: BomReviewRow) => {
    setSelectedDrawerRow(row);
    if (row.possibleMatches && row.possibleMatches.length > 0) {
      setSelectedMatchOption(row.possibleMatches[0].id);
    }
  };

  const handleCloseDrawer = () => {
    setSelectedDrawerRow(null);
  };

  // Specific Business Actions (Instant in-place resolution)
  const handleApplyRowAction = (
    rowId: string,
    actionType: 'PREPARE_NEW_MT' | 'SELECT_MT' | 'PROPOSE_ALT' | 'KEEP_ORIGINAL' | 'EDIT_DATA' | 'MANUAL_REVIEW',
    overrideParam?: string
  ) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;

        let newDecision = r.decision;
        let newStatus: BomReviewRow['reviewStatus'] = 'Resolved';
        let newAction: BomReviewRow['actionRequired'] = 'None';
        let newMtItem = r.mtItemNo;
        let newBcStatus = r.bcStatus;

        if (actionType === 'PREPARE_NEW_MT') {
          newDecision = 'Prepare New MT Item (ERP Sync)';
          newStatus = 'Resolved';
          newAction = 'None';
          newMtItem = `MT-NEW-${r.position.replace(/[^A-Za-z0-9]/g, '')}`;
          newBcStatus = 'Existing Item';
        } else if (actionType === 'SELECT_MT') {
          const chosen = overrideParam || selectedMatchOption;
          newDecision = `Selected ${chosen}`;
          newStatus = 'Resolved';
          newAction = 'None';
          newMtItem = chosen;
          newBcStatus = 'Existing Item';
        } else if (actionType === 'PROPOSE_ALT') {
          newDecision = 'Alternative Approved (MT-6732)';
          newStatus = 'Resolved';
          newAction = 'None';
          newMtItem = 'MT-6732';
          newBcStatus = 'Existing Item';
        } else if (actionType === 'KEEP_ORIGINAL') {
          newDecision = `Keep Original Customer Part (${r.originalMpn})`;
          newStatus = 'Resolved';
          newAction = 'None';
          newMtItem = 'MT-STOCK-DIRECT';
          newBcStatus = 'Existing Item';
        } else if (actionType === 'EDIT_DATA') {
          const info = overrideParam || manualClarificationInput;
          newDecision = `Clarified: ${info}`;
          newStatus = 'Resolved';
          newAction = 'None';
          newMtItem = 'MT-3080';
          newBcStatus = 'Existing Item';
        } else if (actionType === 'MANUAL_REVIEW') {
          newDecision = 'Engineering Review Assigned';
          newStatus = 'Resolved';
          newAction = 'None';
        }

        return {
          ...r,
          reviewStatus: newStatus,
          actionRequired: newAction,
          decision: newDecision,
          mtItemNo: newMtItem,
          bcStatus: newBcStatus,
        };
      })
    );

    showToast(`Action applied for position ${selectedDrawerRow?.position || 'item'}. Marked Resolved.`);
    handleCloseDrawer();
  };

  // Direct Inline Action for quick table interactions
  const handleInlineQuickAction = (row: BomReviewRow) => {
    if (row.actionRequired === 'New MT Item') {
      handleApplyRowAction(row.id, 'PREPARE_NEW_MT');
    } else if (row.actionRequired === 'Select MT Item') {
      const defaultCandidate = row.possibleMatches?.[0]?.id || 'MT-2201';
      handleApplyRowAction(row.id, 'SELECT_MT', defaultCandidate);
    } else if (row.actionRequired === 'Alternative Review') {
      handleApplyRowAction(row.id, 'PROPOSE_ALT');
    } else {
      handleOpenReviewDrawer(row);
    }
  };

  const handleSaveProgress = () => {
    showToast(`BOM Review state saved successfully. (${resolvedCount} of ${totalBomLines} rows resolved)`);
  };

  // Download Finalized BOM Feature (CSV ready to be sent to the customer)
  const handleDownloadFinalizedBom = () => {
    const csvHeader = [
      'Position',
      'Description',
      'Value',
      'Package',
      'Qty',
      'ABC Class',
      'Customer Original Mfr',
      'Customer Original MPN',
      'SiliconExpert Validated Mfr',
      'SiliconExpert Validated MPN',
      'SE Category',
      'Lifecycle Status',
      'RoHS Status',
      'Alternative Part',
      'SiliconExpert Price',
      'SiliconExpert Lead Time',
      'Micro Technic Item No',
      'BC Description',
      'Match Type',
      'BC Status',
    ].join(',');

    const csvContent = rows
      .map((r) => {
        const originalMpnClean = r.isCustomerMpnMissing ? '[Unspecified in Customer BOM]' : r.originalMpn;
        const originalMfrClean = r.originalMfr === '—' ? '[Unspecified]' : r.originalMfr;
        const seDetails = getSePricingAndLeadTime(r);
        return [
          `"${r.position}"`,
          `"${(r.description || '').replace(/"/g, '""')}"`,
          `"${(r.value || '').replace(/"/g, '""')}"`,
          `"${(r.package || '').replace(/"/g, '""')}"`,
          r.qty,
          `"${r.abc}"`,
          `"${originalMfrClean.replace(/"/g, '""')}"`,
          `"${originalMpnClean.replace(/"/g, '""')}"`,
          `"${(r.validatedMfr || '').replace(/"/g, '""')}"`,
          `"${(r.validatedMpn || '').replace(/"/g, '""')}"`,
          `"${(r.seCategory || '').replace(/"/g, '""')}"`,
          `"${r.lifecycle}"`,
          `"${r.rohs}"`,
          `"${(r.alternative || '').replace(/"/g, '""')}"`,
          `"${seDetails.price}"`,
          `"${seDetails.leadTime}"`,
          `"${r.mtItemNo}"`,
          `"${(r.bcDescription || '').replace(/"/g, '""')}"`,
          `"${r.matchType}"`,
          `"${r.bcStatus}"`,
        ].join(',');
      })
      .join('\n');

    const blob = new Blob([csvHeader + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Micro_Technic_Finalized_BOM_${productName.replace(/\s+/g, '_')}_${revision}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportModal(true);
    showToast('Finalized BOM downloaded successfully. Ready to send to customer.');
  };

  const isWholeBomView = activeChip === 'All';

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-xl text-xs border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Export Confirmation Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Finalized BOM Saved & Exported</h3>
                  <p className="text-xs text-slate-500">File downloaded and BOM successfully saved to Business Central</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">File Name:</span>
                <span className="font-mono font-semibold text-slate-900">
                  Micro_Technic_Finalized_BOM_{productName.replace(/\s+/g, '_')}_{revision}.csv
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Total Components:</span>
                <span className="font-semibold text-slate-900">{totalBomLines} BOM Lines</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Resolved Lines:</span>
                <span className="font-semibold text-emerald-700">{resolvedCount} Lines</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Enriched Missing MPNs:</span>
                <span className="font-semibold text-cyan-700">31 Positions Mapped</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">SiliconExpert Enrichment:</span>
                <span className="font-semibold text-slate-900">Indicative Pricing & Lead Times Included</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              The finalized BOM contains full customer positions, SiliconExpert lifecycle/RoHS validations, indicative prices,
              lead times, and matched Micro Technic ERP item numbers.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExportModal(false);
                  if (onSaveAndFinish) {
                    onSaveAndFinish();
                  } else if (onContinueToFinalBom) {
                    onContinueToFinalBom();
                  }
                }}
                className="px-4 py-2 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save & Return to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">BOM Review</h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Review the fully enriched BOM and resolve only the rows that still require attention.
            SiliconExpert and Business Central have already resolved compliant and rule-matched lines.
          </p>
        </div>

        {/* Header Action */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleDownloadFinalizedBom}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            title="Download the customer-ready finalized BOM with SiliconExpert pricing and lead times"
          >
            <Download className="w-4 h-4" />
            <span>Download Finalized BOM</span>
          </button>
        </div>
      </div>

      {/* Primary Filter Bar: Dual View Options (Action Required Data [DEFAULT] vs Show Full BOM) & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        {/* Filter Toggle: Action Required Data (DEFAULT) and Show Full BOM */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          {/* Option 1: Action Required Data (DEFAULT) */}
          <button
            type="button"
            onClick={() => {
              setViewMode('action_required');
              setActiveChip('All');
            }}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'action_required'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
            title="Show only components that require engineering decisions or action"
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${viewMode === 'action_required' ? 'text-white' : 'text-amber-600'}`} />
            <span>Action Required Data</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                viewMode === 'action_required' ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {needAttentionCount}
            </span>
          </button>

          {/* Option 2: Show Full BOM */}
          <button
            type="button"
            onClick={() => {
              setViewMode('full_bom');
              setActiveChip('All');
            }}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'full_bom'
                ? 'bg-[#2465A1] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
            title="Display all components in the full bill of materials"
          >
            <FileSpreadsheet className={`w-3.5 h-3.5 ${viewMode === 'full_bom' ? 'text-white' : 'text-[#2465A1]'}`} />
            <span>Show Full BOM</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                viewMode === 'full_bom' ? 'bg-[#184672] text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {totalBomLines}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px] sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Position / Manufacturer / MPN / MT Item"
            className="w-full pl-8.5 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Filter Widgets Grid */}
      <div
        className={`grid gap-3 ${
          viewMode === 'full_bom'
            ? 'grid-cols-2 sm:grid-cols-4 md:grid-cols-7'
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6'
        }`}
      >
        {[
          {
            id: 'All' as FilterChip,
            title: viewMode === 'action_required' ? 'All Action Items' : 'All BOM Items',
            count: widgetCounts.all,
            subtitle: viewMode === 'action_required' ? 'Items needing attention' : 'Complete 112 BOM lines',
            icon: Layers,
            activeColor: 'border-slate-800 text-slate-900 bg-slate-50/50',
            indicatorColor: 'bg-slate-700',
          },
          {
            id: 'NEW MT Item' as FilterChip,
            title: 'NEW MT Item',
            count: widgetCounts.newMtItem,
            subtitle: 'No BC item in ERP',
            icon: PlusCircle,
            activeColor: 'border-cyan-600 text-cyan-900 bg-cyan-50/50',
            indicatorColor: 'bg-cyan-600',
          },
          {
            id: 'Duplicate Item' as FilterChip,
            title: 'Duplicate Item',
            count: widgetCounts.duplicateItem,
            subtitle: 'Multiple BC candidates',
            icon: Copy,
            activeColor: 'border-blue-600 text-blue-900 bg-blue-50/50',
            indicatorColor: 'bg-blue-600',
          },
          {
            id: 'Missing MPN' as FilterChip,
            title: 'Missing MPN',
            count: widgetCounts.missingMpn,
            subtitle: 'Enriched via SE',
            icon: HelpCircle,
            activeColor: 'border-amber-600 text-amber-900 bg-amber-50/50',
            indicatorColor: 'bg-amber-600',
          },
          {
            id: 'EOL' as FilterChip,
            title: 'EOL / Obsolete',
            count: widgetCounts.eol,
            subtitle: 'Lifecycle alerts',
            icon: AlertTriangle,
            activeColor: 'border-rose-600 text-rose-900 bg-rose-50/50',
            indicatorColor: 'bg-rose-600',
          },
          {
            id: 'Alternative' as FilterChip,
            title: 'Alternative',
            count: widgetCounts.alternative,
            subtitle: 'Cross-ref suggested',
            icon: Sparkles,
            activeColor: 'border-purple-600 text-purple-900 bg-purple-50/50',
            indicatorColor: 'bg-purple-600',
          },
          ...(viewMode === 'full_bom'
            ? [
                {
                  id: 'Resolved' as FilterChip,
                  title: 'Resolved',
                  count: widgetCounts.resolved,
                  subtitle: 'Clean matches',
                  icon: CheckCircle2,
                  activeColor: 'border-emerald-600 text-emerald-900 bg-emerald-50/50',
                  indicatorColor: 'bg-emerald-600',
                },
              ]
            : []),
        ].map((widget) => {
          const isSelected = activeChip === widget.id;
          const Icon = widget.icon;

          return (
            <button
              key={widget.id}
              type="button"
              onClick={() => setActiveChip(widget.id)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? `border-2 shadow-sm ring-2 ring-slate-900/10 ${widget.activeColor}`
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <span className={`text-[11px] font-bold truncate ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                  {widget.title}
                </span>
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`} />
              </div>

              <div className="mt-2 flex items-baseline justify-between w-full">
                <span className="text-xl font-bold font-mono tracking-tight text-slate-900">
                  {widget.count}
                </span>
                {isSelected && (
                  <span className={`w-2 h-2 rounded-full ${widget.indicatorColor}`}></span>
                )}
              </div>

              <span className="text-[10px] text-slate-500 mt-0.5 truncate block">
                {widget.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Helper Banner for Missing MPN filtering */}
      {activeChip === 'Missing MPN' && (
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Missing Customer MPN Lines (31 Items):</strong> Displaying original customer components with
              missing MPN, enriched with <strong>SiliconExpert manufacturer/part number</strong> and matched{' '}
              <strong>Business Central internal MT Item numbers</strong>.
            </span>
          </div>
          <span className="font-semibold text-amber-800 text-[11px] shrink-0 ml-3">
            Enriched via SE + BC Rules
          </span>
        </div>
      )}

      {/* Helper Banner for Duplicate Item filtering */}
      {activeChip === 'Duplicate Item' && (
        <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Copy className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Duplicate / Multiple Match Items:</strong> Showing lines where multiple candidate parts exist in
              Business Central ERP. Review and select the approved Micro Technic standard item.
            </span>
          </div>
        </div>
      )}

      {/* Helper Banner for NEW MT Item filtering */}
      {activeChip === 'NEW MT Item' && (
        <div className="p-3 bg-cyan-50/80 border border-cyan-200 rounded-lg text-xs text-cyan-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>
              <strong>NEW MT Item Candidates:</strong> Validated customer components that do not currently exist in
              Business Central ERP. Click <strong>+ Create NEW MT Item</strong> to initiate ERP part number creation.
            </span>
          </div>
        </div>
      )}

      {/* MAIN EXCEL-STYLE TABLE */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            {/* Visual Grouped Header Area */}
            <thead>
              <tr className="border-b border-slate-300 text-[11px] font-bold uppercase tracking-wider select-none">
                {/* GROUP 1 Header */}
                <th
                  colSpan={8}
                  className="bg-slate-100 text-slate-800 py-2 px-3 border-r-2 border-slate-300 font-semibold sticky top-0 z-30"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500 inline-block"></span>
                    <span>GROUP 1 — CUSTOMER BOM</span>
                  </div>
                </th>

                {/* GROUP 2 Header */}
                <th
                  colSpan={8}
                  className="bg-cyan-50/70 text-cyan-900 py-2 px-3 border-r-2 border-slate-300 font-semibold sticky top-0 z-30"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-600 inline-block"></span>
                    <span>GROUP 2 — SILICONEXPERT ENRICHMENT</span>
                  </div>
                </th>

                {/* GROUP 3 Header */}
                <th
                  colSpan={5}
                  className="bg-blue-50/70 text-blue-900 py-2 px-3 border-r-2 border-slate-300 font-semibold sticky top-0 z-30"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                    <span>GROUP 3 — BUSINESS CENTRAL MATCHING</span>
                  </div>
                </th>

                {/* GROUP 4 Header: Review Status */}
                <th
                  colSpan={2}
                  className="bg-emerald-50/80 text-emerald-950 py-2 px-3 font-semibold sticky top-0 z-30"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                    <span>GROUP 4 — REVIEW STATUS</span>
                  </div>
                </th>
              </tr>

              {/* Individual Column Headers */}
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px] sticky top-[33px] z-30">
                {/* Group 1 Columns */}
                <th className="py-2.5 px-3 border-r border-slate-200 w-24">
                  Position
                </th>
                <th className="py-2.5 px-3 border-r border-slate-200 min-w-[200px] max-w-[240px]">
                  Description
                </th>
                <th className="py-2.5 px-3 border-r border-slate-200 min-w-[100px]">Value</th>
                <th className="py-2.5 px-3 border-r border-slate-200">Package</th>
                <th className="py-2.5 px-2.5 text-center border-r border-slate-200">Qty</th>
                <th className="py-2.5 px-3 border-r border-slate-200">Original Mfr</th>
                <th className="py-2.5 px-3 border-r border-slate-200">Original MPN</th>
                <th className="py-2.5 px-2.5 text-center border-r-2 border-slate-300">ABC</th>

                {/* Group 2 Columns: SiliconExpert Enrichment */}
                <th className="py-2.5 px-3 border-r border-slate-200 bg-cyan-50/30">Validated Mfr</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-cyan-50/30">Validated MPN (SE Part)</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-cyan-50/30">SE Category</th>
                <th className="py-2.5 px-2.5 text-center border-r border-slate-200 bg-cyan-50/30">Lifecycle</th>
                <th className="py-2.5 px-2.5 text-center border-r border-slate-200 bg-cyan-50/30">RoHS</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-cyan-50/30">Alternative</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-cyan-50/30 font-semibold">Indicative Price</th>
                <th className="py-2.5 px-2.5 text-center border-r-2 border-slate-300 bg-cyan-50/30 font-semibold">Lead Time</th>

                {/* Group 3 Columns: Business Central Matching */}
                <th className="py-2.5 px-3 border-r border-slate-200 bg-blue-50/30 font-bold">MT Item No.</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-blue-50/30">BC Description</th>
                <th className="py-2.5 px-2.5 text-center border-r border-slate-200 bg-blue-50/30">BC Category</th>
                <th className="py-2.5 px-3 border-r border-slate-200 bg-blue-50/30">Match Type</th>
                <th className="py-2.5 px-3 border-r-2 border-slate-300 bg-blue-50/30">BC Status</th>

                {/* Group 4 Columns: Review Status */}
                <th className="py-2.5 px-3 border-r border-slate-200 bg-emerald-50/30">Review Status</th>
                <th className="py-2.5 px-3 bg-emerald-50/30">Action Required</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={23} className="py-12 text-center text-slate-500">
                    <p className="font-medium">No BOM lines match your search or filter.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveChip('All');
                      }}
                      className="mt-2 text-cyan-600 hover:underline text-xs font-semibold cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const isResolved = row.reviewStatus === 'Resolved';
                  const needsAction = !isResolved;

                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors font-sans ${
                        needsAction
                          ? 'bg-amber-50/20 hover:bg-amber-50/40'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* GROUP 1: CUSTOMER BOM */}
                      {/* Position */}
                      <td className="py-2 px-3 font-semibold text-slate-900 border-r border-slate-200 w-24">
                        <span className="font-mono text-xs">{row.position}</span>
                      </td>

                      {/* Description */}
                      <td
                        className="py-2 px-3 text-slate-800 border-r border-slate-200 min-w-[200px] max-w-[240px] truncate"
                        title={row.description}
                      >
                        {row.description}
                      </td>

                      {/* Value */}
                      <td className="py-2 px-3 text-slate-700 border-r border-slate-200 font-mono text-[11px] min-w-[100px]">
                        {row.value || '—'}
                      </td>

                      {/* Package */}
                      <td
                        className="py-2 px-3 text-slate-600 border-r border-slate-200 max-w-[140px] truncate"
                        title={row.package}
                      >
                        {row.package || '—'}
                      </td>

                      {/* Qty */}
                      <td className="py-2 px-2.5 text-center text-slate-700 border-r border-slate-200 font-mono">
                        {row.qty}
                      </td>

                      {/* Original Mfr */}
                      <td
                        className="py-2 px-3 text-slate-700 border-r border-slate-200 max-w-[140px] truncate"
                        title={row.originalMfr}
                      >
                        {row.originalMfr === '—' ? (
                          <span className="text-slate-400 italic">—</span>
                        ) : (
                          row.originalMfr
                        )}
                      </td>

                      {/* Original MPN: Highlight if Missing */}
                      <td
                        className="py-2 px-3 border-r border-slate-200 font-mono text-[11px] max-w-[170px] truncate"
                        title={row.originalMpn}
                      >
                        {row.isCustomerMpnMissing ? (
                          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-medium border border-amber-200">
                            Missing in BOM
                          </span>
                        ) : (
                          <span className="text-slate-800">{row.originalMpn}</span>
                        )}
                      </td>

                      {/* ABC */}
                      <td className="py-2 px-2.5 text-center border-r-2 border-slate-300">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            row.abc === 'A'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : row.abc === 'B'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {row.abc}
                        </span>
                      </td>

                      {/* GROUP 2: SILICONEXPERT ENRICHMENT */}
                      {/* Validated Mfr */}
                      <td className="py-2 px-3 text-slate-700 border-r border-slate-200 bg-cyan-50/10">
                        {row.validatedMfr === '—' ? (
                          <span className="text-slate-400 italic">—</span>
                        ) : row.validatedMfr === 'Ambiguous' ? (
                          <span className="text-amber-700 font-medium">Ambiguous</span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-slate-800">{row.validatedMfr}</span>
                            {row.isCustomerMpnMissing && (
                              <span className="text-[9px] px-1 bg-cyan-100 text-cyan-800 rounded font-semibold">
                                SE
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Validated MPN: Highlight SE Part if customer MPN was missing */}
                      <td className="py-2 px-3 border-r border-slate-200 bg-cyan-50/10 font-mono text-[11px]">
                        {row.validatedMpn === '—' ? (
                          <span className="text-slate-400 italic">—</span>
                        ) : row.isCustomerMpnMissing ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-cyan-900 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">
                              {row.validatedMpn}
                            </span>
                            <span className="text-[9px] text-cyan-700 font-medium mt-0.5">
                              SE Identified Part
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-800">{row.validatedMpn}</span>
                        )}
                      </td>

                      {/* SE Category */}
                      <td className="py-2 px-3 text-slate-600 border-r border-slate-200 bg-cyan-50/10 text-[11px]">
                        {row.seCategory}
                      </td>

                      {/* Lifecycle */}
                      <td className="py-2 px-2.5 text-center border-r border-slate-200 bg-cyan-50/10">
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-medium ${
                            row.lifecycle === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : row.lifecycle === 'EOL' || row.lifecycle === 'Obsolete'
                              ? 'bg-rose-100 text-rose-800 font-bold border border-rose-300'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {row.lifecycle}
                        </span>
                      </td>

                      {/* RoHS */}
                      <td className="py-2 px-2.5 text-center border-r border-slate-200 bg-cyan-50/10 text-[11px]">
                        {row.rohs === 'Compliant' ? (
                          <span className="text-emerald-700 font-medium">Compliant</span>
                        ) : (
                          <span className="text-slate-400 italic">{row.rohs}</span>
                        )}
                      </td>

                      {/* Alternative */}
                      <td className="py-2 px-3 border-r border-slate-200 bg-cyan-50/10 text-slate-700 font-mono text-[11px]">
                        {row.alternative !== '—' && !row.alternative.includes('None') ? (
                          <span className="text-purple-700 font-semibold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                            {row.alternative}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>

                      {/* Indicative Price */}
                      <td className="py-2 px-3 border-r border-slate-200 bg-cyan-50/10 font-mono text-[11px] text-slate-800">
                        <span className="font-semibold text-slate-900">{row.indicativePrice || getSePricingAndLeadTime(row).price}</span>
                      </td>

                      {/* Lead Time */}
                      <td className="py-2 px-2.5 text-center border-r-2 border-slate-300 bg-cyan-50/10 text-[11px] text-slate-700">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-medium">
                          {row.leadTime || getSePricingAndLeadTime(row).leadTime}
                        </span>
                      </td>

                      {/* GROUP 3: BUSINESS CENTRAL MATCHING */}
                      {/* MT Item No (Internal Part Number) */}
                      <td className="py-2 px-3 border-r border-slate-200 bg-blue-50/10 font-mono font-bold">
                        {row.mtItemNo !== '—' ? (
                          <div className="flex flex-col">
                            <span className="text-slate-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 inline-block">
                              {row.mtItemNo}
                            </span>
                            {row.isCustomerMpnMissing && (
                              <span className="text-[9px] text-blue-600 font-medium mt-0.5">
                                Internal Part
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[10px] font-semibold">
                            No MT Item
                          </span>
                        )}
                      </td>

                      {/* BC Description */}
                      <td
                        className="py-2 px-3 border-r border-slate-200 bg-blue-50/10 text-slate-700 max-w-[170px] truncate"
                        title={row.bcDescription}
                      >
                        {row.bcDescription || <span className="text-slate-400 italic">—</span>}
                      </td>

                      {/* BC Category */}
                      <td className="py-2 px-2.5 text-center border-r border-slate-200 bg-blue-50/10 font-mono text-[11px] text-slate-600">
                        {row.bcCategory || '—'}
                      </td>

                      {/* Match Type */}
                      <td className="py-2 px-3 border-r border-slate-200 bg-blue-50/10 text-slate-700 text-[11px]">
                        <span className="text-slate-800 font-medium">{row.matchType}</span>
                      </td>

                      {/* BC Status */}
                      <td className="py-2 px-3 border-r-2 border-slate-300 bg-blue-50/10">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            row.bcStatus === 'Existing Item'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : row.bcStatus === 'Rule Match'
                              ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                              : row.bcStatus === 'Alternative Available'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : row.bcStatus === 'Conflict'
                              ? 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {row.bcStatus}
                        </span>
                      </td>

                      {/* GROUP 4: REVIEW STATUS */}
                      {/* Review Status */}
                      <td className="py-2 px-3 border-r border-slate-200 bg-emerald-50/10">
                        {isResolved ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Resolved</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-800 font-semibold text-xs">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>{row.reviewStatus}</span>
                          </span>
                        )}
                      </td>

                      {/* Action Required */}
                      <td className="py-2 px-3 bg-emerald-50/10 text-slate-700">
                        {row.actionRequired !== 'None' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenReviewDrawer(row)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors cursor-pointer shadow-2xs"
                            title="Click to review and resolve this component"
                          >
                            <span>{row.actionRequired}</span>
                            <ChevronRight className="w-3 h-3 text-amber-700" />
                          </button>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">None</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {onSaveAndFinish && (
          <button
            type="button"
            onClick={onSaveAndFinish}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] rounded-md shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Finish Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ROW DETAIL DRAWER (SLIDE-OVER ON REVIEW CLICK) */}
      {selectedDrawerRow && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={handleCloseDrawer}
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col h-full border-l border-slate-200 z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200">
                  {selectedDrawerRow.actionRequired}
                </span>
                <h2 className="text-sm font-bold text-slate-900">
                  Review Position {selectedDrawerRow.position}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* SECTION: WHY IS THIS FLAGGED? */}
              <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>WHY IS THIS FLAGGED?</span>
                </div>
                <p className="text-amber-950 text-xs leading-relaxed">
                  {selectedDrawerRow.flagReason ||
                    'This component requires an engineering or procurement decision before finalising the BOM.'}
                </p>
              </div>

              {/* 1. CUSTOMER BOM */}
              <div className="border border-slate-200 rounded-lg p-3.5 space-y-2 bg-slate-50/50">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block border-b border-slate-200 pb-1">
                  CUSTOMER BOM
                </span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-500">Position:</span>{' '}
                    <span className="font-semibold text-slate-800 font-mono">
                      {selectedDrawerRow.position}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Quantity:</span>{' '}
                    <span className="font-semibold text-slate-800 font-mono">
                      {selectedDrawerRow.qty}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Description:</span>{' '}
                    <span className="font-medium text-slate-900">
                      {selectedDrawerRow.description}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Value:</span>{' '}
                    <span className="font-mono text-slate-800">
                      {selectedDrawerRow.value || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Package:</span>{' '}
                    <span className="text-slate-800">{selectedDrawerRow.package}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Original Mfr:</span>{' '}
                    <span className="text-slate-800 font-medium">
                      {selectedDrawerRow.originalMfr || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Original MPN:</span>{' '}
                    {selectedDrawerRow.isCustomerMpnMissing ? (
                      <span className="text-amber-800 font-bold bg-amber-100 px-1.5 py-0.2 rounded text-[11px]">
                        Missing in BOM
                      </span>
                    ) : (
                      <span className="font-mono text-slate-800">
                        {selectedDrawerRow.originalMpn || '—'}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500">ABC Class:</span>{' '}
                    <span className="font-bold text-slate-800">
                      Class {selectedDrawerRow.abc}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. SILICONEXPERT */}
              <div className="border border-slate-200 rounded-lg p-3.5 space-y-2 bg-cyan-50/30">
                <span className="font-bold text-cyan-900 text-[11px] uppercase tracking-wider block border-b border-cyan-200/60 pb-1">
                  SILICONEXPERT ENRICHMENT
                </span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-500">Validated Mfr:</span>{' '}
                    <span className="font-semibold text-slate-900">
                      {selectedDrawerRow.validatedMfr || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Validated MPN:</span>{' '}
                    <span className="font-mono font-semibold text-slate-900">
                      {selectedDrawerRow.validatedMpn || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Category:</span>{' '}
                    <span className="text-slate-800">{selectedDrawerRow.seCategory}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Lifecycle:</span>{' '}
                    <span
                      className={`font-semibold ${
                        selectedDrawerRow.lifecycle === 'EOL' || selectedDrawerRow.lifecycle === 'Obsolete'
                          ? 'text-rose-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {selectedDrawerRow.lifecycle}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">RoHS:</span>{' '}
                    <span className="text-slate-800">{selectedDrawerRow.rohs}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Alternative:</span>{' '}
                    <span className="font-mono text-purple-800 font-semibold">
                      {selectedDrawerRow.alternative || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Indicative Price:</span>{' '}
                    <span className="font-mono font-semibold text-slate-900">
                      {selectedDrawerRow.indicativePrice || getSePricingAndLeadTime(selectedDrawerRow).price}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Lead Time:</span>{' '}
                    <span className="font-semibold text-slate-800">
                      {selectedDrawerRow.leadTime || getSePricingAndLeadTime(selectedDrawerRow).leadTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. BUSINESS CENTRAL */}
              <div className="border border-slate-200 rounded-lg p-3.5 space-y-2 bg-blue-50/30">
                <span className="font-bold text-blue-900 text-[11px] uppercase tracking-wider block border-b border-blue-200/60 pb-1">
                  BUSINESS CENTRAL MATCHING
                </span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-500">MT Item No.:</span>{' '}
                    <span className="font-mono font-bold text-slate-900">
                      {selectedDrawerRow.mtItemNo || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span>{' '}
                    <span className="font-medium text-slate-800">
                      {selectedDrawerRow.bcStatus}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">BC Description:</span>{' '}
                    <span className="text-slate-800">
                      {selectedDrawerRow.bcDescription || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Category:</span>{' '}
                    <span className="text-slate-800 font-mono">
                      {selectedDrawerRow.bcCategory || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Match Type:</span>{' '}
                    <span className="text-slate-800">
                      {selectedDrawerRow.matchType}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION: WHAT SHOULD HAPPEN? (Action Choices) */}
              <div className="border border-cyan-200 bg-cyan-50/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-cyan-600" />
                  <span>WHAT SHOULD HAPPEN?</span>
                </div>

                {/* Scenario 3: NO MT ITEM */}
                {selectedDrawerRow.drawerType === 'NO_MT_ITEM' && (
                  <div className="space-y-3">
                    <p className="text-slate-600 text-xs">
                      The customer-specified component ({selectedDrawerRow.validatedMpn}) is valid in SiliconExpert,
                      but does not yet exist in Micro Technic's Business Central catalogue.
                    </p>
                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApplyRowAction(selectedDrawerRow.id, 'PREPARE_NEW_MT')}
                        className="w-full py-2.5 px-3 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white font-semibold rounded-md text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Prepare New MT Item in BC</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyRowAction(selectedDrawerRow.id, 'MANUAL_REVIEW')}
                        className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-md text-xs border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Keep for Manual Review</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Scenario 4: MULTIPLE MATCHES / DUPLICATE ITEM */}
                {selectedDrawerRow.drawerType === 'MULTIPLE_MATCH' && (
                  <div className="space-y-3">
                    <p className="text-slate-600 text-xs">
                      Select which existing Micro Technic item should be assigned to this requirement:
                    </p>

                    <div className="space-y-2 bg-white p-3 rounded border border-slate-200">
                      {selectedDrawerRow.possibleMatches?.map((match) => (
                        <label
                          key={match.id}
                          className={`flex items-start gap-2.5 p-2 rounded cursor-pointer border transition-colors ${
                            selectedMatchOption === match.id
                              ? 'bg-sky-50/70 border-[#2568A3]'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="matchOption"
                            checked={selectedMatchOption === match.id}
                            onChange={() => setSelectedMatchOption(match.id)}
                            className="mt-0.5 text-[#2568A3] focus:ring-[#2568A3]"
                          />
                          <div className="text-xs">
                            <span className="font-mono font-bold text-slate-900">{match.id}</span>
                            <span className="text-slate-600"> — {match.name}</span>
                            <span className="block text-[11px] text-slate-400">
                              Mfr: {match.mfr} · MPN: {match.mpn}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApplyRowAction(selectedDrawerRow.id, 'SELECT_MT')}
                        className="w-full py-2.5 px-3 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white font-semibold rounded-md text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Use Selected MT Item ({selectedMatchOption})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyRowAction(selectedDrawerRow.id, 'MANUAL_REVIEW')}
                        className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-md text-xs border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Keep for Manual Review</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Scenario 5: MISSING / UNCLEAR DATA */}
                {selectedDrawerRow.drawerType === 'MISSING_DATA' && (
                  <div className="space-y-3">
                    <p className="text-slate-600 text-xs">
                      Customer data lacks complete manufacturer part number specification. Clarify component:
                    </p>

                    <div className="space-y-1.5 bg-white p-3 rounded border border-slate-200">
                      <label className="text-[11px] font-semibold text-slate-700 block">
                        Specify Manufacturer & MPN:
                      </label>
                      <input
                        type="text"
                        value={manualClarificationInput}
                        onChange={(e) => setManualClarificationInput(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#2568A3]"
                        placeholder="e.g. Diodes Incorporated / BAS70-04-7-F"
                      />
                      <span className="text-[10px] text-slate-400 block">
                        Will link to MT-3080 upon verification
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApplyRowAction(selectedDrawerRow.id, 'EDIT_DATA')}
                        className="w-full py-2.5 px-3 bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] text-white font-semibold rounded-md text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Accept Clarification & Resolve</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyRowAction(selectedDrawerRow.id, 'MANUAL_REVIEW')}
                        className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-md text-xs border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Keep for Manual Review</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Scenario 6: EOL / ALTERNATIVE */}
                {selectedDrawerRow.drawerType === 'EOL_ALTERNATIVE' && (
                  <div className="space-y-3">
                    <div className="p-2.5 rounded bg-purple-50 border border-purple-200 text-xs text-purple-900">
                      <span className="font-bold">Recommendation:</span> SiliconExpert confirmed active pin-compatible
                      replacement {selectedDrawerRow.alternative} registered in Business Central as{' '}
                      <span className="font-mono font-bold">{selectedDrawerRow.mtItemNo}</span>.
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApplyRowAction(selectedDrawerRow.id, 'PROPOSE_ALT')}
                        className="w-full py-2.5 px-3 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-md text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Use Active Alternative ({selectedDrawerRow.mtItemNo})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyRowAction(selectedDrawerRow.id, 'KEEP_ORIGINAL')}
                        className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-md text-xs border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Keep Original ({selectedDrawerRow.originalMpn})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyRowAction(selectedDrawerRow.id, 'MANUAL_REVIEW')}
                        className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-slate-600 font-medium rounded-md text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Keep for Manual Review</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                Clicking an action updates the row decision and increments the review progress.
              </span>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
