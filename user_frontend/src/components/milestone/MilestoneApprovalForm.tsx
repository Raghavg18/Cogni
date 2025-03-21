import React, { useState } from "react";

interface MilestoneApprovalFormProps {
  amount: string;
  onRaiseDispute: () => void;
  onReleasePayment: () => void;
}

const MilestoneApprovalForm: React.FC<MilestoneApprovalFormProps> = ({
  amount,
  onRaiseDispute,
  onReleasePayment,
}) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [hostedUrl, setHostedUrl] = useState("");
  const [externalFiles, setExternalFiles] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="flex w-full max-w-[928px] flex-col items-stretch text-base font-medium mt-4 max-md:max-w-full">
      <div className="flex min-h-[88px] gap-4 text-[rgba(13,20,28,1)] flex-wrap px-4 py-3">
        <div className="min-w-40 w-full flex-1 shrink basis-[0%] max-md:max-w-full">
          <label htmlFor="repoUrl" className="w-full pb-2 max-md:max-w-full">
            Repository URL:
          </label>
          <input
            id="repoUrl"
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="bg-[rgba(250,248,255,1)] border flex min-h-8 w-full rounded-xl border-[rgba(209,219,232,1)] border-solid max-md:max-w-full px-3"
          />
        </div>
      </div>
      <div className="flex min-h-[88px] gap-4 text-[rgba(13,20,28,1)] flex-wrap pl-4 pr-[15px] py-3">
        <div className="min-w-40 w-[718px] grow shrink max-md:max-w-full">
          <label htmlFor="hostedUrl" className="w-full pb-2 max-md:max-w-full">
            Hosted URL:
          </label>
          <input
            id="hostedUrl"
            type="text"
            value={hostedUrl}
            onChange={(e) => setHostedUrl(e.target.value)}
            className="bg-[rgba(250,248,255,1)] border flex min-h-8 w-full rounded-xl border-[rgba(209,219,232,1)] border-solid max-md:max-w-full px-3"
          />
        </div>
      </div>
      <div className="flex min-h-[88px] gap-4 text-[rgba(13,20,28,1)] flex-wrap px-4 py-3">
        <div className="min-w-40 w-full flex-1 shrink basis-[0%] max-md:max-w-full">
          <label
            htmlFor="externalFiles"
            className="w-full pb-2 max-md:max-w-full"
          >
            External Files:
          </label>
          <input
            id="externalFiles"
            type="text"
            value={externalFiles}
            onChange={(e) => setExternalFiles(e.target.value)}
            className="bg-[rgba(250,248,255,1)] border flex min-h-8 w-full rounded-xl border-[rgba(209,219,232,1)] border-solid max-md:max-w-full px-3"
          />
        </div>
      </div>
      <div className="z-10 flex min-h-[151px] gap-4 text-[rgba(13,20,28,1)] flex-wrap px-4 py-3">
        <div className="min-w-40 w-full flex-1 shrink basis-[0%] max-md:max-w-full">
          <label htmlFor="note" className="w-full pb-2 max-md:max-w-full">
            Note from freelancer:
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-[rgba(250,248,255,1)] border flex min-h-[95px] w-full rounded-xl border-[rgba(209,219,232,1)] border-solid max-md:max-w-full p-3"
          />
        </div>
      </div>
      <div className="flex min-h-14 gap-4 text-xl text-[rgba(13,20,28,1)] leading-[1.2] flex-wrap px-4 py-3">
        <div className="min-w-40 w-full flex-1 shrink basis-[0%] max-md:max-w-full">
          <div className="w-full pb-2 max-md:max-w-full">
            <span className="font-semibold">Amount: </span>
            <span className="font-semibold">₹</span>
            <span className="font-semibold">{amount}</span>
          </div>
        </div>
      </div>
      <div className="flex w-[410px] max-w-full items-stretch gap-[15px] text-sm text-center max-md:mr-2.5">
        <button
          onClick={onRaiseDispute}
          className="min-h-8 text-[rgba(30,30,30,1)]"
        >
          <div className="bg-[rgba(250,248,255,1)] flex min-w-[84px] min-h-8 w-full max-w-[480px] items-center overflow-hidden justify-center px-4 rounded-[10px] border-[rgba(0,0,0,0.25)]">
            <div className="self-stretch overflow-hidden my-auto">
              Not Satisfied !! Raise a dispute
            </div>
          </div>
        </button>
        <button
          onClick={onReleasePayment}
          className="min-h-8 text-[rgba(13,20,28,1)]"
        >
          <div className="bg-[rgba(197,252,197,1)] flex min-w-[84px] min-h-8 items-center overflow-hidden justify-center px-4 rounded-[10px]">
            <div className="self-stretch overflow-hidden my-auto">
              Release Payment
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MilestoneApprovalForm;
