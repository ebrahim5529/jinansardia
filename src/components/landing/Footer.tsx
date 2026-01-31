import React from 'react';
import Link from 'next/link';
import { t, type Locale } from '@/locales/i18n';

const Footer = ({ locale }: { locale: Locale }) => {
    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="text-2xl font-['Pacifico'] text-brand-500 mb-4 font-bold">JinanSardia</div>
                        <p className="text-gray-300 mb-6 max-w-md">
                            {t(locale, 'landing.footer.description')}
                        </p>
                        <div className="flex space-x-4">
                            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-500 transition-colors duration-200 cursor-pointer">
                                <i className="ri-linkedin-fill text-lg"></i>
                            </div>
                            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-500 transition-colors duration-200 cursor-pointer">
                                <i className="ri-twitter-fill text-lg"></i>
                            </div>
                            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-500 transition-colors duration-200 cursor-pointer">
                                <i className="ri-facebook-fill text-lg"></i>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t(locale, 'landing.footer.quickLinks')}</h3>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t(locale, 'landing.footer.links.about')}</Link></li>
                            <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t(locale, 'landing.footer.links.services')}</Link></li>
                            <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t(locale, 'landing.footer.links.caseStudies')}</Link></li>
                            <li><Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">{t(locale, 'landing.footer.links.careers')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t(locale, 'landing.footer.contactInfo')}</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center">
                                <div className="w-5 h-5 flex items-center justify-center mr-3">
                                    <i className="ri-mail-line text-brand-500"></i>
                                </div>
                                <span className="text-gray-300">info@jinansardia.com</span>
                            </li>
                            <li className="flex items-center">
                                <div className="w-5 h-5 flex items-center justify-center mr-3">
                                    <i className="ri-phone-line text-brand-500"></i>
                                </div>
                                <span className="text-gray-300">+86 531 8888 9999</span>
                            </li>
                            <li className="flex items-start">
                                <div className="w-5 h-5 flex items-center justify-center mr-3 mt-1">
                                    <i className="ri-map-pin-line text-brand-500"></i>
                                </div>
                                <span className="text-gray-300">Jinan, Shandong Province, China</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                    <p className="text-gray-400">
                        {t(locale, 'landing.footer.copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
