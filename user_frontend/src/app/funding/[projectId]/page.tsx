"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import PageTitle from "@/components/jobs/PageTitle";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  "pk_test_51R5086GdIuM6VO5RXpUs9eHpwiAyQG9vl7sQmEbB4mGDi2cfDBdNkyGBhsLAosYvoaIdwL5VxeZgii3usmE4MdKq00zuubmgdO"
);

// Payment Form Component
const PaymentForm = ({ projectId, totalAmount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create payment method
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
        });

      if (stripeError) {
        setError(stripeError.message);
        setIsLoading(false);
        return;
      }

      // Fund the escrow
      const response = await axios.post("http://localhost:8000/fund-escrow", {
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
        err.response?.data?.message || "Payment failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-[rgba(13,20,28,1)] mb-2">
          Card Details
        </label>
        <div className="p-3 border border-[rgba(229,232,235,1)] rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 mb-4 p-2 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`w-full bg-[rgba(79,115,150,1)] hover:bg-[rgba(60,90,120,1)] text-white px-4 py-2 rounded-md ${
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
  const [freelancers, setFreelancers] = useState([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const params = useParams();
  useEffect(() => {
    const projectId = params.projectId;

    if (projectId) {
      fetchProjectDetails(projectId);
    } else {
      setError("Project ID is missing");
      setIsLoading(false);
    }
  }, []);

  // Fetch project details
  const fetchProjectDetails = async (projectId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/project/${projectId}`
      );
      setProjectData(response.data);

      // Calculate total amount from milestones
      const total = response.data.milestones.reduce(
        (sum, milestone) => sum + parseFloat(milestone.amount || 0),
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

  // Fetch all freelancers
  const fetchFreelancers = async () => {
    try {
      // This endpoint would need to be implemented on your backend
      const response = await axios.get("http://localhost:8000/freelancers");
      setFreelancers(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching freelancers:", err);
      setError("Failed to load freelancers");
      setIsLoading(false);
    }
  };

  // Handle freelancer selection
  const handleSelectFreelancer = (freelancer) => {
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
  const handlePaymentSuccess = (paymentId) => {
    setPaymentIntentId(paymentId);
    setPaymentSuccess(true);

    // Update project with selected freelancer
    updateProjectWithFreelancer();
  };

  // Update project with selected freelancer
  const updateProjectWithFreelancer = async () => {
    try {
      await axios.put(
        `http://localhost:8000/project/${projectData.project._id}/assign-freelancer`,
        {
          freelancerId: selectedFreelancer._id,
        }
      );

      // Redirect to project dashboard after a short delay
      setTimeout(() => {
        router.push(`/client-dashboard/${projectData.project._id}`);
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
    <div className="bg-white">
      <div className="bg-[rgba(247,250,252,1)] min-h-[800px] w-full overflow-hidden max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <Header />
          <main className="flex w-full justify-center flex-1 h-full px-4 md:px-8 lg:px-40 py-5 max-md:max-w-full">
            <div className="flex min-w-60 w-full max-w-[960px] flex-col overflow-hidden items-stretch flex-1 shrink basis-[0%] max-md:max-w-full">
              <div className="bg-white rounded-lg shadow-sm mt-6 p-3">
                <nav className="flex p-4">
                  <ol className="flex flex-wrap items-center gap-2 text-base">
                    {breadcrumbItems.map((item, index) => (
                      <React.Fragment key={index}>
                        <li className="inline-flex items-center">
                          <a
                            href={item.href}
                            className={`transition-colors ${
                              item.active
                                ? "text-[rgba(13,20,28,1)]"
                                : "text-[rgba(79,115,150,1)] hover:text-foreground"
                            }`}
                          >
                            {item.label}
                          </a>
                        </li>
                        {index < breadcrumbItems.length - 1 && (
                          <li
                            role="presentation"
                            aria-hidden="true"
                            className="mx-1 text-[rgba(79,115,150,1)]"
                          >
                            /
                          </li>
                        )}
                      </React.Fragment>
                    ))}
                  </ol>
                </nav>

                <PageTitle
                  title={
                    paymentSuccess ? "Payment Successful" : "Select Freelancer"
                  }
                  actionLabel={
                    !paymentSuccess && !showPaymentForm && selectedFreelancer
                      ? "Continue to Payment"
                      : ""
                  }
                  onAction={handleContinueToPayment}
                />

                {/* Error display */}
                {error && (
                  <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                    {error}
                  </div>
                )}

                {/* Loading state */}
                {isLoading ? (
                  <div className="px-6 py-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[rgba(79,115,150,1)] border-r-transparent"></div>
                    <p className="mt-2 text-[rgba(79,115,150,1)]">Loading...</p>
                  </div>
                ) : (
                  <>
                    {/* Payment Success View */}
                    {paymentSuccess ? (
                      <div className="px-6 py-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="green"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[rgba(13,20,28,1)] mb-2">
                          Payment Successful!
                        </h3>
                        <p className="text-[rgba(79,115,150,1)] mb-4">
                          Your payment of ${totalAmount.toFixed(2)} has been
                          processed successfully.
                        </p>
                        <p className="text-[rgba(79,115,150,1)] mb-4">
                          You have assigned{" "}
                          <span className="font-semibold">
                            {selectedFreelancer?.username}
                          </span>{" "}
                          to your project.
                        </p>
                        <p className="text-sm text-[rgba(79,115,150,1)]">
                          Payment ID: {paymentIntentId}
                        </p>
                        <p className="mt-4 text-[rgba(79,115,150,1)]">
                          Redirecting to project dashboard...
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Project Summary */}
                        {projectData && (
                          <div className="px-6 py-4 border-b border-[rgba(229,232,235,1)]">
                            <h3 className="text-lg font-semibold text-[rgba(13,20,28,1)] mb-2">
                              Project Summary
                            </h3>
                            <p className="text-[rgba(79,115,150,1)] mb-4">
                              {projectData.project.description}
                            </p>

                            <div className="mb-4">
                              <h4 className="text-md font-medium text-[rgba(13,20,28,1)] mb-2">
                                Milestones
                              </h4>
                              <div className="bg-[rgba(247,250,252,1)] p-3 rounded-md">
                                {projectData.milestones.map(
                                  (milestone, index) => (
                                    <div
                                      key={index}
                                      className="mb-2 pb-2 border-b border-[rgba(229,232,235,1)] last:border-0 last:mb-0 last:pb-0"
                                    >
                                      <div className="flex justify-between">
                                        <span className="font-medium text-[rgba(13,20,28,1)]">
                                          {milestone.description ||
                                            `Milestone ${index + 1}`}
                                        </span>
                                        <span className="text-[rgba(79,115,150,1)]">
                                          $
                                          {parseFloat(milestone.amount).toFixed(
                                            2
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                )}
                                <div className="mt-2 pt-2 border-t border-[rgba(229,232,235,1)] font-semibold">
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
                          <div className="px-6 py-4">
                            <h3 className="text-lg font-semibold text-[rgba(13,20,28,1)] mb-4">
                              Payment Details
                            </h3>
                            <div className="bg-[rgba(247,250,252,1)] p-4 rounded-md mb-4">
                              <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-[rgba(79,115,150,1)] rounded-full flex items-center justify-center text-white font-bold mr-3">
                                  {selectedFreelancer.username
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-medium text-[rgba(13,20,28,1)]">
                                    {selectedFreelancer.username}
                                  </h4>
                                  <p className="text-sm text-[rgba(79,115,150,1)]">
                                    Freelancer
                                  </p>
                                </div>
                              </div>
                              <p className="text-[rgba(79,115,150,1)] text-sm mb-2">
                                You are about to fund the escrow account for
                                this project.
                              </p>
                              <p className="text-[rgba(79,115,150,1)] text-sm mb-2">
                                The total amount of ${totalAmount.toFixed(2)}{" "}
                                will be held in escrow until you approve each
                                milestone.
                              </p>
                            </div>

                            <Elements stripe={stripePromise}>
                              <PaymentForm
                                projectId={projectData.project._id}
                                totalAmount={totalAmount}
                                onSuccess={handlePaymentSuccess}
                              />
                            </Elements>

                            <button
                              onClick={() => setShowPaymentForm(false)}
                              className="mt-3 w-full bg-[rgba(229,232,235,1)] text-[rgba(13,20,28,1)] px-4 py-2 rounded-md"
                            >
                              Back to Freelancer Selection
                            </button>
                          </div>
                        ) : (
                          <div className="px-6 py-4">
                            <h3 className="text-lg font-semibold text-[rgba(13,20,28,1)] mb-4">
                              Available Freelancers
                            </h3>

                            {freelancers.length === 0 ? (
                              <div className="text-center py-8 text-[rgba(79,115,150,1)]">
                                No freelancers available at the moment.
                              </div>
                            ) : (
                              <div className="grid gap-4">
                                {freelancers.map((freelancer) => (
                                  <div
                                    key={freelancer._id}
                                    className={`p-4 border rounded-md cursor-pointer transition-all ${
                                      selectedFreelancer?._id === freelancer._id
                                        ? "border-[rgba(79,115,150,1)] bg-[rgba(247,250,252,1)]"
                                        : "border-[rgba(229,232,235,1)] hover:border-[rgba(79,115,150,1)]"
                                    }`}
                                    onClick={() =>
                                      handleSelectFreelancer(freelancer)
                                    }
                                  >
                                    <div className="flex items-center">
                                      <div className="w-12 h-12 bg-[rgba(79,115,150,1)] rounded-full flex items-center justify-center text-white font-bold mr-4">
                                        {freelancer.username
                                          .charAt(0)
                                          .toUpperCase()}
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-[rgba(13,20,28,1)]">
                                          {freelancer.username}
                                        </h4>
                                        <p className="text-sm text-[rgba(79,115,150,1)]">
                                          Freelancer
                                        </p>
                                      </div>
                                      {selectedFreelancer?._id ===
                                        freelancer._id && (
                                        <div className="ml-auto">
                                          <div className="w-6 h-6 bg-[rgba(79,115,150,1)] rounded-full flex items-center justify-center">
                                            <svg
                                              width="12"
                                              height="12"
                                              viewBox="0 0 12 12"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M10 3L4.5 8.5L2 6"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    {/* You can add more details about the freelancer here if needed */}
                                  </div>
                                ))}
                              </div>
                            )}

                            {selectedFreelancer && (
                              <div className="mt-6 flex justify-center">
                                <button
                                  onClick={handleContinueToPayment}
                                  className="bg-[rgba(79,115,150,1)] hover:bg-[rgba(60,90,120,1)] text-white px-8 py-3 rounded-md font-medium text-base"
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
      </div>
    </div>
  );
};

export default SelectFreelancer;
