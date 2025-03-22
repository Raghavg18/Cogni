"use client";
import React, { useState } from "react";
import MilestoneHeader from "@/components/milestone/MilestoneHeader";
import ProjectHeader from "@/components/milestone/ProjectHeader";
import BudgetCards from "@/components/milestone/BudgetCard";
import MilestoneTimeline from "@/components/milestone/MilestoneTimeline";
import MilestoneContainer from "@/components/milestone/MilestoneContainer";

const MilestonePage = () => {
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);

  const timelineItems = [
    {
      title: "Job started",
      date: "Jun 1, 2023",
      status: "completed" as const,
    },
    {
      title: "Designing",
      date: "Jun 15, 2023",
      status: "completed" as const,
    },
    {
      title: "Code Review: 1",
      date: "July 15, 2023",
      status: "inProgress" as const,
    },
    {
      title: "Code Review: 2",
      date: "July 30, 2023",
      status: "upcoming" as const,
    },
    {
      title: "Testing",
      date: "August 10, 2023",
      status: "upcoming" as const,
    },
  ];

  const handleAddMilestone = () => {
    setShowAddMilestoneModal(true);
    // In a real application, this would open a modal to add a new milestone
    console.log("Add milestone clicked");
  };

  return (
    <div className="bg-white">
      <div className="bg-[rgba(247,250,252,1)] min-h-[1736px] w-full overflow-hidden max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <MilestoneHeader />
          <div className="flex w-full justify-center flex-1 h-full px-40 py-5 max-md:max-w-full max-md:px-5">
            <div className="min-w-60 w-full max-w-[960px] overflow-hidden flex-1 shrink basis-[0%] max-md:max-w-full">
              <ProjectHeader
                title="Website Redesign"
                progress={40}
                status="Milestone Review Pending"
              />

              <BudgetCards
                totalBudget="$5,000"
                released="$2,000"
                remaining="$3,000"
              />

              <MilestoneTimeline items={timelineItems} />

              <MilestoneContainer onAddMilestone={handleAddMilestone} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestonePage;
