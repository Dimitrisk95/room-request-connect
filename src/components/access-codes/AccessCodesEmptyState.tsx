
import { QrCode } from "lucide-react";

interface AccessCodesEmptyStateProps {
  searchTerm: string;
}

const AccessCodesEmptyState: React.FC<AccessCodesEmptyStateProps> = ({ searchTerm }) => {
  return (
    <div className="text-center py-12">
      <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No rooms found</h3>
      <p className="text-muted-foreground">
        {searchTerm ? "Try a different search term" : "Add rooms to see their access codes here"}
      </p>
    </div>
  );
};

export default AccessCodesEmptyState;
