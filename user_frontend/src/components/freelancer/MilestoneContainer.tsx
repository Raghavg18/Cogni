"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { MilestoneSubmitData } from "./MilestoneSubmitModal";

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

interface MilestoneSubmissionData {
  repositoryUrl: string;
  hostingUrl: string;
  externalFiles: string;
  notes: string;
  budget: number;
  images: File[];
  milestoneId: string;
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

const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  date,
  status,
  isLast = false,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-[rgba(52,178,51,1)]";
      case "active":
        return "bg-[rgba(121,37,255,1)]";
      case "pending":
        return "bg-[rgba(242,236,255,1)]";
    }
  };

  const getLineColor = () => {
    switch (status) {
      case "completed":
        return "bg-[rgba(52,178,51,1)]";
      default:
        return "bg-[rgba(242,236,255,1)]";
    }
  };

  return (
    <div className="flex min-h-[67px] w-full items-stretch gap-2 flex-wrap mt-2 max-md:max-w-full">
      <div
        className={`flex flex-col items-center w-10 ${isLast ? "pb-3" : ""}`}
      >
        {!isLast && <div className={`${getLineColor()} flex min-h-4 w-0.5`} />}
        <div
          className={`rounded ${getStatusColor()} flex min-h-2 w-2 h-2 mt-1`}
        />
        {!isLast && (
          <div className={`${getLineColor()} flex min-h-10 w-0.5 mt-1`} />
        )}
      </div>
      <div className="min-w-60 text-base flex-1 shrink basis-[0%] py-3 max-md:max-w-full">
        <div className="w-full text-[rgba(13,20,28,1)] font-medium max-md:max-w-full">
          {title}
        </div>
        <div className="w-full text-[rgba(79,115,150,1)] font-normal max-md:max-w-full">
          {date}
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
        className={`${textColor} text-[26px] font-bold leading-none mt-[9px]`}
      >
        {amount}
      </div>
    </div>
  );
};

