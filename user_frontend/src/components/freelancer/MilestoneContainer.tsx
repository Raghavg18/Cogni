"use client";
import React, { useState } from "react";

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

const MilestoneContainer: React.FC = () => {
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
  }> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<MilestoneSubmissionData>({
      repositoryUrl: "",
      hostingUrl: "",
      externalFiles: "",
      notes: "",
      budget: 0,
      images: [],
    });

    if (!isOpen) return null;

    const handleImageUpload = (files: File[]) => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    };

    const handleMilestoneSubmit = async (data: MilestoneSubmissionData) => {
      try {
        const formData = new FormData();

        // Append regular data
        formData.append("repositoryUrl", data.repositoryUrl);
        formData.append("hostingUrl", data.hostingUrl);
        formData.append("externalFiles", data.externalFiles);
        formData.append("notes", data.notes);
        formData.append("budget", data.budget.toString());

        data.images.forEach((image, index) => {
          formData.append(`image${index}`, image);
        });

        const response = await fetch("/api/milestones/submit", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to submit milestone");
        }

        setIsModalOpen(false);
      } catch (error) {
        console.error("Error submitting milestone:", error);
      }
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
                <label className="block text-sm font-medium mb-1">Budget</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      budget: Number(e.target.value),
                    }))
                  }
                  className="w-full border rounded-lg p-2"
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

  // Modify the MilestoneContainer component by adding these lines after the existing state declarations
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Replace the existing handleSubmit function with this:
  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  const handleMilestoneSubmit = async (data: MilestoneSubmissionData) => {
    try {
      const response = await fetch("/api/milestones/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit milestone");
      }

      setIsModalOpen(false);
      // Add success notification here if needed
    } catch (error) {
      console.error("Error submitting milestone:", error);
      // Add error notification here if needed
    }
  };

  const timelineItems = [
    { title: "Job started", date: "Jun 1, 2023", status: "completed" as const },
    { title: "Designing", date: "Jun 15, 2023", status: "completed" as const },
    {
      title: "Code Review: 1",
      date: "July 15, 2023",
      status: "active" as const,
    },
    {
      title: "Code Review: 2",
      date: "July 30, 2023",
      status: "active" as const,
    },
    {
      title: "Testing",
      date: "August 10, 2023",
      status: "active" as const,
      isLast: true,
    },
  ];

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
          <h1 className="min-w-72 w-72">Website Redesign</h1>
        </div>
        <div className="w-full p-4 max-md:max-w-full">
          <div className="flex w-full gap-[40px_100px] text-[rgba(13,20,28,1)] whitespace-nowrap justify-between flex-wrap max-md:max-w-full">
            <div className="text-base font-medium w-[70px]">Progress</div>
            <div className="min-h-6 text-sm font-normal w-8">40%</div>
          </div>
          <div className="rounded bg-[rgba(242,236,255,1)] flex w-full flex-col mt-3 max-md:max-w-full">
            <div
              className="rounded bg-[rgba(121,37,255,1)] flex min-h-2"
              style={{ width: `40%` }}
            />
          </div>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="flex w-full items-stretch gap-[37px] flex-wrap mt-8 rounded-2xl max-md:max-w-full">
        <BudgetCard title="Total Budget" amount="$5,000" />
        <BudgetCard
          title="Recieved"
          amount="$2,000"
          textColor="text-[rgba(52,178,51,1)]"
        />
        <BudgetCard
          title="Pending"
          amount="$3,000"
          textColor="text-[rgba(105,105,105,1)]"
        />
      </div>

      {/* Timeline Section */}
      <section className="w-full mt-8 max-md:max-w-full">
        <h2 className="text-lg text-[rgba(13,20,28,1)] font-bold leading-none pt-4 pb-2 px-4 max-md:max-w-full">
          Milestones Timeline
        </h2>
        <div className="w-full px-4 max-md:max-w-full">
          <div className="flex min-h-[67px] w-full items-stretch gap-2 flex-wrap max-md:max-w-full">
            <div className="flex flex-col items-center w-10 pt-5">
              <div className="rounded bg-[rgba(52,178,51,1)] flex min-h-2 w-2 h-2" />
              <div className="bg-[rgba(52,178,51,1)] flex min-h-10 w-0.5 mt-1" />
            </div>
            <div className="min-w-60 text-base flex-1 shrink basis-[0%] py-3 max-md:max-w-full">
              <div className="w-full text-[rgba(13,20,28,1)] font-medium max-md:max-w-full">
                Job started
              </div>
              <div className="w-full text-[rgba(79,115,150,1)] font-normal max-md:max-w-full">
                Jun 1, 2023
              </div>
            </div>
          </div>

          {timelineItems.slice(1).map((item, index) => (
            <TimelineItem
              key={index}
              title={item.title}
              date={item.date}
              status={item.status}
              isLast={item.isLast}
            />
          ))}
        </div>
      </section>

      {/* Milestone Item */}
      <div className="bg-white flex w-full flex-col items-stretch justify-center mt-8 py-2.5 rounded-2xl max-md:max-w-full">
        <div className="flex min-h-[72px] w-full items-center gap-[40px_100px] justify-between flex-wrap px-4 py-3 max-md:max-w-full">
          <div className="self-stretch flex min-w-60 items-center gap-4 my-auto">
            <div className="bg-[rgba(191,255,190,1)] self-stretch flex min-h-12 items-center justify-center w-12 h-12 my-auto rounded-lg">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/4a4cf1ecf9034f01a73614fde549ea42/6f1585f5997db10128b849c0afc62280322437c9?placeholderIfAbsent=true"
                alt="Milestone 1: Design"
                className="aspect-[1] object-contain w-6 self-stretch my-auto"
              />
            </div>
            <div className="self-stretch flex min-w-60 flex-col items-stretch justify-center w-[314px] my-auto">
              <div className="max-w-full w-[314px] overflow-hidden text-base text-[rgba(13,20,28,1)] font-medium">
                Milestone 1: Design
              </div>
              <div className="w-[253px] max-w-full overflow-hidden text-sm text-[rgba(79,115,150,1)] font-normal">
                Payment was Settled on Jun 18, 2023
              </div>
            </div>
          </div>
          <div className="self-stretch flex items-stretch gap-[25px] w-[194px] my-auto">
            <button className="overflow-hidden text-xs text-[rgba(121,37,255,1)] font-normal underline leading-[21px] my-auto">
              View Details
            </button>
            <div className="text-sm text-[rgba(13,20,28,1)] font-medium whitespace-nowrap text-center">
              <div className="bg-[rgba(242,236,255,1)] flex min-w-[84px] min-h-8 w-24 items-center overflow-hidden justify-center px-4 rounded-[10px]">
                <div className="self-stretch w-16 overflow-hidden my-auto">
                  Received
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex w-full text-base text-[rgba(13,20,28,1)] font-bold text-center mt-8 px-4 py-3 max-md:max-w-full">
        <button
          onClick={handleSubmit}
          className="bg-[rgba(232,237,242,1)] flex min-w-[84px] min-h-12 w-[179px] max-w-[480px] items-center overflow-hidden justify-center px-5 rounded-xl"
        >
          <div className="self-stretch w-[139px] overflow-hidden my-auto">
            Submit Milestone
          </div>
        </button>
      </div>
      <SubmitMilestoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleMilestoneSubmit}
      />
    </div>
  );
};

export default MilestoneContainer;
