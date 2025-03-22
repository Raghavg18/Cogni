import React from "react";

interface Props {
  isClient: 0 | 1;
  setIsClient: React.Dispatch<React.SetStateAction<0 | 1>>;
}

const Current = ({ isClient, setIsClient }: Props) => {
  return (
    <div className="bg-[#F2ECFF] w-[358px] flex p-1 rounded-lg">
      <button
        className={`${isClient ? "bg-[#7925FF] font-medium text-white" : "text-[#9C9AA5]"} w-full py-2 rounded-lg cursor-pointer`}
        onClick={() => {
          setIsClient(1);
        }}
      >
        Client
      </button>
      <button
        className={`${!isClient ? "bg-[#7925FF] font-medium text-white" : "text-[#9C9AA5]"} w-full py-2 rounded-lg cursor-pointer`}
        onClick={() => {
          setIsClient(0);
        }}
      >
        Freelancer
      </button>
    </div>
  );
};

export default Current;
