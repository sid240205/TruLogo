import LogoUpload from "./LogoUpload";
import { ShieldCheck, Search, AlertTriangle } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-background pt-16 pb-32 space-y-24">
            <div className="relative">
                <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
                    <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-32 lg:max-w-none lg:mx-0 lg:px-0 lg:col-start-2">
                        <div className="relative rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 bg-card p-8 sm:p-10">
                            <div className="text-center mb-8">
                                <h3 className="text-lg font-medium text-foreground">
                                    Check your logo risk now!
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Upload an image to instantly analyze trademark infringement risks.
                                </p>
                            </div>
                            <LogoUpload />
                        </div>
                    </div>
                    <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-1">
                        <div className="pr-4 -ml-48 sm:pr-6 md:-ml-16 lg:px-0 lg:m-0 lg:relative lg:h-full lg:flex lg:items-center">
                            <div className="lg:py-24">
                                <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                                    <span className="block xl:inline">Protect your brand with</span>{" "}
                                    <span className="block text-primary xl:inline">TruLogo AI</span>
                                </h1>
                                <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Don't let trademark infringement cost you millions. Our advanced AI analyzes your logo against a massive database of existing trademarks to identify potential risks instantly.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <a
                                            href="#"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
                                        >
                                            Get started
                                        </a>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <a
                                            href="#"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition-colors"
                                        >
                                            Live demo
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
                                    <div className="flex flex-col items-center lg:items-start">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 text-primary mb-2">
                                            <Search className="h-6 w-6" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">Deep Search</p>
                                    </div>
                                    <div className="flex flex-col items-center lg:items-start">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 text-primary mb-2">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">Risk Analysis</p>
                                    </div>
                                    <div className="flex flex-col items-center lg:items-start">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 text-primary mb-2">
                                            <AlertTriangle className="h-6 w-6" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">Instant Alerts</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
