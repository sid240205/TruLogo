"use client";
import React, { useState } from 'react';
import { Sparkles, Zap, Loader2, Download } from 'lucide-react';
import { generateLogo } from '../../lib/api';

export default function GeneratePage() {
    const [formData, setFormData] = useState({
        business_name: '',
        business_description: '',
        business_type: 'none',
        color: ''
    });
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        setError('');
        setGeneratedImage(null);

        try {
            const blob = await generateLogo(formData);
            const imageUrl = URL.createObjectURL(blob);
            setGeneratedImage(imageUrl);
        } catch (err) {
            console.error("Generation failed:", err);
            setError("Failed to generate logo. Please check backend configuration.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
            <div className="glass-panel rounded-3xl p-1 shadow-2xl border-border overflow-hidden flex flex-col md:flex-row bg-surfaceHighlight min-h-[600px]">

                {/* Inputs */}
                <div className="md:w-1/3 bg-surface border-r border-border p-8 flex flex-col gap-6">
                    <div>
                        <h3 className="text-white font-medium text-sm tracking-wider uppercase opacity-70 mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-400" /> Logo Generator
                        </h3>

                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-neutral-500 font-mono">Business Name *</label>
                                <input
                                    name="business_name"
                                    required
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                                    placeholder="e.g. Acme Corp"
                                    value={formData.business_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-neutral-500 font-mono">Business Description *</label>
                                <textarea
                                    name="business_description"
                                    required
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors h-24 resize-none"
                                    placeholder="Describe your business and logo vision..."
                                    value={formData.business_description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-neutral-500 font-mono">Business Type</label>
                                <select
                                    name="business_type"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                                    value={formData.business_type}
                                    onChange={handleChange}
                                >
                                    <option value="none">General / None</option>
                                    <option value="technology">Technology</option>
                                    <option value="food">Food & Beverage</option>
                                    <option value="retail">Retail</option>
                                    <option value="health">Health & Wellness</option>
                                    <option value="finance">Finance</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-neutral-500 font-mono">Preferred Color</label>
                                <input
                                    name="color"
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                                    placeholder="e.g. Red, #FF0000"
                                    value={formData.color}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isGenerating}
                                className={`w-full py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all flex justify-center items-center gap-2 mt-6 ${isGenerating
                                        ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                        : 'bg-white text-black hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                    }`}
                            >
                                {isGenerating ? <><Loader2 className="animate-spin w-4 h-4" /> Generating...</> : <><Zap className="w-4 h-4" /> Generate Logo</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Result Area */}
                <div className="md:w-2/3 bg-[#0c0c0c] p-8 relative flex items-center justify-center">
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                    {generatedImage ? (
                        <div className="relative group max-w-md w-full aspect-square bg-surface border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                            <img src={generatedImage} alt="Generated Logo" className="w-full h-full object-contain p-8" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md flex justify-end">
                                <a href={generatedImage} download="logo.png" className="text-white hover:text-emerald-400 flex items-center gap-2 text-sm font-mono">
                                    <Download className="w-4 h-4" /> Download
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center opacity-30 select-none">
                            <Sparkles className="w-24 h-24 mx-auto mb-4 text-white" />
                            <h2 className="text-4xl font-serif text-white">
                                {isGenerating ? "Creating Magic..." : "Ready to Create"}
                            </h2>
                            {error && <p className="text-red-500 mt-4 text-sm font-mono">{error}</p>}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
