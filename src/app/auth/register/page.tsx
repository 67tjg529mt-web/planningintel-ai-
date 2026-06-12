// ============================================================
// PlanningIntel AI — Register Page
// ============================================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-gray-50 px-6 py-24 dark:bg-gray-950">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <span className="text-xl font-bold text-white">PI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Start your free trial
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            No credit card required. 14 days free.
          </p>
        </div>

        <div className="mt-10">
          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  First name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Last name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Smith"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Work email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="mt-1"
                required
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Company name
              </label>
              <Input
                id="company"
                type="text"
                placeholder="Your planning consultancy"
                className="mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                className="mt-1"
                required
              />
            </div>

            <div className="space-y-2">
              {[
                "14-day free trial, cancel anytime",
                "No credit card required",
                "Full access to all Pro features",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Start Free Trial
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}