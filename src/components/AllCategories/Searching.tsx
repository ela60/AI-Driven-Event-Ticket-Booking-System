"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { FaArrowRight } from "react-icons/fa";
import eventData from "../../data/events.json";

// Define Filters
interface Filters {
  location?: string;
  forWhom?: string;
  category?: string;
  price?: string;
}

// Props type for Searching component
interface SearchingProps {
  updateFilters: (newFilters: Filters) => void;
}

// Extract unique values dynamically for dropdowns
const getUniqueValues = <K extends keyof Filters>(key: K): string[] => {
  return [...new Set(eventData.events.map((event) => event[key as keyof Filters] as string))];
};

export default function Searching({ updateFilters }: SearchingProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({});  
  // console.log(filters);

  // Handle dropdown change (Only updates local state)
  const handleChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply filters and update URL when button is clicked
  const applyFilters = () => {
    updateFilters(filters);  

    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
    ).toString();

    router.push(`?${query}`);
  };

  return (
    <div className="flex md:flex-row flex-col items-center justify-center gap-3">
      <Select onValueChange={(value) => handleChange("location", value)}>
        <SelectTrigger className="w-full ">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          {getUniqueValues("location").map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleChange("forWhom", value)}>
        <SelectTrigger className="w-full ">
          <SelectValue placeholder="For Whom" />
        </SelectTrigger>
        <SelectContent>
          {getUniqueValues("forWhom").map((forWhom) => (
            <SelectItem key={forWhom} value={forWhom}>
              {forWhom}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleChange("category", value)}>
        <SelectTrigger className="w-full ">
          <SelectValue placeholder="Categories" />
        </SelectTrigger>
        <SelectContent>
          {getUniqueValues("category").map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleChange("price", value)}>
        <SelectTrigger className="w-full ">
          <SelectValue placeholder="Price" />
        </SelectTrigger>
        <SelectContent>
          {getUniqueValues("price").map((price) => (
            <SelectItem key={price} value={price}>
              {price}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Apply Filters when Arrow Button is clicked */}
      <Button
        variant="outline"
        onClick={applyFilters}
        className="border border-primary p-3 rounded-lg bg-[#902B27] text-white"
      >
        <FaArrowRight />
      </Button>
    </div>
  );
}