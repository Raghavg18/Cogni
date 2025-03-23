"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Link from "next/link";
import { Check } from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(
  "pk_test_51R5086GdIuM6VO5RXpUs9eHpwiAyQG9vl7sQmEbB4mGDi2cfDBdNkyGBhsLAosYvoaIdwL5VxeZgii3usmE4MdKq00zuubmgdO"
);

// Payment Form Component
interface PaymentFormProps {
  projectId: string;
  totalAmount: number;
  onSuccess: (paymentId: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  projectId,
  totalAmount,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create payment method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("Card details are missing");
        setIsLoading(false);
        return;
      }

      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (stripeError) {
        setError(stripeError.message || "");
        setIsLoading(false);
        return;
      }

      // Fund the escrow
      const response = await axios.post("https://cogni-production.up.railway.app/fund-escrow", {
        projectId,
        amount: totalAmount,
        paymentMethodId: paymentMethod.id,
      });

      if (response.data.success) {
        onSuccess(response.data.paymentIntentId);
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        (axios.isAxiosError(err) && err.response?.data?.message) ||
          "Payment failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 w-full flex flex-col gap-6">
      <div>
        <label htmlFor="card-element" className="block text-sm font-medium mb-2">
          Card Details
        </label>
        <div className="h-12 border border-[#465FF166] rounded-lg p-4 focus-within:border-2 focus-within:border-[#7925FF]">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#9C9AA5",
                  },
                },
                invalid: {
                  color: "#EF4444",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 px-4 py-3 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`w-full rounded-lg bg-[#7925FF] font-bold text-white py-3.5 hover:bg-[#6315e0] transition-colors ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
};

const SelectFreelancer = () => {
  const router = useRouter();
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  
  interface Project {
    project: {
      _id: string;
      description: string;
    };
    milestones: { amount: string; description: string }[];
  }

  const [projectData, setProjectData] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const params = useParams();
  
  useEffect(() => {
    const projectId = Array.isArray(params.projectId)
      ? params.projectId[0]
      : params.projectId;
    // Fetch project details
    const fetchProjectDetails = async (projectId: string) => {
      try {
        const response = await axios.get(
          `https://cogni-production.up.railway.app/project/${projectId}`
        );
        setProjectData(response.data);

        // Calculate total amount from milestones
        const total = response.data.milestones.reduce(
          (sum: number, milestone: { amount: string }) =>
            sum + parseFloat(milestone.amount || "0"),
          0
        );
        setTotalAmount(total);

        // Fetch freelancers
        fetchFreelancers();
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project details");
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails(projectId);
    } else {
      setError("Project ID is missing");
      setIsLoading(false);
    }
  }, [params.projectId]);

  // Fetch all freelancers
  const fetchFreelancers = async () => {
    try {
      // This endpoint would need to be implemented on your backend
      const response = await axios.get("https://cogni-production.up.railway.app/freelancers");
      setFreelancers(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching freelancers:", err);
      setError("Failed to load freelancers");
      setIsLoading(false);
    }
  };

  // Handle freelancer selection
  interface Freelancer {
    _id: string;
    username: string;
    // Add other properties as needed
  }

  const handleSelectFreelancer = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
  };

  // Handle "Continue to Payment" button click
  const handleContinueToPayment = () => {
    if (!selectedFreelancer) {
      setError("Please select a freelancer to continue");
      return;
    }

    setShowPaymentForm(true);
  };

  // Handle payment success
  const handlePaymentSuccess = (paymentId: string) => {
    setPaymentIntentId(paymentId);
    setPaymentSuccess(true);

    // Update project with selected freelancer
    updateProjectWithFreelancer();
  };

  // Update project with selected freelancer
  const updateProjectWithFreelancer = async () => {
    try {
      if (projectData && selectedFreelancer) {
        await axios.put(
          `https://cogni-production.up.railway.app/project/${projectData.project._id}/assign-freelancer`,
          {
            freelancerId: selectedFreelancer._id,
          }
        );
      } else {
        setError("Project data or freelancer is missing");
      }

      // Redirect to project dashboard after a short delay
      setTimeout(() => {
        if (projectData) {
          router.push(`/client-dashboard/${projectData.project._id}`);
        }
      }, 3000);
    } catch (err) {
      console.error("Error assigning freelancer:", err);
      setError("Failed to assign freelancer, but payment was successful");
    }
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "All Jobs", href: "/jobs" },
    { label: "Select Freelancer", active: true },
  ];

  return (
    <div className="bg-[#F8F8FA] min-h-screen">
      <Header />
      <main className="flex justify-center px-4 py-6 md:py-12">
        <div className="w-full max-w-[800px]">
          {/* Breadcrumbs */}
          <nav className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                  <li className="inline-flex items-center">
                    <Link
                      href={item.href || ''}
                      className={`transition-colors ${
                        item.active
                          ? "text-black font-medium"
                          : "text-[#9C9AA5] hover:text-[#7925FF]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                  {index < breadcrumbItems.length - 1 && (
                    <li
                      role="presentation"
                      aria-hidden="true"
                      className="mx-1 text-[#9C9AA5]"
                    >
                      /
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ol>
          </nav>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            {/* Title */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">
                {paymentSuccess ? "Payment Successful" : showPaymentForm ? "Payment Details" : "Select Freelancer"}
              </h1>
              
              {!paymentSuccess && !showPaymentForm && selectedFreelancer && (
                <button
                  onClick={handleContinueToPayment}
                  className="bg-[#7925FF] hover:bg-[#6315e0] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Continue to Payment
                </button>
              )}
            </div>

            {/* Error display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            {/* Loading state */}
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#7925FF] border-r-transparent"></div>
                <p className="mt-4 text-[#9C9AA5]">Loading...</p>
              </div>
            ) : (
              <>
                {/* Payment Success View */}
                {paymentSuccess ? (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 bg-[#E0D7FF] rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="text-[#7925FF] h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">
                      Payment Successful!
                    </h3>
                    <p className="text-[#494652] mb-4">
                      Your payment of ${totalAmount.toFixed(2)} has been
                      processed successfully.
                    </p>
                    <p className="text-[#494652] mb-4">
                      You have assigned{" "}
                      <span className="font-semibold">
                        {selectedFreelancer?.username}
                      </span>{" "}
                      to your project.
                    </p>
                    <p className="text-sm text-[#9C9AA5]">
                      Payment ID: {paymentIntentId}
                    </p>
                    <p className="mt-6 text-[#9C9AA5]">
                      Redirecting to project dashboard...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Project Summary */}
                    {projectData && (
                      <div className="mb-8 pb-6 border-b border-[#E1E1E4]">
                        <h3 className="text-lg font-medium mb-4">
                          Project Summary
                        </h3>
                        <p className="text-[#494652] mb-6">
                          {projectData.project.description}
                        </p>

                        <div>
                          <h4 className="text-base font-medium mb-3">
                            Milestones
                          </h4>
                          <div className="bg-[#F8F8FA] p-4 rounded-lg">
                            {projectData.milestones.map(
                              (milestone, index) => (
                                <div
                                  key={index}
                                  className="mb-3 pb-3 border-b border-[#E1E1E4] last:border-0 last:mb-0 last:pb-0"
                                >
                                  <div className="flex justify-between">
                                    <span className="font-medium">
                                      {milestone.description ||
                                        `Milestone ${index + 1}`}
                                    </span>
                                    <span className="text-[#494652]">
                                      ${parseFloat(milestone.amount).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                            <div className="mt-3 pt-3 border-t border-[#E1E1E4] font-semibold">
                              <div className="flex justify-between">
                                <span>Total</span>
                                <span>${totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Select Freelancer or Payment Form */}
                    {showPaymentForm ? (
                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          Payment Details
                        </h3>
                        <div className="bg-[#F8F8FA] p-4 rounded-lg mb-6">
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-[#7925FF] rounded-full flex items-center justify-center text-white font-bold mr-3">
                              {selectedFreelancer?.username
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {selectedFreelancer?.username}
                              </h4>
                              <p className="text-sm text-[#9C9AA5]">
                                Freelancer
                              </p>
                            </div>
                          </div>
                          <p className="text-[#494652] text-sm mb-2">
                            You are about to fund the escrow account for
                            this project.
                          </p>
                          <p className="text-[#494652] text-sm">
                            The total amount of ${totalAmount.toFixed(2)}{" "}
                            will be held in escrow until you approve each
                            milestone.
                          </p>
                        </div>

                        <Elements stripe={stripePromise}>
                          <PaymentForm
                            projectId={projectData?.project._id || ""}
                            totalAmount={totalAmount}
                            onSuccess={handlePaymentSuccess}
                          />
                        </Elements>

                        <button
                          onClick={() => setShowPaymentForm(false)}
                          className="mt-4 w-full bg-[#F8F8FA] text-[#494652] px-4 py-3 rounded-lg border border-[#E1E1E4] hover:bg-[#E1E1E4] transition-colors"
                        >
                          Back to Freelancer Selection
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          Available Freelancers
                        </h3>

                        {freelancers.length === 0 ? (
                          <div className="text-center py-8 text-[#9C9AA5]">
                            No freelancers available at the moment.
                          </div>
                        ) : (
                          <div className="grid gap-3">
                            {freelancers.map((freelancer) => (
                              <div
                                key={freelancer._id}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                  selectedFreelancer &&
                                  selectedFreelancer._id === freelancer._id
                                    ? "border-[#7925FF] bg-[#F8F8FA]"
                                    : "border-[#E1E1E4] hover:border-[#7925FF]"
                                }`}
                                onClick={() =>
                                  handleSelectFreelancer(freelancer)
                                }
                              >
                                <div className="flex items-center">
                                  <div className="w-12 h-12 bg-[#7925FF] rounded-full flex items-center justify-center text-white font-bold mr-4">
                                    {freelancer.username
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">
                                      {freelancer.username}
                                    </h4>
                                    <p className="text-sm text-[#9C9AA5]">
                                      Freelancer
                                    </p>
                                  </div>
                                  {selectedFreelancer?._id ===
                                    freelancer._id && (
                                    <div className="ml-auto">
                                      <div className="w-6 h-6 bg-[#7925FF] rounded-full flex items-center justify-center">
                                        <Check className="text-white h-3 w-3" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {selectedFreelancer && (
                          <div className="mt-8 flex justify-center">
                            <button
                              onClick={handleContinueToPayment}
                              className="bg-[#7925FF] hover:bg-[#6315e0] text-white px-8 py-3.5 rounded-lg font-bold text-base transition-colors"
                            >
                              Continue to Payment
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SelectFreelancer;