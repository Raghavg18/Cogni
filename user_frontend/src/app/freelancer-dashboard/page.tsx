"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

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

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Get the username from localStorage or context
        // For this example, I'll hardcode a username, but you should replace this with actual authentication
        const username = localStorage.getItem('username') || 'defaultFreelancerUsername';
        
        const response = await fetch(`http://localhost:8000/freelancer-projects/${username}`, {
          method: 'GET',
          credentials: 'include', // Important for cookies
          headers: {
            'Content-Type': 'application/json',
          }
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
    if (progress < 30) return 'bg-[#ffeca0]';
    if (progress < 70) return 'bg-[#bde1ff]';
    return 'bg-[#beffbe]';
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#0c141c] mb-1">
              My Projects
            </h1>
            <p className="text-[#4f7296] text-base">
              {filteredJobs.length} active projects
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4f7296] w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full md:w-[220px] h-9 pl-9 pr-3 rounded-lg border border-[#e5e8ea] text-sm focus:outline-none focus:ring-2 focus:ring-[#7825ff]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <Card 
              key={job.id}
              className="cursor-pointer hover:shadow-sm transition-all duration-200 border-t-[3px]"
              style={{
                borderTopColor: getProgressColor(job.progress)
              }}
              onClick={() => router.push(`/freelancer-dashboard/${job.id}`)}
            >
              <CardContent className="p-4">
                <div className="mb-4">
                  <h3 className="font-medium text-[#0c141c] text-base line-clamp-2 mb-2">
                    {job.title}
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-[#f1f3f5] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(job.progress)} transition-all duration-500 ease-out`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-[#4f7296] whitespace-nowrap">
                      {job.progress}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[#4f7296]">Total Budget</span>
                    <span className="font-medium text-[#0c141c]">${job.totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4f7296]">Received Amount</span>
                    <span className="font-medium text-green-600">${job.receivedAmount.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-[#e5e8ea]">
                    <span className="text-[#4f7296] text-xs">
                      {job.milestones.completed} of {job.milestones.total} milestones completed
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[#4f7296] text-base">
              {loading ? "Loading projects..." : "No projects found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}