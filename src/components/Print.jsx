import { forwardRef } from 'react'
import ImageWithPlaceholder from './ImageWithPlaceholder'

/**
 * A photo styled as a slightly imperfect physical print.
 *
 * Structure (so GSAP and CSS never fight over the same transform):
 *   figure.print          ← GSAP target (position, parallax, stacking rotation)
 *     .print-inner        ← static rotation (--rot) + CSS hover
 *       .print-photo      ← [data-print-photo] aspect box; mask reveals target this
 *     figcaption          ← tiny handwritten note (hover on desktop, always on touch)
 *
 * Size it from outside with className (e.g. "w-[42vw] md:w-[24vw]").
 */
const Print = forwardRef(function Print(
  {
    photo,
    aspect = '4 / 5',
    rotate = 0,
    hoverDelta = -1,
    captionMode = 'hover', // 'hover' | 'always'
    cursor = true,
    priority = false,
    className = '',
    style,
  },
  ref
) {
  const { src, alt, focal, caption } = photo

  return (
    <figure
      ref={ref}
      className={`print ${className}`}
      data-cursor={cursor ? 'view' : undefined}
      style={style}
    >
      <div
        className="print-inner"
        style={{ '--rot': `${rotate}deg`, '--hover-delta': `${hoverDelta}deg` }}
      >
        <div className="print-photo" data-print-photo style={{ aspectRatio: aspect }}>
          <ImageWithPlaceholder
            src={src}
            alt={alt}
            focal={focal}
            loading={priority ? 'eager' : 'lazy'}
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="print-caption hand" data-mode={captionMode}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
})

export default Print
