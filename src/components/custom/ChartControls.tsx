import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Download, 
  Search, 
  Calendar,
  FileText,
  FileSpreadsheet,
  File,
  X
} from 'lucide-react';
import { useState } from 'react';

interface ChartControlsProps {
  onSearch?: (searchTerm: string) => void;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  onExport?: (format: 'csv' | 'pdf' | 'excel') => void;
  showSearch?: boolean;
  showDateFilter?: boolean;
  showExport?: boolean;
  showQuickDateButtons?: boolean;
  searchPlaceholder?: string;
}

export default function ChartControls({
  onSearch,
  onDateRangeChange,
  onExport,
  showSearch = false,
  showDateFilter = false,
  showExport = true,
  showQuickDateButtons = false,
  searchPlaceholder = "Search...",
}: ChartControlsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedQuickButton, setSelectedQuickButton] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleDateChange = () => {
    if (startDate && endDate) {
      onDateRangeChange?.(startDate, endDate);
    }
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    onExport?.(format);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSearchInput(false);
    onSearch?.('');
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setSelectedQuickButton(null);
    onDateRangeChange?.('', '');
  };

  const setQuickDateRange = (period: 'week' | 'month' | 'quarter' | 'year') => {
    const now = new Date();
    const start = new Date();
    
    // Reset time to start of day for start date
    start.setHours(0, 0, 0, 0);
    now.setHours(23, 59, 59, 999); // End of current day
    
    switch (period) {
      case 'week':
        // Set to start of current week (Monday)
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        break;
      case 'month':
        start.setDate(1);
        break;
      case 'quarter':
        const quarter = Math.floor(start.getMonth() / 3);
        start.setMonth(quarter * 3, 1);
        break;
      case 'year':
        start.setMonth(0, 1);
        break;
    }
    
    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = now.toISOString().split('T')[0];
    
    setStartDate(startDateStr);
    setEndDate(endDateStr);
    setSelectedQuickButton(period);
    
    // Immediately trigger the date range change
    if (onDateRangeChange) {
      onDateRangeChange(startDateStr, endDateStr);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Search Icon/Input */}
      {showSearch && (
        <div className="flex items-center">
          {showSearchInput ? (
            <div className="relative flex items-center">
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-64 bg-[#1f1f1f] border-gray-600 text-white rounded-none text-sm"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={clearSearch}
                className="ml-1 h-8 w-8 p-0 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSearchInput(true)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Date Filter Icon/Popover */}
      {showDateFilter && (
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              title="Filter by date range"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-[#1f1f1f] border-gray-600 rounded-none">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">Date Range Filter</h4>
                {(startDate || endDate) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearDateFilter}
                    className="h-6 text-xs text-gray-400 hover:text-white"
                  >
                    Clear
                  </Button>
                )}
              </div>
              
              {/* Quick Date Selection Buttons */}
              {showQuickDateButtons && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 block">Quick Select</label>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuickDateRange('week')}
                      className={`text-xs px-2 py-1 h-6 border-gray-600 rounded-none ${
                        selectedQuickButton === 'week' 
                          ? 'bg-blue-600 text-white border-blue-500' 
                          : 'bg-[#2A2A2B] text-white hover:bg-[#3A3A3B]'
                      }`}
                    >
                      Week
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuickDateRange('month')}
                      className={`text-xs px-2 py-1 h-6 border-gray-600 rounded-none ${
                        selectedQuickButton === 'month' 
                          ? 'bg-blue-600 text-white border-blue-500' 
                          : 'bg-[#2A2A2B] text-white hover:bg-[#3A3A3B]'
                      }`}
                    >
                      Month
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuickDateRange('quarter')}
                      className={`text-xs px-2 py-1 h-6 border-gray-600 rounded-none ${
                        selectedQuickButton === 'quarter' 
                          ? 'bg-blue-600 text-white border-blue-500' 
                          : 'bg-[#2A2A2B] text-white hover:bg-[#3A3A3B]'
                      }`}
                    >
                      Quarter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuickDateRange('year')}
                      className={`text-xs px-2 py-1 h-6 border-gray-600 rounded-none ${
                        selectedQuickButton === 'year' 
                          ? 'bg-blue-600 text-white border-blue-500' 
                          : 'bg-[#2A2A2B] text-white hover:bg-[#3A3A3B]'
                      }`}
                    >
                      Year
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="grid gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">From Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setSelectedQuickButton(null); // Clear quick button selection when manually entering date
                    }}
                    onBlur={handleDateChange}
                    className="bg-[#2A2A2B] border-gray-600 text-white rounded-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">To Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setSelectedQuickButton(null); // Clear quick button selection when manually entering date
                    }}
                    onBlur={handleDateChange}
                    className="bg-[#2A2A2B] border-gray-600 text-white rounded-none"
                  />
                </div>
              </div>
              {startDate && endDate && (
                <div className="text-xs text-gray-400">
                  Filtering: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Export Icon/Dropdown */}
      {showExport && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              title="Export data"
            >
              <Download className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1f1f1f] border-gray-600 rounded-none">
            <DropdownMenuItem 
              onClick={() => handleExport('csv')}
              className="text-white hover:bg-[#2A2A2B] cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleExport('excel')}
              className="text-white hover:bg-[#2A2A2B] cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleExport('pdf')}
              className="text-white hover:bg-[#2A2A2B] cursor-pointer"
            >
              <File className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
