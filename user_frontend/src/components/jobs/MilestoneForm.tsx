import React, { useState } from "react";

interface MilestoneFormProps {
  onSubmit: (data: MilestoneFormData) => void;
}

export interface MilestoneFormData {
  title: string;
  description: string;
  dueDate: string;
  amount: string;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<MilestoneFormData>({
    title: "",
    description: "",
    dueDate: "",
    amount: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 pt-4">
      <div className="text-lg text-[rgba(13,20,28,1)] font-bold mb-4">
        Milestone details
      </div>

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-base text-[rgba(13,20,28,1)] font-medium mb-2"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="bg-[rgba(247,250,252,1)] border w-full h-10 rounded-xl border-[rgba(209,219,232,1)] px-3"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-base text-[rgba(13,20,28,1)] font-medium mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="bg-[rgba(247,250,252,1)] border min-h-36 w-full rounded-xl border-[rgba(209,219,232,1)] py-3 px-3"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="dueDate"
            className="block text-base text-[rgba(13,20,28,1)] font-medium mb-2"
          >
            Due date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="bg-[rgba(247,250,252,1)] border w-full h-10 rounded-xl border-[rgba(209,219,232,1)] px-3"
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-base text-[rgba(13,20,28,1)] font-medium mb-2"
          >
            Amount
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="bg-[rgba(247,250,252,1)] border w-full h-10 rounded-xl border-[rgba(209,219,232,1)] px-3"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-[rgba(13,20,28,1)] text-white font-medium rounded-xl px-5 py-2.5 mt-2"
      >
        Save Milestone
      </button>
    </form>
  );
};

export default MilestoneForm;
