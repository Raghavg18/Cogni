"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import MilestoneSubmitModal, {
  MilestoneSubmitData,
} from "./MilestoneSubmitModal";
import { Check, Calendar, FileText, AlertTriangle } from "lucide-react";
import RaiseDisputeModal, { DisputeData } from "./RaiseDisputeModal";

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

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <Check className="w-5 h-5 text-white" />;
      case "active":
        return <FileText className="w-5 h-5 text-white" />;
      case "pending":
        return <Calendar className="w-5 h-5 text-[#7925ff]" />;
    }
  };

  return (
    <div className="flex items-start gap-8 py-6 group relative hover:bg-[#f7f9fc] rounded-lg transition-colors duration-200 px-4">
      <div className="relative flex flex-col items-center">
        {/* Date display */}
        <div className="text-sm font-medium mb-4 text-[#4f7296] bg-[#f7f9fc] px-3 py-1 rounded-full">
          {date}
        </div>

        {/* Timeline dot with icon */}
        <div
          className={`w-10 h-10 rounded-full ${
            status === "pending" ? "bg-[#f2ecff]" : getStatusColor()
          } flex items-center justify-center ring-4 ring-white shadow-md relative z-10`}
        >
          {getStatusIcon()}
        </div>

        {/* Status label */}
        <span className={`text-xs font-medium mt-2 ${getStatusTextColor()}`}>
          {getStatusLabel()}
        </span>

        {/* Connecting line */}
        {!isLast && (
          <div className="absolute left-1/2 top-24 h-16 w-1 bg-gradient-to-b from-current to-[#f2ecff] transform -translate-x-1/2 -z-10" />
        )}
      </div>

      <div className="flex-1 pt-1 bg-white p-5 rounded-xl shadow-sm border border-[#f0f0f5] hover:border-[#7925ff] transition-all duration-200">
        <h3 className="text-[#0c141c] font-semibold text-lg mb-3 group-hover:text-[#7925ff] transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-[#4f7296]">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{date}</span>
        </div>
      </div>
    </div>
  );
};

