import React from "react";

interface ProjectHeaderProps {
  title: string;
  progress: number;
  status: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  progress,
  status,
}) => {
  return (
    <div className="w-full max-md:max-w-full">
      <div className="flex w-full gap-[8px_100px] font-medium justify-between flex-wrap p-4 max-md:max-w-full">
        <div className="flex items-stretch gap-2 text-base text-[rgba(79,115,150,1)] w-[132px]">
          <div className="whitespace-nowrap">Home</div>
          <div className="whitespace-nowrap">/</div>
          <div className="text-[rgba(13,20,28,1)]">All Jobs</div>
        </div>
        <div className="text-sm text-[rgba(13,20,28,1)] text-center w-[211px]">
          <div className="bg-[rgba(255,236,161,1)] flex min-w-[84px] min-h-8 max-w-full w-[211px] items-center overflow-hidden justify-center px-4 rounded-[10px]">
            <div className="self-stretch w-[179px] overflow-hidden my-auto">
              {status}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-[12px_0px] text-[32px] text-[rgba(13,20,28,1)] font-bold leading-none justify-between flex-wrap p-4">
        <div className="min-w-72 w-72">{title}</div>
      </div>
      <div className="w-full p-4 max-md:max-w-full">
        <div className="flex w-full gap-[40px_100px] text-[rgba(13,20,28,1)] whitespace-nowrap justify-between flex-wrap max-md:max-w-full">
          <div className="text-base font-medium w-[70px]">Progress</div>
          <div className="min-h-6 text-sm font-normal w-8">{progress}%</div>
        </div>
        <div className="rounded bg-[rgba(242,236,255,1)] flex w-full flex-col mt-3 max-md:max-w-full">
          <div
            className="rounded bg-[rgba(121,37,255,1)] flex min-h-2"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
