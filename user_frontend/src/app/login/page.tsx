"use client";
import Panel from "@/components/LoginSignup/Panel";
import Logo from "@/components/LoginSignup/Logo";
import Form from "@/components/LoginSignup/Form";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext"; // Import the auth hook

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setAuth } = useAuth(); // Use the auth hook

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("pass") as string;

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://cogni-production.up.railway.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email, // Using email as username based on your form
            password: password,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      console.log(data);
      // Get the user role from the response data
      const userRole = data.role; // Assuming your API returns the role
      const isClient = userRole === "client";

      // Store user info in the global context
      setAuth(email, isClient);

      // Redirect based on user role
      if (userRole === "freelancer") {
        router.push("/onboarding");
      } else {
        // Assume client by default
        router.push("/client-dashboard/milestone-tracker");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during login");
      } else {
        setError("An error occurred during login");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-48">
      <div className="h-screen pl-8 py-8">
        <Panel
          heading="Welcome to Cognii"
          brief="Your Gateway to hassle free Freelancing"
          heading2="Seamless Payments"
          brief2="Effortlessly work together without worrying about the payments"
        />
      </div>
      <div className="pt-44 pb-11 pr-28 pl-14">
        <Logo />
        <div className="flex flex-col gap-6">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {loading && (
            <div className="text-blue-500 text-sm">Logging in...</div>
          )}
          <Form signup={false} redirectTo="/signup" onSubmit={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Page;
