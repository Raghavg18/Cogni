"use client";
import { useAuth } from "@/components/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Milestone {
  _id: string;
  projectId: string;
  description: string;
  amount: number;
  status: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  freelancerId: string;
  completed: number;
  amount: number;
  milestones: Milestone[];
}

const Page = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { username, isClient } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(username, isClient);
    if (username && !isClient) {
      router.push("/freelancer-dashboard");
    } else if (!username) {
      router.push("/login");
    }
  }, [username, isClient, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log(username);
        const response = await axios.get(
          `https://cogni-production.up.railway.app/client-projects/${username}`,
          { withCredentials: true }
        );

        // The main error: response data is already parsed by axios
        // No need to call response.json()
        setProjects(response.data.projects);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [username]);

  // Helper function to get progress bar color
  const getProgressColor = (completed: number) => {
    if (completed < 30) return "bg-[#ffeca0]";
    if (completed < 70) return "bg-[#bde1ff]";
    return "bg-[#beffbe]";
  };

  // Helper function to format client name nicely
  const formatClientName = (clientId: string) => {
    return `${clientId} - Client`;
  };

  const handleCreateJob = () => {
    router.push("/create-job");
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] p-8 md:p-12 lg:p-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Create Job Button */}
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-bold text-[#0c141c] text-[32px] leading-10 mb-3">
              Milestone Tracker
            </h1>
            <p className="[font-family:'Be_Vietnam_Pro',Helvetica] text-[#4f7296] text-lg max-w-2xl">
              View the completion rate of your projects, check the ratings of
              clients, and monitor your ongoing projects
            </p>
          </div>
          <button
            onClick={handleCreateJob}
            className="mt-4 sm:mt-0 bg-[#7925FF] hover:bg-[#7925FF] text-white py-3 px-6 rounded-lg [font-family:'Be_Vietnam_Pro',Helvetica] font-medium text-sm transition-colors duration-200 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Job
          </button>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-2xl border border-[#e5e8ea] shadow-sm">
          <div className="p-6 border-b border-[#e5e8ea]">
            <h2 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-semibold text-[#0c141c] text-xl">
              Active Projects ({loading ? "..." : projects.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-[#4f7296]">
              Loading projects...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : projects.length === 0 ? (
            <div className="p-6 text-center text-[#4f7296]">
              No active projects found
            </div>
          ) : (
            <div className="divide-y divide-[#e5e8ea]">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-6 hover:bg-[#f7f9fc] transition-colors duration-200 cursor-pointer"
                  onClick={() => {
                    router.push("/client-dashboard/" + project.id);
                  }}>
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="[font-family:'Be_Vietnam_Pro',Helvetica] font-semibold text-[#0c141c] text-lg mb-2">
                        {formatClientName(project.clientId)}
                      </h3>
                      <p className="text-[#4f7296] mb-4">
                        Working on{" "}
                        <span className="font-medium text-[#0c141c]">
                          {project.name}
                        </span>
                      </p>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-[#f1f3f5] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(
                              project.completed
                            )} transition-all duration-500 ease-out`}
                            style={{ width: `${project.completed}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-[#4f7296] whitespace-nowrap">
                          {project.completed}% Complete
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <div className="text-right">
                        <p className="[font-family:'Be_Vietnam_Pro',Helvetica] font-semibold text-[#0c141c] text-xl">
                          ${project.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-[#4f7296]">Project Value</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
