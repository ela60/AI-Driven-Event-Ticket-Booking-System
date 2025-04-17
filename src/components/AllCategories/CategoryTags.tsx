import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export default function CategoryTags() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    const paramsObj: Record<string, string> = {};
    
    searchParams.forEach((value, key) => {
      paramsObj[key] = decodeURIComponent(value);  
    });

    setFilters(paramsObj);
  }, [searchParams]);

  // Function to remove a specific filter
  const removeFilter = (filterKey: string) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[filterKey];  

    // Update the URL
    const query = new URLSearchParams(updatedFilters).toString();
    router.push(query ? `?${query}` : "/categories");
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    router.push("/categories"); 
  };

  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {Object.entries(filters).map(([key, value], index) => (
        <Button
          key={index}
          variant="outline"
          className="bg-pink-100 text-primary px-4 py-2 rounded-full hover:bg-pink-200 transition"
          onClick={() => removeFilter(key)}
        >
          {value} ✕
        </Button>
      ))}
      {Object.keys(filters).length > 0 && (
        <Button
          variant="ghost"
          className="text-red-500 hover:underline"
          onClick={clearAllFilters}
        >
          Clear All
        </Button>
      )}
    </div>
  );
}
