import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Download, CloudUpload, Trash2, Info } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import BulkOnboardingDialog from '../modals/BulkOnboardingDialog';
import { BulkOnboardingUserData } from '@/constants/dashboardConstant';
import BulkOnboardInstructions from './BulkOnboardInstructions';
import { useUserDB } from '@/hooks/customhooks/IndexedDBHooks/useUserDB';
import BulkOnboardingTable from './BulkOnboardingTable';

export default function BulkOnboarding() {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<BulkOnboardingUserData[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [openInstructions, setOpenInstructions] = useState(false);
  const { fileNames, getUsers, upsertUsers } = useUserDB();

  const processFile = async (file: File): Promise<void> => {
    setIsLoading(true);
    setFileName(file.name);
    setErrors([]);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'csv') {
        // Handle CSV files
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: results => {
            const rawData = results.data as Record<string, unknown>[];
            const list = rawData.map(row => {
              const emailKey = Object.keys(row).find(
                key =>
                  key.toLowerCase().includes('email') ||
                  key.toLowerCase() === 'email'
              );
              const panKey = Object.keys(row).find(
                key =>
                  key.toLowerCase().includes('pan') ||
                  key.toLowerCase().includes('pannumber') ||
                  key.toLowerCase().includes('pan_number') ||
                  key.toLowerCase() === 'pan'
              );
              const phoneKey = Object.keys(row).find(
                key =>
                  key.toLowerCase().includes('phone') ||
                  key.toLowerCase().includes('phonenumber') ||
                  key.toLowerCase().includes('phone_number') ||
                  key.toLowerCase() === 'phone'
              );
              const capitalKey = Object.keys(row).find(
                key =>
                  key.toLowerCase().includes('capital') ||
                  key.toLowerCase().includes('commitment') ||
                  key.toLowerCase().includes('capitalcommitment') ||
                  key.toLowerCase().includes('capital_commitment')
              );
              return {
                email: emailKey ? String(row[emailKey] ?? '').trim() : '',
                pan_number: panKey ? String(row[panKey] ?? '').trim() : '',
                phone: phoneKey ? String(row[phoneKey] ?? '').trim() : '',
                capital_commitment: capitalKey
                  ? String(row[capitalKey] ?? '').trim()
                  : '',
              };
            });
            setParsedData(list);
            setOpen(true);
            upsertUsers(file.name, list);
            setIsLoading(false);
          },
          error: error => {
            console.error('CSV parsing error:', error);
            setErrors([
              'Error parsing CSV file. Please check the file format.',
            ]);
            setIsLoading(false);
          },
        });
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // Handle Excel files with SheetJS
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          blankrows: false,
        }) as unknown[][];

        // Convert to array of objects with headers
        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[];
          const dataRows = jsonData.slice(1) as unknown[][];
          const rawData: Record<string, unknown>[] = dataRows.map(row => {
            const obj: Record<string, unknown> = {};
            headers.forEach((header, index) => {
              obj[String(header)] = row[index] || '';
            });
            return obj;
          });

          const list = rawData.map(row => {
            const emailKey = Object.keys(row).find(
              key =>
                key.toLowerCase().includes('email') ||
                key.toLowerCase() === 'email'
            );
            const panKey = Object.keys(row).find(
              key =>
                key.toLowerCase().includes('pan') ||
                key.toLowerCase().includes('pannumber') ||
                key.toLowerCase().includes('pan_number') ||
                key.toLowerCase() === 'pan'
            );
            const phoneKey = Object.keys(row).find(
              key =>
                key.toLowerCase().includes('phone') ||
                key.toLowerCase().includes('phonenumber') ||
                key.toLowerCase().includes('phone_number') ||
                key.toLowerCase() === 'phone'
            );
            const capitalKey = Object.keys(row).find(
              key =>
                key.toLowerCase().includes('capital') ||
                key.toLowerCase().includes('commitment') ||
                key.toLowerCase().includes('capitalcommitment') ||
                key.toLowerCase().includes('capital_commitment')
            );
            return {
              email: emailKey ? String(row[emailKey] ?? '').trim() : '',
              pan_number: panKey ? String(row[panKey] ?? '').trim() : '',
              phone: phoneKey ? String(row[phoneKey] ?? '').trim() : '',
              capital_commitment: capitalKey
                ? String(row[capitalKey] ?? '').trim()
                : '',
            };
          });
          setParsedData(list);
          upsertUsers(file.name, list);
          setOpen(true);
        }
        setIsLoading(false);
      } else {
        setErrors(['Please upload a CSV, XLS, or XLSX file']);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('File processing error:', error);
      setErrors(['Error processing file. Please try again.']);
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert('File size must be under 10MB');
        return;
      }
      processFile(file);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert('File size must be under 10MB');
        return;
      }
      processFile(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFileName('');
    setParsedData([]);
    setOpen(false);
    setErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadAreaClick = () => {
    if (fileName) {
      setOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleDownloadTemplate = () => {
    // Create worksheet with updated headers
    const ws = XLSX.utils.aoa_to_sheet([
      ['email', 'panNumber', 'phoneNumber', 'capitalCommitment'],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'bulk-onboarding-template.xlsx');
  };

  return (
    <>
      <div className="w-full bg-white text-gray-900">
        {/* Header Section */}
        <BulkOnboardInstructions
          open={openInstructions}
          setOpen={setOpenInstructions}
        />

        {/* Upload Section */}
        <div className="pb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload File</h2>
              <p className="text-gray-600 text-sm">
                To ensure your data is formatted correctly, start by downloading our template.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2.5 font-medium flex items-center gap-2 rounded-lg transition-colors"
                onClick={() => setOpenInstructions(true)}
              >
                <Info className="w-4 h-4" />
                Instructions
              </button>
              <button
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 font-medium flex items-center gap-2 rounded-lg transition-colors"
                onClick={handleDownloadTemplate}
              >
                <Download className="w-4 h-4" />
                Download Template
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleUploadAreaClick}
          >
            {fileName ? (
              <div className="relative bg-white border-2 border-gray-200 rounded-lg cursor-pointer overflow-hidden">
                <button
                  className="z-10 p-2 bg-white hover:bg-red-50 text-red-600 absolute top-3 right-3 cursor-pointer rounded-lg border border-gray-200 hover:border-red-200 transition-colors"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  title="Remove file"
                  tabIndex={-1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="w-full relative overflow-hidden flex items-center justify-center py-12">
                  <img
                    src={'/excel-sheet.png'}
                    alt="excel sheet"
                    className="w-auto h-32 object-contain"
                  />
                  <div className="absolute bottom-0 bg-gradient-to-t from-gray-50 to-transparent w-full flex justify-center p-4">
                    <span className="text-gray-700 font-medium">
                      Click to review: {fileName}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`bg-gray-50 border-2 border-dashed rounded-lg p-12 transition-colors cursor-pointer ${
                  isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-6">
                    <CloudUpload
                      className={`w-16 h-16 ${isLoading ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`}
                    />
                  </div>
                  <div className="mb-2">
                    <span className="text-lg text-gray-700">
                      {isLoading
                        ? 'Processing file...'
                        : 'Drag your file(s) or '}
                    </span>
                    {!isLoading && !fileName && (
                      <button
                        className="text-blue-600 underline hover:text-blue-700 transition-colors font-medium"
                        onClick={e => {
                          e.stopPropagation();
                          handleBrowseClick();
                        }}
                      >
                        browse
                      </button>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">
                    File type: XLS or CSV under 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-800">
                Validation Errors ({errors.length})
              </h3>
              <div className="space-y-2">
                {errors.slice(0, 10).map((error, index) => (
                  <p key={index} className="text-red-700 text-sm">
                    • {error}
                  </p>
                ))}
                {errors.length > 10 && (
                  <p className="text-red-600 text-sm mt-2 font-medium">
                    ... and {errors.length - 10} more errors
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <BulkOnboardingTable fileNames={fileNames} getUsers={getUsers} />
      </div>
      <BulkOnboardingDialog data={parsedData} open={open} setOpen={setOpen} />
    </>
  );
}
