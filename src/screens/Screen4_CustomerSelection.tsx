import React, { useState, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  UserPlus,
  CheckCircle2,
  Hash,
  MapPin,
  UploadCloud,
  FileSpreadsheet,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { CUSTOMERS } from '../data/mockData';

export interface CombinedIntakePayload {
  customer: string;
  isNewCustomer: boolean;
  productName: string;
  revision: string;
  productionQty: number;
  fileName: string;
  situation: 'existing_approved' | 'existing_new_rev' | 'new_product';
  newCustomerDetails?: {
    companyName: string;
    contactName?: string;
  };
}

interface CustomerSelectionProps {
  onBack: () => void;
  onContinue: (data: CombinedIntakePayload) => void;
  initialCustomer?: string;
}

export const Screen4_CustomerSelection: React.FC<CustomerSelectionProps> = ({
  onBack,
  onContinue,
  initialCustomer = 'Danfoss Power Solutions',
}) => {
  // Mode: Existing vs New Customer
  const [customerType, setCustomerType] = useState<'existing' | 'new'>('existing');

  // Existing Customer State
  const [selectedCustomer, setSelectedCustomer] = useState(initialCustomer);

  // New Customer State
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newContactName, setNewContactName] = useState('');

  // Product Details (The 4 fields: Product Type, Product Name, BOM Revision, Product Quantity)
  const [productType, setProductType] = useState<'New Product / New BOM' | 'Existing Product'>('New Product / New BOM');
  const [productName, setProductName] = useState('Smart Hub');
  const [bomRevision, setBomRevision] = useState('0');
  const [productionQuantity, setProductionQuantity] = useState<string>('1,000');

  // BOM File Upload State
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    rows: number;
    columns: number;
    size: string;
  } | null>({
    name: 'Micro Technic BOM.xlsx',
    rows: 112,
    columns: 9,
    size: '142 KB',
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation
  const [touched, setTouched] = useState(false);

  // Active customer record
  const activeCustomerRecord = useMemo(() => {
    return CUSTOMERS.find((c) => c.name === selectedCustomer) || CUSTOMERS[0];
  }, [selectedCustomer]);

  // Handlers for file upload
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({
        name: file.name,
        rows: 112,
        columns: 9,
        size: `${Math.round(file.size / 1024)} KB`,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        rows: 112,
        columns: 9,
        size: `${Math.round(file.size / 1024)} KB`,
      });
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleQuantityChange = (val: string) => {
    const numericOnly = val.replace(/[^\d]/g, '');
    if (!numericOnly) {
      setProductionQuantity('');
      return;
    }
    setProductionQuantity(Number(numericOnly).toLocaleString('en-US'));
  };

  // Validation checks
  const isCustomerValid =
    customerType === 'existing'
      ? Boolean(selectedCustomer.trim())
      : Boolean(newCompanyName.trim());

  const isProductValid = Boolean(productName.trim());
  const isFileValid = Boolean(uploadedFile);

  const isFormValid = isCustomerValid && isProductValid && isFileValid;

  const handleProceed = () => {
    setTouched(true);
    if (!isFormValid) return;

    const parsedQty = Number(productionQuantity.replace(/[^\d]/g, '')) || 1000;
    const revFormatted = bomRevision.trim().startsWith('Rev') ? bomRevision.trim() : `Rev ${bomRevision.trim() || '0'}`;

    if (customerType === 'existing') {
      onContinue({
        customer: selectedCustomer,
        isNewCustomer: false,
        productName: productName.trim() || 'Smart Hub',
        revision: revFormatted,
        productionQty: parsedQty,
        fileName: uploadedFile?.name || 'Micro Technic BOM.xlsx',
        situation: productType === 'Existing Product' ? 'existing_new_rev' : 'new_product',
      });
    } else {
      onContinue({
        customer: newCompanyName.trim(),
        isNewCustomer: true,
        productName: productName.trim() || 'Smart Hub',
        revision: revFormatted,
        productionQty: parsedQty,
        fileName: uploadedFile?.name || 'Micro Technic BOM.xlsx',
        situation: 'new_product',
        newCustomerDetails: {
          companyName: newCompanyName.trim(),
          contactName: newContactName.trim() || undefined,
        },
      });
    }
  };

  return (
  <div className="w-full px-6 sm:px-8 lg:px-10 py-6 space-y-6">
    {/* 2. Title: "Who is this BOM for" (no badge, no description) */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Who is this BOM for
        </h1>
      </div>

      {/* 4 & 5. Customer Type Cards: No ERP Synced tag, no Onboarding tag, no subtitle text */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* EXISTING CUSTOMER CARD */}
        <button
          type="button"
          onClick={() => setCustomerType('existing')}
          className={`p-5 rounded-xl border text-left transition-all cursor-pointer relative flex items-center justify-between ${
            customerType === 'existing'
              ? 'border-[#2568A3] bg-[#2568A3]/10 ring-2 ring-[#2568A3]/20 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-[#2568A3]" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Existing Customer
              </div>
            </div>
          </div>
          {customerType === 'existing' && (
            <div className="text-[#2568A3]">
              <CheckCircle2 className="w-5 h-5 fill-[#2568A3] text-white" />
            </div>
          )}
        </button>

        {/* NEW CUSTOMER CARD */}
        <button
          type="button"
          onClick={() => setCustomerType('new')}
          className={`p-5 rounded-xl border text-left transition-all cursor-pointer relative flex items-center justify-between ${
            customerType === 'new'
              ? 'border-[#2568A3] bg-[#2568A3]/10 ring-2 ring-[#2568A3]/20 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5 text-[#2568A3]" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                New Customer
              </div>
            </div>
          </div>
          {customerType === 'new' && (
            <div className="text-[#2568A3]">
              <CheckCircle2 className="w-5 h-5 fill-[#2568A3] text-white" />
            </div>
          )}
        </button>
      </div>

      {/* SECTION 1 DETAILS: Existing or New Customer Fields */}
      {customerType === 'existing' ? (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          {/* 7. Rename to "Micro Technic Customer" */}
          {/* 9. Removed "Connected to Microsoft Dynamics 365 Business Central" */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Micro Technic Customer</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Customer <span className="text-rose-600">*</span>
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
              >
                {CUSTOMERS.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              {/* 8. Removed "4 verified corporate accounts available" */}
            </div>

            {/* Customer Details: 10. Removed "Historical Products 3 Registered PCBA(s)" */}
            <div className="md:col-span-2 bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-slate-500 flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Account ID
                  </div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">
                    {activeCustomerRecord.code}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {activeCustomerRecord.country}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Industry Segment</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {activeCustomerRecord.segment}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* NEW CUSTOMER INPUTS: 6. Removed "New Customer Intake & Product Onboarding" info banner */
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span>Customer Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="e.g. Nordic Robotics ApS"
                required
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-md text-slate-900 focus:bg-white focus:outline-none transition-colors ${
                  touched && !newCompanyName.trim()
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                }`}
              />
              {touched && !newCompanyName.trim() && (
                <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Please enter the company name.</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contact Name <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="e.g. Lars Møller"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 11. SECTION 2: PRODUCT DETAILS */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Product Details
          </div>
        </div>

        {customerType === 'existing' ? (
          /* Existing customer: 4 details (Product Type, Product Name, BOM Revision, Product Quantity) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Detail 1: Product Type dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Product Type <span className="text-rose-600">*</span>
              </label>
              <select
                value={productType}
                onChange={(e) => {
                  const val = e.target.value as 'New Product / New BOM' | 'Existing Product';
                  setProductType(val);
                  if (val === 'Existing Product' && productName === 'Smart Hub') {
                    setProductName('Smart Controller PCB');
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
              >
                <option value="New Product / New BOM">New Product / New BOM</option>
                <option value="Existing Product">Existing Product</option>
              </select>
            </div>

            {/* Detail 2: Product Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Product Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Smart Hub"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-md text-slate-900 focus:bg-white focus:outline-none transition-colors ${
                  touched && !productName.trim()
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                }`}
              />
              {touched && !productName.trim() && (
                <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Please enter or select a product.</span>
                </p>
              )}
            </div>

            {/* Detail 3: BOM Revision */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                BOM Revision
              </label>
              <input
                type="text"
                value={bomRevision}
                onChange={(e) => setBomRevision(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Detail 4: Product Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Product Quantity
              </label>
              <input
                type="text"
                value={productionQuantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                placeholder="1,000"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ) : (
          /* New customer: only 3 details (Product Name, Revision number, Product Quantity) */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Detail 1: Product Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Product Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Smart Hub"
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-md text-slate-900 focus:bg-white focus:outline-none transition-colors ${
                  touched && !productName.trim()
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                }`}
              />
              {touched && !productName.trim() && (
                <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Please enter a product name.</span>
                </p>
              )}
            </div>

            {/* Detail 2: Revision number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Revision Number
              </label>
              <input
                type="text"
                value={bomRevision}
                onChange={(e) => setBomRevision(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Detail 3: Product Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Product Quantity
              </label>
              <input
                type="text"
                value={productionQuantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                placeholder="1,000"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* 12. SECTION 3: BOM FILE --> Upload feature */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            BOM File
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!uploadedFile ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
              isDragging
                ? 'border-blue-600 bg-blue-50/50'
                : touched && !uploadedFile
                ? 'border-rose-400 bg-rose-50/20 hover:border-rose-500'
                : 'border-slate-300 bg-slate-50/50 hover:border-blue-500 hover:bg-blue-50/20'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6 stroke-[1.8]" />
            </div>

            <div className="text-sm font-semibold text-slate-800">
              Drag BOM file here
            </div>

            <div className="text-xs text-slate-400 my-1 font-medium">or</div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-1.5 text-xs font-semibold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-md transition-colors cursor-pointer shadow-2xs"
            >
              Browse File
            </button>

            <div className="text-[11px] text-slate-500 mt-3">
              Supported formats: XLSX, XLS, CSV
            </div>
          </div>
        ) : (
          <div className="border border-slate-200 bg-slate-50/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{uploadedFile.name}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="font-medium text-slate-700">
                    {uploadedFile.rows} rows detected
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="font-medium text-slate-700">
                    {uploadedFile.columns} columns detected
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200/80">
                    <CheckCircle2 className="w-3 h-3" />
                    Ready
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-xs font-medium text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-md hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        )}

        {touched && !uploadedFile && (
          <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" />
            <span>Please upload a BOM file.</span>
          </p>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          disabled={!isFormValid}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2568A3] hover:bg-[#1e588b] active:bg-[#18466e] disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
