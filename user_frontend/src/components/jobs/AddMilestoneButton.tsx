import React from "react";

interface AddMilestoneButtonProps {
  onClick: () => void;
}

const AddMilestoneButton: React.FC<AddMilestoneButtonProps> = ({ onClick }) => {
  return (
    <div className="flex px-6 pt-2 pb-4">
      <button
        onClick={onClick}
        className="bg-[rgba(232,237,242,1)] flex items-center justify-center h-12 px-5 rounded-xl font-bold text-base text-[rgba(13,20,28,1)]"
      >
        Add Milestone
      </button>
    </div>
  );
};

export default AddMilestoneButton;
