"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Shield,
  Zap,
  DollarSign,
  Star,
  Users,
  Clock,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#f7f9fc] to-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-[600px]">
              <h1 className="text-5xl font-bold text-[#0c141c] mb-6 leading-tight">
                Secure Freelancing Platform for Developers
              </h1>
              <p className="text-xl text-[#4f7296] mb-8 leading-relaxed">
                Connect with top clients, work on exciting projects, and get
                paid securely through our milestone-based payment system.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => router.push("/signup")}
                  className="bg-[#7925ff] hover:bg-[#6a1ff0] text-white px-8 py-6 rounded-xl text-lg font-medium">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="px-8 py-6 rounded-xl text-lg font-medium border-[#e5e8ea] text-[#4f7296] hover:bg-[#f7f9fc]">
                  Sign In
                </Button>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="relative hidden lg:block h-[500px] w-full">
              {/* Main gradient container */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-tr from-[#7925ff]/10 to-[#f7f9fc]">
                {/* Animated gradient orbs */}
                <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-[#7925ff]/20 to-[#9f55ff]/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-l from-[#7925ff]/15 to-[#9f55ff]/15 rounded-full blur-2xl animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-tr from-[#7925ff]/25 to-[#9f55ff]/25 rounded-full blur-xl animate-pulse delay-500" />

                {/* Stats floating cards */}
                <div className="absolute top-12 left-12 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#e5e8ea] shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#7925ff]" />
                    <p className="text-sm font-medium text-[#0c141c]">
                      100% Secure Payments
                    </p>
                  </div>
                </div>

                <div className="absolute top-32 right-20 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#e5e8ea] shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-[#7925ff]" />
                    <p className="text-sm font-medium text-[#0c141c]">
                      4.9/5 Average Rating
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-20 right-12 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#e5e8ea] shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-[#7925ff]" />
                    <p className="text-sm font-medium text-[#0c141c]">
                      Instant Withdrawals
                    </p>
                  </div>
                </div>

                <div className="absolute top-1/2 right-16 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#e5e8ea] shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-[#7925ff]" />
                    <p className="text-sm font-medium text-[#0c141c]">
                      Low Platform Fees
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-40 left-20 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#e5e8ea] shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#7925ff]" />
                    <p className="text-sm font-medium text-[#0c141c]">
                      5,000+ Active Developers
                    </p>
                  </div>
                </div>

                <div className="absolute top-1/2 left-16 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#e5e8ea] shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#7925ff]" />
                    <p className="text-sm font-medium text-[#0c141c]">
                      24/7 Support
                    </p>
                  </div>
                </div>

                {/* Decorative dots */}
                <div className="absolute inset-0 bg-[radial-gradient(#7925ff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.15]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-[1400px] mx-auto px-8 py-24">
        <h2 className="text-3xl font-bold text-center text-[#0c141c] mb-16">
          Why Choose Cognii?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-xl border border-[#e5e8ea] bg-white hover:border-[#7925ff] transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-[#f7f9fc] flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#0c141c] mb-4">
                {feature.title}
              </h3>
              <p className="text-[#4f7296] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7925ff]/5 via-[#f7f9fc] to-white">
          <div className="absolute inset-0">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#7925ff]/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7925ff]/5 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#7925ff]/10 rounded-full blur-[80px]" />
          </div>
        </div>

        {/* Content */}
        <div className="relative max-w-[1400px] mx-auto px-8 py-32 text-center">
          <div className="space-y-6 max-w-[600px] mx-auto">
            <h2 className="text-4xl font-bold text-[#0c141c] mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-[#4f7296] mb-8">
              Join thousands of developers who trust Cogni for secure
              freelancing opportunities.
            </p>
            <Button
              onClick={() => router.push("/signup")}
              className="bg-[#7925ff] hover:bg-[#6a1ff0] text-white px-8 py-6 rounded-xl text-lg font-medium group transition-all duration-300 hover:shadow-lg hover:shadow-[#7925ff]/20">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-[#e5e8ea]">
              <p className="text-3xl font-bold text-[#7925ff] mb-2">5,000+</p>
              <p className="text-[#4f7296]">Active Developers</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-[#e5e8ea]">
              <p className="text-3xl font-bold text-[#7925ff] mb-2">$2M+</p>
              <p className="text-[#4f7296]">Paid to Freelancers</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-[#e5e8ea]">
              <p className="text-3xl font-bold text-[#7925ff] mb-2">98%</p>
              <p className="text-[#4f7296]">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    title: "Secure Payments",
    description:
      "Our milestone-based payment system ensures you get paid for your work. Funds are held securely until project milestones are completed.",
    icon: <Shield className="w-6 h-6 text-[#7925ff]" />,
  },
  {
    title: "Fast Transactions",
    description:
      "Quick payment processing and instant withdrawals. Get your earnings when you need them, without unnecessary delays.",
    icon: <Zap className="w-6 h-6 text-[#7925ff]" />,
  },
  {
    title: "Competitive Rates",
    description:
      "Set your own rates and keep more of what you earn. Our platform fees are among the lowest in the industry.",
    icon: <DollarSign className="w-6 h-6 text-[#7925ff]" />,
  },
];
