"use client";
import React, { useState } from 'react';
import { UploadCloud, Loader2, AlertTriangle, Shield, Activity } from 'lucide-react';
import { analyzeLogoRisk, fileToBase64 } from '../services/geminiService';

const LogoUpload = ({ onAnalysisComplete }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setIsAnalyzing(true);
        setError(null);
        try {
            const base64 = await fileToBase64(file);
            const data = await analyzeLogoRisk(base64, "", "User is an MSME in the retail sector.");
            setResult(data);
            onAnalysisComplete(data);
        } catch (err) {
            console.error(err);
            setError("Analysis failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-surfaceHighlight min-h-[500px]">

            {/* Left: Input Console */}
            <div className="p-8 border-r border-border flex flex-col justify-center relative bg-surface">

                {/* Upload Area */}
                <div className="group relative border border-border rounded-xl bg-background hover:bg-black/50 transition-all overflow-hidden h-64 flex items-center justify-center shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/30">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {preview ? (
                        <img src={preview} alt="Preview" className="h-full w-full object-contain p-4 opacity-80" />
                    ) : (
                        <div className="text-center p-6 transform group-hover:scale-105 transition-transform duration-300">
                            <div className="mb-4 relative">
                                <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full"></div>
                                <UploadCloud className="w-12 h-12 text-neutral-400 mx-auto relative z-10 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <p className="text-white text-lg font-medium mb-1">ADD LOGO HERE</p>
                            <p className="text-neutral-500 text-xs font-mono">PNG, JPG, WEBP</p>
                        </div>
                    )}
                    {/* Decoration lines */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neutral-600"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neutral-600"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neutral-600"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neutral-600"></div>
                </div>

                {/* Action Button */}
                <div className="mt-8">
                    <button
                        onClick={handleAnalyze}
                        disabled={!file || isAnalyzing}
                        className={`w-full py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all flex justify-center items-center gap-2 ${!file || isAnalyzing
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            : 'bg-white text-black hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                            }`}
                    >
                        {isAnalyzing ? (
                            <><Loader2 className="animate-spin w-4 h-4" /> Processing...</>
                        ) : (
                            'Run Analysis'
                        )}
                    </button>
                    {error && <p className="text-red-500 text-xs mt-2 text-center font-mono">{error}</p>}
                </div>
            </div>

            {/* Right: Output Console */}
            <div className="bg-[#0c0c0c] p-8 overflow-y-auto relative min-h-[500px]">
                {/* Background grid for terminal feel */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <h3 className="text-white font-medium text-sm tracking-wider uppercase opacity-70 mb-6 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Analysis Output
                </h3>

                {result ? (
                    <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-4">
                        {/* Summary Block */}
                        <div className="border border-white/10 bg-white/5 rounded-lg p-4 backdrop-blur-md">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-neutral-400 text-xs font-mono">RISK_LEVEL</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded border ${result.riskLevel === 'Low' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' :
                                    result.riskLevel === 'Medium' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' :
                                        'border-red-500/50 text-red-400 bg-red-500/10'
                                    }`}>
                                    {result.riskLevel}
                                </span>
                            </div>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-4xl font-mono text-white">{result.riskScore}</span>
                                <span className="text-sm text-neutral-500 mb-1">/ 100</span>
                            </div>
                            <p className="text-neutral-300 text-sm leading-relaxed border-t border-white/5 pt-3 mt-3">
                                {result.summary}
                            </p>
                        </div>

                        {/* Visual Flags */}
                        {result.flags.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-neutral-500 text-xs font-mono">DETECTED_FLAGS</span>
                                {result.flags.map((flag, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-red-300 bg-red-950/20 border border-red-900/30 px-3 py-2 rounded">
                                        <AlertTriangle className="w-3 h-3 text-red-500" />
                                        {flag}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Matches Table Style */}
                        <div>
                            <span className="text-neutral-500 text-xs font-mono block mb-2">SIMILAR_MARKS_DB</span>
                            <div className="border border-white/10 rounded-lg overflow-hidden text-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-neutral-400 font-mono text-xs">
                                        <tr>
                                            <th className="p-3 font-normal">ENTITY</th>
                                            <th className="p-3 font-normal">SIMILARITY</th>
                                            <th className="p-3 font-normal">STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-neutral-300">
                                        {result.similarTrademarks.map((tm, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="p-3">{tm.name}</td>
                                                <td className="p-3 font-mono text-xs">
                                                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-1 mb-1">
                                                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${tm.similarityScore}%` }}></div>
                                                    </div>
                                                    {tm.similarityScore}%
                                                </td>
                                                <td className="p-3 text-xs opacity-70">{tm.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-6">
                        <div className="w-24 h-24 rounded-full border border-dashed border-neutral-700 bg-neutral-900/50 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                            <Shield className="w-10 h-10 text-neutral-500" />
                        </div>
                        <div className="text-center">
                            <p className="font-mono text-sm text-neutral-400 tracking-widest mb-2">WAITING FOR INPUT...</p>
                            <p className="text-xs text-neutral-600 max-w-[200px] mx-auto">Upload a logo to begin the AI trademark safety scan.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogoUpload;
