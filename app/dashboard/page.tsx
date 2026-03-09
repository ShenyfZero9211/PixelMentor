'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../LanguageContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function DashboardPage() {
    const { t, lang } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setResult(null);
            setError('');
        }
    };

    const compressImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                const MAX_SIZE = 1200; // Resize to max 1200px to avoid timeouts

                if (width > height && width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                } else if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Canvas to Blob failed'));
                }, 'image/jpeg', 0.85); // Compress heavily at 85% JS JPEG quality
            };
            img.onerror = reject;
        });
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Compress the image first to vastly improve AI upload speed/solve timeouts
            const compressedBlob = await compressImage(file);
            const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });

            const formData = new FormData();
            formData.append('image', compressedFile);
            formData.append('prompt', t('defaultPrompt'));

            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Analysis failed');
            }

            setResult(data.analysis.result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t('uploadTitle')} <span className="text-gradient">{t('uploadTitleHighlight')}</span></h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{t('uploadDesc')}</p>
                <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '2rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--glass-border)'
                }}>
                    ✨ {t('aiDisclaimer')}
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div
                        style={{
                            border: '2px dashed var(--glass-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '2rem',
                            textAlign: 'center',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                        onClick={() => document.getElementById('file-upload')?.click()}
                    >
                        {previewUrl ? (
                            <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                                <Image src={previewUrl} alt="Preview" fill style={{ objectFit: 'contain' }} />
                            </div>
                        ) : (
                            <div style={{ padding: '4rem 0' }}>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{t('clickToUpload')}</p>
                                <span className="btn-secondary" style={{ display: 'inline-block' }}>{t('upload')}</span>
                            </div>
                        )}
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="btn-primary"
                        style={{ width: '100%', opacity: (!file || loading) ? 0.5 : 1 }}
                    >
                        {loading ? t('analyzingBtn') : t('analyzeBtn')}
                    </button>

                    {error && (
                        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                            {error}
                        </div>
                    )}
                </div>

                <div className="glass-panel" style={{ padding: '2rem', minHeight: '400px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        {t('analysisResultTitle')}
                    </h2>

                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '1rem' }}>
                            <div style={{
                                width: '40px', height: '40px',
                                borderRadius: '50%',
                                border: '3px solid var(--glass-border)',
                                borderTopColor: 'var(--accent-primary)',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <p style={{ color: 'var(--text-secondary)' }}>{t('aiThinking')}</p>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : result ? (
                        <div
                            className="markdown-body"
                            style={{
                                lineHeight: 1.8,
                                color: 'var(--text-primary)',
                            }}
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {result}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-secondary)' }}>
                            {t('uploadPromptText')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
