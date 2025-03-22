import Image from "next/image";
import React from "react";

const MilestoneHeader: React.FC = () => {
  return (
    <div className="flex w-full items-center justify-between flex-wrap px-10 py-3 border-[rgba(229,232,235,1)] border-b max-md:max-w-full max-md:px-5">
      <div className="self-stretch flex items-center gap-4 my-auto">
        <div className="self-stretch w-4 my-auto">
          <div className="flex min-h-4 w-4 flex-1" />
        </div>
        <div className="self-stretch min-h-[23px] text-lg text-[rgba(13,20,28,1)] font-bold leading-none w-[83px] my-auto">
          Acme Co
        </div>
      </div>
      <div className="self-stretch flex min-w-60 gap-8 flex-wrap flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
        <div className="flex min-w-60 min-h-10 items-center gap-9 text-sm text-[rgba(13,20,28,1)] font-medium whitespace-nowrap">
          <div className="self-stretch w-[41px] my-auto">Home</div>
          <div className="self-stretch w-[77px] my-auto">Dashboard</div>
          <div className="self-stretch w-[33px] my-auto">Jobs</div>
          <div className="self-stretch w-[55px] my-auto">Reports</div>
          <div className="self-stretch w-[69px] my-auto">Messages</div>
        </div>
        <div className="flex gap-2">
          <div className="bg-[rgba(232,237,242,1)] flex min-h-10 items-center gap-2 overflow-hidden justify-center w-10 h-10 max-w-[480px] px-2.5 rounded-xl">
            <div className="self-stretch w-5 flex-1 shrink basis-[0%] my-auto">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/4a4cf1ecf9034f01a73614fde549ea42/e8a5a998ba82a711cc28c498a68284d4fabd2fa8?placeholderIfAbsent=true"
                fill
                alt="image"
                className="aspect-[1] object-contain flex-1"
              />
            </div>
          </div>
          <div className="bg-[rgba(232,237,242,1)] flex min-h-10 items-center gap-2 overflow-hidden justify-center w-10 h-10 max-w-[480px] px-2.5 rounded-xl">
            <div className="self-stretch w-5 flex-1 shrink basis-[0%] my-auto">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/4a4cf1ecf9034f01a73614fde549ea42/7499fa7b2fa2e71109c65d50fa28838fbebf80ee?placeholderIfAbsent=true"
                className="aspect-[1] object-contain flex-1"
                alt="images"
              />
            </div>
          </div>
        </div>
        <div className="w-10 relative">
          <Image
            src="https://cdn.builder.io/api/v1/image/assets/4a4cf1ecf9034f01a73614fde549ea42/62b637a0e998ef23af08ab02b840e7e2bab13a36?placeholderIfAbsent=true"
            className="aspect-[1] object-contain shrink-0 rounded-[20px]"
            fill
            alt="image"
          />
        </div>
      </div>
    </div>
  );
};

export default MilestoneHeader;
