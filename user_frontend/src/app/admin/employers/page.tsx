"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function EmployersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employers</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <p>Employers listing will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
