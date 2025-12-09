"use client";
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Globe, ChevronDown, Check } from 'lucide-react';
import { NAV_ITEMS, LANGUAGES } from '../constants';

const Navbar = () => {
    const pathname = usePathname();
    const { language, setLanguage, t } = useLanguage();
    const [isLangOpen, setIsLangOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4">
            <div className="bg-[#050505]/80 backdrop-blur-2xl rounded-full px-8 py-4 flex items-center justify-between gap-12 border border-white/5 shadow-2xl shadow-black/80 max-w-5xl w-full">

                {/* Logo */}
                <Link href="/" className="flex items-center cursor-pointer gap-3 group focus:outline-none">
                    <img src="/logo.png" alt="TruLogo" className="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
                    <span className="font-['Outfit'] font-bold text-xl tracking-tight text-white mb-0.5 group-hover:text-emerald-400 transition-colors">TRULOGO</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-2">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.id}
                            href={item.path || '#'}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-['Outfit'] font-medium tracking-wide transition-all duration-300 focus:outline-none focus:ring-0 border ${pathname === item.path
                                ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] border-emerald-500/10'
                                : 'text-neutral-500 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            {t(`navbar.${item.id}`)}
                        </Link>
                    ))}
                </nav>

                {/* Language / Actions */}
                <div className="flex items-center gap-5">
                    <div className="relative font-['Outfit']">
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            onBlur={() => setTimeout(() => setIsLangOpen(false), 200)} // Simple delay to allow click
                            className={`text-xs font-medium flex items-center gap-2 transition-all uppercase tracking-wider focus:outline-none px-3 py-1.5 rounded-lg ${isLangOpen ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-400 hover:text-white'}`}
                        >
                            <Globe className="w-3 h-3" />
                            {language}
                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl py-2 text-neutral-300 border border-white/10 shadow-2xl bg-neutral-900 transform transition-all duration-200 origin-top-right z-50 ${isLangOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}>
                            <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-white/5 mb-1">
                                Select Language
                            </div>
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.label);
                                        setIsLangOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-xs transition-all font-['Outfit'] flex items-center justify-between group ${language === lang.label ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <span>{lang.label}</span>
                                    {language === lang.label && <Check className="w-3 h-3 text-emerald-400" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="bg-white text-black text-xs font-['Outfit'] font-bold px-6 py-2.5 rounded-full hover:bg-emerald-50 transition-colors shadow-lg shadow-white/10 tracking-wide focus:outline-none transform hover:scale-105 active:scale-95 duration-200">
                        {t('navbar.signIn')}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
