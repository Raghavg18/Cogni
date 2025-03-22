"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import MilestoneSubmitModal, {
  MilestoneSubmitData,
} from "./MilestoneSubmitModal";

interface TimelineItemProps {
  title: string;
  date: string;
  status: "completed" | "active" | "pending";
  isLast?: boolean;
}

interface BudgetCardProps {
  title: string;
  amount: string;
  textColor?: string;
}

interface Milestone {
  _id: string;
  description: string;
  amount: number;
  status: "pending" | "submitted" | "paid";
  createdAt: string;
  updatedAt: string;
  projectId: string;
  paymentIntentId?: string;
  transferId?: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  clientId: string;
  freelancerId?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

const getFormattedDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  date,
  status,
  isLast = false,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-[#34b233]";
      case "active":
        return "bg-[#7925ff]";
      case "pending":
        return "bg-[#f2ecff]";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "completed":
        return "Completed";
      case "active":
        return "In Review";
      case "pending":
        return "Pending";
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case "completed":
        return "text-[#34b233]";
      case "active":
        return "text-[#7925ff]";
      case "pending":
        return "text-[#4f7296]";
    }
  };

  return (
    <div className="flex items-start gap-6 py-4 group relative hover:bg-[#f7f9fc] rounded-lg transition-colors duration-200">
      <div className="relative">
        {/* Timeline dot with label */}
        <div className="flex flex-col items-center">
          <span className={`text-xs font-medium mb-2 ${getStatusTextColor()}`}>
            {getStatusLabel()}
          </span>
          <div
            className={`w-4 h-4 rounded-full ${getStatusColor()} ring-4 ring-white shadow-sm relative z-10`}
          />
        </div>
        {/* Connecting line */}
        {!isLast && (
          <div className="absolute left-2 top-10 bottom-0 w-0.5 bg-gradient-to-b from-current to-[#f2ecff] -z-10" />
        )}
      </div>
      <div className="flex-1 pt-1">
        <h3 className="text-[#0c141c] font-medium text-base mb-1 group-hover:text-[#7925ff] transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[#4f7296]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm text-[#4f7296]">{date}</span>
        </div>
      </div>
    </div>
  );
};

const BudgetCard: React.FC<BudgetCardProps> = ({
  title,
  amount,
  textColor = "text-[rgba(13,20,28,1)]",
}) => {
  return (
    <div className="bg-white flex flex-col overflow-hidden whitespace-nowrap flex-1 pl-[22px] pr-[59px] pt-[13px] pb-[21px] rounded-2xl max-md:px-5">
      <div className="text-[rgba(13,20,28,1)] text-lg font-semibold leading-none">
        {title}
      </div>
      <div
        className={`${textColor} text-[26px] font-bold leading-none mt-[9px]`}>
        {amount}
      </div>
    </div>
  );
};

interface MilestoneContainerProps {
  projectId: string;
}

