"use client";

import { History, AlertTriangle, CheckCircle, FileText, ArrowRight } from "lucide-react";

export default function Dashboard() {
    // Mock Data for MVP
    const recentScans = [
        { id: 1, name: "TechNova Logo.png", date: "2024-10-24", risk: 12, status: "Safe" },
        { id: 2, name: "GreenLeaf_v1.svg", date: "2024-10-22", risk: 85, status: "Critical" },
        { id: 3, name: "Surya Foods.jpg", date: "2024-10-20", risk: 45, status: "Moderate" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-24">
            {/* Added pt-24 because global navbar is fixed */}

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">MSME Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage your trademark filings and logo safety reports.</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        New Analysis
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <History className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Scans</p>
                                <p className="text-2xl font-bold text-gray-900">12</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Safe to File</p>
                                <p className="text-2xl font-bold text-gray-900">8</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Critical Risks</p>
                                <p className="text-2xl font-bold text-gray-900">2</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Recent Logo Analyses</h3>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-medium uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="px-6 py-3">File Name</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Risk Score</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentScans.map((scan) => (
                                    <tr key={scan.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-900">{scan.name}</td>
                                        <td className="px-6 py-4">{scan.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${scan.risk > 70 ? 'bg-red-500' : scan.risk > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                        style={{ width: `${scan.risk}%` }}
                                                    ></div>
                                                </div>
                                                <span>{scan.risk}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                                ${scan.status === 'Safe' ? 'bg-green-100 text-green-700' :
                                                    scan.status === 'Critical' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'}`}>
                                                {scan.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-gray-400 hover:text-blue-600 transition">
                                                <FileText className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Legal Resources */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <a href="#" className="block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition group">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">Find IP Attorney</h4>
                        <p className="text-sm text-gray-500">Connect with pre-vetted trademark lawyers in your region.</p>
                    </a>
                    <a href="#" className="block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition group">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">File TM-A Form</h4>
                        <p className="text-sm text-gray-500">Direct link to IP India e-filing portal with guide.</p>
                    </a>
                    <a href="#" className="block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition group">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">Watch Classes</h4>
                        <p className="text-sm text-gray-500">Learn about NICE classifications for your products.</p>
                    </a>
                    <a href="#" className="block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition group">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">Download Report</h4>
                        <p className="text-sm text-gray-500">Get a PDF compliance report for your investors.</p>
                    </a>
                </div>
            </main>
        </div>
    );
}
