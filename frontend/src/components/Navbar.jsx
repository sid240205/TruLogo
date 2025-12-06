"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-background border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-xl">T</span>
                            </div>
                            <span className="text-xl font-bold text-foreground tracking-tight">TruLogo</span>
                        </Link>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            <Link
                                href="#"
                                className="border-transparent text-muted-foreground hover:text-foreground hover:border-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                            >
                                Features
                            </Link>
                            <Link
                                href="#"
                                className="border-transparent text-muted-foreground hover:text-foreground hover:border-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                            >
                                How it Works
                            </Link>
                            <Link
                                href="/dashboard"
                                className="border-transparent text-muted-foreground hover:text-foreground hover:border-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                        <Link href="/dashboard">
                            <button className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Log in
                            </button>
                        </Link>
                        <Link href="/dashboard">
                            <button className="bg-primary text-primary-foreground hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">
                                Dashboard
                            </button>
                        </Link>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden bg-background border-b border-border">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="#"
                            className="bg-primary/5 border-l-4 border-primary text-primary block pl-3 pr-4 py-2 text-base font-medium"
                        >
                            Features
                        </Link>
                        <Link
                            href="#"
                            className="border-transparent text-muted-foreground hover:bg-muted hover:border-gray-300 hover:text-foreground block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        >
                            How it Works
                        </Link>
                        <Link
                            href="#"
                            className="border-transparent text-muted-foreground hover:bg-muted hover:border-gray-300 hover:text-foreground block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        >
                            Pricing
                        </Link>
                    </div>
                    <div className="pt-4 pb-4 border-t border-border">
                        <div className="flex items-center px-4 space-y-3 flex-col">
                            <button className="w-full text-center text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-base font-medium">
                                Log in
                            </button>
                            <button className="w-full text-center bg-primary text-primary-foreground hover:bg-blue-700 px-4 py-2 rounded-md text-base font-medium shadow-sm">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
