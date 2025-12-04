"use client";

import { useState } from 'react';
import { analyzeLogo } from '@/lib/api';
import { Upload, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

export default function LogoUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Logo for Analysis</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
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
                            Analyzing...
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
                <div className="mt-8 space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
                        <div className="flex items-center">
                            <div className={`text-3xl font-bold ${result.risk_score > 50 ? 'text-red-600' : 'text-green-600'}`}>
                                {result.risk_score.toFixed(1)}%
                            </div>
                            <span className="ml-2 text-gray-600">Risk Score</span>
                        </div>
                    </div>

                    {result.heatmap && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Similarity Heatmap</h3>
                            <div className="relative rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src={`data:image/png;base64,${result.heatmap}`}
                                    alt="Similarity Heatmap"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Similar Trademarks Found</h3>
                        {result.similar_marks.length > 0 ? (
                            <ul className="space-y-2">
                                {result.similar_marks.map((mark: any, idx: number) => (
                                    <li key={idx} className="p-3 bg-white border border-gray-200 rounded flex justify-between items-center">
                                        <span className="font-medium">{mark.metadata?.name || 'Unknown'}</span>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-gray-700">
                                                {(mark.similarity * 100).toFixed(1)}% Match
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Dist: {mark.score.toFixed(4)}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">No similar marks found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
