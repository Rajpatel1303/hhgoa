import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Local development fallback if Vercel token is not configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN is missing. Falling back to local public directory storage.');
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const tempDir = path.join(process.cwd(), 'public', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const filePath = path.join(tempDir, fileName);
      fs.writeFileSync(filePath, buffer);
      
      const origin = new URL(request.url).origin;
      return NextResponse.json({ url: `${origin}/temp/${fileName}` });
    }

    // Direct upload to Vercel Blob CDN
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
