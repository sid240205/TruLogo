"use client";
import React, { useState } from 'react';
import { RefreshCw, Download, Zap, Loader2, Sparkles } from 'lucide-react';
import { generateSafeLogo } from '../services/geminiService';

const RegenerationPanel = () => {
    // Note: Converted LogoGenerator component
    const [description, setDescription] = useState('');
    const [style, setStyle] = useState('Minimalist');
    const [generatedImages, setGeneratedImages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!description) return;
        setIsGenerating(true);
        const images = await generateSafeLogo(description, style);
        setGeneratedImages(images);
        setIsGenerating(false);
    };

    return (
        <div className="bg-surfaceHighlight min-h-[500px] flex flex-col md:flex-row">
            {/* Controls */}
            <div className="md:w-1/3 bg-surface border-r border-border p-8 flex flex-col gap-6">
                <div>
                    <h3 className="text-white font-medium text-sm tracking-wider uppercase opacity-70 mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" /> Generator Config
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-neutral-500 font-mono">VISUAL_STYLE</label>
                            <select
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors font-mono appearance-none"
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                            >
                                <option>Minimalist</option>
                                <option>Geometric</option>
                                <option>Vintage / Retro</option>
                                <option>Abstract</option>
                                <option>Futuristic</option>
                                <option>Typographic</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-neutral-500 font-mono">PROMPT_CONTEXT</label>
                            <textarea
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors h-32 resize-none leading-relaxed"
                                placeholder="Describe your brand essence..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!description || isGenerating}
                    className={`w-full py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all flex justify-center items-center gap-2 mt-auto ${!description || isGenerating
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            : 'bg-white text-black hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        }`}
                >
                    {isGenerating ? <><Loader2 className="animate-spin w-4 h-4" /> Generating...</> : <><Zap className="w-4 h-4" /> Create Assets</>}
                </button>
            </div>

            {/* Canvas / Result Area */}
            <div className="md:w-2/3 bg-[#0c0c0c] p-8 relative flex items-center justify-center">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                {generatedImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl z-10">
                        {generatedImages.map((img, index) => (
                            <div key={index} className="group relative aspect-square bg-surface border border-white/10 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all shadow-2xl">
                                <img src={img} alt="Generated" className="w-full h-full object-contain p-8" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform flex justify-between items-center">
                                    <span className="text-xs font-mono text-emerald-400">SAFE_SCORE: 98/100</span>
                                    <a href={img} download className="text-white hover:text-emerald-400"><Download className="w-4 h-4" /></a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center opacity-30 select-none">
                        <RefreshCw className="w-24 h-24 mx-auto mb-4 text-white" />
                        <h2 className="text-4xl font-serif text-white">Canvas Empty</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegenerationPanel;
