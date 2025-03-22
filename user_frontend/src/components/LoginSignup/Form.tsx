import { Check } from "lucide-react";
import Link from "next/link";
import { FormEvent } from "react";

interface props {
  signup?: boolean;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  redirectTo: string;
}

const Form = ({ signup, onSubmit, redirectTo }: props) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-[358px] flex flex-col gap-6">
        {signup && (
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-2 w-full h-12 border border-[#465FF166] rounded-lg p-4 focus:outline-none focus:border-2 focus:border-[#465FF1]"
            />
          </div>
        )}
        <div>
          <label htmlFor="email">Email Id</label>
          <input
            type="text"
            id="email"
            name="email"
            className="mt-2 w-full h-12 border border-[#465FF166] rounded-lg p-4 focus:outline-none focus:border-2 focus:border-[#465FF1]"
          />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="pass">Password</label>
            {!signup && (
              <p className="underline text-xs text-[#9C9AA5]">
                Forgot Password?
              </p>
            )}
          </div>
          <input
            type="password"
            id="pass"
            name="pass"
            className="mt-2 mb-2.5 w-full h-12 border border-[#465FF166] rounded-lg p-4 focus:outline-none focus:border-2 focus:border-[#465FF1]"
            placeholder="Enter Password"
          />
          {signup && (
            <div className="flex flex-col gap-1">
              <div className="flex gap-2.5">
                <Check className="text-[#D1D7FB] " />
                <p className="text-xs">Password Strength: Weak</p>
              </div>
              <div className="flex gap-2.5">
                <Check className="text-[#D1D7FB] " />
                <p className="text-xs">
                  Cannot contain your name or email address
                </p>
              </div>
              <div className="flex gap-2.5">
                <Check className="text-[#D1D7FB] " />
                <p className="text-xs">At least 8 characters</p>
              </div>
              <div className="flex gap-2.5">
                <Check className="text-[#D1D7FB] " />
                <p className="text-xs">
                  Contains at least a number and a symbol
                </p>
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-[#7925FF] font-bold text-white py-3.5">
          {signup ? "Create Account" : "Login"}
        </button>
      </form>
      <div className="text-center w-[358px]">
        <span className="font-bold text-[#E1E1E4] relative mx-4 before:content-[''] before:absolute before:w-20 before:h-0.5 before:bg-[#E1E1E4] before:left-[-90px] before:top-1/2 after:content-[''] after:absolute after:w-20 after:h-0.5 after:bg-[#E1E1E4] after:right-[-90px] after:top-1/2">
          OR
        </span>
      </div>
      <div className="flex gap-1 justify-center w-[358px]">
        <p className="text-black text-sm">
          {signup ? "Already have an Account?" : "Don't have an Account?"}
        </p>
        <Link href={redirectTo} className="text-[#7925FF] text-sm underline">
          {signup ? "Login Here" : " Signup Here"}
        </Link>
      </div>
      {signup && (
        <p className="text-[10px] text-[#9C9AA5] text-center w-[358px]">
          By signing up to create an account I accept <br />
          Company&apos;s
          <span className="text-black">Terms of use & Privacy Policy.</span>
        </p>
      )}
    </>
  );
};

export default Form;
