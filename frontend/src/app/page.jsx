"use client";
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import LogoUpload from '../components/LogoUpload';
import RegenerationPanel from '../components/RegenerationPanel';
import Dashboard from '../components/Dashboard';
import LegalAdvice from '../components/LegalAdvice';
import { Shield, Zap, ArrowRight, Activity, Search, Scale, Globe } from 'lucide-react';

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
                            <span className="text-neutral-500 font-serif italic">Modern Era.</span>
                        </h1>
                        <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                            The fastest trademark analysis engine tailored for South East Asia.
                            Detect conflicts, visualize risk, and secure your legacy in seconds.
                        </p>
                    </div>

                    {/* Playground / Main Interaction Area */}
                    {renderPlayground()}

                    {/* Bento Grid Features */}
                    <div className="max-w-6xl mx-auto mt-24">
                        <h3 className="text-neutral-500 text-sm font-mono mb-8 uppercase tracking-widest pl-2">Core Capabilities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* Card 1: Scanning */}
                            <div className="md:col-span-2 glass-panel p-8 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-20 transition-opacity group-hover:opacity-40">
                                    <Search className="w-32 h-32 text-emerald-500" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 text-emerald-400">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-2xl text-white font-medium mb-2">Multi-Modal Scanning</h3>
                                    <p className="text-neutral-400 max-w-md">Our AI doesn't just read text. It analyzes visual geometry, phonetic similarity, and semantic meaning across ASEAN trademark databases.</p>
                                </div>
                            </div>

                            {/* Card 2: Legal */}
                            <div className="glass-panel p-8 rounded-3xl group hover:border-emerald-500/30 transition-colors">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                                    <Scale className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl text-white font-medium mb-2">Legal Intelligence</h3>
                                <p className="text-neutral-400 text-sm">Automated filing recommendations tailored to WIPO and local IP offices.</p>
                            </div>

                            {/* Card 3: Regional */}
                            <div className="glass-panel p-8 rounded-3xl group hover:border-purple-500/30 transition-colors">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl text-white font-medium mb-2">ASEAN Localized</h3>
                                <p className="text-neutral-400 text-sm">Trained on cultural contexts of Indonesia, Vietnam, Thailand, and Malaysia.</p>
                            </div>

                            {/* Card 4: Stats */}
                            <div className="md:col-span-2 glass-panel p-8 rounded-3xl flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl text-white font-medium mb-1">99.8% Accuracy</h3>
                                    <p className="text-neutral-400 text-sm">In detecting exact visual matches.</p>
                                </div>
                                <div className="hidden md:flex gap-8">
                                    <div className="text-center">
                                        <div className="text-3xl font-mono text-white">50k+</div>
                                        <div className="text-xs text-neutral-500 uppercase mt-1">Scans</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-mono text-white">5+</div>
                                        <div className="text-xs text-neutral-500 uppercase mt-1">Countries</div>
                                    </div>
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
                <p>&copy; 2024 TruLogo AI. Cartesia-inspired Design.</p>
            </footer>
        </div>
    );
}
