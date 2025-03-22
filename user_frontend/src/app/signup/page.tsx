"use client";
import Panel from "@/components/LoginSignup/Panel";
import Current from "@/components/LoginSignup/Current";
import Logo from "@/components/LoginSignup/Logo";
import Form from "@/components/LoginSignup/Form";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [isClient, setIsClient] = useState<0 | 1>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("pass") as string;
    
    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email, // Using email as username based on your form
          password: password,
          role: isClient === 1 ? "client" : "freelancer",
          name: name || "", // Optional field
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Redirect to login page on successful signup
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred during signup");
        console.error("Signup error:", err);
      } else {
        setError("An unknown error occurred during signup");
        console.error("Signup error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-48">
      <div className="h-screen pl-8 py-8">
        <Panel
          heading="Welcome to Fiverr"
          brief="Your Gateway to hassle free Freelancing"
          heading2="Seamless Payments"
          brief2="Effortlessly work together without worrying about the payments"
        />
      </div>
      <div className="pt-16 pb-11 pr-28 pl-14 flex flex-col items-center">
        <Logo />
        <div className="flex flex-col gap-6 items-center">
          <Current isClient={isClient} setIsClient={setIsClient} />
          {error && (
            <div className="text-red-500 text-sm w-[358px] text-center mt-2">
              {error}
            </div>
          )}
          {loading && (
            <div className="text-blue-500 text-sm w-[358px] text-center mt-2">
              Processing...
            </div>
          )}
          <Form 
            signup={true} 
            redirectTo="/login" 
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;