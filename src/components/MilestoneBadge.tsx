interface Props {
  label: string
}

export function MilestoneBadge({ label }: Props) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
      style={{
        background: 'rgba(212,175,122,0.15)',
        color: '#A07840',
        border: '1px solid rgba(212,175,122,0.4)',
        letterSpacing: '0.06em',
      }}
    >
      {label}
    </span>
  )
}
