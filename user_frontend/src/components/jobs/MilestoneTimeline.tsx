import React from "react";

export interface Milestone {
  title: string;
  date: string;
  description?: string;
  completed: boolean;
  isLast?: boolean;
  amount?: string;
}

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
}) => {
  return (
    <div className="w-full px-6 py-2">
      {milestones.map((milestone, index) => (
        <div key={index} className={`flex gap-4 ${index > 0 ? "mt-1" : ""}`}>
          <div className="flex flex-col items-center w-5">
            {index > 0 && (
              <div className="bg-[rgba(209,219,232,1)] w-0.5 h-5" />
            )}
            <div className="rounded-full bg-[rgba(13,20,28,1)] w-2.5 h-2.5 flex-shrink-0" />
            {!milestone.isLast && (
              <div className="bg-[rgba(209,219,232,1)] w-0.5 h-full flex-grow mt-1" />
            )}
          </div>
          <div className="flex flex-col py-1 pb-5">
            <div className="text-base text-[rgba(13,20,28,1)] font-medium">
              {milestone.title}
            </div>
            <div className="text-sm text-[rgba(79,115,150,1)]">
              {milestone.date}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MilestoneTimeline;
