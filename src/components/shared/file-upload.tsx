// ─── 野造 · 文件上传组件 ───
// Drag-drop upload with preview, progress bar, compression, and retry

'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image, AlertCircle, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  uploadFile,
  compressImage,
  validateFile,
  formatFileSize,
  generateFilePath,
  type StorageBucket,
  type FileValidation,
} from '@/lib/supabase/storage'

export interface FileUploadProps {
  bucket: StorageBucket
  folder?: string
  userId: string
  accept?: string
  maxSizeMB?: number
  maxFiles?: number
  value?: UploadedFile[]
  onChange?: (files: UploadedFile[]) => void
  className?: string
  preview?: boolean
}

export interface UploadedFile {
  id: string
  url: string
  path: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'done' | 'error'
  progress: number
  error?: string
}

export function FileUpload({
  bucket,
  folder = 'uploads',
  userId,
  accept = 'image/*',
  maxSizeMB = 10,
  maxFiles = 5,
  value = [],
  onChange,
  className,
  preview = true,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(value)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const updateFiles = useCallback(
    (newFiles: UploadedFile[]) => {
      setFiles(newFiles)
      onChange?.(newFiles)
    },
    [onChange]
  )

  const uploadSingleFile = async (file: File, fileId: string) => {
    const validation = validateFile(file, {
      maxSizeMB,
      allowedTypes: accept === 'image/*' ? ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] : undefined,
    })

    if (!validation.valid) {
      updateFiles(
        files.map((f) => (f.id === fileId ? { ...f, status: 'error' as const, error: validation.error, progress: 0 } : f))
      )
      return
    }

    try {
      // Compress image
      let blob: Blob = file
      if (file.type.startsWith('image/') && !file.type.includes('gif')) {
        blob = await compressImage(file)
      }

      const compressedFile = new File([blob], file.name, { type: 'image/webp' })
      const filePath = generateFilePath(userId, folder, file.name)

      // Upload with simulated progress (Supabase doesn't provide real-time progress via JS client)
      updateFiles(files.map((f) => (f.id === fileId ? { ...f, progress: 20 } : f)))

      const result = await uploadFile({
        bucket,
        path: filePath,
        file: compressedFile,
        upsert: false,
      })

      updateFiles(
        files.map((f) =>
          f.id === fileId
            ? { ...f, url: result.url, path: result.path, status: 'done' as const, progress: 100 }
            : f
        )
      )
    } catch (err) {
      updateFiles(
        files.map((f) =>
          f.id === fileId
            ? { ...f, status: 'error' as const, error: err instanceof Error ? err.message : '上传失败', progress: 0 }
            : f
        )
      )
    }
  }

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArr = Array.from(newFiles)
      const remaining = maxFiles - files.length

      if (remaining <= 0) return

      const toUpload = fileArr.slice(0, remaining).map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url: URL.createObjectURL(file),
        path: '',
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading' as const,
        progress: 0,
      }))

      const updated = [...files, ...toUpload]
      updateFiles(updated)

      // Start upload for each file
      toUpload.forEach((f, i) => {
        uploadSingleFile(fileArr[i], f.id)
      })
    },
    [files, maxFiles, updateFiles, bucket, folder, userId]
  )

  const removeFile = (fileId: string) => {
    updateFiles(files.filter((f) => f.id !== fileId))
  }

  const retryFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (!file) return

    const updated = files.map((f) => (f.id === fileId ? { ...f, status: 'uploading' as const, progress: 0, error: undefined } : f))
    updateFiles(updated)

    // Re-create a File from the object URL
    fetch(file.url).then((r) => r.blob()).then((blob) => {
      const f = new File([blob], file.name, { type: file.type })
      uploadSingleFile(f, fileId)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Drop zone */}
      {files.length < maxFiles && (
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors',
            isDragOver ? 'border-clay-400 bg-clay-50/50' : 'border-clay-200 hover:border-clay-300 hover:bg-clay-50/30'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className={cn('h-8 w-8 mx-auto mb-2', isDragOver ? 'text-clay-500' : 'text-clay-300')} />
          <p className="text-sm text-clay-500">
            <span className="text-clay-600 font-medium">点击上传</span>{' '}
            或拖拽文件到此处
          </p>
          <p className="text-xs text-clay-300 mt-1">
            支持 {accept === 'image/*' ? 'JPG / PNG / WebP / GIF' : accept}，单文件最大 {maxSizeMB}MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </motion.div>
      )}

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border',
                  file.status === 'error' ? 'border-red-200 bg-red-50/50' : 'border-clay-100 bg-white'
                )}
              >
                {/* Preview */}
                {preview && file.type.startsWith('image/') && (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-clay-100">
                    {(file.url || file.status === 'done') ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <Image className="h-5 w-5 absolute inset-0 m-auto text-clay-300" />
                    )}
                    {file.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{file.progress}%</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-clay-700 truncate">{file.name}</p>
                  <p className="text-xs text-clay-400">{formatFileSize(file.size)}</p>
                  {file.status === 'error' && (
                    <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {file.error}
                    </p>
                  )}
                  {file.status === 'uploading' && (
                    <div className="mt-1 h-1 bg-clay-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-clay-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {file.status === 'error' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-clay-400 hover:text-clay-600"
                      onClick={(e) => { e.stopPropagation(); retryFile(file.id) }}
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-clay-400 hover:text-red-400"
                    onClick={(e) => { e.stopPropagation(); removeFile(file.id) }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
