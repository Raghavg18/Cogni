"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Job {
  id: string;
  title: string;
  progress: number;
  totalBudget: number;
  receivedAmount: number;
  milestones: {
    total: number;
    completed: number;
  };
}

export default function FreelancerDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { isClient, username } = useAuth();

  useEffect(() => {
    console.log(username, isClient);
    if (username && isClient) {
      router.push("/client-dashboard/milestone-tracker");
    } else if (!username) {
      router.push("/login");
    }
  }, [username, isClient, router]);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Get the username from localStorage or context
        const username = localStorage.getItem("username") || "defaultFreelancerUsername";

        const response = await fetch(`https://cogni-production.up.railway.app/freelancer-projects/${username}`, {
          method: "GET",
          credentials: "include", // Important for cookies
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          setJobs(data.projects);
        } else {
          console.error("Failed to fetch projects:", data.message);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-[#FFD580]"; // Light orange
    if (progress < 70) return "bg-[#7925FF]/30"; // Light purple to match brand color
    return "bg-[#7925FF]"; // Purple to match brand color
  };

  const getProgressTextColor = (progress: number) => {
    if (progress < 30) return "text-orange-600";
    if (progress < 70) return "text-[#7925FF]";
    return "text-white";
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-[1200px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Projects</h1>
            <p className="text-gray-500 text-sm">
              {filteredJobs.length} active projects
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full md:w-[358px] h-12 pl-9 pr-3 rounded-lg border border-[#465FF166] text-sm focus:outline-none focus:border-2 focus:border-[#7925FF]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 border border-[#465FF166]"
              onClick={() => router.push(`/freelancer-dashboard/${job.id}`)}
            >
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-4">
                    {job.title}
                  </h3>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(job.progress)} rounded-full transition-all duration-500 ease-out relative`}
                        style={{ width: `${job.progress}%` }}
                      >
                        {job.progress >= 70 && (
                          <span className={`absolute right-2 text-xs font-bold ${getProgressTextColor(job.progress)}`}>
                            {job.progress}%
                          </span>
                        )}
                      </div>
                    </div>
                    {job.progress < 70 && (
                      <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                        {job.progress}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Total Budget</span>
                    <span className="font-bold text-gray-900">${job.totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Received Amount</span>
                    <span className="font-bold text-[#7925FF]">${job.receivedAmount.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-[#7925FF] h-2 rounded-full" 
                          style={{ width: `${(job.milestones.completed / job.milestones.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {job.milestones.completed}/{job.milestones.total}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2 items-center">
                      <Check className="text-[#7925FF] h-4 w-4" />
                      <span className="text-xs text-gray-500">
                        {job.milestones.completed} of {job.milestones.total} milestones completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="text-gray-400 h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 text-center max-w-md">
              We couldn&apos;t find any projects matching your search criteria. Try adjusting your search or check back later.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Loading projects...</h3>
            <p className="text-gray-500 text-center">
              Please wait while we fetch your projects.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}