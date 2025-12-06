"use client";
import React from 'react';
import { Shield, Globe } from 'lucide-react';
import { NAV_ITEMS, LANGUAGES } from '../constants';

const Navbar = ({ currentView, setCurrentView, language, setLanguage }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4">
            <div className="bg-[#050505]/80 backdrop-blur-2xl rounded-full px-8 py-4 flex items-center justify-between gap-12 border border-white/5 shadow-2xl shadow-black/80 max-w-5xl w-full">

                {/* Logo */}
                <div
                    className="flex items-center cursor-pointer gap-3 group focus:outline-none"
                    onClick={() => setCurrentView('home')}
                >
                    <img src="/logo.png" alt="TruLogo" className="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
                    <span className="font-['Outfit'] font-bold text-xl tracking-tight text-white mb-0.5 group-hover:text-emerald-400 transition-colors">TruLogo</span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-2">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-['Outfit'] font-medium tracking-wide transition-all duration-300 focus:outline-none focus:ring-0 border ${currentView === item.id
                                ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] border-emerald-500/10'
                                : 'text-neutral-500 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Language / Actions */}
                <div className="flex items-center gap-5">
                    <div className="relative group font-['Outfit']">
                        <button className="text-xs text-neutral-400 hover:text-emerald-400 font-medium flex items-center gap-2 transition-colors uppercase tracking-wider focus:outline-none">
                            <Globe className="w-3 h-3" /> {language}
                        </button>
                        <div className="absolute right-0 top-full mt-4 w-40 glass-panel rounded-xl py-2 hidden group-hover:block text-neutral-300 border border-white/10 shadow-xl">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.label)}
                                    className="block w-full text-left px-4 py-3 text-xs hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors font-['Outfit'] focus:outline-none"
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="bg-white text-black text-xs font-['Outfit'] font-bold px-6 py-2.5 rounded-full hover:bg-emerald-50 transition-colors shadow-lg shadow-white/10 tracking-wide focus:outline-none">
                        Sign In
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
