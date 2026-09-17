import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="text-6xl mb-4">🏠</div>
      <h1 className="text-2xl font-bold mb-2">Imóvel não encontrado</h1>
      <p className="text-muted mb-6 max-w-md">
        O código informado não corresponde a nenhum imóvel cadastrado. Verifique
        o código e tente novamente.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
      >
        Voltar ao início
      </Link>
    </main>
  )
}
