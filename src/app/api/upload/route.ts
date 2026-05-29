import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { requireAdmin } from '@/lib/auth'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'projects')
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif','image/webp']

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, GIF allowed' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum 5MB' },
        { status: 400 }
      )
    }

    // Create upload directory if not exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const filename = `project-${timestamp}-${randomString}.webp`
    const filepath = path.join(UPLOAD_DIR, filename)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert to WebP using sharp
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 85 })
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer()

    // Write file
    await writeFile(filepath, webpBuffer)

    // Return URL
    const url = `/images/projects/${filename}`

    return NextResponse.json({
      success: true,
      url,
      filename
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
