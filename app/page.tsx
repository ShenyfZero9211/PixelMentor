'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageContext';

export default function LandingPage() {
    const { t, lang, toggleLang } = useLanguage();

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="navbar">
                <div className="nav-logo">{t('appName')}</div>
                <div className="nav-links">
                    <button onClick={toggleLang} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                        {lang === 'en' ? '中' : 'EN'}
                    </button>
                    <Link href="/login" className="btn-secondary">{t('login')}</Link>
                    <Link href="/register" className="btn-primary">{t('signup')}</Link>
                </div>
            </nav>

            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ maxWidth: '800px', textAlign: 'center', padding: '4rem 2rem', position: 'relative', overflow: 'hidden' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                        {t('heroTitle1')} <br />
                        <span className="text-gradient">{t('heroTitle2')}</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                        {t('heroDesc')}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/dashboard" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                            {t('tryItOut')}
                        </Link>
                        <Link href="/register" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                            {t('getStarted')}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
