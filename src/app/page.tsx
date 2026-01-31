"use client";
import React, { useEffect, useState } from 'react';
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import CompanyOverview from "@/components/landing/CompanyOverview";
import History from "@/components/landing/History";
import Mission from "@/components/landing/Mission";
import BusinessAreas from "@/components/landing/BusinessAreas";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

// We need to import AOS securely
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {
    const [locale, setLocale] = useState<'ar' | 'en'>('en');

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }, []);

    useEffect(() => {
        const html = document.documentElement;

        const syncLocale = () => {
            setLocale(html.lang === 'ar' ? 'ar' : 'en');
        };

        syncLocale();

        const observer = new MutationObserver(() => {
            syncLocale();
        });

        observer.observe(html, {
            attributes: true,
            attributeFilter: ['lang'],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <main className="bg-white min-h-screen">
            <Navbar />
            <Hero locale={locale} />
            <CompanyOverview locale={locale} />
            <History locale={locale} />
            <Mission locale={locale} />
            <BusinessAreas locale={locale} />
            <CTA locale={locale} />
            <Footer locale={locale} />
        </main>
    );
}
