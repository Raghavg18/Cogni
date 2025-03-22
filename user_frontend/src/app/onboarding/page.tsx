"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";

const StripeOnboardingPage = () => {
  const [loading, setLoading] = useState(false);
  interface StripeStatus {
    accountId: string;
    transfersEnabled: boolean;
  }

  const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { username } = useAuth();

  // Get username from localStorage or query params on component mount
  useEffect(() => {
    const storedUsername = username;
    if (storedUsername) {
      checkStripeStatus(storedUsername);
    }
  }, [username]);

  // Function to check Stripe account status
  const checkStripeStatus = async (user: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/check-stripe-status/${user}`
      );

      if (response.data.success) {
        setStripeStatus(response.data);
        if (response.data.transfersEnabled) {
          setSuccess(
            "Your Stripe account is connected and ready to receive payments!"
          );
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error checking Stripe status:", error);
      setStripeStatus(null);
    }
  };

  // Function to connect to Stripe
  const connectStripe = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await axios.post(
        "http://localhost:8000/connect-stripe",
        {
          username: username,
        }
      );

      if (response.data.success) {
        // If we received an account link, redirect the user to Stripe
        if (response.data.accountLink) {
          // Save username to localStorage before redirecting
          localStorage.setItem("username", username);
          window.location.href = response.data.accountLink;
        } else {
          // If no account link but success, the account is already set up
          setSuccess("Your Stripe account is already connected!");
          checkStripeStatus(username);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error connecting to Stripe:", error);
      setError(
        (error as AxiosError<{ message: string }>).response?.data?.message ||
          "Failed to connect to Stripe"
      );
    }
  };

  // Function for when a user returns from Stripe onboarding
  useEffect(() => {
    // Check if this is a return from Stripe onboarding
    const urlParams = new URLSearchParams(window.location.search);
    const returnParam = urlParams.get("stripe-return");

    if (returnParam === "success") {
      setSuccess("Stripe account setup was successful!");
      const user = urlParams.get("username") || username;
      if (user) {
        checkStripeStatus(user);
      }
    } else if (returnParam === "canceled") {
      setError("Stripe account setup was not completed. Please try again.");
    }
  }, [username]);

  // Determine button state and text
  const getButtonState = () => {
    if (!stripeStatus) {
      return { text: "Connect Stripe Account", disabled: false };
    }

    if (stripeStatus.transfersEnabled) {
      return { text: "Stripe Account Connected ✓", disabled: true };
    }

    return { text: "Complete Stripe Setup", disabled: false };
  };

  const buttonState = getButtonState();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex justify-center mb-6 h-20 w-20">
            <Image src="/api/placeholder/80/80" alt="Stripe Logo" fill />
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Connect Your Stripe Account
          </h1>

          <p className="text-gray-600 mb-8 text-center">
            To receive payments for your completed milestones, you need to
            connect your Stripe account.
          </p>

          {/* Status Indicator */}
          {stripeStatus && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-2">Account Status</h3>
              <div className="flex items-center mb-2">
                <span className="mr-2 font-medium">Account ID:</span>
                <span className="text-gray-600">{stripeStatus.accountId}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 font-medium">Transfers:</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    stripeStatus.transfersEnabled
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                  {stripeStatus.transfersEnabled ? "Active" : "Pending"}
                </span>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Connect Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={connectStripe}
              disabled={loading || buttonState.disabled}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading || buttonState.disabled
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}>
              {loading ? <span>Processing...</span> : buttonState.text}
            </button>

            {stripeStatus?.transfersEnabled && (
              <button
                onClick={() => router.push("/freelancer-dashboard")}
                className="mt-4 w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Go to Dashboard
              </button>
            )}
          </div>

          {/* Information section */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-gray-900 font-medium mb-2">
              Why connect Stripe?
            </h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Securely receive payments directly to your bank account</li>
              <li>
                Get paid instantly when clients release milestone payments
              </li>
              <li>Track your earnings and payment history</li>
              <li>Industry-standard security for all financial transactions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeOnboardingPage;
