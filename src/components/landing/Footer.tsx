"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { t, type Locale } from '@/locales/i18n';

interface FooterData {
    description: string;
    email: string;
    phone: string;
    address: string;
    copyright: string;
    links: Array<{ label: string; url: string }>;
    social: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
    };
}

const Footer = ({ locale }: { locale: Locale }) => {
    const [footerData, setFooterData] = useState<FooterData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadFooterData();
    }, []);

    const loadFooterData = async () => {
        try {
            const response = await fetch('/api/admin/website-settings');
            if (response.ok) {
                const data = await response.json();
                setFooterData({
                    description: data['footer.description'] || t(locale, 'landing.footer.description'),
                    email: data['footer.email'] || 'info@jinansardia.com',
                    phone: data['footer.phone'] || '+86 531 8888 9999',
                    address: data['footer.address'] || 'Jinan, Shandong Province, China',
                    copyright: data['footer.copyright'] || t(locale, 'landing.footer.copyright'),
                    links: JSON.parse(data['footer.links'] || '[]'),
                    social: JSON.parse(data['footer.social'] || '{}'),
                });
            } else {
                // Fallback to default values
                setFooterData({
                    description: t(locale, 'landing.footer.description'),
                    email: 'info@jinansardia.com',
                    phone: '+86 531 8888 9999',
                    address: 'Jinan, Shandong Province, China',
                    copyright: t(locale, 'landing.footer.copyright'),
                    links: [],
                    social: {},
                });
            }
        } catch (error) {
            console.error('Error loading footer data:', error);
            // Fallback to default values
            setFooterData({
                description: t(locale, 'landing.footer.description'),
                email: 'info@jinansardia.com',
                phone: '+86 531 8888 9999',
                address: 'Jinan, Shandong Province, China',
                copyright: t(locale, 'landing.footer.copyright'),
                links: [],
                social: {},
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !footerData) {
        return (
            <footer id="contact" className="bg-gray-900 text-white py-16 scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-400">جاري التحميل...</div>
                </div>
            </footer>
        );
    }

    return (
        <footer id="contact" className="bg-gray-900 text-white py-16 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="text-2xl font-['Pacifico'] text-brand-500 mb-4 font-bold">JinanSardia</div>
                        <p className="text-gray-300 mb-6 max-w-md">
                            {footerData.description}
                        </p>
                        <div className="flex space-x-4">
                            {footerData.social.linkedin && (
                                <a
                                    href={footerData.social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-500 transition-colors duration-200 cursor-pointer"
                                >
                                    <i className="ri-linkedin-fill text-lg"></i>
                                </a>
                            )}
                            {footerData.social.twitter && (
                                <a
                                    href={footerData.social.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-500 transition-colors duration-200 cursor-pointer"
                                >
                                    <i className="ri-twitter-fill text-lg"></i>
                                </a>
                            )}
                            {footerData.social.facebook && (
                                <a
                                    href={footerData.social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-500 transition-colors duration-200 cursor-pointer"
                                >
                                    <i className="ri-facebook-fill text-lg"></i>
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t(locale, 'landing.footer.quickLinks')}</h3>
                        <ul className="space-y-3">
                            {footerData.links.length > 0 ? (
                                footerData.links.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.url || '#'}
                                            className="text-gray-300 hover:text-white transition-colors duration-200"
                                        >
                                            {link.label || t(locale, `landing.footer.links.${index === 0 ? 'about' : index === 1 ? 'services' : index === 2 ? 'caseStudies' : 'careers'}`)}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t(locale, 'landing.footer.links.about')}</Link></li>
                                    <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t(locale, 'landing.footer.links.services')}</Link></li>
                                    <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t(locale, 'landing.footer.links.caseStudies')}</Link></li>
                                    <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t(locale, 'landing.footer.links.careers')}</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t(locale, 'landing.footer.contactInfo')}</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center">
                                <div className="w-5 h-5 flex items-center justify-center mr-3">
                                    <i className="ri-mail-line text-brand-500"></i>
                                </div>
                                <a href={`mailto:${footerData.email}`} className="text-gray-300 hover:text-white transition-colors">
                                    {footerData.email}
                                </a>
                            </li>
                            <li className="flex items-center">
                                <div className="w-5 h-5 flex items-center justify-center mr-3">
                                    <i className="ri-phone-line text-brand-500"></i>
                                </div>
                                <a href={`tel:${footerData.phone}`} className="text-gray-300 hover:text-white transition-colors">
                                    {footerData.phone}
                                </a>
                            </li>
                            <li className="flex items-start">
                                <div className="w-5 h-5 flex items-center justify-center mr-3 mt-1">
                                    <i className="ri-map-pin-line text-brand-500"></i>
                                </div>
                                <span className="text-gray-300">{footerData.address}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                    <p className="text-gray-400">
                        {footerData.copyright}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
