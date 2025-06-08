
import { Input } from "@/components/ui/input";

interface RoomSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const RoomSearch = ({ searchTerm, onSearchChange }: RoomSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Room Management</h1>
      <div className="flex gap-2">
        <Input
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-[220px]"
          data-tutorial="search-rooms"
        />
      </div>
    </div>
  );
};

export default RoomSearch;
