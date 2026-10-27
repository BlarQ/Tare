import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isSupabaseConfigured, getSupabaseServerClient } from '@/lib/supabase';
import { isStudioAuthorized } from '@/lib/studio-auth';

// Disable default body parser limit in Next.js route if needed
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    if (!isStudioAuthorized(req)) return NextResponse.json({ success: false, error: 'Studio access required.' }, { status: 401 });
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;

    const filesToProcess: File[] = [];
    if (files && files.length > 0) {
      filesToProcess.push(...files);
    } else if (singleFile) {
      filesToProcess.push(singleFile);
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json({ success: false, error: 'No files provided for upload' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];
    const client = isSupabaseConfigured() ? getSupabaseServerClient() : null;

    // Ensure bucket exists in Supabase if configured
    if (client) {
      try {
        const { data: buckets } = await client.storage.listBuckets();
        const bucketExists = buckets?.some((b) => b.name === 'cms-assets');
        if (!bucketExists) {
          await client.storage.createBucket('cms-assets', { public: true });
        }
      } catch (err) {
        console.warn('Could not verify/create cms-assets bucket automatically:', err);
      }
    }

    // Process each file
    for (const file of filesToProcess) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean filename
      const ext = path.extname(file.name) || '.jpg';
      const cleanBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueName = `${cleanBaseName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;

      let fileUploaded = false;

      // 1. Try Supabase Cloud Storage
      if (client) {
        try {
          const { data, error } = await client.storage
            .from('cms-assets')
            .upload(`uploads/${uniqueName}`, buffer, {
              contentType: file.type || 'image/jpeg',
              upsert: true,
            });

          if (!error && data) {
            const { data: publicUrlData } = client.storage.from('cms-assets').getPublicUrl(`uploads/${uniqueName}`);
            if (publicUrlData?.publicUrl) {
              uploadedUrls.push(publicUrlData.publicUrl);
              fileUploaded = true;
            }
          }
        } catch (supabaseErr) {
          console.warn('Supabase storage upload failed, falling back to local storage:', supabaseErr);
        }
      }

      // 2. Fallback to Local Filesystem Storage
      if (!fileUploaded) {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join(uploadsDir, uniqueName);
        fs.writeFileSync(filePath, buffer);
        uploadedUrls.push(`/uploads/${uniqueName}`);
      }
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length,
      storage: client ? 'supabase' : 'local',
    });
  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
