"use client";
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import PageTitle from "@/components/jobs/PageTitle";
import { Milestone } from "@/components/jobs/MilestoneTimeline";
import { XCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const CreateJob: React.FC = () => {
  const router = useRouter();
  // Project details state
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Milestones state
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Form visibility state
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  // New milestone form state
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    date: "",
    amount: "",
  });

  // Error state
  const [error, setError] = useState("");

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "All Jobs", href: "/jobs", active: true },
  ];

  const handleCreateProject = async () => {
    if (milestones.length === 0) {
      setError("Please add at least one milestone before creating the project");
      return;
    }
    if (!projectTitle.trim()) {
      setError("Please enter a project title");
      return;
    }
    setError("");
    const projectData = {
      name: projectTitle,
      description: projectDescription,
      milestones: milestones,
    };
    const response = await axios.post(
      "http://localhost:8000/create-project",
      projectData,
    );
    router.push("/funding/" + response.data.projectId);
  };

  const handleAddMilestone = () => {
    setShowMilestoneForm(!showMilestoneForm);
    setError("");
  };

  const handleMilestoneInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewMilestone({
      ...newMilestone,
      [name]: value,
    });
  };

  const handleCreateMilestone = () => {
    // Validate milestone data
    if (!newMilestone.title.trim()) {
      setError("Milestone title is required");
      return;
    }

    if (!newMilestone.date.trim()) {
      setError("Milestone date is required");
      return;
    }

    if (!newMilestone.amount.trim()) {
      setError("Milestone amount is required");
      return;
    }

    // Format the date for display
    const dateObj = new Date(newMilestone.date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // Create a new milestone
    const milestone: Milestone = {
      title: newMilestone.title,
      description: newMilestone.description,
      date: formattedDate,
      amount: newMilestone.amount,
      completed: false,
      isLast: true,
    };

    // Update the previous last milestone if it exists
    const updatedMilestones = milestones.map((m) => ({
      ...m,
      isLast: false,
    }));

    // Add the new milestone
    setMilestones([...updatedMilestones, milestone]);

    // Reset the form
    setNewMilestone({
      title: "",
      description: "",
      date: "",
      amount: "",
    });

    // Hide the form
    setShowMilestoneForm(false);

    // Clear any errors
    setError("");
  };

  const handleRemoveMilestone = (index: number) => {
    const updatedMilestones = [...milestones];
    updatedMilestones.splice(index, 1);

    // If we have milestones left, make sure the last one has isLast=true
    if (updatedMilestones.length > 0) {
      updatedMilestones[updatedMilestones.length - 1].isLast = true;
    }

    setMilestones(updatedMilestones);
  };

  // Enhanced Timeline Component
  const EnhancedMilestoneTimeline: React.FC<{ milestones: Milestone[] }> = ({
    milestones,
  }) => {
    return (
      <div className="px-6 py-4">
        {milestones.map((milestone, index) => (
          <div key={index} className="relative ml-6 mb-6">
            {/* Vertical line */}
            {index < milestones.length - 1 && (
              <div
                className="absolute left-3 top-8 h-full w-0.5 bg-[rgba(229,232,235,1)]"
                style={{ transform: "translateX(-50%)" }}
              ></div>
            )}

            {/* Timeline node */}
            <div className="absolute left-0 top-2 -ml-3 h-6 w-6 rounded-full bg-[rgba(79,115,150,1)] border-4 border-white flex items-center justify-center">
              {milestone.completed ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </div>

            {/* Milestone content */}
            <div className="flex justify-between items-start">
              <div className="ml-6">
                <div className="flex items-center">
                  <h4 className="text-base font-semibold text-[rgba(13,20,28,1)]">
                    {milestone.title}
                  </h4>
                  <button
                    onClick={() => handleRemoveMilestone(index)}
                    className="ml-2 text-[rgba(79,115,150,1)] hover:text-red-500"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
                <div className="text-sm text-[rgba(79,115,150,1)] mt-1">
                  {milestone.date}
                </div>
                {milestone.description && (
                  <div className="text-sm text-[rgba(79,115,150,1)] mt-1">
                    {milestone.description}
                  </div>
                )}
                {milestone.amount && (
                  <div className="bg-[rgba(247,250,252,1)] text-[rgba(13,20,28,1)] text-sm font-medium px-3 py-1 rounded-full mt-2 inline-block">
                    Amount: {milestone.amount}
                  </div>
                )}
              </div>

              <div className="mr-2">
                {milestone.completed ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="bg-[rgba(247,250,252,1)] min-h-[800px] w-full overflow-hidden max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <Header />
          <main className="flex w-full justify-center flex-1 h-full px-4 md:px-8 lg:px-40 py-5 max-md:max-w-full">
            <div className="flex min-w-60 w-full max-w-[960px] flex-col overflow-hidden items-stretch flex-1 shrink basis-[0%] max-md:max-w-full">
              <div className="bg-white rounded-lg shadow-sm mt-6 p-3">
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
                  onAction={handleCreateProject}
                />

                {/* Project Details Section */}
                <div className="px-6 py-4 border-b border-[rgba(229,232,235,1)]">
                  <div className="mb-4">
                    <label
                      htmlFor="projectTitle"
                      className="block text-sm font-medium text-[rgba(13,20,28,1)] mb-1"
                    >
                      Project Title
                    </label>
                    <input
                      type="text"
                      id="projectTitle"
                      className="w-full p-2 border border-[rgba(229,232,235,1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(79,115,150,1)]"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="Enter project title"
                    />
                  </div>

                  <div className="mb-2">
                    <label
                      htmlFor="projectDescription"
                      className="block text-sm font-medium text-[rgba(13,20,28,1)] mb-1"
                    >
                      Project Description
                    </label>
                    <textarea
                      id="projectDescription"
                      className="w-full p-2 border border-[rgba(229,232,235,1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(79,115,150,1)]"
                      rows={4}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe the project details..."
                    />
                  </div>
                </div>

                {/* Milestones Section */}
                <div className="px-6 py-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-[rgba(13,20,28,1)]">
                      Milestones
                    </h2>
                    <button
                      onClick={handleAddMilestone}
                      className="flex items-center bg-[rgba(79,115,150,1)] hover:bg-[rgba(60,90,120,1)] text-white px-4 py-2 rounded-md"
                    >
                      <span className="mr-1">+</span> Create Milestone
                    </button>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="text-red-600 mb-4 p-2 bg-red-50 rounded-md border border-red-200">
                      {error}
                    </div>
                  )}

                  {/* Milestone Form Dropdown */}
                  {showMilestoneForm && (
                    <div className="bg-[rgba(247,250,252,1)] p-4 rounded-md mb-6 border border-[rgba(229,232,235,1)]">
                      <h3 className="font-medium text-[rgba(13,20,28,1)] mb-3">
                        New Milestone
                      </h3>

                      <div className="mb-3">
                        <label
                          htmlFor="milestoneTitle"
                          className="block text-sm font-medium text-[rgba(13,20,28,1)] mb-1"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="milestoneTitle"
                          name="title"
                          className="w-full p-2 border border-[rgba(229,232,235,1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(79,115,150,1)]"
                          value={newMilestone.title}
                          onChange={handleMilestoneInputChange}
                          placeholder="Milestone title"
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="milestoneDescription"
                          className="block text-sm font-medium text-[rgba(13,20,28,1)] mb-1"
                        >
                          Description
                        </label>
                        <textarea
                          id="milestoneDescription"
                          name="description"
                          className="w-full p-2 border border-[rgba(229,232,235,1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(79,115,150,1)]"
                          rows={2}
                          value={newMilestone.description}
                          onChange={handleMilestoneInputChange}
                          placeholder="Milestone description"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label
                            htmlFor="milestoneDate"
                            className="block text-sm font-medium text-[rgba(13,20,28,1)] mb-1"
                          >
                            Date
                          </label>
                          <input
                            type="date"
                            id="milestoneDate"
                            name="date"
                            className="w-full p-2 border border-[rgba(229,232,235,1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(79,115,150,1)]"
                            value={newMilestone.date}
                            onChange={handleMilestoneInputChange}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="milestoneAmount"
                            className="block text-sm font-medium text-[rgba(13,20,28,1)] mb-1"
                          >
                            Amount
                          </label>
                          <input
                            type="text"
                            id="milestoneAmount"
                            name="amount"
                            className="w-full p-2 border border-[rgba(229,232,235,1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(79,115,150,1)]"
                            value={newMilestone.amount}
                            onChange={handleMilestoneInputChange}
                            placeholder="$0.00"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowMilestoneForm(false)}
                          className="bg-[rgba(229,232,235,1)] hover:bg-[rgba(210,215,220,1)] text-[rgba(13,20,28,1)] px-4 py-2 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateMilestone}
                          className="bg-[rgba(79,115,150,1)] hover:bg-[rgba(60,90,120,1)] text-white px-4 py-2 rounded-md"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Timeline of Milestones */}
                  {milestones.length > 0 ? (
                    <div className="mb-6 border border-[rgba(229,232,235,1)] rounded-md">
                      <EnhancedMilestoneTimeline milestones={milestones} />
                    </div>
                  ) : (
                    <div className="text-[rgba(79,115,150,1)] italic mb-6 bg-[rgba(247,250,252,1)] p-4 rounded-md border border-[rgba(229,232,235,1)] text-center">
                      No milestones added yet. Click &quot;Create
                      Milestone&quot; to add one.
                    </div>
                  )}

                  {/* Create Project Button */}
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={handleCreateProject}
                      className="bg-[rgba(79,115,150,1)] hover:bg-[rgba(60,90,120,1)] text-white px-8 py-3 rounded-md font-medium text-base"
                      disabled={milestones.length === 0}
                    >
                      Create Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;

