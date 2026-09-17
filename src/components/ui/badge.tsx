export function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
}) {
  const styles = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-accent/10 text-accent',
    error: 'bg-error/10 text-error',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  )
}
