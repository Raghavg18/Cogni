"use client";
import React, { useState } from "react";
import MilestoneCard from "./MilestoneCard";
import MilestoneApprovalForm from "./MilestoneApprovalForm";

interface MilestoneContainerProps {
  onAddMilestone: () => void;
}

const MilestoneContainer: React.FC<MilestoneContainerProps> = ({
  onAddMilestone,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  const handleRaiseDispute = () => {
    console.log("Dispute raised");
    // Implement dispute logic
  };

  const handleReleasePayment = () => {
    console.log("Payment released");
    // Implement payment release logic
  };

  return (
    <>
      <div className="bg-white w-full mt-8 py-2.5 rounded-2xl max-md:max-w-full">
        <MilestoneCard
          title="Milestone 1: Design"
          status="released"
          date="Payment was Settled on Jun 18, 2023"
          iconSrc="https://cdn.builder.io/api/v1/image/assets/4a4cf1ecf9034f01a73614fde549ea42/df7d1b6b50705fd6129cea313d8c1183bc063e1d?placeholderIfAbsent=true"
          iconBgColor="bg-[rgba(191,255,190,1)]"
          onViewDetails={() => console.log("View details for milestone 1")}
        />

        <div className="flex w-full max-w-[927px] items-stretch gap-8 flex-wrap px-4 py-2 max-md:max-w-full">
          <div className="flex items-stretch flex-wrap grow shrink basis-auto max-md:max-w-full">
            <div className="flex items-center gap-4 flex-wrap grow shrink basis-auto">
              <div className="bg-[rgba(255,245,190,1)] self-stretch flex min-h-12 items-center justify-center w-12 h-12 my-auto rounded-lg">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/4a4cf1ecf9034f01a73614fde549ea42/b2a71799bfba5382cceafb51c10917b1f80e6eb4?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-6 self-stretch my-auto"
                />
              </div>
              <div className="self-stretch flex min-w-60 flex-col items-stretch justify-center w-[364px] my-auto">
                <div className="w-[314px] max-w-full overflow-hidden text-base text-[rgba(13,20,28,1)] font-medium">
                  Milestone 2: Code Review: 1
                </div>
                <div className="max-w-full w-[364px] overflow-hidden text-sm text-[rgba(79,115,150,1)] font-normal">
                  Review and release the payment before July 19, 2023{" "}
                </div>
              </div>
            </div>
            <button
              onClick={handleViewDetails}
              className="overflow-hidden text-xs text-[rgba(121,37,255,1)] font-normal underline leading-[21px] my-auto"
            >
              View Details
            </button>
          </div>
          <div className="text-sm text-[rgba(13,20,28,1)] font-medium whitespace-nowrap text-center my-auto">
            <div className="bg-[rgba(255,236,161,1)] flex min-w-[84px] min-h-8 w-24 items-center overflow-hidden justify-center px-4 rounded-[10px]">
              <div className="self-stretch w-[55px] overflow-hidden my-auto">
                Release
              </div>
            </div>
          </div>
        </div>

        {showDetails && (
          <MilestoneApprovalForm
            amount="40,000"
            onRaiseDispute={handleRaiseDispute}
            onReleasePayment={handleReleasePayment}
          />
        )}
      </div>

      <div className="flex w-full text-base text-[rgba(13,20,28,1)] font-bold text-center mt-8 px-4 py-3 max-md:max-w-full">
        <button
          onClick={onAddMilestone}
          className="bg-[rgba(232,237,242,1)] flex min-w-[84px] min-h-12 w-[156px] max-w-[480px] items-center overflow-hidden justify-center px-5 rounded-xl"
        >
          <div className="self-stretch w-[116px] overflow-hidden my-auto">
            Add Milestone
          </div>
        </button>
      </div>
    </>
  );
};

export default MilestoneContainer;
