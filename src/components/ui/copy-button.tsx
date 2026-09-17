'use client'

import { useState } from 'react'

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
    >
      {copied ? '✓ Copiado!' : label || 'Copiar'}
    </button>
  )
}
