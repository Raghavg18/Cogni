"use client";
import React, { useEffect, useState } from "react";
import ProjectHeader from "@/components/milestone/ProjectHeader";
import BudgetCards from "@/components/milestone/BudgetCard";
import MilestoneTimeline from "@/components/milestone/MilestoneTimeline";
import MilestoneContainer from "@/components/milestone/MilestoneContainer"; // Import our updated component
import axios from "axios";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProjectMilestone {
  description: string;
  status: string;
  amount: number;
  date: string;
  images: string[];
  repositoryUrl: string;
  externalFiles: string;
  hostingUrl: string;
  _id: string;
}

interface ProjectData {
  name: string;
  status: string;
}

const MilestonePage = () => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const {username,isClient} = useAuth()
  const router = useRouter()

  useEffect(()=>{
    console.log(username,isClient)
    if(username && !isClient){
      router.push("/freelancer-dashboard")
    }else if(!username){
      router.push("/login")
    }
  },[username,isClient,router])

  useEffect(() => {
    const getProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/project/${params.projectId}`
        );

        if (response.data) {
          setProjectData(response.data.project);
          setMilestones(response.data.milestones || []);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };
    getProjectDetails();
  }, [params.projectId]);

  // Calculate progress based on milestone statuses
  const calculateProgress = () => {
    if (!milestones || milestones.length === 0) return 0;

    const completedMilestones = milestones.filter(
      (milestone) =>
        milestone.status === "paid" || milestone.status === "completed"
    ).length;

    return Math.floor((completedMilestones / milestones.length) * 100);
  };

  // Calculate budget information
  const calculateBudgets = () => {
    if (!projectData) return { total: "$0", released: "$0", remaining: "$0" };

    const totalBudget = milestones.reduce((sum, m) => sum + (m.amount || 0), 0);

    // Fix: Only consider "completed" and "paid" milestones as released
    const releasedAmount = milestones
      .filter((m) => m.status === "completed" || m.status === "paid")
      .reduce((sum, m) => sum + (m.amount || 0), 0);

    const remainingAmount = totalBudget - releasedAmount;

    return {
      total: `$${totalBudget.toLocaleString()}`,
      released: `$${releasedAmount.toLocaleString()}`,
      remaining: `$${remainingAmount.toLocaleString()}`,
    };
  };

  // Format milestones for timeline display
  const formatTimelineItems = () => {
    if (!milestones || milestones.length === 0) return [];

    return milestones.map((milestone, index) => {
      // Convert status from API to timeline format
      let status: "upcoming" | "completed" | "inProgress" = "upcoming";
      if (milestone.status === "completed" || milestone.status === "paid")
        status = "completed";
      else if (milestone.status === "submitted") status = "inProgress";

      // Create a dummy date if not available
      const date = milestone.date
        ? new Date(milestone.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : `Milestone ${index + 1}`;

      return {
        title: milestone.description || `Milestone ${index + 1}`,
        date: date,
        status: status,
      };
    });
  };

  const handleAddMilestone = () => {
    console.log("Add milestone clicked");
  };

  const budgets = calculateBudgets();
  const progress = calculateProgress();

  if (loading) {
    return (
      <div className="bg-[rgba(247,250,252,1)] min-h-screen w-full flex items-center justify-center">
        <p>Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="bg-[rgba(247,250,252,1)] min-h-[1736px] w-full overflow-hidden max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <div className="flex w-full justify-center flex-1 h-full px-40 py-5 max-md:max-w-full max-md:px-5">
            <div className="min-w-60 w-full max-w-[960px] overflow-hidden flex-1 shrink basis-[0%] max-md:max-w-full">
              <ProjectHeader
                title={projectData?.name || "Project"}
                progress={progress}
                status={projectData?.status || "Pending"}
              />

              <BudgetCards
                totalBudget={budgets.total}
                released={budgets.released}
                remaining={budgets.remaining}
              />

              <MilestoneTimeline items={formatTimelineItems()} />

              <MilestoneContainer
                milestones={milestones}
                onAddMilestone={handleAddMilestone}
                projectId={
                  Array.isArray(params.projectId)
                    ? params.projectId[0]
                    : params.projectId
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestonePage;
