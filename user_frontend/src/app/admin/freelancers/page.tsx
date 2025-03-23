"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import FilterDialog from "@/components/admin/FilterDialog";
import SortMenu, { SortOption } from "@/components/admin/SortMenu";
import { Star, Clock, DollarSign } from "lucide-react";

interface Freelancer {
  id: number;
  name: string;
  avatar: string;
  skills: string[];
  rating: number;
  hourlyRate: number;
  projectsCompleted: number;
  location: string;
  lastActive: string;
}

const mockFreelancers: Freelancer[] = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    skills: ["React", "TypeScript", "UI/UX"],
    rating: 4.9,
    hourlyRate: 85,
    projectsCompleted: 32,
    location: "Berlin, Germany",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Sam Chen",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    skills: ["Python", "Django", "React"],
    rating: 4.7,
    hourlyRate: 75,
    projectsCompleted: 28,
    location: "Toronto, Canada",
    lastActive: "Just now",
  },
];

const Freelancers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allFreelancers, setAllFreelancers] = useState<Freelancer[]>([]);
  const [displayedFreelancers, setDisplayedFreelancers] = useState<
    Freelancer[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSort, setCurrentSort] = useState<SortOption>("rating-desc");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAllFreelancers(mockFreelancers);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...allFreelancers];

    if (searchTerm) {
      filtered = filtered.filter(
        (freelancer) =>
          freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          freelancer.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    setDisplayedFreelancers(filtered);
  }, [allFreelancers, searchTerm]);

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Freelancers</h1>
        <p className="text-gray-500">
          Browse and manage freelancers on your platform.
        </p>
      </div>

      <div className="dashboard-card mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search freelancers by name or skills..."
              className="bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 w-full text-gray-700 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <FilterDialog onApplyFilters={() => {}} />
          <SortMenu onSortChange={setCurrentSort} currentSort={currentSort} />
        </div>
      </div>

      {isLoading ? (
        <div className="dashboard-card flex items-center justify-center h-64">
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
            <div className="h-4 w-56 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : displayedFreelancers.length === 0 ? (
        <div className="dashboard-card flex flex-col items-center justify-center h-64 text-center">
          <div className="text-gray-400 mb-2">
            <Search size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-medium text-gray-700">
            No freelancers found
          </h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedFreelancers.map((freelancer) => (
            <div
              key={freelancer.id}
              className="bg-white shadow-md rounded-xl p-6 w-full flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16">
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {freelancer.name}
                  </h3>
                  <div className="text-gray-500">{freelancer.location}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 flex-1">
                {freelancer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
                  <div className="flex items-center text-yellow-500 mb-1">
                    <Star size={16} className="fill-current" />
                    <span className="ml-1 font-medium">
                      {freelancer.rating}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
                  <div className="flex items-center text-green-500 mb-1">
                    <DollarSign size={16} />
                    <span className="font-medium">{freelancer.hourlyRate}</span>
                  </div>
                  <div className="text-xs text-gray-500">Hourly</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
                  <div className="flex items-center text-blue-500 mb-1">
                    <Clock size={16} />
                    <span className="ml-1 text-gray-700 text-sm">
                      {freelancer.lastActive}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">Last Active</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Freelancers;
