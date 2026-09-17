'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [code, setCode] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (trimmed) router.push(`/${trimmed}`)
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
      <div className="text-center max-w-md w-full">
        <div className="text-5xl mb-4">🏠</div>
        <h1 className="text-3xl font-bold mb-2">Guia do Hóspede</h1>
        <p className="text-muted mb-8">
          Digite o código do imóvel para acessar o guia digital da sua estadia.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ex: FLN001"
            className="flex-1 px-4 py-3 text-lg rounded-xl bg-card border border-border focus:outline-none focus:border-primary transition-colors text-center font-mono uppercase tracking-wider"
            maxLength={10}
            autoFocus
          />
          <button
            type="submit"
            disabled={!code.trim()}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Acessar
          </button>
        </form>

        <div className="mt-12 text-sm text-muted">
          <p>
            Imóveis disponíveis para demonstração:{' '}
            <button
              onClick={() => router.push('/FLN001')}
              className="text-primary hover:underline cursor-pointer font-medium"
            >
              FLN001
            </button>
            {' · '}
            <button
              onClick={() => router.push('/GRM001')}
              className="text-primary hover:underline cursor-pointer font-medium"
            >
              GRM001
            </button>
          </p>
        </div>
      </div>

      <footer className="mt-auto pt-12 pb-6 text-center text-xs text-muted">
        <p>Seazone — Gestão inteligente de imóveis por temporada</p>
      </footer>
    </main>
  )
}
