import React, { useState } from "react";
import { FileText, X, Link, Upload, Calendar, Github } from "lucide-react";

interface MilestoneSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneAmount: number;
  onSubmit: (data: MilestoneSubmitData) => void;
}

export interface MilestoneSubmitData {
  repositoryUrl: string;
  hostedUrl: string;
  note: string;
  files: File[];
  externalFiles: string;
}

const MilestoneSubmitModal: React.FC<MilestoneSubmitModalProps> = ({
  isOpen,
  onClose,
  milestoneAmount,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<MilestoneSubmitData>({
    repositoryUrl: "",
    hostedUrl: "",
    note: "",
    files: [],
    externalFiles: "",
  });

  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...Array.from(e.target.files || [])],
      }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...Array.from(e.dataTransfer.files)],
      }));
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove),
    }));
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
              Submit Milestone
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
          <div className="w-px h-5 bg-[#e0e0e0]"></div>
          <div className="text-base font-semibold text-[#7925ff]">
            Milestone Amount: ${milestoneAmount.toLocaleString()}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Repository URL Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#0d141c] mb-2">
                <Github className="w-4 h-4 text-[#4f7296]" />
                Repository URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.repositoryUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      repositoryUrl: e.target.value,
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
                Link to your code repository (GitHub, GitLab, etc.)
              </p>
            </div>

            {/* Hosted URL Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#0d141c] mb-2">
                <Link className="w-4 h-4 text-[#4f7296]" />
                Hosted URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.hostedUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({ 
                      ...prev, 
                      hostedUrl: e.target.value 
                    }))
                  }
                  className="w-full p-3 pl-10 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7925ff] focus:border-transparent transition-all"
                  placeholder="https://your-project.com"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4f7296]">
                  <Link className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-1 text-xs text-[#4f7296]">
                Link to your deployed application
              </p>
            </div>

            {/* External Files Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#0d141c] mb-2">
                <Link className="w-4 h-4 text-[#4f7296]" />
                External Files
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.externalFiles}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      externalFiles: e.target.value,
                    }))
                  }
                  className="w-full p-3 pl-10 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7925ff] focus:border-transparent transition-all"
                  placeholder="Link to additional files (Google Drive, Dropbox, etc.)"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4f7296]">
                  <Link className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-1 text-xs text-[#4f7296]">
                Add links to any external resources or files
              </p>
            </div>

            {/* File Upload Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#0d141c] mb-2">
                <Upload className="w-4 h-4 text-[#4f7296]" />
                Upload Files
              </label>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive ? "border-[#7925ff] bg-[#f2ecff]" : "border-[#e0e0e0]"
                } transition-all cursor-pointer`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-[#f2ecff] p-3 rounded-full">
                    <Upload className="w-5 h-5 text-[#7925ff]" />
                  </div>
                  <p className="text-[#0d141c] font-medium">
                    Drag and drop files or <span className="text-[#7925ff]">browse</span>
                  </p>
                  <p className="text-xs text-[#4f7296]">
                    Upload any supporting documents, screenshots, or media files
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
              </div>

              {/* File List */}
              {formData.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-[#0d141c]">
                    {formData.files.length} file(s) selected
                  </p>
                  <div className="max-h-32 overflow-y-auto pr-2">
                    {formData.files.map((file, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between items-center py-2 px-3 bg-[#f7f9fc] rounded-lg text-sm mb-2"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-[#4f7296] shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Note Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#0d141c] mb-2">
                <FileText className="w-4 h-4 text-[#4f7296]" />
                Note <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.note}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, note: e.target.value }))
                }
                className="w-full p-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7925ff] focus:border-transparent transition-all"
                rows={4}
                placeholder="Describe what you've accomplished in this milestone..."
                required
              />
              <p className="mt-1 text-xs text-[#4f7296]">
                Provide details about what you&apos;ve completed and any important information
              </p>
            </div>
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
              Submit Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilestoneSubmitModal;