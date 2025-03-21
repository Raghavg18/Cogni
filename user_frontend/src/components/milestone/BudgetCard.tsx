import React from "react";

interface BudgetCardsProps {
  totalBudget: string;
  released: string;
  remaining: string;
}

const BudgetCards: React.FC<BudgetCardsProps> = ({
  totalBudget,
  released,
  remaining,
}) => {
  return (
    <div className="flex w-full items-stretch gap-[37px] flex-wrap mt-8 rounded-2xl max-md:max-w-full">
      <div className="bg-white flex flex-col overflow-hidden text-[rgba(13,20,28,1)] flex-1 pl-[22px] pr-[59px] pt-[13px] pb-[21px] rounded-2xl max-md:px-5">
        <div className="text-lg font-semibold leading-none">Total Budget</div>
        <div className="text-[26px] font-bold leading-none mt-[9px]">
          {totalBudget}
        </div>
      </div>
      <div className="bg-white flex flex-col overflow-hidden whitespace-nowrap flex-1 pl-[22px] pr-[59px] pt-[13px] pb-[21px] rounded-2xl max-md:px-5">
        <div className="text-[rgba(13,20,28,1)] text-lg font-semibold leading-none">
          Released
        </div>
        <div className="text-[rgba(52,178,51,1)] text-[26px] font-bold leading-none mt-[9px]">
          {released}
        </div>
      </div>
      <div className="bg-white flex flex-col overflow-hidden whitespace-nowrap flex-1 pl-[22px] pr-[59px] pt-[13px] pb-[21px] rounded-2xl max-md:px-5">
        <div className="text-[rgba(13,20,28,1)] text-lg font-semibold leading-none">
          Remaining
        </div>
        <div className="text-[rgba(105,105,105,1)] text-[26px] font-bold leading-none mt-[9px]">
          {remaining}
        </div>
      </div>
    </div>
  );
};

export default BudgetCards;
