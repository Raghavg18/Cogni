"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";

export type SortOption =
  | "rating-desc"
  | "rating-asc"
  | "hourly-desc"
  | "hourly-asc"
  | "recent";

interface SortMenuProps {
  onSortChange: (sortOption: SortOption) => void;
  currentSort: SortOption;
}

const SortMenu = ({ onSortChange, currentSort }: SortMenuProps) => {
  const sortOptions = [
    { value: "rating-desc", label: "Highest Rating/Jobs" },
    { value: "rating-asc", label: "Lowest Rating/Jobs" },
    { value: "hourly-desc", label: "Highest Rate/Spent" },
    { value: "hourly-asc", label: "Lowest Rate/Spent" },
    { value: "recent", label: "Recently Active" },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white hover:bg-gray-50 transition-colors border border-gray-200 rounded-lg py-2 px-4 text-gray-700"
        >
          <ArrowUpDown size={18} />
          <span>Sort</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className="flex items-center justify-between"
          >
            {option.label}
            {currentSort === option.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortMenu;
