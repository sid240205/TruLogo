"use client";
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function LiteracyPage() {
    const { t } = useLanguage();
    return (
        <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
            <div className="text-center py-20">
                <h2 className="text-3xl text-white font-serif mb-4">{t('literacy.title')}</h2>
                <p className="text-neutral-400">{t('literacy.desc')}</p>
            </div>
        </div>
    );
}
