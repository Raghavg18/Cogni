import React from "react";

interface PageTitleProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex items-center justify-between py-4">
      <h1 className="text-3xl font-bold text-[rgba(13,20,28,1)]">{title}</h1>
      {actionLabel && (
        <button
          onClick={onAction}
          className="bg-[rgba(232,237,242,1)] h-10 px-4 rounded-xl text-sm font-medium text-[rgba(13,20,28,1)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default PageTitle;
