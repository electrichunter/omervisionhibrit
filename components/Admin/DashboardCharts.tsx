'use client'

import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Örnek ziyaretçi verisi - 7 Günlük
const visitorData = [
    { name: 'Pzt', ziyaretci: 120, tiklama: 400 },
    { name: 'Sal', ziyaretci: 200, tiklama: 600 },
    { name: 'Çar', ziyaretci: 150, tiklama: 550 },
    { name: 'Per', ziyaretci: 280, tiklama: 800 },
    { name: 'Cum', ziyaretci: 250, tiklama: 750 },
    { name: 'Cmt', ziyaretci: 390, tiklama: 1200 },
    { name: 'Paz', ziyaretci: 310, tiklama: 900 },
];

// Örnek sistem etkileşim verisi - Aylık
const activityData = [
    { name: 'Ocak', blogYazisi: 4, yorum: 24, proje: 1 },
    { name: 'Şuvat', blogYazisi: 3, yorum: 13, proje: 0 },
    { name: 'Mart', blogYazisi: 5, yorum: 45, proje: 2 },
    { name: 'Nisan', blogYazisi: 2, yorum: 18, proje: 1 },
    { name: 'Mayıs', blogYazisi: 6, yorum: 62, proje: 3 },
    { name: 'Haziran', blogYazisi: 8, yorum: 90, proje: 2 },
];

export default function DashboardCharts() {
    // SSR (Server Side Rendering) sırasında recharts animasyon sorunlarını engellemek için mount state kullanımı
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 animate-pulse">
                <div className="bg-slate-800 p-6 rounded-2xl h-96 w-full"></div>
                <div className="bg-slate-800 p-6 rounded-2xl h-96 w-full"></div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">

            {/* 1. Tablo: Site Ziyaretçi & Trafik (Çizgi Grafik) */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-100">Haftalık Ziyaretçi Analizi</h3>
                    <p className="text-sm text-slate-400">Son 7 güne ait tahmini ziyaretçi ve etkileşim sayıları</p>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={visitorData}
                            margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '14px', color: '#cbd5e1' }} />
                            <Line type="monotone" name="Görüntüleme" dataKey="tiklama" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" name="Tekil Ziyaretçi" dataKey="ziyaretci" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Tablo: İçerik Üretim Trendleri (Çubuk Grafik) */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-100">İçerik Büyüme Hızı</h3>
                    <p className="text-sm text-slate-400">Aylık bazda sisteme eklenen blog yazı, yorum ve projeler</p>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={activityData}
                            margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: '#1e293b' }}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '14px', color: '#cbd5e1' }} />
                            <Bar name="Blog Yazısı" dataKey="blogYazisi" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            <Bar name="Onaylı Yorum" dataKey="yorum" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            <Bar name="Portfolyo Projesi" dataKey="proje" fill="#ec4899" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}
