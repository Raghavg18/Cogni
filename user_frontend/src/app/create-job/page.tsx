"use client";
import React, { useEffect, useState } from "react";
import { XCircle, Wand2, Plus, Calendar, DollarSign } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Header from "@/components/layout/Header";

const CreateJob: React.FC = () => {
  const router = useRouter();
  const { isClient, username } = useAuth();

  useEffect(() => {
    if (!isClient) {
      router.push("/freelancer-dashboard");
    }
  }, [isClient, router]);

  // Project details state
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Milestones state
  const [milestones, setMilestones] = useState<
    Array<{
      title: string;
      description: string;
      date: string;
      amount: string;
      completed: boolean;
      isLast: boolean;
    }>
  >([]);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // New milestone form state
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    date: "",
    amount: "",
  });

  // Error state
  const [error, setError] = useState("");

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

    try {
      const projectData = {
        name: projectTitle,
        description: projectDescription,
        milestones: milestones,
        clientId: username,
      };

      const response = await axios.post(
        "http://localhost:8000/create-project",
        projectData
      );

      router.push("/funding/" + response.data.projectId);
    } catch (err) {
      setError("Failed to create project. Please try again.");
      console.error("Error creating project:", err);
    }
  };

  const handleAddMilestone = () => {
    setShowMilestoneForm(!showMilestoneForm);
    setError("");
  };

  const handleMilestoneInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    const milestone = {
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

  const generateMilestones = async () => {
    if (!projectTitle.trim() || !projectDescription.trim()) {
      setError("Please enter both project title and description");
      return;
    }

    try {
      setError("");
      setIsGenerating(true);

      const response = await axios.post(
        "http://localhost:8000/generate-milestones",
        {
          projectTitle,
          projectDescription,
        }
      );

      if (response.data.success) {
        // Convert API response to the format your app uses
        const generatedMilestones = response.data.milestones.map(
          (
            milestone: {
              title: string;
              description: string;
              formattedDate: string;
              amount: number;
            },
            index: number,
            array: { length: number }
          ) => ({
            title: milestone.title,
            description: milestone.description,
            date: milestone.formattedDate,
            amount: milestone.amount.toString(),
            completed: false,
            isLast: index === array.length - 1,
          })
        );

        setMilestones(generatedMilestones);
      } else {
        setError("Failed to generate milestones: " + response.data.message);
      }
    } catch (error) {
      console.error("Error generating milestones:", error);
      setError("Error connecting to milestone generation service");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex-col justify-center items-center">
      <Header />
      <div className="w-full max-w-3xl mx-auto px-4 py-5">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden p-8">
          <h1 className="font-bold text-2xl text-center mb-8">Create a New Project</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Project Details Section */}
          <div className="mb-8">
            <h2 className="font-medium text-lg mb-4">Project Details</h2>
            
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor="projectTitle" className="block mb-2 text-sm">Project Title</label>
                <input
                  type="text"
                  id="projectTitle"
                  className="w-full h-12 border border-[#465FF166] rounded-lg p-4 focus:outline-none focus:border-2 focus:border-[#7925FF]"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <label htmlFor="projectDescription" className="block mb-2 text-sm">Project Description</label>
                <textarea
                  id="projectDescription"
                  className="w-full border border-[#465FF166] rounded-lg p-4 focus:outline-none focus:border-2 focus:border-[#7925FF]"
                  rows={4}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your project requirements and expectations..."
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E1E1E4] my-6"></div>

          {/* Milestones Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-medium text-lg">
                Project Milestones {milestones.length > 0 && `(${milestones.length})`}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={generateMilestones}
                  disabled={isGenerating || !projectTitle || !projectDescription}
                  className={`flex items-center justify-center rounded-lg px-4 py-2 text-sm
                    ${!projectTitle || !projectDescription || isGenerating
                      ? "bg-[#E1E1E4] text-[#9C9AA5] cursor-not-allowed"
                      : "bg-[#D1D7FB] text-[#465FF1] hover:bg-[#B9C3F8]"
                    }`}>
                  <Wand2 size={16} className="mr-2" />
                  {isGenerating ? "Generating..." : "Auto-Generate"}
                </button>
                <button
                  onClick={handleAddMilestone}
                  className="flex items-center justify-center bg-[#7925FF] text-white rounded-lg px-4 py-2 text-sm transition-colors hover:bg-[#6817E2]">
                  <Plus size={16} className="mr-2" />
                  Add Milestone
                </button>
              </div>
            </div>

            {/* Milestone Form */}
            {showMilestoneForm && (
              <div className="bg-[#F5F5F7] p-6 rounded-lg mb-6 border border-[#E1E1E4]">
                <h3 className="font-medium text-lg mb-4">New Milestone</h3>

                <div className="flex flex-col gap-6">
                  <div>
                    <label htmlFor="milestoneTitle" className="block mb-2 text-sm">
                      Title
                    </label>
                    <input
                      type="text"
                      id="milestoneTitle"
                      name="title"
                      className="w-full h-12 border border-[#465FF166] rounded-lg p-4 focus:outline-none focus:border-2 focus:border-[#7925FF]"
                      value={newMilestone.title}
                      onChange={handleMilestoneInputChange}
                      placeholder="E.g., Initial Design, MVP Development"
                    />
                  </div>

                  <div>
                    <label htmlFor="milestoneDescription" className="block mb-2 text-sm">
                      Description
                    </label>
                    <textarea
                      id="milestoneDescription"
                      name="description"
                      className="w-full border border-[#465FF166] rounded-lg p-4 focus:outline-none focus:border-2 focus:border-[#7925FF]"
                      rows={3}
                      value={newMilestone.description}
                      onChange={handleMilestoneInputChange}
                      placeholder="Describe what will be delivered in this milestone"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="milestoneDate" className="block mb-2 text-sm">
                        Due Date
                      </label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9C9AA5]" />
                        <input
                          type="date"
                          id="milestoneDate"
                          name="date"
                          className="w-full h-12 border border-[#465FF166] rounded-lg p-4 pl-10 focus:outline-none focus:border-2 focus:border-[#7925FF]"
                          value={newMilestone.date}
                          onChange={handleMilestoneInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="milestoneAmount" className="block mb-2 text-sm">
                        Payment Amount
                      </label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9C9AA5]" />
                        <input
                          type="text"
                          id="milestoneAmount"
                          name="amount"
                          className="w-full h-12 border border-[#465FF166] rounded-lg p-4 pl-10 focus:outline-none focus:border-2 focus:border-[#7925FF]"
                          value={newMilestone.amount}
                          onChange={handleMilestoneInputChange}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setShowMilestoneForm(false)}
                      className="px-4 py-2 rounded-lg text-[#9C9AA5] hover:bg-[#E1E1E4] transition-colors text-sm">
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateMilestone}
                      className="px-4 py-2 rounded-lg bg-[#7925FF] text-white transition-colors text-sm hover:bg-[#6817E2]">
                      Save Milestone
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline of Milestones */}
            {milestones.length > 0 ? (
              <div className="border border-[#E1E1E4] rounded-lg overflow-hidden mb-8">
                <div className="divide-y divide-[#E1E1E4]">
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="p-5 hover:bg-[#F5F5F7] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 h-6 w-6 rounded-full bg-[#7925FF] flex items-center justify-center text-white text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">
                                {milestone.title}
                              </h4>
                              <button
                                onClick={() => handleRemoveMilestone(index)}
                                className="text-[#9C9AA5] hover:text-red-500 transition-colors"
                                aria-label="Remove milestone"
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                            <p className="text-sm text-[#9C9AA5] mt-1">
                              {milestone.date}
                            </p>
                            {milestone.description && (
                              <p className="text-sm text-[#9C9AA5] mt-2 max-w-3xl">
                                {milestone.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="bg-[#F5F5F7] text-[#7925FF] text-sm font-medium px-4 py-2 rounded-full">
                          ${parseFloat(milestone.amount).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-[#F5F5F7] rounded-lg border border-dashed border-[#E1E1E4] mb-8">
                <p className="text-[#9C9AA5] mb-3">
                  No milestones added yet
                </p>
                <p className="text-sm text-[#9C9AA5] max-w-lg">
                  Break your project into stages with clear deliverables, timeframes, and payment amounts
                </p>
              </div>
            )}

            {/* Create Project Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleCreateProject}
                disabled={milestones.length === 0}
                className={`w-full rounded-lg font-bold py-3.5 transition-colors
                  ${milestones.length === 0
                    ? "bg-[#E1E1E4] text-[#9C9AA5] cursor-not-allowed"
                    : "bg-[#7925FF] hover:bg-[#6817E2] text-white"
                  }`}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;