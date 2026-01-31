import React from 'react';
import { t, type Locale } from '@/locales/i18n';

const CTA = ({ locale }: { locale: Locale }) => {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-brand-500 rounded-2xl p-12 text-center text-white shadow-xl" data-aos="zoom-out">
                    <h2 className="text-4xl font-bold mb-6">{t(locale, 'landing.cta.title')}</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        {t(locale, 'landing.cta.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-brand-500 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95 shadow-md">
                            {t(locale, 'landing.cta.primary')}
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-brand-500 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95">
                            {t(locale, 'landing.cta.secondary')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
