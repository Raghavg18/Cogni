"use client";
import React, { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ExternalLink,
  Github,
  File,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";

// Initialize Stripe once
loadStripe("your_publishable_key"); // Replace with your actual publishable key

// MilestoneContainer Component
interface MilestoneContainerProps {
  milestones: Array<Milestone>;
  onAddMilestone: () => void;
  projectId: string | undefined;
}
interface StatusProps {
  containerClass: string;
  icon: JSX.Element;
  showViewDetails: boolean;
  showRelease: boolean;
}
interface Milestone {
  images: string[];
  repositoryUrl: string;
  externalFiles: string;
  hostingUrl: string;
  _id: string;
  description: string;
  date: string;
  amount: number;
  status: string;
  githubUrl?: string;
  screenshots?: string[];
  notes?: string;
}

const MilestoneContainer: React.FC<MilestoneContainerProps> = ({
  milestones = [],
  onAddMilestone,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const processingAction = false;

  // Function to determine status-based styling and icons

  const getStatusProps = (status: string): StatusProps => {
    switch (status) {
      case "paid":
        return {
          containerClass: "bg-green-50 border-green-200",
          icon: <CheckCircle className="text-green-500" size={20} />,
          showViewDetails: true,
          showRelease: false,
        };
      case "submitted":
        return {
          containerClass: "bg-yellow-50 border-yellow-200",
          icon: <AlertCircle className="text-yellow-500" size={20} />,
          showViewDetails: true,
          showRelease: true,
        };
      case "completed":
        return {
          containerClass: "bg-green-50 border-green-200",
          icon: <CheckCircle className="text-green-500" size={20} />,
          showViewDetails: true,
          showRelease: false,
        };
      case "pending":
      default:
        return {
          containerClass: "", // Keep original styling
          icon: <Clock className="text-gray-400" size={20} />,
          showViewDetails: false,
          showRelease: false,
        };
    }
  };

  const handleViewDetails = (milestone: Milestone): void => {
    setSelectedMilestone(milestone);
    setDetailsOpen(true);
    setError(null);
    setReleaseSuccess(false);
  };

  const handleRelease = async (milestoneId: string) => {
    try {
      setIsReleasing(true);
      setError(null);

      const response = await axios.post(
        "https://cogni-production.up.railway.app/release-payment",
        {
          milestoneId: milestoneId,
        }
      );

      if (response.data.success) {
        handleReleaseSuccess();
      } else {
        setError(response.data.message || "Failed to release payment");
      }
    } catch (err) {
      setError(
        (axios.isAxiosError(err) && err.response?.data?.message) ||
          "An error occurred while releasing payment"
      );
      console.error("Error releasing payment:", err);
    } finally {
      setIsReleasing(false);
    }
  };

  // Handle successful payment release
  const handleReleaseSuccess = () => {
    setReleaseSuccess(true);
    setError(null);
    // Close the modal after 2 seconds and refresh the page
    setTimeout(() => {
      setDetailsOpen(false);
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Milestones</h2>
        <Button
          onClick={onAddMilestone}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm">
          <Plus size={16} className="mr-1" />
          Add Milestone
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {milestones.length > 0 ? (
          milestones.map((milestone, index) => {
            const { containerClass, icon, showViewDetails, showRelease } =
              getStatusProps(milestone.status);

            return (
              <div
                key={milestone._id || index}
                className={`p-4 rounded-lg border ${containerClass}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      {icon}
                      <h3 className="font-medium text-gray-800">
                        {milestone.description || `Milestone ${index + 1}`}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {milestone.date
                        ? new Date(milestone.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "No date specified"}
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-2">
                      ${milestone.amount || 0}
                    </p>
                  </div>

                  {/* Conditionally render buttons based on status */}
                  {(showViewDetails || showRelease) && (
                    <div className="flex gap-2">
                      {showViewDetails && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(milestone)}>
                          View Details
                        </Button>
                      )}

                      {showRelease && (
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                          onClick={() => handleViewDetails(milestone)}>
                          Release
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-6">
            No milestones added yet. Click &quote;Add Milestone&quote; to create
            your first milestone.
          </p>
        )}
      </div>

      {/* Details Dialog */}
      {/* Details Dialog with Improved Scrolling and Image Handling */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-2">
            <DialogTitle className="text-xl">
              {selectedMilestone?.description || "Milestone Details"}
            </DialogTitle>
            <DialogDescription>
              {selectedMilestone?.status === "submitted"
                ? "Review the milestone submission before releasing payment."
                : "View milestone information."}
            </DialogDescription>
          </DialogHeader>

          {selectedMilestone && (
            <div className="mt-4 space-y-5">
              {/* Status and Payment Info */}
              <div className="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium mr-2">
                    Status:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedMilestone.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : selectedMilestone.status === "submitted"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                    {selectedMilestone.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium mr-2">
                    Amount:
                  </span>
                  <span className="text-lg font-bold">
                    ${selectedMilestone.amount}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium mr-2">
                    Due Date:
                  </span>
                  <span>
                    {selectedMilestone.date
                      ? new Date(selectedMilestone.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "Not specified"}
                  </span>
                </div>
              </div>

              {/* Links Section */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h4 className="font-medium">Project Links</h4>
                </div>
                <div className="p-4 grid gap-3">
                  {/* GitHub Repository */}
                  <div className="flex items-center">
                    <Github size={18} className="mr-2 text-gray-600" />
                    {selectedMilestone.repositoryUrl ? (
                      <a
                        href={selectedMilestone.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 hover:underline">
                        View GitHub Repository
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    ) : (
                      <span className="text-gray-500 italic">
                        No GitHub repository provided
                      </span>
                    )}
                  </div>

                  {/* Hosting URL */}
                  {selectedMilestone.hostingUrl && (
                    <div className="flex items-center">
                      <ExternalLink size={18} className="mr-2 text-gray-600" />
                      <a
                        href={selectedMilestone.hostingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 hover:underline">
                        View Live Demo
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  )}

                  {/* External Files */}
                  {selectedMilestone.externalFiles && (
                    <div className="flex items-center">
                      <File size={18} className="mr-2 text-gray-600" />
                      <a
                        href={selectedMilestone.externalFiles}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 hover:underline">
                        View External Files
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  )}

                  {/* Show message if no links are available */}
                  {!selectedMilestone.repositoryUrl &&
                    !selectedMilestone.hostingUrl &&
                    !selectedMilestone.externalFiles && (
                      <p className="text-gray-500 italic">
                        No project links available
                      </p>
                    )}
                </div>
              </div>

              {/* Display Screenshots with improved handling */}
              {selectedMilestone.images &&
                selectedMilestone.images.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <h4 className="font-medium">
                        Screenshots ({selectedMilestone.images.length})
                      </h4>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedMilestone.images.map(
                          (
                            screenshot: string | URL | undefined,
                            idx: React.Key | null | undefined
                          ) => (
                            <div
                              key={idx}
                              className="group relative border rounded-lg overflow-hidden shadow-sm bg-white">
                              {/* Image container with fixed height and proper handling */}
                              <div className="relative w-full h-full aspect-video bg-gray-100 flex items-center justify-center">
                                <Image
                                  src={
                                    typeof screenshot === "string"
                                      ? screenshot
                                      : ""
                                  }
                                  alt={`Screenshot ${Number(idx) + 1}`}
                                  fill
                                  loading="lazy"
                                  onClick={() =>
                                    window.open(screenshot, "_blank")
                                  }
                                />
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 bg-white shadow-md"
                                  onClick={() =>
                                    window.open(screenshot, "_blank")
                                  }>
                                  <ExternalLink size={14} className="mr-1" />
                                  View Full Size
                                </Button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* Display submission notes if available */}
              {selectedMilestone.notes && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <h4 className="font-medium">Notes</h4>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700 whitespace-pre-line max-h-48 overflow-y-auto">
                      {selectedMilestone.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Success message */}
              {releaseSuccess && (
                <div className="bg-green-50 text-green-700 p-3 rounded border border-green-200 flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  Payment successfully released! Redirecting...
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200">
                  <p>{error}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="sticky bottom-0 bg-white pt-2 z-10 mt-4">
            <Button
              variant="outline"
              onClick={() => setDetailsOpen(false)}
              disabled={processingAction}>
              Close
            </Button>

            {selectedMilestone && selectedMilestone.status === "submitted" && (
              <Button
                onClick={() => handleRelease(selectedMilestone._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isReleasing || releaseSuccess || processingAction}>
                {isReleasing ? "Processing..." : "Release Payment"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MilestoneContainer;
