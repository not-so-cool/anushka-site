import { useEffect, useState } from 'react'

/**
 * Fills its (positioned) parent. If the file is missing, shows an elegant
 * paper-toned placeholder that names exactly which file goes where.
 */
export default function ImageWithPlaceholder({
  src,
  alt,
  focal = '50% 50%',
  loading = 'lazy',
  className = '',
}) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  const publicPath = `/public${src.startsWith('/') ? src : `/${src}`}`

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`placeholder absolute inset-0 h-full w-full ${className}`}
      >
        <span className="placeholder-label">REPLACE → {publicPath}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      style={{ objectPosition: focal }}
    />
  )
}
