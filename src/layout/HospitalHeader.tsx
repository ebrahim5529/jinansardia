"use client";

import React, { useEffect, useState } from "react";
import AppHeader from "@/layout/AppHeader";
import { t, type Locale } from "@/locales/i18n";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

export default function HospitalHeader() {
  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    const currentLocale = getCookie("NEXT_LOCALE") as Locale;
    if (currentLocale === "en" || currentLocale === "ar") {
      setLocale(currentLocale);
    }
  }, []);

  return <AppHeader title={t(locale, "hospital.dashboard.title")} />;
}
