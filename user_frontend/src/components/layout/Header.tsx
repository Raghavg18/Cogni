import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
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
          <Link href="/" className="self-stretch w-[41px] my-auto">
            Home
          </Link>
          <Link href="/dashboard" className="self-stretch w-[77px] my-auto">
            Dashboard
          </Link>
          <Link href="/jobs" className="self-stretch w-[33px] my-auto">
            Jobs
          </Link>
          <Link href="/reports" className="self-stretch w-[55px] my-auto">
            Reports
          </Link>
          <Link href="/messages" className="self-stretch w-[69px] my-auto">
            Messages
          </Link>
        </div>
        <div className="flex gap-2">
          <button className="bg-[rgba(232,237,242,1)] flex min-h-10 items-center gap-2 overflow-hidden justify-center w-10 h-10 max-w-[480px] px-2.5 rounded-xl">
            <div className="self-stretch w-full flex-1 shrink basis-[0%] my-auto">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/bbb85c1e8fe27a8497081e05b7a0a479c380e574?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-5 flex-1"
                alt="Notification"
              />
            </div>
          </button>
          <button className="bg-[rgba(232,237,242,1)] flex min-h-10 items-center gap-2 overflow-hidden justify-center w-10 h-10 max-w-[480px] px-2.5 rounded-xl">
            <div className="self-stretch w-full flex-1 shrink basis-[0%] my-auto">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/3efb8a5d9e570f293718c4fa7d389324fe0d4173?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-5 flex-1"
                alt="Messages"
              />
            </div>
          </button>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/62b637a0e998ef23af08ab02b840e7e2bab13a36?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-10 shrink-0 rounded-[20px]"
          alt="User profile"
        />
      </div>
    </div>
  );
};

export default Header;
