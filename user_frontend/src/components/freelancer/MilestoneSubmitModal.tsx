import React, { useState } from "react";

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData)
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[rgba(13,20,28,1)]">
            Submit Milestone
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="text-lg font-semibold text-[rgba(13,20,28,1)]">
            Milestone Amount: ${milestoneAmount}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[rgba(13,20,28,1)] mb-2">
              Repository URL
            </label>
            <input
              type="url"
              value={formData.repositoryUrl}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  repositoryUrl: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-lg"
              placeholder="https://github.com/username/repo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgba(13,20,28,1)] mb-2">
              Hosted URL
            </label>
            <input
              type="url"
              value={formData.hostedUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, hostedUrl: e.target.value }))
              }
              className="w-full p-2 border rounded-lg"
              placeholder="https://your-project.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgba(13,20,28,1)] mb-2">
              External Files
            </label>
            <input
              type="text"
              value={formData.externalFiles}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  externalFiles: e.target.value,
                }))
              }
              className="w-full p-2 border rounded-lg"
              placeholder="Link to additional files (Google Drive, Dropbox, etc.)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgba(13,20,28,1)] mb-2">
              Upload Files
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
              multiple
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgba(13,20,28,1)] mb-2">
              Note
            </label>
            <textarea
              value={formData.note}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, note: e.target.value }))
              }
              className="w-full p-2 border rounded-lg"
              rows={4}
              placeholder="Add any additional notes..."
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-[rgba(121,37,255,1)] text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90"
            >
              Submit Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilestoneSubmitModal;
