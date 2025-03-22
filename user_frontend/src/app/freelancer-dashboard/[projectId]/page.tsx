import React from "react";
import MilestoneHeader from "@/components/milestone/MilestoneHeader";
import MilestoneContainer from "@/components/freelancer/MilestoneContainer";

const Index: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="bg-[rgba(247,250,252,1)] min-h-[800px] w-full overflow-hidden max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <MilestoneHeader />
          <main className="flex w-full justify-center flex-1 h-full px-40 py-5 max-md:max-w-full max-md:px-5">
            <MilestoneContainer />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
