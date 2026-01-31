import React from 'react';
import Link from 'next/link';
import { t, type Locale } from '@/locales/i18n';

const History = ({ locale }: { locale: Locale }) => {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div data-aos="fade-left">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">{t(locale, 'landing.history.title')}</h2>
                        <div className="w-24 h-1 bg-brand-500 mb-8"></div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            {t(locale, 'landing.history.p1')}
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {t(locale, 'landing.history.p2')}
                        </p>
                    </div>
                    <div className="lg:order-first" data-aos="fade-right">
                        <Link href="#" className="block overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 group">
                            {/* Since we don't have next/image setup for external domains like readdy.ai, using img tag. 
                                In production, should configure images in next.config.ts */}
                            <img
                                src="https://readdy.ai/api/search-image?query=Professional%20business%20team%20reviewing%20supply%20chain%20operations%20in%20modern%20office%20environment%2C%20diverse%20group%20of%20professionals%20analyzing%20logistics%20data%20on%20digital%20screens%2C%20clean%20corporate%20setting%20with%20natural%20lighting%2C%20contemporary%20office%20design%20with%20glass%20walls%20and%20modern%20furniture%2C%20collaborative%20workspace%20atmosphere&width=600&height=400&seq=history001&orientation=landscape"
                                alt={t(locale, 'landing.history.imageAlt')}
                                className="w-full h-96 object-cover object-top group-hover:scale-110 transition-transform duration-500"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default History;
