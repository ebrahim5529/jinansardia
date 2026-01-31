import React from 'react';
import { t, type Locale } from '@/locales/i18n';

const Hero = ({ locale }: { locale: Locale }) => {
    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center"
            data-aos="fade-in"
            style={{
                backgroundImage: "url('https://readdy.ai/api/search-image?query=Modern%20international%20supply%20chain%20logistics%20warehouse%20with%20medical%20equipment%20and%20trucks%2C%20professional%20corporate%20environment%20with%20clean%20white%20and%20blue%20tones%2C%20spacious%20facility%20with%20organized%20inventory%20systems%2C%20natural%20lighting%20creating%20bright%20atmosphere%2C%20minimalist%20industrial%20design%20with%20high-tech%20elements%2C%20wide%20angle%20view%20showing%20scale%20and%20efficiency&width=1920&height=1080&seq=hero001&orientation=landscape')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl" data-aos="fade-right" data-aos-delay="200">
                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                        {t(locale, 'landing.hero.title')}
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        {t(locale, 'landing.hero.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95 shadow-lg">
                            {t(locale, 'landing.hero.primaryCta')}
                        </button>
                        <button className="border-2 border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 whitespace-nowrap hover:scale-105 active:scale-95">
                            {t(locale, 'landing.hero.secondaryCta')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
