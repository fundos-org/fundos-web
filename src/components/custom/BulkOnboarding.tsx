import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  Upload,
  Users,
  FileSpreadsheet,
  Download,
  Cloud,
  X,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import BulkOnboardingDialog from './modals/BulkOnboardingDialog';
import { BulkOnboardingUserData } from '@/constants/dashboardConstant';

export default function BulkOnboarding() {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<BulkOnboardingUserData[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

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
            setParsedData(
              rawData.map(row => {
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
              })
            );
            setOpen(true);
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

          setParsedData(
            rawData.map(row => {
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
            })
          );
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
      <div className="min-h-screen w-full bg-black text-white">
        {/* Header Section */}
        <div className="px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <span>Tab groups</span>
            </div>
            <h1 className="text-3xl font-semibold mb-2">How onboard works?</h1>
            <p className="text-gray-400">
              Here's a simple 3-step guide to get you started:
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6 mb-12">
            {/* Step 1 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-gray-300" />
              </div>
              <span className="text-lg text-gray-300">
                Download the template CSV file
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-300" />
              </div>
              <span className="text-lg text-gray-300">
                Fill & Upload your file (.csv or .xls under 10MB)
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-300" />
              </div>
              <span className="text-lg text-gray-300">
                Review and confirm to onboard members
              </span>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="px-8 pb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Upload file</h2>
              <p className="text-gray-400 text-sm">
                To ensure your data is formatted correctly, start by downloading
                our template.
              </p>
            </div>
            <button
              className="cursor-pointer bg-white text-black px-4 py-2 font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
              onClick={handleDownloadTemplate}
            >
              <Download className="w-4 h-4" />
              Download template
            </button>
          </div>

          {/* Upload Area */}
          <div
            className={`bg-gray-900 border-2 border-dashed p-12 transition-colors cursor-pointer ${
              isDragOver ? 'border-blue-500 bg-gray-800' : 'border-gray-700'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleUploadAreaClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center text-center">
              {fileName ? (
                <div className="my-8 flex items-center gap-2">
                  <div
                    className="bg-blue-600 text-white px-4 py-2 text-sm font-medium flex items-center gap-2 cursor-pointer"
                    onClick={e => {
                      e.stopPropagation();
                      setOpen(true);
                    }}
                    title="Show uploaded file"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    {fileName}
                  </div>
                  <button
                    className="ml-2 text-gray-300 hover:text-red-400"
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    title="Remove file"
                    tabIndex={-1}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <Cloud
                      className={`w-16 h-16 ${isLoading ? 'text-blue-500 animate-pulse' : 'text-gray-600'}`}
                    />
                  </div>
                  <div className="mb-2">
                    <span className="text-lg text-gray-300">
                      {isLoading
                        ? 'Processing file...'
                        : 'Drag your file(s) or '}
                    </span>
                    {!isLoading && !fileName && (
                      <button
                        className="text-blue-400 underline hover:text-blue-300 transition-colors"
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
                </>
              )}
            </div>
          </div>

          {errors.length > 0 && (
            <div className="mt-8 bg-red-900/20 border border-red-800 p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-400">
                Validation Errors ({errors.length})
              </h3>
              <div className="space-y-2">
                {errors.slice(0, 10).map((error, index) => (
                  <p key={index} className="text-red-300 text-sm">
                    • {error}
                  </p>
                ))}
                {errors.length > 10 && (
                  <p className="text-red-400 text-sm mt-2">
                    ... and {errors.length - 10} more errors
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <BulkOnboardingDialog data={parsedData} open={open} setOpen={setOpen} />
    </>
  );
}
