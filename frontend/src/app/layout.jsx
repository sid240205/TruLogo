import "./globals.css";

export const metadata = {
    title: "TruLogo - AI Trademark Verification",
    description: "Protect your brand with AI-powered logo trademark analysis",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;600;700&family=Fira+Code:wght@400&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased text-neutral-200">
                {children}
            </body>
        </html>
    );
}
