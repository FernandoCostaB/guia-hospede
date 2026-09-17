export function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon?: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-card rounded-xl border border-border p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  )
}
