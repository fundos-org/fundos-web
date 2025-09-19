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
                className="w-64 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={clearSearch}
                className="ml-1 h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSearchInput(true)}
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
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
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Filter by date range"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">Date Range Filter</h4>
                {(startDate || endDate) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearDateFilter}
                    className="h-6 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    Clear
                  </Button>
                )}
              </div>
              
              {/* Quick Date Selection Buttons */}
              {showQuickDateButtons && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-600 block font-medium">Quick Select</label>
                  <div className="flex gap-1 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuickDateRange('week')}
                      className={`text-xs px-2 py-1 h-6 border border-gray-200 rounded-md ${
                        selectedQuickButton === 'week' 
                          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Week
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuickDateRange('month')}
                      className={`text-xs px-2 py-1 h-6 border border-gray-200 rounded-md ${
                        selectedQuickButton === 'month' 
                          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Month
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuickDateRange('quarter')}
                      className={`text-xs px-2 py-1 h-6 border border-gray-200 rounded-md ${
                        selectedQuickButton === 'quarter' 
                          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Quarter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuickDateRange('year')}
                      className={`text-xs px-2 py-1 h-6 border border-gray-200 rounded-md ${
                        selectedQuickButton === 'year' 
                          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Year
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="grid gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block font-medium">From Date</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setSelectedQuickButton(null); // Clear quick button selection when manually entering date
                      }}
                      onBlur={handleDateChange}
                      className="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block font-medium">To Date</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setSelectedQuickButton(null); // Clear quick button selection when manually entering date
                      }}
                      onBlur={handleDateChange}
                      className="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              {startDate && endDate && (
                <div className="text-xs text-gray-600">
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
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Export data"
            >
              <Download className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
            <DropdownMenuItem 
              onClick={() => handleExport('csv')}
              className="text-gray-900 hover:bg-gray-50 cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleExport('excel')}
              className="text-gray-900 hover:bg-gray-50 cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleExport('pdf')}
              className="text-gray-900 hover:bg-gray-50 cursor-pointer"
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
