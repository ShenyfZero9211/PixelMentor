import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Analysis from '@/models/Analysis';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.GLM_API_KEY,
    baseURL: 'https://www.dmxapi.cn/v1',
});

export async function POST(request: Request) {
    try {
        const session = await getSession();
        
        let isGuest = false;
        let ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1';
        if (ipAddress.includes(',')) {
            ipAddress = ipAddress.split(',')[0].trim();
        }

        await dbConnect();

        if (!session) {
            isGuest = true;
            const usageCount = await Analysis.countDocuments({ isGuest: true, ipAddress });
            if (usageCount >= 2) {
                return NextResponse.json({ error: '试用次数已达上限（2次），请登录或注册以继续使用。' }, { status: 429 });
            }
        }

        const formData = await request.formData();
        const file = formData.get('image') as File;
        const promptParam = formData.get('prompt') as string;

        if (!file) {
            return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
        }

        const defaultPrompt = '分析这张照片的内容，并提供详细的后期修图建议（例如色彩调整、光影调节、构图优化等）。';
        const finalPrompt = promptParam || defaultPrompt;

        // Process the file into memory buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert to Base64 for OpenAI API and Database Storage
        const base64Image = buffer.toString('base64');
        const mimeType = file.type || 'image/jpeg';
        const base64Url = `data:${mimeType};base64,${base64Image}`;

        // Call GLM API
        console.log(`[Analyze] Starting GLM API call for image size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
        const completion = await openai.chat.completions.create({
            model: 'GLM-4.1V-Thinking-Flash',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: finalPrompt },
                        {
                            type: 'image_url',
                            image_url: {
                                url: base64Url,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 4096, // Add max_tokens to ensure response limit
        }, { timeout: 120000 }); // 2-minute timeout for fetch

        console.log(`[Analyze] GLM API call succeeded`);
        const result = completion.choices[0].message.content || '未返回有效建议。';

        // Save to DB (We store the Base64 URL directly instead of a local file path so it works on Vercel's serverless environment)
        const analysis = await Analysis.create({
            userId: session ? session.id : undefined,
            isGuest,
            ipAddress,
            imageUrl: base64Url,
            prompt: finalPrompt,
            result: result,
        });

        return NextResponse.json({
            message: 'Analysis complete',
            analysis: {
                id: analysis._id,
                imageUrl: analysis.imageUrl,
                prompt: analysis.prompt,
                result: analysis.result,
                createdAt: analysis.createdAt,
            },
        });
    } catch (error: any) {
        console.error('Analysis Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
