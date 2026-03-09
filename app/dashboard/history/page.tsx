'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../../LanguageContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AnalysisHistory {
    _id: string;
    imageUrl: string;
    prompt: string;
    result: string;
    createdAt: string;
}

export default function HistoryPage() {
    const { t } = useLanguage();
    const [histories, setHistories] = useState<AnalysisHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/history');
                const data = await res.json();

                if (!res.ok) throw new Error(data.error);

                setHistories(data.histories);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>{t('loadingHistory')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--danger)' }}>
                <p>Error: {error}</p>
            </div>
        );
    }

    if (histories.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>{t('noHistory')}</p>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{t('historyTitle')}</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {histories.map((item) => (
                    <div key={item._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                        <div style={{ position: 'relative', width: '200px', height: '150px', flexShrink: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                            <Image src={item.imageUrl} alt="Analyzed photo" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                {new Date(item.createdAt).toLocaleString()}
                            </div>
                            <div
                                className="markdown-body"
                                style={{
                                    color: 'var(--text-primary)',
                                    lineHeight: 1.6,
                                    fontSize: '0.95rem',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    paddingRight: '1rem'
                                }}
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {item.result}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
