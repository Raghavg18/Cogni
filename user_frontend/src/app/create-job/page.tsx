"use client";
import React, { useEffect, useState } from "react";
import { XCircle, Wand2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const CreateJob: React.FC = () => {
  const router = useRouter();
  const { isClient, username } = useAuth();
  
  useEffect(() => {
    if (!isClient) {
      router.push('/freelancer-dashboard');
    }
  }, [isClient, router]);
  
  // Project details state
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Milestones state
  const [milestones, setMilestones] = useState([]);
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
        clientId: username
      };
      
      const response = await axios.post(
        "http://localhost:8000/create-project",
        projectData,
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
        const generatedMilestones = response.data.milestones.map((milestone: { title: any; description: any; formattedDate: any; amount: { toString: () => any; }; }, index: number, array: string | any[]) => ({
          title: milestone.title,
          description: milestone.description,
          date: milestone.formattedDate,
          amount: milestone.amount.toString(),
          completed: false,
          isLast: index === array.length - 1,
        }));
        
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
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Header Component would go here */}
      <main className="max-w-7xl mx-auto p-8 md:p-12 lg:p-16">
        <div className="mb-12">
          <h1 className="font-bold text-[#0c141c] text-[32px] leading-10 mb-3">
            Create a New Project
          </h1>
          <p className="text-[#4f7296] text-lg max-w-2xl">
            Define your project details and set up milestones to track progress and payments
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e5e8ea] shadow-sm overflow-hidden">
          {/* Project Details Section */}
          <div className="p-6 border-b border-[#e5e8ea]">
            <h2 className="font-semibold text-[#0c141c] text-xl mb-6">
              Project Details
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="projectTitle"
                  className="block text-sm font-medium text-[#0c141c] mb-2"
                >
                  Project Title
                </label>
                <input
                  type="text"
                  id="projectTitle"
                  className="w-full p-3 border border-[#e5e8ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f7296] bg-white"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Enter a clear, descriptive title for your project"
                />
              </div>

              <div>
                <label
                  htmlFor="projectDescription"
                  className="block text-sm font-medium text-[#0c141c] mb-2"
                >
                  Project Description
                </label>
                <textarea
                  id="projectDescription"
                  className="w-full p-3 border border-[#e5e8ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f7296] bg-white"
                  rows={5}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe the project scope, requirements, and expectations in detail..."
                />
              </div>
            </div>
          </div>

          {/* Milestones Section */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="font-semibold text-[#0c141c] text-xl mb-4 sm:mb-0">
                Project Milestones {milestones.length > 0 && `(${milestones.length})`}
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={generateMilestones}
                  disabled={isGenerating || !projectTitle || !projectDescription}
                  className={`flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium
                    ${(!projectTitle || !projectDescription || isGenerating) 
                    ? 'bg-[#e5e8ea] text-[#8a9db0] cursor-not-allowed' 
                    : 'bg-[#e9f4ff] text-[#4f7296] hover:bg-[#d5e8ff]'}`}
                >
                  <Wand2 size={16} className="mr-2" />
                  {isGenerating ? 'Generating...' : 'Auto-Generate'}
                </button>
                <button
                  onClick={handleAddMilestone}
                  className="flex items-center justify-center bg-[#4f7296] hover:bg-[#3c5a78] text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  <span className="mr-2">+</span> Add Milestone
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="text-red-600 mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Milestone Form */}
            {showMilestoneForm && (
              <div className="bg-[#f7f9fc] p-6 rounded-lg mb-6 border border-[#e5e8ea]">
                <h3 className="font-medium text-[#0c141c] text-lg mb-4">
                  New Milestone
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="milestoneTitle"
                      className="block text-sm font-medium text-[#0c141c] mb-2"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="milestoneTitle"
                      name="title"
                      className="w-full p-3 border border-[#e5e8ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f7296] bg-white"
                      value={newMilestone.title}
                      onChange={handleMilestoneInputChange}
                      placeholder="E.g., Initial Design, MVP Development"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="milestoneDescription"
                      className="block text-sm font-medium text-[#0c141c] mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="milestoneDescription"
                      name="description"
                      className="w-full p-3 border border-[#e5e8ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f7296] bg-white"
                      rows={3}
                      value={newMilestone.description}
                      onChange={handleMilestoneInputChange}
                      placeholder="Describe what will be delivered in this milestone"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="milestoneDate"
                        className="block text-sm font-medium text-[#0c141c] mb-2"
                      >
                        Due Date
                      </label>
                      <input
                        type="date"
                        id="milestoneDate"
                        name="date"
                        className="w-full p-3 border border-[#e5e8ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f7296] bg-white"
                        value={newMilestone.date}
                        onChange={handleMilestoneInputChange}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="milestoneAmount"
                        className="block text-sm font-medium text-[#0c141c] mb-2"
                      >
                        Payment Amount
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#4f7296]">$</span>
                        <input
                          type="text"
                          id="milestoneAmount"
                          name="amount"
                          className="w-full p-3 pl-8 border border-[#e5e8ea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f7296] bg-white"
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
                      className="px-4 py-2.5 rounded-lg text-[#4f7296] hover:bg-[#e5e8ea] transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateMilestone}
                      className="px-4 py-2.5 rounded-lg bg-[#4f7296] hover:bg-[#3c5a78] text-white transition-colors text-sm font-medium"
                    >
                      Save Milestone
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline of Milestones */}
            {milestones.length > 0 ? (
              <div className="border border-[#e5e8ea] rounded-lg overflow-hidden mb-8">
                <div className="divide-y divide-[#e5e8ea]">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="p-5 hover:bg-[#f7f9fc] transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 h-6 w-6 rounded-full bg-[#4f7296] flex items-center justify-center text-white text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-[#0c141c]">
                                {milestone.title}
                              </h4>
                              <button
                                onClick={() => handleRemoveMilestone(index)}
                                className="text-[#8a9db0] hover:text-red-500 transition-colors"
                                aria-label="Remove milestone"
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                            <p className="text-sm text-[#4f7296] mt-1">
                              {milestone.date}
                            </p>
                            {milestone.description && (
                              <p className="text-sm text-[#4f7296] mt-2 max-w-3xl">
                                {milestone.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="bg-[#f7f9fc] text-[#0c141c] text-sm font-medium px-4 py-2 rounded-full">
                          ${parseFloat(milestone.amount).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#f7f9fc] rounded-lg border border-dashed border-[#e5e8ea] mb-8">
                <p className="text-[#4f7296] mb-4">
                  No milestones added yet. Break your project into manageable stages.
                </p>
                <p className="text-sm text-[#8a9db0] max-w-lg">
                  For best results, define clear deliverables for each milestone with reasonable timeframes and payment amounts.
                </p>
              </div>
            )}

            {/* Create Project Button */}
            <div className="flex justify-center">
              <button
                onClick={handleCreateProject}
                disabled={milestones.length === 0}
                className={`px-8 py-3 rounded-lg font-medium text-base transition-colors
                  ${milestones.length === 0 
                  ? 'bg-[#e5e8ea] text-[#8a9db0] cursor-not-allowed' 
                  : 'bg-[#4f7296] hover:bg-[#3c5a78] text-white'}`}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;