"use client";
import React, { useEffect, useState } from 'react';
import { Scale, FileText, ExternalLink, ShieldAlert } from 'lucide-react';
import { getLegalAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const LegalAdvice = ({ lastResult }) => {
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAdvice = async () => {
            if (lastResult) {
                setLoading(true);
                const context = `Flags: ${lastResult.flags.join(', ')}. Summary: ${lastResult.summary}`;
                const text = await getLegalAdvice(lastResult.riskLevel, context);
                setAdvice(text);
                setLoading(false);
            } else {
                setAdvice("Run an analysis in the playground to unlock legal intelligence.");
            }
        };
        fetchAdvice();
    }, [lastResult]);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in mt-10">
            <div className="glass-panel p-10 rounded-3xl border-l-4 border-emerald-500 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 text-white/5">
                    <Scale size={200} />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-serif text-white mb-2">Legal Intelligence</h2>
                    <p className="text-neutral-400">Automated counsel for the ASEAN market.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 glass-panel p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <ShieldAlert className="text-emerald-500" />
                        <h3 className="text-lg font-medium text-white">Strategic Directive</h3>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-white/10 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse"></div>
                            <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse"></div>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-sm max-w-none prose-headings:font-serif prose-a:text-emerald-400">
                            <ReactMarkdown>{advice}</ReactMarkdown>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-3xl">
                        <h4 className="font-bold font-mono text-xs text-neutral-500 uppercase mb-4 tracking-wider">
                            Official Databases
                        </h4>
                        <ul className="space-y-4 text-sm text-neutral-300">
                            <li className="flex items-start gap-3 hover:text-white cursor-pointer group transition-colors">
                                <ExternalLink className="w-4 h-4 mt-0.5 text-neutral-500 group-hover:text-emerald-400" />
                                <span>ASEAN TMview</span>
                            </li>
                            <li className="flex items-start gap-3 hover:text-white cursor-pointer group transition-colors">
                                <ExternalLink className="w-4 h-4 mt-0.5 text-neutral-500 group-hover:text-emerald-400" />
                                <span>WIPO Madrid Monitor</span>
                            </li>
                            <li className="flex items-start gap-3 hover:text-white cursor-pointer group transition-colors">
                                <ExternalLink className="w-4 h-4 mt-0.5 text-neutral-500 group-hover:text-emerald-400" />
                                <span>DGIP Indonesia</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-900/50 to-transparent p-6 rounded-3xl border border-emerald-500/20">
                        <h4 className="font-bold text-white mb-2 text-sm">Pro Tip</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                            For multi-country protection in SEA, consider a single filing via the Madrid System to save up to 40% on legal fees.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalAdvice;
