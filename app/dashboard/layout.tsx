'use client';

import React from 'react';
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
    
    const [user, setUser] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [pathname]);

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
                    
                    {user && (
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
                    )}
                    
                    <button onClick={toggleLang} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)', fontSize: '0.875rem' }}>
                        {lang === 'en' ? '中' : 'EN'}
                    </button>

                    {!loading && user ? (
                        <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                            {t('logout')}
                        </button>
                    ) : !loading && !user ? (
                        <Link href="/login" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                            {t('loginPrompt')}
                        </Link>
                    ) : null}
                </div>
            </nav>

            <main style={{ flex: 1, position: 'relative' }}>
                {!user && pathname === '/dashboard' && !loading && (
                    <div style={{ backgroundColor: 'rgba(255,165,0,0.1)', color: '#ff9800', padding: '0.5rem', textAlign: 'center', fontSize: '0.875rem', marginBottom: '1rem', borderRadius: '4px' }}>
                        {lang === 'en' ? 'You are in Guest Mode. You have 2 free analyses. Please login or register to save your results.' : '您当前处于游客模式，可免费试用 2 次。登录或注册以保存记录。'}
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}
