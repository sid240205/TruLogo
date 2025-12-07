"use client";
import React from 'react';
import RegenerationPanel from '../../components/RegenerationPanel';

export default function GeneratePage() {
    return (
        <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
            <div className="glass-panel rounded-3xl p-1 shadow-2xl border-border overflow-hidden">
                <RegenerationPanel />
            </div>
        </div>
    );
}
