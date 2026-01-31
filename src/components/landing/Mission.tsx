import React from 'react';
import { t, type Locale } from '@/locales/i18n';

const Mission = ({ locale }: { locale: Locale }) => {
    return (
        <section className="py-20 bg-brand-500 text-white" data-aos="zoom-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold mb-8">{t(locale, 'landing.mission.title')}</h2>
                <div className="w-24 h-1 bg-white mx-auto mb-12"></div>
                <div className="max-w-4xl mx-auto">
                    <p className="text-2xl leading-relaxed font-light">
                        {t(locale, 'landing.mission.part1')}
                        <span className="font-semibold">{t(locale, 'landing.mission.highlight1')}</span>
                        {t(locale, 'landing.mission.part2')}
                        <span className="font-semibold">{t(locale, 'landing.mission.highlight2')}</span>
                        {t(locale, 'landing.mission.part3')}
                        <span className="font-semibold">{t(locale, 'landing.mission.highlight3')}</span>
                        {t(locale, 'landing.mission.part4')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Mission;
