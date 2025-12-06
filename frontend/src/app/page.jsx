"use client";
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import LogoUpload from '../components/LogoUpload';
import RegenerationPanel from '../components/RegenerationPanel';
import Dashboard from '../components/Dashboard';
import LegalAdvice from '../components/LegalAdvice';
import { Shield, Zap, Activity, Search, Scale, Globe } from 'lucide-react';

export default function Home() {
    const [currentView, setCurrentView] = useState('home');
    const [language, setLanguage] = useState('English');
    const [lastAnalysisResult, setLastAnalysisResult] = useState(null);
    const [playgroundMode, setPlaygroundMode] = useState('analyze');

    const handleAnalysisComplete = (result) => {
        setLastAnalysisResult(result);
    };

    const renderPlayground = () => {
        return (
            <div className="w-full max-w-6xl mx-auto mt-8 animate-fade-in">
                <div className="flex justify-center mb-6">
                    <div className="inline-flex bg-surfaceHighlight rounded-full p-1 border border-border">
                        <button
                            onClick={() => setPlaygroundMode('analyze')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${playgroundMode === 'analyze' ? 'bg-background text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                        >
                            Analysis
                        </button>
                        <button
                            onClick={() => setPlaygroundMode('generate')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${playgroundMode === 'generate' ? 'bg-background text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                        >
                            Generation
                        </button>
                    </div>
                </div>

                <div className="glass-panel rounded-3xl p-1 shadow-2xl shadow-black/40 border-border overflow-hidden">
                    {playgroundMode === 'analyze' ? (
                        <LogoUpload onAnalysisComplete={handleAnalysisComplete} />
                    ) : (
                        <RegenerationPanel />
                    )}
                </div>
            </div>
        )
    }

    const renderContent = () => {
        if (currentView === 'home') {
            return (
                <div className="pt-32 pb-20 px-4">
                    {/* Hero */}
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-mono mb-6">
                            <Activity className="w-3 h-3" />
                            <span>TRULOGO INTELLIGENCE v2.0</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tight mb-6 leading-[1.1]">
                            Brand Safety for the <br />
                            <span className="text-emerald-500 font-serif">Modern Era.</span>
                        </h1>
                        <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
                            The fastest trademark analysis engine tailored for South East Asia.
                            Detect conflicts, visualize risk, and secure your legacy in seconds.
                        </p>

                        {/* Hero CTA */}
                        <div className="flex justify-center gap-4 animate-fade-in-up">
                            <button
                                onClick={() => setCurrentView('analysis')}
                                className="bg-emerald-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] transform hover:scale-105"
                            >
                                <Shield className="w-5 h-5" /> Check Your Logo
                            </button>
                            <button
                                onClick={() => setCurrentView('generation')}
                                className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2 hover:bg-white/20"
                            >
                                <Zap className="w-5 h-5" /> Create Logo
                            </button>
                        </div>
                    </div>

                    {/* Core Capabilities */}
                    <div className="max-w-6xl mx-auto mt-32">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
                                Why TruLogo?
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Card 1: Scanning */}
                            <div className="glass-panel p-10 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
                                <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500 rotate-12">
                                    <Search className="w-64 h-64 text-emerald-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-8 text-emerald-400 group-hover:scale-110 transition-transform">
                                        <Shield className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl text-white font-medium mb-3">Multi-Modal Scanning</h3>
                                    <p className="text-neutral-400 leading-relaxed">
                                        Our AI goes beyond simple text matching. It analyzes visual geometry, color composition, and phonetic similarity across massive ASEAN trademark databases to find conflicts others miss.
                                    </p>
                                </div>
                            </div>

                            {/* Card 2: Legal */}
                            <div className="glass-panel p-10 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                                <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500 rotate-12">
                                    <Scale className="w-64 h-64 text-blue-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 transition-transform">
                                        <Scale className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl text-white font-medium mb-3">Legal Intelligence</h3>
                                    <p className="text-neutral-400 leading-relaxed">
                                        Get instant, actionable filing recommendations. We cross-reference WIPO Madrid System guidelines and local IP office rules to give you a clear roadmap to registration.
                                    </p>
                                </div>
                            </div>

                            {/* Card 3: Regional */}
                            <div className="glass-panel p-10 rounded-3xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
                                <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500 rotate-12">
                                    <Globe className="w-64 h-64 text-purple-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-8 text-purple-400 group-hover:scale-110 transition-transform">
                                        <Globe className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl text-white font-medium mb-3">ASEAN Localized</h3>
                                    <p className="text-neutral-400 leading-relaxed">
                                        Trained on the specific cultural and linguistic contexts of Indonesia, Vietnam, Thailand, and Malaysia to detect culturally sensitive or inappropriate imagery.
                                    </p>
                                </div>
                            </div>

                            {/* Card 4: Generative */}
                            <div className="glass-panel p-10 rounded-3xl relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-500">
                                <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500 rotate-12">
                                    <Zap className="w-64 h-64 text-yellow-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mb-8 text-yellow-400 group-hover:scale-110 transition-transform">
                                        <Zap className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl text-white font-medium mb-3">Generative Design</h3>
                                    <p className="text-neutral-400 leading-relaxed">
                                        Don't just find risks—fix them. Our integrated design engine creates distinctive, trademark-safe logo variations in seconds, ready for immediate use.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            );
        }

        // Other views wrapped in the container
        return (
            <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
                {currentView === 'dashboard' && <Dashboard />}
                {currentView === 'legal' && <LegalAdvice lastResult={lastAnalysisResult} />}
                {currentView === 'analysis' && (
                    <div className="glass-panel rounded-3xl p-1 shadow-2xl border-border overflow-hidden">
                        <LogoUpload onAnalysisComplete={handleAnalysisComplete} />
                    </div>
                )}
                {currentView === 'generation' && (
                    <div className="glass-panel rounded-3xl p-1 shadow-2xl border-border overflow-hidden">
                        <RegenerationPanel />
                    </div>
                )}
                {currentView === 'literacy' && (
                    <div className="text-center py-20">
                        <h2 className="text-3xl text-white font-serif mb-4">Knowledge Base</h2>
                        <p className="text-neutral-400">Coming Soon.</p>
                    </div>
                )}
            </div>
        )
    };

    return (
        <div className="min-h-screen font-sans text-neutral-200">
            <Navbar
                currentView={currentView}
                setCurrentView={setCurrentView}
                language={language}
                setLanguage={setLanguage}
            />
            <main>
                {renderContent()}
            </main>
            <footer className="py-12 text-center text-neutral-600 text-xs border-t border-white/5 mt-20 bg-black/50 backdrop-blur-sm">
                <p>&copy; 2025 TruLogo AI. Cartesia-inspired Design.</p>
            </footer>
        </div>
    );
}
