"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import MilestoneContainer from "@/components/freelancer/MilestoneContainer";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProjectParams {
  projectId: string;
}

const ProjectDetails: React.FC = () => {
  const params = useParams() as unknown as ProjectParams;
  const { username, isClient } = useAuth();
  const router = useRouter();
  useEffect(() => {
    console.log(username, isClient);
    if (username && isClient) {
      router.push("/client-dashboard/milestone-tracker");
    } else if (!username) {
      router.push("/login");
    }
  }, [username, isClient, router]);

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-[800px] w-full bg-[#f7f9fc] overflow-hidden">
        <div className="w-full">
          <main className="flex justify-center px-6 py-8 md:px-40 md:py-5">
            <div className="w-full max-w-[960px]">
              <MilestoneContainer projectId={params.projectId} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
