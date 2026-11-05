import { useState, type ImgHTMLAttributes } from 'react'
import type { ResponsiveImage } from '@/data/projects'
import { asset, assetSrcSet, cn } from '@/lib/utils'

type ImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height' | 'alt'> & {
  image: ResponsiveImage
  sizes?: string
  priority?: boolean
}

/** Responsive, lazy image with a soft fade-in once decoded. */
export function Img({ image, sizes = '100vw', priority, className, ...rest }: ImgProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={asset(image.src)}
      srcSet={assetSrcSet(image.srcSet)}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      className={cn('transition-opacity duration-700', loaded ? 'opacity-100' : 'opacity-0', className)}
      {...rest}
    />
  )
}

/** Shorthand for project photography stored in /public/images as name-{w}.webp */
export function photo(name: string, widths: [number, number], ratio: number, alt: string): ResponsiveImage {
  return {
    src: `/images/${name}-${widths[0]}.webp`,
    srcSet: `/images/${name}-${widths[1]}.webp ${widths[1]}w, /images/${name}-${widths[0]}.webp ${widths[0]}w`,
    alt,
    width: widths[0],
    height: Math.round(widths[0] * ratio),
  }
}
