import React from 'react';
import { t, type Locale } from '@/locales/i18n';

const CompanyOverview = ({ locale }: { locale: Locale }) => {
    return (
        <section className="py-20 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">{t(locale, 'landing.overview.title')}</h2>
                    <div className="w-24 h-1 bg-brand-500 mx-auto mb-8"></div>
                </div>
                <div className="max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                    <p className="text-lg text-gray-700 leading-relaxed mb-8">
                        {t(locale, 'landing.overview.p1')}
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {t(locale, 'landing.overview.p2')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CompanyOverview;
