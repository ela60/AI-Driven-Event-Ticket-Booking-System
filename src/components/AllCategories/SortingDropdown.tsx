import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  export default function SortingDropdown() {
    return (
      <div className="flex justify-end mt-4">
        <Select>
          <SelectTrigger className="w-40 border border-gray-300">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="price-low-high">Price: Low to High</SelectItem>
            <SelectItem value="price-high-low">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }
  