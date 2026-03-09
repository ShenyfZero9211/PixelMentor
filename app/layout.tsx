import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from './LanguageContext';

export const metadata: Metadata = {
    title: 'Vision AI - Photo Analysis & Suggestions',
    description: 'AI-powered photo analysis and post-processing suggestions',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <div className="bg-blobs">
                    <div className="blob-1"></div>
                    <div className="blob-2"></div>
                </div>

                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}
