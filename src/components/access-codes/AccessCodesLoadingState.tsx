
import { Loader } from "lucide-react";

const AccessCodesLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader className="h-8 w-8 animate-spin mr-2" />
      <span>Loading room data...</span>
    </div>
  );
};

export default AccessCodesLoadingState;
