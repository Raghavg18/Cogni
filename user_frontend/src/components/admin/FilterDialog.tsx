"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

interface FilterOptions {
  minRate: number | "";
  maxRate: number | "";
  minRating: number | "";
  lastActive: string;
}

interface FilterDialogProps {
  onApplyFilters: (filters: FilterOptions) => void;
}

const FilterDialog = ({ onApplyFilters }: FilterDialogProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    minRate: "",
    maxRate: "",
    minRating: "",
    lastActive: "any",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleLastActiveChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      lastActive: value,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white hover:bg-gray-50 transition-colors border border-gray-200 rounded-lg py-2 px-4 text-gray-700"
        >
          <Filter size={18} />
          <span>Filters</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle className="text-center">Filter Freelancers</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-6 px-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Hourly Rate</h4>
            <div className="flex items-center gap-4">
              <div className="space-y-1 flex-1">
                <label htmlFor="minRate" className="text-sm text-gray-500">
                  Min ($)
                </label>
                <Input
                  id="minRate"
                  name="minRate"
                  type="number"
                  placeholder="Min"
                  value={filters.minRate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1 flex-1">
                <label htmlFor="maxRate" className="text-sm text-gray-500">
                  Max ($)
                </label>
                <Input
                  id="maxRate"
                  name="maxRate"
                  type="number"
                  placeholder="Max"
                  value={filters.maxRate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Rating</h4>
            <div className="space-y-1">
              <label htmlFor="minRating" className="text-sm text-gray-500">
                Minimum Rating
              </label>
              <Input
                id="minRating"
                name="minRating"
                type="number"
                placeholder="4.5"
                min="0"
                max="5"
                step="0.1"
                value={filters.minRating}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Last Active</h4>
            <RadioGroup
              value={filters.lastActive}
              onValueChange={handleLastActiveChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="any" />
                <label htmlFor="any" className="text-sm">
                  Any time
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="day" id="day" />
                <label htmlFor="day" className="text-sm">
                  Last 24 hours
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="week" id="week" />
                <label htmlFor="week" className="text-sm">
                  Last week
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDialog;
