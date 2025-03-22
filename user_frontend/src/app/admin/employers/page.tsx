"use client";
import { useState } from "react";
import { Search, Briefcase, MapPin, Building2 } from "lucide-react";
import FilterDialog from "@/components/admin/FilterDialog";
import SortMenu from "@/components/admin/SortMenu";

interface Employer {
  id: number;
  name: string;
  logo: string;
  industry: string;
  location: string;
  openJobs: number;
  activeProjects: number;
  totalSpent: string;
  joinedDate: string;
}

const mockEmployers: Employer[] = [
  { id: 1, name: "Initech", logo: "IN", industry: "Financial Services", location: "Austin, TX", openJobs: 5, activeProjects: 2, totalSpent: "$43,500", joinedDate: "Jan 2022" },
  { id: 2, name: "Soylent Corp", logo: "SC", industry: "Marketing & Design", location: "Chicago, IL", openJobs: 4, activeProjects: 3, totalSpent: "$67,230", joinedDate: "Nov 2021" },
  { id: 3, name: "Globex Corporation", logo: "GC", industry: "E-commerce", location: "New York, NY", openJobs: 7, activeProjects: 5, totalSpent: "$98,750", joinedDate: "Aug 2021" },
  { id: 4, name: "Acme Technologies", logo: "AT", industry: "Software Development", location: "San Francisco, CA", openJobs: 12, activeProjects: 8, totalSpent: "$142,500", joinedDate: "Jun 2021" },
];

const Employers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedEmployers, setDisplayedEmployers] = useState<Employer[]>(mockEmployers);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDisplayedEmployers(
      mockEmployers.filter(
        (employer) =>
          employer.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          employer.industry.toLowerCase().includes(e.target.value.toLowerCase()) ||
          employer.location.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Employers</h1>
        <p className="text-gray-500 mb-6">Browse and manage employers using your platform.</p>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search employers by name, industry or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <FilterDialog onApplyFilters={() => {}} />
          <SortMenu onSortChange={() => {}} currentSort="recent" />
        </div>

        {displayedEmployers.length === 0 ? (
          <div className="text-center text-gray-600">No employers found.</div>
        ) : (
          <div className="space-y-4">
            {displayedEmployers.map((employer) => (
              <div
                key={employer.id}
                className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 flex items-center justify-between"
              >
                {/* Avatar and Info */}
                <div className="flex items-center">
                  <div className="w-12 h-12 flex items-center justify-center text-white font-semibold rounded-full bg-green-700 text-lg mr-4">
                    {employer.logo}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{employer.name}</h3>
                    <div className="text-gray-500 flex items-center text-sm">
                      <Building2 size={14} className="mr-1" /> {employer.industry}
                    </div>
                    <div className="text-gray-500 flex items-center text-sm">
                      <MapPin size={14} className="mr-1" /> {employer.location}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg text-center min-w-[80px]">
                    <div className="text-blue-600 font-semibold text-lg">{employer.openJobs}</div>
                    <div className="text-xs text-gray-500">Open Jobs</div>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg text-center min-w-[80px]">
                    <div className="text-purple-600 font-semibold text-lg">{employer.activeProjects}</div>
                    <div className="text-xs text-gray-500">Active Projects</div>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg text-center min-w-[100px]">
                    <div className="text-green-600 font-semibold text-lg">{employer.totalSpent}</div>
                    <div className="text-xs text-gray-500">Total Spent</div>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg text-center min-w-[100px] flex flex-col items-center">
                    <Briefcase size={14} className="text-gray-700 mb-1" />
                    <div className="text-gray-700 font-semibold">{employer.joinedDate}</div>
                    <div className="text-xs text-gray-500">Member Since</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employers;
