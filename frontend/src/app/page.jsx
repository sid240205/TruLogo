"use client";
import React from 'react';
import Link from 'next/link';
import { Shield, Zap, Search, Scale, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen font-sans text-neutral-200">
            <div className="pt-32 pb-20 px-4">
                {/* Hero */}
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-mono mb-6">
                        <ActivityIcon className="w-3 h-3" />
                        <span>{t('hero.badge')}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tight mb-6 leading-[1.1]">
                        {t('hero.titleLine1')} <br />
                        <span className="text-emerald-500 font-serif">{t('hero.titleLine2')}</span>
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
                        {t('hero.subtitle')}
                    </p>

                    {/* Hero CTA */}
                    <div className="flex justify-center gap-4 animate-fade-in-up">
                        <Link
                            href="/analyze"
                            className="bg-emerald-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] transform hover:scale-105"
                        >
                            <Shield className="w-5 h-5" /> {t('hero.checkLogo')}
                        </Link>
                        <Link
                            href="/generate"
                            className="bg-white text-black border border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] transform hover:scale-105"
                        >
                            <Zap className="w-5 h-5" /> {t('hero.createLogo')}
                        </Link>
                    </div>
                </div>

                {/* Core Capabilities */}
                <div className="max-w-6xl mx-auto mt-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
                            {t('features.why')}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Card 1: Scanning */}
                        <div className="glass-panel p-10 rounded-3xl relative overflow-hidden group hover:border-emerald-500/60 hover:bg-emerald-500/5 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 transform hover:-translate-y-2">
                            <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-40 transition-opacity duration-500 rotate-12">
                                <Search className="w-64 h-64 text-emerald-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-8 text-emerald-400 group-hover:scale-110 transition-transform">
                                    <Shield className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl text-white font-medium mb-3">{t('features.scanning.title')}</h3>
                                <p className="text-neutral-400 leading-relaxed">
                                    {t('features.scanning.desc')}
                                </p>
                            </div>
                        </div>

                        {/* Card 2: Legal */}
                        <div className="glass-panel p-10 rounded-3xl relative overflow-hidden group hover:border-blue-500/60 hover:bg-blue-500/5 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-2">
                            <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-40 transition-opacity duration-500 rotate-12">
                                <Scale className="w-64 h-64 text-blue-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 transition-transform">
                                    <Scale className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl text-white font-medium mb-3">{t('features.legal.title')}</h3>
                                <p className="text-neutral-400 leading-relaxed">
                                    {t('features.legal.desc')}
                                </p>
                            </div>
                        </div>

                        {/* Card 3: Regional */}
                        <div className="glass-panel p-10 rounded-3xl relative overflow-hidden group hover:border-purple-500/60 hover:bg-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-2">
                            <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-40 transition-opacity duration-500 rotate-12">
                                <Globe className="w-64 h-64 text-purple-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-8 text-purple-400 group-hover:scale-110 transition-transform">
                                    <Globe className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl text-white font-medium mb-3">{t('features.localized.title')}</h3>
                                <p className="text-neutral-400 leading-relaxed">
                                    {t('features.localized.desc')}
                                </p>
                            </div>
                        </div>

                        {/* Card 4: Generative */}
                        <div className="glass-panel p-10 rounded-3xl relative overflow-hidden group hover:border-yellow-500/60 hover:bg-yellow-500/5 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 transform hover:-translate-y-2">
                            <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-40 transition-opacity duration-500 rotate-12">
                                <Zap className="w-64 h-64 text-yellow-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mb-8 text-yellow-400 group-hover:scale-110 transition-transform">
                                    <Zap className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl text-white font-medium mb-3">{t('features.generative.title')}</h3>
                                <p className="text-neutral-400 leading-relaxed">
                                    {t('features.generative.desc')}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper for the "Activity" icon which I missed importing properly if it was named Activity
function ActivityIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}