const MilestoneContainer: React.FC<MilestoneContainerProps> = ({
  projectId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("");
  const [selectedMilestoneAmount, setSelectedMilestoneAmount] =
    useState<number>();
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/project/${projectId}`
        );
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }
        const data = await response.json();
        setProject(data.project);
        setMilestones(data.milestones);
      } catch (err) {
        console.error(err);
      } finally {
      }
    };

    fetchProjectData();
  }, [projectId]);

  // Calculate budget numbers
  const totalBudget = milestones.reduce(
    (sum, milestone) => sum + milestone.amount,
    0
  );
  const receivedAmount = milestones
    .filter((milestone) => milestone.status === "paid")
    .reduce((sum, milestone) => sum + milestone.amount, 0);
  const pendingAmount = totalBudget - receivedAmount;

  // Calculate project progress
  const completedMilestones = milestones.filter(
    (milestone) => milestone.status === "paid"
  ).length;
  const progress =
    milestones.length > 0
      ? Math.round((completedMilestones / milestones.length) * 100)
      : 0;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Received";
      case "submitted":
        return "Submitted";
      default:
        return "Pending";
    }
  };

  const getMilestoneStatus = (
    status: string
  ): "completed" | "active" | "pending" => {
    switch (status) {
      case "paid":
        return "completed";
      case "submitted":
        return "active";
      default:
        return "pending";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-[rgba(242,236,255,1)] text-[rgba(13,20,28,1)]";
      case "submitted":
        return "bg-[rgba(255,236,161,1)] text-[rgba(13,20,28,1)]";
      default:
        return "bg-[rgba(121,37,255,1)] text-white";
    }
  };

  // Client-side fix in handleMilestoneSubmit function
  const handleMilestoneSubmit = async (
    data: MilestoneSubmitData,
    milestoneId: string
  ) => {
    try {
      // Create FormData object for multipart form data (file uploads)
      const formData = new FormData();

      // Add text fields
      formData.append("milestoneId", milestoneId);
      formData.append("repositoryUrl", data.repositoryUrl);
      formData.append("hostingUrl", data.hostedUrl); // Note the name difference from your server
      formData.append("externalFiles", data.externalFiles);
      formData.append("notes", data.note); // Note the name difference from your server

      // Add all files
      data.files.forEach((file: string | Blob) => {
        formData.append("images", file); // Make sure this matches your server's expected field name
      });

      // Log the formData keys to verify what's being sent
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Make the API call with the correct content type for file uploads
      const response = await axios.post(
        "http://localhost:8000/submit-milestone",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Submission response:", response.data);

      // Handle successful submission
      if (response.data.success) {
        // Update local state to reflect the change
        setMilestones((prev) =>
          prev.map((milestone) =>
            milestone._id === milestoneId
              ? { ...milestone, status: "submitted" }
              : milestone
          )
        );

        // Show success message
        alert("Milestone submitted successfully");
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting milestone:", error);
      if (error instanceof Error) {
        alert(
          `Error submitting milestone: ${error.message || "Unknown error"}`
        );
      } else {
        alert("Error submitting milestone: Unknown error");
      }
    }
  };

  return (
    <div className="min-w-60 w-full max-w-[960px] overflow-hidden flex-1 shrink basis-[0%] max-md:max-w-full">
      {/* Breadcrumb */}
      <nav className="flex w-full gap-[8px_100px] font-medium justify-between flex-wrap p-4 max-md:max-w-full">
        <div className="flex items-stretch gap-2 text-base text-[rgba(79,115,150,1)] w-[132px]">
          <a href="#" className="whitespace-nowrap">
            Home
          </a>
          <span className="whitespace-nowrap">/</span>
          <span className="text-[rgba(13,20,28,1)]">All Jobs</span>
        </div>
        <div className="text-sm text-[rgba(13,20,28,1)] text-center w-[211px]">
          <div className="bg-[rgba(255,236,161,1)] flex min-w-[84px] min-h-8 max-w-full w-[211px] items-center overflow-hidden justify-center px-4 rounded-[10px]">
            <div className="self-stretch w-[179px] overflow-hidden my-auto">
              Milestone Review Pending
            </div>
          </div>
        </div>
      </nav>
      {/* Title and Progress */}
      <div className="w-full max-md:max-w-full">
        <div className="flex gap-[12px_0px] text-[32px] text-[rgba(13,20,28,1)] font-bold leading-none justify-between flex-wrap p-4">
          <h1 className="min-w-72 w-72">{project?.name}</h1>
        </div>
        <div className="w-full p-4 max-md:max-w-full">
          <div className="flex w-full gap-[40px_100px] text-[rgba(13,20,28,1)] whitespace-nowrap justify-between flex-wrap max-md:max-w-full">
            <div className="text-base font-medium w-[70px]">Progress</div>
            <div className="min-h-6 text-sm font-normal w-8">{progress}%</div>
          </div>
          <div className="rounded bg-[rgba(242,236,255,1)] flex w-full flex-col mt-3 max-md:max-w-full">
            <div
              className="rounded bg-[rgba(121,37,255,1)] flex min-h-2"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      {/* Budget Cards */}
      <div className="flex w-full items-stretch gap-[37px] flex-wrap mt-8 rounded-2xl max-md:max-w-full">
        <BudgetCard
          title="Total Budget"
          amount={`$${totalBudget.toLocaleString()}`}
        />
        <BudgetCard
          title="Received"
          amount={`$${receivedAmount.toLocaleString()}`}
          textColor="text-[rgba(52,178,51,1)]"
        />
        <BudgetCard
          title="Pending"
          amount={`$${pendingAmount.toLocaleString()}`}
          textColor="text-[rgba(105,105,105,1)]"
        />
      </div>
      {/* Timeline Section */}
      <section className="mt-12 bg-white rounded-xl border border-[#e5e8ea] overflow-hidden">
        <div className="p-6 border-b border-[#e5e8ea]">
          <h2 className="text-xl font-semibold text-[#0c141c]">
            Milestones Timeline
          </h2>
          <p className="text-[#4f7296] mt-1">
            Track your project&apos;s progress through completed milestones
          </p>
        </div>

        <div className="p-6 bg-gradient-to-b from-white to-[#f7f9fc]">
          <div className="relative pl-4">
            {milestones.map((milestone, index) => (
              <TimelineItem
                key={milestone._id}
                title={milestone.description}
                date={getFormattedDate(milestone.createdAt)}
                status={getMilestoneStatus(milestone.status)}
                isLast={index === milestones.length - 1}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Milestone Items */}
      {milestones.map((milestone) => (
        <div
          key={milestone._id}
          className="bg-white flex w-full flex-col items-stretch justify-center mt-8 py-2.5 rounded-2xl max-md:max-w-full">
          <div className="flex min-h-[72px] w-full items-center gap-[40px_100px] justify-between flex-wrap px-4 py-3 max-md:max-w-full">
            <div className="self-stretch flex min-w-60 items-center gap-4 my-auto">
              <div className="bg-[rgba(191,255,190,1)] self-stretch flex min-h-12 items-center justify-center w-12 h-12 my-auto rounded-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div className="self-stretch flex min-w-60 flex-col items-stretch justify-center w-[314px] my-auto">
                <div className="max-w-full w-[314px] overflow-hidden text-base text-[rgba(13,20,28,1)] font-medium">
                  {milestone.description}
                </div>
                <div className="w-[253px] max-w-full overflow-hidden text-sm text-[rgba(79,115,150,1)] font-normal">
                  ${milestone.amount.toLocaleString()} -{" "}
                  {getFormattedDate(milestone.updatedAt)}
                </div>
              </div>
            </div>
            <div className="self-stretch flex items-stretch gap-[25px] my-auto">
              <button className="overflow-hidden cursor-pointer text-xs text-[#ff2525] font-normal underline leading-[21px] my-auto">
                Raise Dispute
              </button>
              <button className="overflow-hidden cursor-pointer text-xs text-[rgba(121,37,255,1)] font-normal underline leading-[21px] my-auto">
                View Details
              </button>
              <div className="text-sm text-[rgba(13,20,28,1)] font-medium whitespace-nowrap text-center">
                <div
                  className={`${getStatusColor(
                    milestone.status
                  )} flex min-w-[84px] min-h-8 w-24 items-center overflow-hidden justify-center px-4 rounded-[10px]`}>
                  <div className="self-stretch w-16 overflow-hidden my-auto">
                    {getStatusLabel(milestone.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {milestones.some((m) => m.status === "pending") && (
        <div className="flex w-full text-base text-[rgba(13,20,28,1)] font-bold text-center mt-8 px-4 py-3 max-md:max-w-full">
          <div className="flex flex-wrap gap-4">
            {milestones
              .filter((m) => m.status === "pending")
              .map((milestone) => (
                <button
                  key={milestone._id}
                  onClick={() => {
                    setSelectedMilestoneId(milestone._id);
                    setSelectedMilestoneAmount(milestone.amount);
                    setIsModalOpen(true);
                  }}
                  className="bg-[rgba(121,37,255,1)] text-white flex min-w-[84px] min-h-12 items-center overflow-hidden justify-center px-5 rounded-xl">
                  Submit: {milestone.description}
                </button>
              ))}
          </div>
        </div>
      )}

      <MilestoneSubmitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        milestoneAmount={selectedMilestoneAmount || 0}
        onSubmit={(data) => handleMilestoneSubmit(data, selectedMilestoneId)}
      />
    </div>
  );
};

export default MilestoneContainer;
