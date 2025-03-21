"use client";
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import PageTitle from "@/components/jobs/PageTitle";
import MilestoneTimeline from "@/components/jobs/MilestoneTimeline";
import AddMilestoneButton from "@/components/jobs/AddMilestoneButton";
import MilestoneForm, {
  MilestoneFormData,
} from "@/components/jobs/MilestoneForm";
import { Milestone } from "@/components/jobs/MilestoneTimeline";

const CreateJob: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      title: "Job started",
      date: "Jun 1, 2023",
      completed: true,
    },
    {
      title: "Designing",
      date: "Jun 15, 2023",
      completed: true,
    },
    {
      title: "Coding",
      date: "Jul 1, 2023",
      completed: true,
      isLast: true,
    },
  ]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "All Jobs", href: "/jobs", active: true },
  ];

  const handleSave = () => {
    console.log("Saving job...");
    // Implement save functionality
  };

  const handleAddMilestone = () => {
    console.log("Adding milestone...");
    // In a real app, you might show a modal or expand a form
  };

  const handleMilestoneSubmit = (data: MilestoneFormData) => {
    console.log("Milestone data:", data);
    // In a real app, you would add this to the milestones array
  };

  return (
    <div className="bg-white">
      <div className="bg-[rgba(247,250,252,1)] min-h-[800px] w-full overflow-hidden max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <Header />
          <main className="flex w-full justify-center flex-1 h-full px-4 md:px-8 lg:px-40 py-5 max-md:max-w-full">
            <div className="flex min-w-60 w-full max-w-[960px] flex-col overflow-hidden items-stretch flex-1 shrink basis-[0%] max-md:max-w-full">
              <div className="bg-white rounded-lg shadow-sm mt-6">
                <nav className="flex p-4">
                  <ol className="flex flex-wrap items-center gap-2 text-base">
                    {breadcrumbItems.map((item, index) => (
                      <React.Fragment key={index}>
                        <li className="inline-flex items-center">
                          <a
                            href={item.href}
                            className={`transition-colors ${
                              item.active
                                ? "text-[rgba(13,20,28,1)]"
                                : "text-[rgba(79,115,150,1)] hover:text-foreground"
                            }`}
                          >
                            {item.label}
                          </a>
                        </li>
                        {index < breadcrumbItems.length - 1 && (
                          <li
                            role="presentation"
                            aria-hidden="true"
                            className="mx-1 text-[rgba(79,115,150,1)]"
                          >
                            /
                          </li>
                        )}
                      </React.Fragment>
                    ))}
                  </ol>
                </nav>

                <PageTitle
                  title="Create a job"
                  actionLabel="Save"
                  onAction={handleSave}
                />

                <div className="w-full text-lg text-[rgba(13,20,28,1)] font-bold pt-4 pb-2 px-6">
                  Milestones
                </div>

                <MilestoneTimeline milestones={milestones} />

                <AddMilestoneButton onClick={handleAddMilestone} />

                <div className="w-full border-t border-[rgba(229,232,235,1)] mt-4"></div>

                <MilestoneForm onSubmit={handleMilestoneSubmit} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
