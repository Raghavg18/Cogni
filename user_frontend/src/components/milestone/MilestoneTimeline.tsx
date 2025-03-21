import React from "react";

interface TimelineItem {
  title: string;
  date: string;
  status: "completed" | "inProgress" | "upcoming";
}

interface MilestoneTimelineProps {
  items: TimelineItem[];
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ items }) => {
  const getStatusColor = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return "rgba(52,178,51,1)";
      case "inProgress":
        return "rgba(255,204,0,1)";
      case "upcoming":
        return "rgba(242,236,255,1)";
    }
  };

  const getDotColor = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return "rgba(52,178,51,1)";
      case "inProgress":
        return "rgba(255,204,0,1)";
      case "upcoming":
        return "rgba(121,37,255,1)";
    }
  };

  return (
    <div className="w-full mt-8 max-md:max-w-full">
      <div className="text-lg text-[rgba(13,20,28,1)] font-bold leading-none pt-4 pb-2 px-4 max-md:max-w-full">
        Milestones Timeline
      </div>
      <div className="w-full px-4 max-md:max-w-full">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          return (
            <div
              key={index}
              className={`flex min-h-[67px] w-full items-stretch gap-2 flex-wrap ${
                index > 0 ? "mt-2" : ""
              } max-md:max-w-full`}
            >
              <div
                className={`flex flex-col items-center w-10 ${
                  isFirst ? "pt-5" : ""
                } ${isLast ? "pb-3" : ""}`}
              >
                {!isFirst && (
                  <div
                    className="flex min-h-4 w-0.5"
                    style={{ backgroundColor: getStatusColor(item.status) }}
                  />
                )}
                <div
                  className="rounded flex min-h-2 w-2 h-2 mt-1"
                  style={{ backgroundColor: getDotColor(item.status) }}
                />
                {!isLast && (
                  <div
                    className="flex min-h-10 w-0.5 mt-1"
                    style={{ backgroundColor: getStatusColor(item.status) }}
                  />
                )}
              </div>
              <div className="min-w-60 text-base flex-1 shrink basis-[0%] py-3 max-md:max-w-full">
                <div
                  className={`w-full text-[rgba(13,20,28,1)] font-medium ${
                    item.title.length < 15 ? "whitespace-nowrap" : ""
                  } max-md:max-w-full`}
                >
                  {item.title}
                </div>
                <div className="w-full text-[rgba(79,115,150,1)] font-normal max-md:max-w-full">
                  {item.date}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MilestoneTimeline;
