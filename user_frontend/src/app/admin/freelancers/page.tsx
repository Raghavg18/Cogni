"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SortMenu, { SortOption } from "@/components/admin/SortMenu";
import FilterDialog from "@/components/admin/FilterDialog";

export default function FreelancersPage() {
  const [sortOption, setSortOption] = useState<SortOption>("recent");

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    console.log("Sort option changed to:", option);
  };

  const handleApplyFilters = (filters: any) => {
    console.log("Filters applied:", filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Freelancers</h1>
        <div className="flex gap-3">
          <FilterDialog onApplyFilters={handleApplyFilters} />
          <SortMenu onSortChange={handleSortChange} currentSort={sortOption} />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <p>Freelancers listing will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
