import React from "react";

interface MilestoneCardProps {
  title: string;
  status: "released" | "pending" | "upcoming";
  date?: string;
  iconSrc: string;
  iconBgColor: string;
  onViewDetails?: () => void;
  onRelease?: () => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({
  title,
  status,
  date,
  iconSrc,
  iconBgColor,
  onViewDetails,
  onRelease,
}) => {
  const getStatusBgColor = () => {
    switch (status) {
      case "released":
        return "bg-[rgba(242,236,255,1)]";
      case "pending":
        return "bg-[rgba(255,236,161,1)]";
      case "upcoming":
        return "bg-[rgba(232,237,242,1)]";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "released":
        return "Released";
      case "pending":
        return "Release";
      case "upcoming":
        return "Upcoming";
    }
  };

  return (
    <div className="flex min-h-[72px] w-full items-center gap-[40px_100px] justify-between flex-wrap px-4 py-3 max-md:max-w-full">
      <div className="self-stretch flex min-w-60 items-center gap-4 my-auto">
        <div
          className={`${iconBgColor} self-stretch flex min-h-12 items-center justify-center w-12 h-12 my-auto rounded-lg`}
        >
          <img
            src={iconSrc}
            className="aspect-[1] object-contain w-6 self-stretch my-auto"
          />
        </div>
        <div className="self-stretch flex min-w-60 flex-col items-stretch justify-center w-[314px] my-auto">
          <div className="max-w-full w-[314px] overflow-hidden text-base text-[rgba(13,20,28,1)] font-medium">
            {title}
          </div>
          {date && (
            <div className="w-[253px] max-w-full overflow-hidden text-sm text-[rgba(79,115,150,1)] font-normal">
              {date}
            </div>
          )}
        </div>
      </div>
      <div className="self-stretch flex items-stretch gap-[25px] w-[194px] my-auto">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="overflow-hidden text-xs text-[rgba(121,37,255,1)] font-normal underline leading-[21px] my-auto"
          >
            View Details
          </button>
        )}
        <div className="text-sm text-[rgba(13,20,28,1)] font-medium whitespace-nowrap text-center">
          <div
            className={`${getStatusBgColor()} flex min-w-[84px] min-h-8 w-24 items-center overflow-hidden justify-center px-4 rounded-[10px]`}
          >
            <div className="self-stretch w-16 overflow-hidden my-auto">
              {getStatusText()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneCard;
