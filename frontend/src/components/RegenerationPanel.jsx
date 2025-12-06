"use client";

import { useState } from 'react';
import { Loader2, RefreshCw, Check, Download } from 'lucide-react';

export default function RegenerationPanel({ file, riskScore }) {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('risk_score', riskScore.toString());

            // Assuming the backend is running on localhost:8000
            const res = await fetch('http://localhost:8000/api/v1/generate/logo', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error("Generation failed");

            const data = await res.json();
            setVariants(data.variants);
            setGenerated(true);
        } catch (error) {
            console.error(error);
            alert("Failed to generate variants.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Logo Regeneration</h3>
                    <p className="text-sm text-gray-600">
                        {riskScore > 50
                            ? "Your risk score is high. Generate safer, distinct alternatives instantly."
                            : "Explore stylistic variations of your logo."}
                    </p>
                </div>
                {!generated && (
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4 mr-2" />
                        )}
                        Generate Safer Variants
                    </button>
                )}
            </div>

            {loading && (
                <div className="py-12 text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600 mb-2" />
                    <p className="text-gray-500">designing new concepts...</p>
                </div>
            )}

            {generated && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {variants.map((variant, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="aspect-square relative bg-gray-100 rounded-md overflow-hidden mb-3">
                                <img
                                    src={`data:image/png;base64,${variant.image_b64}`}
                                    className="object-contain w-full h-full"
                                    alt="Generated Variant"
                                />
                            </div>
                            <h4 className="font-semibold text-gray-900">{variant.type}</h4>
                            <p className="text-xs text-gray-500 mt-1">{variant.description}</p>
                            <div className="mt-3 flex gap-2">
                                <button className="flex-1 flex items-center justify-center py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                    <Download className="w-3 h-3 mr-1" /> Save
                                </button>
                                <button className="flex-1 flex items-center justify-center py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                                    <Check className="w-3 h-3 mr-1" /> Use This
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
