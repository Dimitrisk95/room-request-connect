
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AccessCodesHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onDownloadCsv: () => void;
}

const AccessCodesHeader: React.FC<AccessCodesHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  onDownloadCsv
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by room number or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onDownloadCsv}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" disabled>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessCodesHeader;
