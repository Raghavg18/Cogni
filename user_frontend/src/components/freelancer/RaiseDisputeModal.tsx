import React, { useState } from "react";
import { FileText, X, Link, Upload, Calendar, Github } from "lucide-react";

interface RaiseDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DisputeData) => void;
}

export interface MilestoneSubmitData {
  repositoryUrl: string;
  hostedUrl: string;
  note: string;
  files: File[];
  externalFiles: string;
}

export interface DisputeData {
  disputeTitle: string;
  disputeAmount: string;
}

const RaiseDisputeModal: React.FC<RaiseDisputeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<DisputeData>({
    disputeTitle: "",
    disputeAmount: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl animate-in fade-in duration-300 max-h-4/5 overflow-scroll">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#f0f0f5]">
          <div className="flex items-center gap-3">
            <div className="bg-[#f2ecff] p-2 rounded-full">
              <FileText className="w-5 h-5 text-[#7925ff]" />
            </div>
            <h2 className="text-xl font-bold text-[#0d141c]">
              Raise a Dispute
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[#f7f9fc] transition-colors"
          >
            <X className="w-5 h-5 text-[#4f7296]" />
          </button>
        </div>

        {/* Milestone Amount Banner */}
        <div className="bg-[#f7f9fc] p-4 border-b border-[#f0f0f5] flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#4f7296]" />
            <span className="text-[#4f7296] text-sm">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#0d141c] mb-2">
                <FileText className="w-4 h-4 text-[#4f7296]" />
                Write about your dispute <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.disputeTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    disputeTitle: e.target.value,
                  }))
                }
                className="w-full p-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7925ff] focus:border-transparent transition-all"
                rows={4}
                placeholder="Describe what you've accomplished in this milestone..."
                required
              />
              <p className="mt-1 text-xs text-[#4f7296]">
                Provide details your dispute *
              </p>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#0d141c] mb-2">
              <Github className="w-4 h-4 text-[#4f7296]" />
              Dispute Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.disputeAmount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    disputeAmount: e.target.value,
                  }))
                }
                className="w-full p-3 pl-10 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7925ff] focus:border-transparent transition-all"
                placeholder="https://github.com/username/repo"
                required
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4f7296]">
                <Github className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-1 text-xs text-[#4f7296]">
              Enter the dispute amount
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-4 pt-6 mt-6 border-t border-[#f0f0f5]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-[#e0e0e0] text-[#4f7296] font-medium hover:bg-[#f7f9fc] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#7925ff] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#6615e6] transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Raise Query
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseDisputeModal;
