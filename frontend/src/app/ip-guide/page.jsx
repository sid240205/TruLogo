"use client";
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { IP_GUIDE_CONTENT } from './content';
import { BookOpen, AlertTriangle, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function IPGuidePage() {
    const { t } = useLanguage();
    const [activeSection, setActiveSection] = useState(IP_GUIDE_CONTENT[0].id);

    return (
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto min-h-screen">

            {/* Header */}
            <div className="text-center py-10 mb-10 border-b border-white/5">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-4 border border-emerald-500/20">
                    <BookOpen size={14} /> Knowledge Base
                </span>
                <h2 className="text-4xl md:text-5xl text-white font-serif mb-4">{t('ipGuide.title')}</h2>
                <p className="text-neutral-400 max-w-2xl mx-auto text-lg">{t('ipGuide.desc')}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">

                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-1/4 lg:sticky lg:top-32 space-y-1 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 px-2">
                        Sections
                    </div>
                    {IP_GUIDE_CONTENT.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => {
                                setActiveSection(section.id);
                                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group ${activeSection === section.id
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="truncate">{section.title.split('.')[1]}</span>
                            {activeSection === section.id && <ChevronRight size={14} />}
                        </button>
                    ))}
                </aside>

                {/* Main Content Area */}
                <main className="w-full lg:w-3/4 space-y-16">
                    {IP_GUIDE_CONTENT.map((section) => (
                        <div
                            key={section.id}
                            id={section.id}
                            className="scroll-mt-32 group"
                            onMouseEnter={() => setActiveSection(section.id)} // Optional: update active on scroll/hover could be added with IntersectionObserver
                        >
                            <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/5 bg-[#0a0a0a]/50 hover:border-emerald-500/20 transition-colors duration-500">
                                <h3 className="text-2xl md:text-3xl font-serif text-white pb-6 mb-8 border-b border-white/10 flex items-center gap-3">
                                    <span className="text-emerald-500 text-lg font-mono opacity-50">#</span>
                                    {section.title}
                                </h3>

                                <div className="prose prose-invert prose-lg max-w-none 
                                    mt-8
                                    prose-headings:font-serif prose-headings:text-white 
                                    prose-p:text-neutral-400 prose-p:leading-relaxed
                                    prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                                    prose-strong:text-white prose-strong:font-bold
                                    prose-ul:marker:text-emerald-500
                                    prose-li:text-neutral-300
                                    prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-500/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:text-emerald-100 prose-blockquote:not-italic
                                ">
                                    <ReactMarkdown>{section.content}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}
                </main>
            </div>

            {/* Disclaimer Footer */}
            <div className="mt-20 pt-10 border-t border-white/5 text-center">
                <p className="text-neutral-600 text-sm flex items-center justify-center gap-2">
                    <AlertTriangle size={14} /> Disclaimer: This guide is for informational purposes only and does not constitute legal advice.
                </p>
            </div>
        </div>
    );
}
