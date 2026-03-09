'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '../LanguageContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { t, lang, toggleLang } = useLanguage();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="navbar" style={{ marginBottom: '2rem' }}>
                <div className="nav-logo">
                    <Link href="/dashboard">{t('appName')}</Link>
                </div>
                <div className="nav-links">
                    <a
                        href="/dashboard"
                        style={{
                            fontWeight: pathname === '/dashboard' ? 600 : 400,
                            color: pathname === '/dashboard' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            textDecoration: 'none'
                        }}
                    >
                        {t('upload')}
                    </a>
                    <a
                        href="/dashboard/history"
                        style={{
                            fontWeight: pathname === '/dashboard/history' ? 600 : 400,
                            color: pathname === '/dashboard/history' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            textDecoration: 'none'
                        }}
                    >
                        {t('history')}
                    </a>
                    <button onClick={toggleLang} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.875rem' }}>
                        {lang === 'en' ? '中' : 'EN'}
                    </button>
                    <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        {t('logout')}
                    </button>
                </div>
            </nav>

            <main style={{ flex: 1 }}>
                {children}
            </main>
        </div>
    );
}
