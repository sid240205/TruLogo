"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CheckCircle, AlertTriangle, Clock, ArrowUpRight } from 'lucide-react';
import { storageService } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';

const MOCK_CHART_DATA = [
    { name: 'Jan', score: 65 },
    { name: 'Feb', score: 59 },
    { name: 'Mar', score: 80 },
    { name: 'Apr', score: 81 },
    { name: 'May', score: 90 },
    { name: 'Jun', score: 95 },
];

const Dashboard = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState({ safeScans: 0, riskAlerts: 0, pendingFilings: 0 });
    const [recentLogs, setRecentLogs] = useState([]);

    // Load initial data
    React.useEffect(() => {
        const loadData = () => {
            const data = storageService.getDashboardData();
            setStats(data.stats);
            setRecentLogs(data.recentLogs);
        };

        loadData();

        // Listen for updates
        window.addEventListener('dashboard-updated', loadData);
        return () => window.removeEventListener('dashboard-updated', loadData);
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-2">{t('dashboard.title')}</h2>
                    <p className="text-neutral-400">{t('dashboard.subtitle')}</p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-neutral-500 font-mono uppercase mb-1">{t('dashboard.lastUpdated')}</div>
                    <div className="text-white font-mono">{t('dashboard.justNow')}</div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">+12%</span>
                    </div>
                    <h3 className="text-4xl font-mono text-white mb-1">{stats.safeScans}</h3>
                    <p className="text-sm text-neutral-500">{t('dashboard.stats.safeScans')}</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <span className="text-neutral-500 text-xs">Action Req</span>
                    </div>
                    <h3 className="text-4xl font-mono text-white mb-1">{stats.riskAlerts}</h3>
                    <p className="text-sm text-neutral-500">{t('dashboard.stats.riskAlerts')}</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-neutral-600" />
                    </div>
                    <h3 className="text-4xl font-mono text-white mb-1">{stats.pendingFilings}</h3>
                    <p className="text-sm text-neutral-500">{t('dashboard.stats.pendingFilings')}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-lg text-white font-medium mb-6">{t('dashboard.brandHealth')}</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_CHART_DATA}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#525252', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#525252', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#fff', borderRadius: '8px' }}
                                    itemStyle={{ color: '#10b981' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-lg text-white font-medium mb-6">{t('dashboard.recentLog')}</h3>
                    <div className="space-y-1">
                        {recentLogs.length > 0 ? (
                            recentLogs.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-emerald-500 transition-colors ${item.status === 'CRITICAL' ? 'bg-red-500' : ''}`}></div>
                                        <div>
                                            <p className="font-mono text-sm text-neutral-300">{item.action}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-neutral-600 font-mono">{item.date}</span>
                                        <span className={`text-xs font-bold font-mono ${item.color}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-neutral-600 text-sm py-10 font-mono italic">
                                No recent activity. Start by analyzing a logo.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