const MilestoneContainer: React.FC = (projectId) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("");
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/project/${projectId.projectId}`);
        console.log(response)
        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }
        const data = await response.json();
        setProject(data.project);
        setMilestones(data.milestones);
      } catch (err) {
        setError("Error loading project data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  // Calculate budget numbers
  const totalBudget = milestones.reduce((sum, milestone) => sum + milestone.amount, 0);
  const receivedAmount = milestones
    .filter((milestone) => milestone.status === "paid")
    .reduce((sum, milestone) => sum + milestone.amount, 0);
  const pendingAmount = totalBudget - receivedAmount;

  // Calculate project progress
  const completedMilestones = milestones.filter(
    (milestone) => milestone.status === "paid"
  ).length;
  const progress = milestones.length > 0
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

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getMilestoneStatus = (status: string): "completed" | "active" | "pending" => {
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

  const handleSubmit = (milestoneId: string) => {
    setSelectedMilestoneId(milestoneId);
    setIsModalOpen(true);
  };

  const ImageUploadZone: React.FC<{
    onImageUpload: (files: File[]) => void;
    images: File[];
  }> = ({ onImageUpload, images }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragIn = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragOut = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (files.length > 0) {
        onImageUpload(files);
      }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        const files = Array.from(e.target.files).filter((file) =>
          file.type.startsWith("image/")
        );
        onImageUpload(files);
      }
    };

    return (
      <div className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            ${
              isDragging
                ? "border-[rgba(121,37,255,1)] bg-[rgba(242,236,255,1)]"
                : "border-gray-300"
            }
            hover:border-[rgba(121,37,255,1)] transition-colors`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <input
            type="file"
            id="fileInput"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-600">
              Drag and drop images here, or click to select files
            </p>
          </div>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {images.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    const newImages = [...images];
                    newImages.splice(index, 1);
                    onImageUpload(newImages);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 
                    opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const SubmitMilestoneModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MilestoneSubmissionData) => void;
    milestoneId: string;
  }> = ({ isOpen, onClose, onSubmit, milestoneId }) => {
    const [formData, setFormData] = useState<MilestoneSubmissionData>({
      repositoryUrl: "",
      hostingUrl: "",
      externalFiles: "",
      notes: "",
      budget: 0,
      images: [],
      milestoneId: milestoneId,
    });

    useEffect(() => {
      // Set the milestone ID when it changes
      setFormData(prev => ({ ...prev, milestoneId }));
      
      // If the milestone exists, set the budget from the milestone
      const milestone = milestones.find(m => m._id === milestoneId);
      if (milestone) {
        setFormData(prev => ({ ...prev, budget: milestone.amount }));
      }
    }, [milestoneId]);

    if (!isOpen) return null;

    const handleImageUpload = (files: File[]) => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    };

    return (
      <div className="fixed inset-0 bg-[#00000060] bg-opacity-10 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">Submit Milestone</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(formData);
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Repository URL
                </label>
                <input
                  type="url"
                  value={formData.repositoryUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      repositoryUrl: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hosting URL
                </label>
                <input
                  type="url"
                  value={formData.hostingUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hostingUrl: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  External Files
                </label>
                <input
                  type="text"
                  value={formData.externalFiles}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      externalFiles: e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full border rounded-lg p-2 min-h-[100px]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload Images
                </label>
                <ImageUploadZone
                  onImageUpload={handleImageUpload}
                  images={formData.images}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[rgba(121,37,255,1)] text-white rounded-lg hover:bg-opacity-90"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Fixed handleMilestoneSubmit function
const handleMilestoneSubmit = async (data: MilestoneSubmitData, milestoneId: string) => {
  try {
    // Create a FormData object to handle file uploads
    const formData = new FormData();
    
    // Add the milestone ID
    formData.append('milestoneId', milestoneId);
    
    // Add other fields (matching the backend field names)
    formData.append('repositoryUrl', data.repositoryUrl);
    formData.append('hostingUrl', data.hostedUrl); // Note: backend uses hostingUrl, frontend uses hostedUrl
    formData.append('externalFiles', data.externalFiles);
    formData.append('notes', data.note); // Note: backend uses notes, frontend uses note
    
    // Add each file individually
    if (data.files && data.files.length > 0) {
      data.files.forEach((file, index) => {
        formData.append('images', file);
      });
    }
    
    // Log the FormData for debugging (this won't show the actual content)
    console.log("Sending FormData:", formData);
    
    // Send with the correct content type (FormData sets it automatically)
    const response = await axios.post(
      "http://localhost:8000/submit-milestone", 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log(response);
    
    if (!response) {
      throw new Error("Failed to submit milestone");
    }

    // Update the local state to reflect changes
    setMilestones(prev => 
      prev.map(milestone => 
        milestone._id === milestoneId 
          ? { ...milestone, status: "submitted" } 
          : milestone
      )
    );

    setIsModalOpen(false);
  } catch (error) {
    console.error("Error submitting milestone:", error);
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
          <h1 className="min-w-72 w-72">{project.name}</h1>
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
      <section className="w-full mt-8 max-md:max-w-full">
        <h2 className="text-lg text-[rgba(13,20,28,1)] font-bold leading-none pt-4 pb-2 px-4 max-md:max-w-full">
          Milestones Timeline
        </h2>
        <div className="w-full px-4 max-md:max-w-full">
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
      </section>

      {/* Milestone Items */}
      {milestones.map((milestone) => (
        <div 
          key={milestone._id}
          className="bg-white flex w-full flex-col items-stretch justify-center mt-8 py-2.5 rounded-2xl max-md:max-w-full"
        >
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
                  strokeLinejoin="round"
                >
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
                  ${milestone.amount.toLocaleString()} - {getFormattedDate(milestone.updatedAt)}
                </div>
              </div>
            </div>
            <div className="self-stretch flex items-stretch gap-[25px] w-[194px] my-auto">
              <button className="overflow-hidden text-xs text-[rgba(121,37,255,1)] font-normal underline leading-[21px] my-auto">
                View Details
              </button>
              <div className="text-sm text-[rgba(13,20,28,1)] font-medium whitespace-nowrap text-center">
                <div className={`${getStatusColor(milestone.status)} flex min-w-[84px] min-h-8 w-24 items-center overflow-hidden justify-center px-4 rounded-[10px]`}>
                  <div className="self-stretch w-16 overflow-hidden my-auto">
                    {getStatusLabel(milestone.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Submit Button - Only show for pending milestones */}
      {milestones.some(m => m.status === "pending") && (
        <div className="flex w-full text-base text-[rgba(13,20,28,1)] font-bold text-center mt-8 px-4 py-3 max-md:max-w-full">
          <div className="flex flex-wrap gap-4">
            {milestones
              .filter(m => m.status === "pending")
              .map(milestone => (
                <button
                  key={milestone._id}
                  onClick={() => handleSubmit(milestone._id)}
                  className="bg-[rgba(121,37,255,1)] text-white flex min-w-[84px] min-h-12 items-center overflow-hidden justify-center px-5 rounded-xl"
                >
                  <div className="self-stretch overflow-hidden my-auto">
                    Submit: {milestone.description}
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
      
      <SubmitMilestoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => handleMilestoneSubmit(data, selectedMilestone?._id || '')}
        milestoneId={selectedMilestoneId}
      />
    </div>
  );
};

export default MilestoneContainer;