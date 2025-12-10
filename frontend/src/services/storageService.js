const STORAGE_KEY = 'trulogo_dashboard_data';

const DEFAULT_DATA = {
    stats: {
        safeScans: 0,
        riskAlerts: 0,
        pendingFilings: 0
    },
    recentLogs: []
};

export const storageService = {
    getDashboardData: () => {
        if (typeof window === 'undefined') return DEFAULT_DATA;

        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : DEFAULT_DATA;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return DEFAULT_DATA;
        }
    },

    saveDashboardData: (data) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    addScan: (scanResult) => {
        const data = storageService.getDashboardData();

        // Update Stats
        if (scanResult.riskLevel === 'LOW') {
            data.stats.safeScans += 1;
        } else if (scanResult.riskLevel === 'HIGH') {
            data.stats.riskAlerts += 1;
        } else {
            // Medium could go either way, let's say safe for now or ignore
            // Or maybe we treat everything not high as relatively safe?
            // Let's stick to the visible stats
        }

        // Add to Logs
        const newLog = {
            action: `Scan: '${scanResult.brandName || 'Untitled'}'`,
            date: 'Just now',
            status: scanResult.riskLevel === 'HIGH' ? 'CRITICAL' : scanResult.riskLevel === 'MEDIUM' ? 'WARNING' : 'SAFE',
            color: scanResult.riskLevel === 'HIGH' ? 'text-red-400' : scanResult.riskLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-emerald-400',
            timestamp: Date.now()
        };

        // Add to front, keep max 10
        data.recentLogs.unshift(newLog);
        if (data.recentLogs.length > 10) {
            data.recentLogs.pop();
        }

        storageService.saveDashboardData(data);

        // Dispatch event for real-time updates if multiple tabs/components are listening
        window.dispatchEvent(new Event('dashboard-updated'));
    }
};
