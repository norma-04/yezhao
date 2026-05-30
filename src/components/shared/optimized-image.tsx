// ─── 野造 · 优化图片组件 ───
// Next.js Image wrapper with blur placeholder, lazy loading, responsive sizes

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string | null | undefined
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  containerClassName?: string
  priority?: boolean
  sizes?: string
  quality?: number
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  onLoad?: () => void
}

// Default blur data URL (warm cream color matching 野造 brand)
const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNGRUY4RjIiLz48L3N2Zz4='

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  containerClassName,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  quality = 85,
  objectFit = 'cover',
  onLoad,
}: OptimizedImageProps) {
  // Handle null/undefined src with a fallback
  if (!src) {
    return <ImageFallback className={cn(containerClassName, className)} />
  }

  // Determine if external URL (Supabase Storage etc.)
  const isExternal = src.startsWith('http')

  const imageProps = {
    src,
    alt,
    width: fill ? undefined : width,
    height: fill ? undefined : height,
    fill,
    priority,
    sizes: fill || !width ? sizes : undefined,
    quality,
    placeholder: 'blur' as const,
    blurDataURL: BLUR_PLACEHOLDER,
    loading: priority ? undefined : ('lazy' as const),
    className: cn(
      'transition-opacity duration-500',
      objectFit === 'cover' && 'object-cover',
      objectFit === 'contain' && 'object-contain',
      className
    ),
    onLoad,
    unoptimized: isExternal, // External URLs should be pre-optimized by Supabase
  }

  if (fill) {
    return (
      <div className={cn('relative overflow-hidden bg-clay-100', containerClassName)}>
        <Image {...imageProps} fill />
      </div>
    )
  }

  return (
    <div
      className={cn('relative overflow-hidden bg-clay-100', containerClassName)}
      style={width && height ? { width, height } : undefined}
    >
      <Image {...imageProps} />
    </div>
  )
}

// ─── Fallback for missing images ───
function ImageFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-clay-100 text-clay-300',
        className
      )}
    >
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
        />
      </svg>
    </div>
  )
}

/**
 * Generate a low-quality image placeholder (LQIP) from a remote URL.
 * Use this for critical above-the-fold images with known sources.
 */
export function generateBlurDataUrl(url: string): string {
  // For now, return a solid-color SVG matching 野造 brand
  // In production, use a server-side LQIP generator like plaiceholder
  return BLUR_PLACEHOLDER
}
