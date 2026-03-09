import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from './LanguageContext';

export const metadata: Metadata = {
    title: 'PixelMentor - AI Photo Retouching Assistant',
    description: 'An elegant, AI-driven photo analysis and retouching suggestion app',
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
