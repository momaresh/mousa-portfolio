import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null // 'avatar' | 'resume' | 'logo'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    const allowedResumeTypes = ['application/pdf']
    const imageUploadTypes = new Set(['avatar', 'logo', 'company-logo'])

    if (imageUploadTypes.has(type || '') && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid image type. Allowed: JPEG, PNG, GIF, WebP, SVG' }, { status: 400 })
    }

    if (type === 'resume' && !allowedResumeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF allowed for resume' }, { status: 400 })
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `${type}-${Date.now()}.${ext}`

    // Use Vercel Blob in production, local filesystem in development
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Production: Upload to Vercel Blob
      try {
        // Read file as stream for Vercel Blob
        const blob = await put(filename, file.stream(), {
          access: 'public',
          contentType: file.type,
        })
        console.log('Blob uploaded successfully:', blob.url)
        return NextResponse.json({ url: blob.url, filename })
      } catch (blobError) {
        console.error('Vercel Blob error:', blobError)
        return NextResponse.json({ error: `Blob upload failed: ${blobError}` }, { status: 500 })
      }
    } else {
      // Development: Save to local filesystem
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
      const filepath = join(uploadsDir, filename)
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)
      const url = `/uploads/${filename}`
      return NextResponse.json({ url, filename })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
