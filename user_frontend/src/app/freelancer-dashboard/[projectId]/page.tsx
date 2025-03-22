'use client';
import React from "react";
import MilestoneContainer from "@/components/freelancer/MilestoneContainer";
import Header from "@/components/layout/Header";
import { useParams } from "next/navigation";

const Index: React.FC = () => {
  const params = useParams()
  const projectId = params.projectId

  return (
    <div className="bg-white">
      <div className="bg-[rgba(247,250,252,1)] min-h-[800px] w-full overflow-hidden max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <Header />
          <main className="flex w-full justify-center flex-1 h-full px-40 py-5 max-md:max-w-full max-md:px-5">
            <MilestoneContainer projectId={projectId}/>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
