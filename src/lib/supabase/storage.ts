// ─── 野造 · Storage Utility ───
// Helper functions for Supabase Storage operations

import { getSupabaseClient } from './client'

export type StorageBucket = 'avatars' | 'tutorials' | 'materials' | 'community'

export interface UploadOptions {
  bucket: StorageBucket
  path: string
  file: File
  upsert?: boolean
}

export interface UploadResult {
  url: string
  path: string
  bucket: string
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile({ bucket, path, file, upsert = false }: UploadOptions): Promise<UploadResult> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert,
      contentType: file.type,
    })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return {
    url: urlData.publicUrl,
    path,
    bucket,
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw new Error(`Delete failed: ${error.message}`)
}

/**
 * Get the public URL for a file
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const supabase = getSupabaseClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Generate a unique file path for uploads
 */
export function generateFilePath(userId: string, folder: string, fileName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = fileName.split('.').pop() || 'jpg'
  const safeName = fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9一-鿿]/g, '-')
    .substring(0, 30)

  return `${userId}/${folder}/${timestamp}-${random}-${safeName}.${ext}`
}

/**
 * Compress an image before upload (client-side)
 */
export async function compressImage(file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img

      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            // Fallback to original file
            resolve(file)
          }
        },
        'image/webp',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Validate file before upload
 */
export interface FileValidation {
  maxSizeMB?: number
  allowedTypes?: string[]
  allowedExtensions?: string[]
}

export function validateFile(file: File, validation: FileValidation): { valid: boolean; error?: string } {
  const { maxSizeMB = 10, allowedTypes, allowedExtensions } = validation

  // Check size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `文件大小不能超过 ${maxSizeMB}MB` }
  }

  // Check MIME type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return { valid: false, error: `不支持的文件类型: ${file.type}` }
  }

  // Check extension
  if (allowedExtensions) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext && !allowedExtensions.includes(ext)) {
      return { valid: false, error: `不支持的文件扩展名: .${ext}` }
    }
  }

  return { valid: true }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
