import { forwardRef, Fragment } from 'react'

/**
 * Splits text into words (or characters) for GSAP to animate.
 * Animate the `.split-unit` elements inside the ref.
 *  - by="word" | "char"
 *  - mask: wraps each word in an overflow-hidden mask (for upward reveals)
 * Screen readers get the real text via an sr-only span; split spans are aria-hidden.
 */
const SplitText = forwardRef(function SplitText(
  { text, by = 'word', as: Tag = 'span', mask = false, className = '', unitClassName = '', ...rest },
  ref
) {
  const words = text.split(' ')

  return (
    <Tag ref={ref} className={className} {...rest}>
      <span className="sr-only">{text}</span>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span aria-hidden="true" className={`split-word${mask ? ' split-mask' : ''}`}>
            {by === 'char' ? (
              Array.from(word).map((ch, ci) => (
                <span key={ci} className={`split-unit ${unitClassName}`}>
                  {ch}
                </span>
              ))
            ) : (
              <span className={`split-unit ${unitClassName}`}>{word}</span>
            )}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
})

export default SplitText
