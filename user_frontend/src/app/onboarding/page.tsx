"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Check } from "lucide-react";

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
      return { text: "Stripe Account Connected", disabled: true };
    }

    return { text: "Complete Stripe Setup", disabled: false };
  };

  const buttonState = getButtonState();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="flex flex-col items-center">
          <div className="mb-6 h-20 w-20 flex items-center justify-center">
            <img src="/api/placeholder/80/80" alt="Stripe Logo" />
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Connect Your Stripe Account
          </h1>

          <p className="text-sm text-gray-600 mb-8 text-center w-[358px]">
            To receive payments for your completed milestones, you need to
            connect your Stripe account.
          </p>

          {/* Status Indicator with improved design */}
          {stripeStatus && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50 w-[358px]">
              <h3 className="font-medium text-gray-900 mb-2">Account Status</h3>
              <div className="flex items-center mb-2">
                <span className="mr-2 font-medium text-sm">Account ID:</span>
                <span className="text-gray-600 text-sm truncate max-w-[200px]">{stripeStatus.accountId}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 font-medium text-sm">Status:</span>
                <div className="flex items-center">
                  {stripeStatus.transfersEnabled ? (
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-yellow-400 mr-1"></div>
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stripeStatus.transfersEnabled
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}>
                    {stripeStatus.transfersEnabled ? "Active" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg w-[358px] text-sm">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg w-[358px] text-sm">
              {success}
            </div>
          )}

          {/* Connect Button with improved design */}
          <div className="flex flex-col items-center w-[358px]">
            <button
              onClick={connectStripe}
              disabled={loading || buttonState.disabled}
              className={`w-full rounded-lg font-bold text-white py-3.5 ${
                loading || buttonState.disabled
                  ? "bg-[#7925FF]/50 cursor-not-allowed"
                  : "bg-[#7925FF] hover:bg-[#6315e0] transition-colors"
              }`}>
              {loading ? "Processing..." : buttonState.text}
              {stripeStatus?.transfersEnabled && <Check className="ml-2 inline h-5 w-5" />}
            </button>

            {stripeStatus?.transfersEnabled && (
              <button
                onClick={() => router.push("/freelancer-dashboard")}
                className="mt-4 w-full flex justify-center py-3.5 rounded-lg text-sm font-bold text-[#7925FF] bg-white border border-[#7925FF] hover:bg-[#7925FF]/5 transition-colors">
                Go to Dashboard
              </button>
            )}
          </div>

          {/* Divider similar to the login page */}
          <div className="text-center w-[358px] my-6">
            <span className="font-bold text-[#E1E1E4] relative mx-4 before:content-[''] before:absolute before:w-20 before:h-0.5 before:bg-[#E1E1E4] before:left-[-90px] before:top-1/2 after:content-[''] after:absolute after:w-20 after:h-0.5 after:bg-[#E1E1E4] after:right-[-90px] after:top-1/2">
              BENEFITS
            </span>
          </div>

          {/* Information section with improved styling */}
          <div className="w-[358px]">
            <ul className="space-y-2">
              <li className="flex items-start gap-2.5">
                <Check className="text-[#7925FF] h-5 w-5 mt-0.5" />
                <p className="text-sm text-gray-700">Securely receive payments directly to your bank account</p>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="text-[#7925FF] h-5 w-5 mt-0.5" />
                <p className="text-sm text-gray-700">Get paid instantly when clients release milestone payments</p>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="text-[#7925FF] h-5 w-5 mt-0.5" />
                <p className="text-sm text-gray-700">Track your earnings and payment history</p>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="text-[#7925FF] h-5 w-5 mt-0.5" />
                <p className="text-sm text-gray-700">Industry-standard security for all financial transactions</p>
              </li>
            </ul>
          </div>
          
          {/* Footer note */}
          <p className="text-[10px] text-[#9C9AA5] text-center w-[358px] mt-6">
            By connecting your Stripe account, you accept our <br />
            <span className="text-black">Terms of use & Privacy Policy.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StripeOnboardingPage;