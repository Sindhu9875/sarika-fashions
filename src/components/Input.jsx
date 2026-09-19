import React from 'react'

export default function Input({ label, error, id, as = 'input', children, ...rest }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const Tag = as

  return (
    <div className="field">
      {label && <label htmlFor={inputId}>{label}</label>}
      <Tag id={inputId} className={error ? 'has-error' : ''} {...rest}>
        {children}
      </Tag>
      {error && <div className="field-error">{error}</div>}
    </div>
  )
}
