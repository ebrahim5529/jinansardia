"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import LanguageSwitcher from "@/components/header/LanguageSwitcher";
import { t, type Locale } from '@/locales/i18n';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const [currentLocale, setCurrentLocale] = useState<Locale>('en');
    const nextLocale: Locale = currentLocale === 'ar' ? 'en' : 'ar';
    const signInHref = `/signin`;
    const signUpHref = `/signup`;

    useEffect(() => {
        const html = document.documentElement;

        const syncLocale = () => {
            setCurrentLocale(html.lang === 'ar' ? 'ar' : 'en');
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

    async function switchLanguage() {
        await fetch('/api/locale', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locale: nextLocale }),
        });
        router.refresh();
    }

    const navItems = [
        { label: t(currentLocale, 'landing.nav.home'), targetId: 'home' },
        { label: t(currentLocale, 'landing.nav.about'), targetId: 'about' },
        { label: t(currentLocale, 'landing.nav.services'), targetId: 'services' },
    ];

    const handleScrollTo = (targetId: string) => (e: React.MouseEvent) => {
        if (pathname !== '/') {
            setMobileMenuOpen(false);
            return;
        }

        e.preventDefault();

        const el = document.getElementById(targetId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setMobileMenuOpen(false);
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">
                    <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <Image
                            src="/images/logo/logo_website.svg"
                            alt="Logo"
                            width={280}
                            height={80}
                            className="h-18 w-auto"
                            priority
                        />
                    </Link>
                    <nav className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.targetId}
                                href={`/#${item.targetId}`}
                                onClick={handleScrollTo(item.targetId)}
                                className="text-gray-700 hover:text-brand-500 transition-colors duration-200 font-medium"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            className="text-gray-700 hover:text-brand-500 transition-colors duration-200 font-medium"
                        >
                            {t(currentLocale, 'landing.nav.contact')}
                        </Link>
                    </nav>
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href={signInHref}
                            className="px-3 py-2 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            {t(currentLocale, 'landing.nav.signIn')}
                        </Link>
                        <Link
                            href={signUpHref}
                            className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-colors"
                        >
                            {t(currentLocale, 'landing.nav.signUp')}
                        </Link>
                        <LanguageSwitcher />
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <i className="ri-menu-line text-2xl text-gray-700"></i>
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-[60] md:hidden transition-opacity duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Menu */}
            <div
                className={`fixed top-0 start-0 h-full w-64 bg-white z-[70] shadow-2xl md:hidden flex flex-col transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}`}
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/images/logo/logo_website.svg"
                            alt="Logo"
                            width={240}
                            height={72}
                            className="h-16 w-auto"
                            priority
                        />
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                        <i className="ri-close-line text-2xl text-gray-700"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-6">
                    <nav className="flex flex-col space-y-4">
                        {[
                            { name: t(currentLocale, 'landing.nav.home'), icon: 'ri-home-4-line', targetId: 'home' },
                            { name: t(currentLocale, 'landing.nav.about'), icon: 'ri-information-line', targetId: 'about' },
                            { name: t(currentLocale, 'landing.nav.services'), icon: 'ri-service-line', targetId: 'services' },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={`/#${item.targetId}`}
                                onClick={handleScrollTo(item.targetId)}
                                className="text-gray-700 hover:text-brand-500 transition-colors duration-200 font-semibold text-lg py-2 flex items-center gap-3"
                            >
                                <i className={item.icon}></i> {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-gray-700 hover:text-brand-500 transition-colors duration-200 font-semibold text-lg py-2 flex items-center gap-3"
                        >
                            <i className="ri-contacts-line"></i> {t(currentLocale, 'landing.nav.contact')}
                        </Link>
                        <Link
                            href={signInHref}
                            className="text-gray-700 hover:text-brand-500 transition-colors duration-200 font-semibold text-lg py-2 flex items-center gap-3"
                        >
                            <i className="ri-login-box-line"></i> {t(currentLocale, 'landing.nav.signIn')}
                        </Link>
                        <Link
                            href={signUpHref}
                            className="text-gray-700 hover:text-brand-500 transition-colors duration-200 font-semibold text-lg py-2 flex items-center gap-3"
                        >
                            <i className="ri-user-add-line"></i> {t(currentLocale, 'landing.nav.signUp')}
                        </Link>
                        <div className="py-2">
                            <LanguageSwitcher />
                        </div>
                    </nav>
                </div>

                <div className="p-6 border-t border-gray-100">
                    <button className="w-full bg-brand-500 text-white py-3 rounded-lg font-bold hover:bg-brand-600 transition-colors">
                        {t(currentLocale, 'landing.nav.requestQuote')}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
