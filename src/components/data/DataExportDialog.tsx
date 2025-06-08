
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, Calendar as CalendarIcon, Database, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface DataExportDialogProps {
  hotelId: string;
}

const DataExportDialog: React.FC<DataExportDialogProps> = ({ hotelId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const dataTypes = [
    { id: "rooms", label: "Room Information", description: "Room details, types, and configurations" },
    { id: "reservations", label: "Reservations", description: "Booking history and guest information" },
    { id: "requests", label: "Guest Requests", description: "Service requests and their status" },
    { id: "staff", label: "Staff Information", description: "Staff members and their roles" },
    { id: "analytics", label: "Analytics Data", description: "Usage statistics and performance metrics" },
    { id: "feedback", label: "Guest Feedback", description: "Reviews and ratings from guests" }
  ];

  const handleDataTypeChange = (dataType: string, checked: boolean) => {
    if (checked) {
      setSelectedData(prev => [...prev, dataType]);
    } else {
      setSelectedData(prev => prev.filter(type => type !== dataType));
    }
  };

  const handleExport = async () => {
    if (selectedData.length === 0) {
      toast({
        title: "No data selected",
        description: "Please select at least one data type to export.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    try {
      // Mock export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would:
      // 1. Gather the selected data from the database
      // 2. Format it according to the chosen format
      // 3. Create a downloadable file
      // 4. Trigger the download
      
      const fileName = `hotel-data-export-${Date.now()}.${exportFormat}`;
      
      // Mock download
      const mockData = {
        exportDate: new Date().toISOString(),
        hotelId,
        dataTypes: selectedData,
        dateRange,
        format: exportFormat
      };
      
      const blob = new Blob([JSON.stringify(mockData, null, 2)], { 
        type: exportFormat === 'json' ? 'application/json' : 'text/csv' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export completed",
        description: `Your data has been exported as ${fileName}`,
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Export Hotel Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Data Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataTypes.map((dataType) => (
                <div key={dataType.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={dataType.id}
                    checked={selectedData.includes(dataType.id)}
                    onCheckedChange={(checked) => 
                      handleDataTypeChange(dataType.id, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor={dataType.id} className="font-medium">
                      {dataType.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {dataType.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Date Range (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex-1">
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, "PPP") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                        disabled={(date) => dateRange.from ? date < dateRange.from : false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Format</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="csv"
                    name="format"
                    value="csv"
                    checked={exportFormat === "csv"}
                    onChange={(e) => setExportFormat(e.target.value as "csv" | "json")}
                  />
                  <Label htmlFor="csv" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CSV (Spreadsheet)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="json"
                    name="format"
                    value="json"
                    checked={exportFormat === "json"}
                    onChange={(e) => setExportFormat(e.target.value as "csv" | "json")}
                  />
                  <Label htmlFor="json" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    JSON (Developer)
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataExportDialog;
