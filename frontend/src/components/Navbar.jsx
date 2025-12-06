"use client";
import React from 'react';
import { Shield, Globe } from 'lucide-react';
import { NAV_ITEMS, LANGUAGES } from '../constants';

const Navbar = ({ currentView, setCurrentView, language, setLanguage }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-4">
            <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between gap-8 shadow-2xl shadow-black/50 max-w-5xl w-full">

                {/* Logo */}
                <div
                    className="flex items-center cursor-pointer gap-2 group"
                    onClick={() => setCurrentView('home')}
                >
                    {/* Using standard img tag for simplicity with public folder asset */}
                    <img src="/logo.png" alt="TruLogo" className="h-8 w-auto object-contain" />
                    <span className="font-['Outfit'] font-bold text-xl tracking-tight text-white mb-0.5">TruLogo</span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${currentView === item.id
                                ? 'bg-white/10 text-white'
                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Language / Actions */}
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <button className="text-xs text-neutral-400 hover:text-white font-medium flex items-center gap-1 transition-colors">
                            <Globe className="w-3 h-3" /> {language}
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-40 glass-panel rounded-xl py-2 hidden group-hover:block text-neutral-300">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.label)}
                                    className="block w-full text-left px-4 py-2 text-xs hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors">
                        Sign In
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
