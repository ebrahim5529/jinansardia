"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isPasswordsMatch = useMemo(() => {
    if (!password && !confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Missing reset token");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Missing password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!isPasswordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      // TODO: connect to a real endpoint when available.
      // await fetch("/api/reset-password", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ token, password }) })

      await new Promise((r) => setTimeout(r, 900));

      setSuccess("Password updated successfully. You can sign in now.");
      setTimeout(() => router.push("/signin"), 900);
    } catch {
      setError("Reset password failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Back to sign in
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter a new password for your account.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-error-500/30 bg-error-500/10 px-4 py-3 text-sm text-error-800 dark:text-error-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-success-500/30 bg-success-500/10 px-4 py-3 text-sm text-success-700 dark:text-success-400">
              {success}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                error={!isPasswordsMatch}
                hint={!isPasswordsMatch ? "Passwords do not match" : undefined}
              />
            </div>

            {!token && (
              <div className="text-sm text-error-600 dark:text-error-400">
                Missing token. Open this page from the reset password link sent to your email.
              </div>
            )}

            <div>
              <Button className="w-full" size="sm" disabled={submitting || !token}>
                {submitting ? "Saving..." : "Save new password"}
              </Button>
            </div>

            <div>
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Remember your password?{" "}
                <Link href="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
