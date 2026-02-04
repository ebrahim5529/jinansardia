import RegistrationForm from "@/components/auth/RegistrationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignUp Page | JinanSardia - Next.js Dashboard Template",
  description: "This is Next.js SignUp Page JinanSardia Dashboard Template",
  // other metadata
};

export default function SignUp() {
  return <RegistrationForm />;
}
