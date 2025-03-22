"use client";
import Panel from "@/components/LoginSignup/Panel";
import Current from "@/components/LoginSignup/Current";
import Logo from "@/components/LoginSignup/Logo";
import Form from "@/components/LoginSignup/Form";
import { useState } from "react";

const Page = () => {
  const [isClient, setIsClient] = useState<0 | 1>(1);
  const client = () => {};
  const freelancer = () => {};
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
      <div className="pt-16 pb-11 pr-28 pl-14">
        <Logo />
        <div className="flex flex-col gap-6">
          <Current isClient={isClient} setIsClient={setIsClient} />
          <Form
            signup={true}
            redirectTo="/login"
            onSubmit={isClient ? client : freelancer}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
