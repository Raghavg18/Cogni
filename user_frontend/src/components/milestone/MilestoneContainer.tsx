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

// MilestoneContainer Component
interface MilestoneContainerProps {
  milestones: Array<any>;
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
  projectId,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [releaseSuccess, setReleaseSuccess] = useState(false);
  const [error, setError] = useState(null);

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
  };

  const handleRelease = async (milestoneId: string) => {
    try {
      setIsReleasing(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:8000/release-payment",
        {
          milestoneId: milestoneId,
        }
      );

      if (response.data.success) {
        setReleaseSuccess(true);
        // Close the modal after 2 seconds and refresh the page
        setTimeout(() => {
          setDetailsOpen(false);
          window.location.reload();
        }, 2000);
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

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Milestones</h2>
        <Button
          onClick={onAddMilestone}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
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
                className={`p-4 rounded-lg border ${containerClass}`}
              >
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
                          onClick={() => handleViewDetails(milestone)}
                        >
                          View Details
                        </Button>
                      )}

                      {showRelease && (
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                          onClick={() => handleViewDetails(milestone)}
                        >
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
            No milestones added yet. Click "Add Milestone" to create your first
            milestone.
          </p>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Milestone Details</DialogTitle>
            <DialogDescription>
              {selectedMilestone?.status === "submitted"
                ? "Review the milestone submission before releasing payment."
                : "View milestone information."}
            </DialogDescription>
          </DialogHeader>

          {selectedMilestone && (
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-medium text-lg">
                  {selectedMilestone.description}
                </h3>
                <p className="text-gray-600">
                  Status:{" "}
                  <span className="font-medium capitalize">
                    {selectedMilestone.status}
                  </span>
                </p>
                <p className="text-gray-600">
                  Amount:{" "}
                  <span className="font-medium">
                    ${selectedMilestone.amount}
                  </span>
                </p>
              </div>

              {/* Display GitHub URL if available */}
              {selectedMilestone.githubUrl && (
                <div className="pt-2">
                  <h4 className="font-medium mb-2">GitHub Repository</h4>
                  <a
                    href={selectedMilestone.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Github size={16} className="mr-1" />
                    {selectedMilestone.githubUrl}
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              )}

              {/* Display Screenshots if available */}
              {selectedMilestone.screenshots &&
                selectedMilestone.screenshots.length > 0 && (
                  <div className="pt-2">
                    <h4 className="font-medium mb-2">Screenshots</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedMilestone.screenshots.map((screenshot, idx) => (
                        <div
                          key={idx}
                          className="border rounded overflow-hidden"
                        >
                          <img
                            src={screenshot}
                            alt={`Screenshot ${idx + 1}`}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Display submission notes if available */}
              {selectedMilestone.notes && (
                <div className="pt-2">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedMilestone.notes}
                  </p>
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

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>

            {selectedMilestone && selectedMilestone.status === "submitted" && (
              <Button
                onClick={() => handleRelease(selectedMilestone._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isReleasing || releaseSuccess}
              >
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
