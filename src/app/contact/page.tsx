"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { t, type Locale } from "@/locales/i18n";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

export default function ContactPage() {
  const [locale, setLocale] = useState<Locale>("en");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const currentLocale = getCookie("NEXT_LOCALE") as Locale;
    if (currentLocale === "en" || currentLocale === "ar") {
      setLocale(currentLocale);
    }
  }, []);

  const isEmailValid = useMemo(() => {
    if (!email) return true;
    return /^\S+@\S+\.\S+$/.test(email);
  }, [email]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError(locale === "ar" ? "يرجى تعبئة جميع الحقول" : "Please fill all fields");
      return;
    }

    if (!isEmailValid) {
      setError(locale === "ar" ? "البريد الإلكتروني غير صحيح" : "Invalid email");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      setSuccess(locale === "ar" ? "تم إرسال رسالتك بنجاح" : "Message sent successfully");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError(locale === "ar" ? "فشل إرسال الرسالة" : "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {locale === "ar" ? "تواصل معنا" : "Contact"}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {locale === "ar"
                ? "أرسل لنا رسالة وسنرد عليك في أقرب وقت."
                : "Send us a message and we will get back to you as soon as possible."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {locale === "ar" ? "معلومات التواصل" : "Contact Info"}
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                      <i className="ri-mail-line text-xl"></i>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{locale === "ar" ? "البريد" : "Email"}</div>
                      <div className="font-medium">info@jinansardia.com</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                      <i className="ri-phone-line text-xl"></i>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{locale === "ar" ? "الهاتف" : "Phone"}</div>
                      <div className="font-medium">+86 531 8888 9999</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                      <i className="ri-map-pin-line text-xl"></i>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{locale === "ar" ? "العنوان" : "Address"}</div>
                      <div className="font-medium">Jinan, Shandong Province, China</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-56 bg-gray-100" />
                <div className="p-6 text-sm text-gray-600">
                  {locale === "ar"
                    ? "يمكنك إضافة خريطة Google هنا لاحقاً."
                    : "You can add a Google Map here later."}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {locale === "ar" ? "أرسل رسالة" : "Send a message"}
                </h2>

                {error && (
                  <div className="mb-4 rounded-lg border border-error-500/30 bg-error-500/10 px-4 py-3 text-sm text-error-800">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 rounded-lg border border-success-500/30 bg-success-500/10 px-4 py-3 text-sm text-success-700">
                    {success}
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{locale === "ar" ? "الاسم" : "Name"}</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="" />
                    </div>
                    <div>
                      <Label htmlFor="email">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!isEmailValid}
                        hint={!isEmailValid ? (locale === "ar" ? "البريد الإلكتروني غير صحيح" : "Invalid email") : undefined}
                        placeholder=""
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">{locale === "ar" ? "الموضوع" : "Subject"}</Label>
                    <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="" />
                  </div>

                  <div>
                    <Label htmlFor="message">{locale === "ar" ? "الرسالة" : "Message"}</Label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10"
                    />
                  </div>

                  <div className="flex items-center justify-end">
                    <Button size="sm" disabled={submitting}>
                      {submitting
                        ? locale === "ar"
                          ? "جاري الإرسال..."
                          : "Sending..."
                        : locale === "ar"
                          ? "إرسال"
                          : "Send"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}
