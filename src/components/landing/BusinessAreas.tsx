import React from 'react';
import { t, type Locale } from '@/locales/i18n';

const BusinessAreas = ({ locale }: { locale: Locale }) => {
    return (
        <section className="py-20 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">{t(locale, 'landing.business.title')}</h2>
                    <div className="w-24 h-1 bg-brand-500 mx-auto mb-8"></div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {t(locale, 'landing.business.subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Medical Consumables */}
                    <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group" data-aos="fade-up" data-aos-delay="100">
                        <div className="w-16 h-16 bg-brand-500 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                            <i className="ri-heart-pulse-line text-2xl text-white"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t(locale, 'landing.business.area1.title')}</h3>
                        <ul className="space-y-3 text-gray-700">
                            {[
                                t(locale, 'landing.business.area1.b1'),
                                t(locale, 'landing.business.area1.b2'),
                                t(locale, 'landing.business.area1.b3')
                            ].map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <i className="ri-check-line text-brand-500 mt-1 mr-3 flex-shrink-0"></i>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Medical Furniture */}
                    <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group" data-aos="fade-up" data-aos-delay="200">
                        <div className="w-16 h-16 bg-brand-500 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                            <i className="ri-hospital-line text-2xl text-white"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t(locale, 'landing.business.area2.title')}</h3>
                        <ul className="space-y-3 text-gray-700">
                            {[
                                t(locale, 'landing.business.area2.b1'),
                                t(locale, 'landing.business.area2.b2'),
                                t(locale, 'landing.business.area2.b3')
                            ].map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <i className="ri-check-line text-brand-500 mt-1 mr-3 flex-shrink-0"></i>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Trucks and Trailers */}
                    <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group" data-aos="fade-up" data-aos-delay="300">
                        <div className="w-16 h-16 bg-brand-500 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                            <i className="ri-truck-line text-2xl text-white"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t(locale, 'landing.business.area3.title')}</h3>
                        <ul className="space-y-3 text-gray-700">
                            {[
                                t(locale, 'landing.business.area3.b1'),
                                t(locale, 'landing.business.area3.b2'),
                                t(locale, 'landing.business.area3.b3')
                            ].map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <i className="ri-check-line text-brand-500 mt-1 mr-3 flex-shrink-0"></i>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BusinessAreas;
