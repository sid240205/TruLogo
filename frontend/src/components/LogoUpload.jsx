"use client";

import { useState } from 'react';
import { analyzeLogo } from '@/lib/api';
import { Upload, Loader2, AlertTriangle, CheckCircle, Info, Shield, Scale } from 'lucide-react';
import RegenerationPanel from './RegenerationPanel';

export default function LogoUpload() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const data = await analyzeLogo(file);
            setResult(data);
        } catch (err) {
            setError('Failed to analyze logo. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (score) => {
        if (score < 30) return 'text-green-600 bg-green-50 border-green-200';
        if (score < 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Logo for Analysis</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors bg-gray-50/50">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <span className="text-gray-600 font-medium">
                        {file ? file.name : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-sm text-gray-400 mt-2">SVG, PNG, JPG or GIF</span>
                </label>
            </div>

            {file && (
                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyzing Logo DNA...
                        </>
                    ) : (
                        "Analyze Risk"
                    )}
                </button>
            )}

            {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Top Section: Score & Summary */}
                    <div className={`p-6 rounded-xl border ${getRiskColor(result.risk_score)}`}>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h3 className="text-lg font-semibold opacity-90">Brand Health Score</h3>
                                <div className="text-5xl font-extrabold mt-2 tracking-tight">
                                    {(100 - result.risk_score).toFixed(0)}<span className="text-2xl opacity-60">/100</span>
                                </div>
                                <p className="text-sm mt-1 opacity-80 font-medium">
                                    Risk Level: {result.risk_score > 70 ? 'CRITICAL' : result.risk_score > 30 ? 'MODERATE' : 'SAFE'}
                                </p>
                            </div>
                            <div className="flex-1 border-l border-opacity-20 pl-6 border-current hidden md:block">
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Scale className="w-4 h-4" />
                                    Legal Recommendation
                                </h4>
                                <p className="text-sm opacity-90">{result.remedy?.advice?.action}</p>
                                <p className="text-xs mt-1 opacity-70">{result.remedy?.advice?.status}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Col: Visuals */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    AI Attention Analysis
                                </h3>
                                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                    {result.heatmap ? (
                                        <img
                                            src={`data:image/png;base64,${result.heatmap}`}
                                            alt="AI Attention Heatmap"
                                            className="w-full h-auto object-contain"
                                        />
                                    ) : (
                                        <div className="h-48 flex items-center justify-center text-gray-400">No Heatmap</div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs p-3 backdrop-blur-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">AI Attention Map</span>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 rounded" style={{ background: 'linear-gradient(to right, #1e1e3c, #c02040, #ff9500, #ffdd00)' }}></div>
                                                    <span className="text-[10px]">Low → High Focus</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Color Legend */}
                                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-xs text-slate-600 mb-2 font-medium">Understanding the Heatmap:</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded" style={{ background: '#1e1e3c' }}></div>
                                            <span className="text-xs text-slate-500">Low attention</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded" style={{ background: '#c02040' }}></div>
                                            <span className="text-xs text-slate-500">Medium</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded" style={{ background: '#ffdd00' }}></div>
                                            <span className="text-xs text-slate-500">High attention</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2">
                                        Warmer colors show features the AI focuses on when comparing logos.
                                    </p>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    File Metadata
                                </h4>
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <span className="text-gray-500">Dimensions:</span>
                                    <span className="font-medium text-gray-900">{result.metadata?.width}x{result.metadata?.height}</span>
                                    <span className="text-gray-500">Format:</span>
                                    <span className="font-medium text-gray-900">{result.metadata?.format}</span>
                                    <span className="text-gray-500">Size:</span>
                                    <span className="font-medium text-gray-900">{result.metadata?.file_size_kb} KB</span>
                                    <span className="text-gray-500">Dominant Color:</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: result.metadata?.dominant_color }}></div>
                                        <span className="font-mono text-xs">{result.metadata?.dominant_color}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Col: Matches & Safety */}
                        <div className="space-y-6">
                            {/* Safety Flags */}
                            {result.safety && !result.safety.is_safe && (
                                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                                    <h3 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        Safety Flags Detected
                                    </h3>
                                    <ul className="space-y-2">
                                        {result.safety.flags.map((flag, idx) => (
                                            <li key={idx} className="text-sm text-red-700 bg-white/50 p-2 rounded flex items-start gap-2">
                                                <span className="mt-0.5">•</span>
                                                {flag.message}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Similar Marks */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-gray-900">Similar Trademarks</h3>
                                {result.similar_marks.length > 0 ? (
                                    <ul className="space-y-3">
                                        {result.similar_marks.slice(0, 3).map((mark, idx) => (
                                            <li key={idx} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-center transition hover:shadow-md">
                                                <div>
                                                    <span className="font-bold text-gray-900 block">{mark.metadata?.name || 'Unknown Mark'}</span>
                                                    <span className="text-xs text-gray-500">ID: {mark.id || 'N/A'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        {(mark.similarity * 100).toFixed(1)}% Match
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        No conflicting trademarks found in our database.
                                    </div>
                                )}
                            </div>

                            {/* Legal Steps */}
                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                                <h3 className="font-semibold text-slate-800 mb-3">Recommended Actions</h3>
                                <ul className="space-y-2">
                                    {result.remedy?.advice?.steps?.map((step, idx) => (
                                        <li key={idx} className="text-sm text-slate-600 flex gap-2">
                                            <span className="font-bold text-slate-400">{idx + 1}.</span>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 italic">
                                    * {result.remedy?.advice?.warning}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Regeneration Panel */}
                    {file && <RegenerationPanel file={file} riskScore={result.risk_score} />}
                </div>
            )}
        </div>
    );
}
