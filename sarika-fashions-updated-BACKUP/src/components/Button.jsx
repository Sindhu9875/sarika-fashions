import React from 'react'

/**
 * Thin wrapper so buttons stay consistent across the app.
 * variant: 'primary' | 'outline' | 'gold' | 'ghost'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : '',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
