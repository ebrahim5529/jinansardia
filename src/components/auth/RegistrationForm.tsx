"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

type AccountType = "HOSPITAL" | "FACTORY";

type HospitalType = "GOVERNMENT" | "PRIVATE" | "CHARITY";

export default function RegistrationForm() {
  const [accountType, setAccountType] = useState<AccountType | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [commonAccountEmail, setCommonAccountEmail] = useState("");
  const [commonPassword, setCommonPassword] = useState("");
  const [commonConfirmPassword, setCommonConfirmPassword] = useState("");

  // Factory fields
  const [factoryName, setFactoryName] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [commercialRegNo, setCommercialRegNo] = useState("");
  const [taxNo, setTaxNo] = useState("");
  const [activityType, setActivityType] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [contactPersonName, setContactPersonName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [website, setWebsite] = useState("");

  // Hospital fields
  const [hospitalName, setHospitalName] = useState("");
  const [facilityType, setFacilityType] = useState<HospitalType>("PRIVATE");
  const [healthLicenseNo, setHealthLicenseNo] = useState("");
  const [supervisingAuthority, setSupervisingAuthority] = useState("");

  const [purchasingManagerName, setPurchasingManagerName] = useState("");
  const [hospitalJobTitle, setHospitalJobTitle] = useState("");
  const [hospitalPhone, setHospitalPhone] = useState("");
  const [hospitalAltPhone, setHospitalAltPhone] = useState("");
  const [hospitalOfficialEmail, setHospitalOfficialEmail] = useState("");

  const [username, setUsername] = useState("");

  const isPasswordsMatch = useMemo(() => {
    if (!commonPassword && !commonConfirmPassword) return true;
    return commonPassword === commonConfirmPassword;
  }, [commonPassword, commonConfirmPassword]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!accountType) {
      setError("Please choose account type");
      return;
    }

    if (!commonAccountEmail || !commonPassword || !commonConfirmPassword) {
      setError("Missing account email/password");
      return;
    }

    if (!isPasswordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      const payload =
        accountType === "FACTORY"
          ? {
              accountType,
              account: {
                email: commonAccountEmail,
                password: commonPassword,
                name: contactPersonName || undefined,
              },
              factory: {
                factoryName,
                tradeName: tradeName || undefined,
                commercialRegNo,
                taxNo,
                activityType,
                country,
                city,
                address,
                contactPersonName,
                jobTitle,
                phone,
                altPhone: altPhone || undefined,
                officialEmail,
                website: website || undefined,
              },
            }
          : {
              accountType,
              account: {
                username,
                email: commonAccountEmail,
                password: commonPassword,
              },
              hospital: {
                hospitalName,
                facilityType,
                healthLicenseNo,
                supervisingAuthority,
                country,
                city,
                address,
                purchasingManagerName,
                jobTitle: hospitalJobTitle,
                phone: hospitalPhone,
                altPhone: hospitalAltPhone || undefined,
                officialEmail: hospitalOfficialEmail,
              },
            };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        setError(data?.message || "Registration failed");
        return;
      }

      setSuccess("Account created successfully. You can sign in now.");
    } catch {
      setError("Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Back to Home
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose account type then fill required fields.
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
              <Label>Account Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType("HOSPITAL")}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition dark:border-gray-800 ${
                    accountType === "HOSPITAL"
                      ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-white/5"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-white/80"
                  }`}
                >
                  Hospital
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("FACTORY")}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition dark:border-gray-800 ${
                    accountType === "FACTORY"
                      ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-white/5"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-white/80"
                  }`}
                >
                  Factory
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">Account</h2>
              {accountType === "HOSPITAL" && (
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="loginEmail">Login Email</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  value={commonAccountEmail}
                  onChange={(e) => setCommonAccountEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={commonPassword}
                  onChange={(e) => setCommonPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={commonConfirmPassword}
                  onChange={(e) => setCommonConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  error={!isPasswordsMatch}
                  hint={!isPasswordsMatch ? "Passwords do not match" : undefined}
                />
              </div>
            </div>

            {accountType === "FACTORY" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">Factory Basics</h2>
                  <div>
                    <Label>Factory Name</Label>
                    <Input value={factoryName} onChange={(e) => setFactoryName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Trade Name (optional)</Label>
                    <Input value={tradeName} onChange={(e) => setTradeName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Commercial Registration No</Label>
                    <Input value={commercialRegNo} onChange={(e) => setCommercialRegNo(e.target.value)} />
                  </div>
                  <div>
                    <Label>Tax No</Label>
                    <Input value={taxNo} onChange={(e) => setTaxNo(e.target.value)} />
                  </div>
                  <div>
                    <Label>Activity Type</Label>
                    <Input value={activityType} onChange={(e) => setActivityType(e.target.value)} />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">Contact</h2>
                  <div>
                    <Label>Responsible Person</Label>
                    <Input value={contactPersonName} onChange={(e) => setContactPersonName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Job Title</Label>
                    <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label>Alternate Phone (optional)</Label>
                    <Input value={altPhone} onChange={(e) => setAltPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label>Official Email</Label>
                    <Input type="email" value={officialEmail} onChange={(e) => setOfficialEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label>Website (optional)</Label>
                    <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {accountType === "HOSPITAL" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">Hospital Basics</h2>
                  <div>
                    <Label>Hospital Name</Label>
                    <Input value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Facility Type</Label>
                    <select
                      value={facilityType}
                      onChange={(e) => setFacilityType(e.target.value as HospitalType)}
                      className="h-11 w-full rounded-lg border bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    >
                      <option value="GOVERNMENT">Government</option>
                      <option value="PRIVATE">Private</option>
                      <option value="CHARITY">Charity</option>
                    </select>
                  </div>
                  <div>
                    <Label>Health License No</Label>
                    <Input value={healthLicenseNo} onChange={(e) => setHealthLicenseNo(e.target.value)} />
                  </div>
                  <div>
                    <Label>Supervising Authority</Label>
                    <Input value={supervisingAuthority} onChange={(e) => setSupervisingAuthority(e.target.value)} />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-white/90">Contact</h2>
                  <div>
                    <Label>Purchasing Manager</Label>
                    <Input value={purchasingManagerName} onChange={(e) => setPurchasingManagerName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Job Title</Label>
                    <Input value={hospitalJobTitle} onChange={(e) => setHospitalJobTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={hospitalPhone} onChange={(e) => setHospitalPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label>Alternate Phone (optional)</Label>
                    <Input value={hospitalAltPhone} onChange={(e) => setHospitalAltPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label>Official Email</Label>
                    <Input
                      type="email"
                      value={hospitalOfficialEmail}
                      onChange={(e) => setHospitalOfficialEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Button className="w-full" size="sm" disabled={submitting}>
                {submitting ? "Creating..." : "Create Account"}
              </Button>

              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{" "}
                <Link href="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
