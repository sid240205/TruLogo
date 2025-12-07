"use client";
import React from 'react';
import LegalAdvice from '../../components/LegalAdvice';

export default function LegalPage() {
    // In a real app we might pass state via context or URL params, 
    // but for now we'll render it without previous analysis results context
    // or maybe we need a global state manager later.
    return (
        <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
            <LegalAdvice lastResult={null} />
        </div>
    );
}