const BudgetCard: React.FC<BudgetCardProps> = ({
  title,
  amount,
  textColor = "text-[#0d141c]",
}) => {
  return (
    <div className="bg-white flex flex-col overflow-hidden flex-1 p-6 rounded-xl shadow-sm border border-[#f0f0f5] hover:shadow-md transition-all duration-200">
      <div className="text-[#4f7296] text-base font-medium leading-none mb-3">
        {title}
      </div>
      <div className={`${textColor} text-3xl font-bold leading-none`}>
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
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("");
  const [selectedMilestoneAmount, setSelectedMilestoneAmount] =
    useState<number>();
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://cogni-production.up.railway.app/project/${projectId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }
        const data = await response.json();
        setProject(data.project);
        setMilestones(data.milestones);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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
        return "bg-[#e6f7e6] text-[#34b233]";
      case "submitted":
        return "bg-[#fff5cc] text-[#f59e0b]";
      default:
        return "bg-[#7925ff] text-white";
    }
  };

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
      formData.append("hostingUrl", data.hostedUrl);
      formData.append("externalFiles", data.externalFiles);
      formData.append("notes", data.note);

      // Add all files
      data.files.forEach((file: string | Blob) => {
        formData.append("images", file);
      });

      // Make the API call
      const response = await axios.post(
        "https://cogni-production.up.railway.app/submit-milestone",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
        setIsModalOpen(false);
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

  const handleDisputeSubmit = async (data: DisputeData) => {
    try {
      const response = await axios.post(
        "https://cogni-production.up.railway.app/disputes",
        data,
        {
          withCredentials: true,
        }
      );

      console.log(response.data);

      if (response.data) {
        alert("Dispute raised successfully");
        console.log(response);
        setIsModalOpen(false);
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error raising dispute:", error);
      if (error instanceof Error) {
        alert(`Error raising dispute: ${error.message || "Unknown error"}`);
      } else {
        alert("Error raising dispute: Unknown error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7925ff]"></div>
      </div>
    );
  }

  // Find the first pending milestone
  const firstPendingMilestone = milestones.find((m) => m.status === "pending");

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 py-8">
      {/* Project Status Banner */}
      <div className="bg-[#fff5cc] mb-6 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#f59e0b] p-2 rounded-full">
            <FileText className="text-white w-5 h-5" />
          </div>
          <span className="font-medium">Funded</span>
        </div>
      </div>

      {/* Project Title and Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-[#f0f0f5] p-6 mb-8">
        <h1 className="text-3xl font-bold text-[#0d141c] mb-6">
          {project?.name}
        </h1>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-medium text-[#4f7296]">
              Project Progress
            </span>
            <span className="text-lg font-bold text-[#7925ff]">
              {progress}%
            </span>
          </div>
          <div className="h-3 w-full bg-[#f2ecff] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7925ff] rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Budget Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <BudgetCard
            title="Total Budget"
            amount={`$${totalBudget.toLocaleString()}`}
          />
          <BudgetCard
            title="Received"
            amount={`$${receivedAmount.toLocaleString()}`}
            textColor="text-[#34b233]"
          />
          <BudgetCard
            title="Pending"
            amount={`$${pendingAmount.toLocaleString()}`}
            textColor="text-[#7925ff]"
          />
        </div>
      </div>

      {/* Timeline Section */}
      <section className="mt-12 bg-white rounded-xl border border-[#f0f0f5] shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-[#f0f0f5] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-[#0d141c]">
              Milestones Timeline
            </h2>
            <p className="text-[#4f7296] mt-1">
              Track your project&apos;s progress through completed milestones
            </p>
          </div>
          {firstPendingMilestone && (
            <button
              onClick={() => {
                setSelectedMilestoneId(firstPendingMilestone._id);
                setSelectedMilestoneAmount(firstPendingMilestone.amount);
                setIsModalOpen(true);
              }}
              className="bg-[#7925ff] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6615e6] transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Submit Milestone
            </button>
          )}
        </div>

        <div className="p-6 bg-gradient-to-b from-white to-[#f7f9fc]">
          <div className="relative">
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

      {/* Milestone Details Cards */}
      <div className="grid grid-cols-1 gap-4 mt-8">
        {milestones.map((milestone) => (
          <div
            key={milestone._id}
            className="bg-white border border-[#f0f0f5] hover:border-[#7925ff] rounded-xl shadow-sm p-6 transition-all duration-200"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`${
                    milestone.status === "paid"
                      ? "bg-[#e6f7e6]"
                      : milestone.status === "submitted"
                      ? "bg-[#fff5cc]"
                      : "bg-[#f2ecff]"
                  } p-3 rounded-lg`}
                >
                  <FileText
                    className={`w-6 h-6 ${
                      milestone.status === "paid"
                        ? "text-[#34b233]"
                        : milestone.status === "submitted"
                        ? "text-[#f59e0b]"
                        : "text-[#7925ff]"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0d141c] mb-1">
                    {milestone.description}
                  </h3>
                  <div className="flex items-center gap-4 text-[#4f7296]">
                    <span className="text-base font-bold text-[#7925ff]">
                      ${milestone.amount.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {getFormattedDate(milestone.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="text-[#4f7296] hover:text-[#7925ff] text-sm font-medium underline">
                  View Details
                </button>

                <div
                  className={`${getStatusColor(
                    milestone.status
                  )} px-4 py-2 rounded-lg text-sm font-medium`}
                >
                  {getStatusLabel(milestone.status)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Need Help Section */}
      <div className="mt-12 bg-[#f7f9fc] border border-[#f0f0f5] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#fff5cc] p-3 rounded-full">
            <AlertTriangle className="w-6 h-6 text-[#f59e0b]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#0d141c] mb-1">
              Need Help with Your Project?
            </h3>
            <p className="text-[#4f7296]">
              Contact our support team for assistance with your milestones
            </p>
          </div>
        </div>
        <button
          onClick={() => setDisputeModalOpen(true)}
          className="bg-white text-[#7925ff] border border-[#7925ff] px-6 py-3 rounded-lg font-medium hover:bg-[#7925ff] hover:text-white transition-colors whitespace-nowrap"
        >
          Contact Support
        </button>
      </div>

      <MilestoneSubmitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        milestoneAmount={selectedMilestoneAmount || 0}
        onSubmit={(data) => handleMilestoneSubmit(data, selectedMilestoneId)}
      />

      <RaiseDisputeModal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        onSubmit={(data) => {
          console.log(data);
          handleDisputeSubmit(data);
        }}
      />
    </div>
  );
};

export default MilestoneContainer;
