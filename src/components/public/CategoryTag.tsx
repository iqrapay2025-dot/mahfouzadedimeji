import type { Category } from '../../context/AppContext'

const colors: Record<Category, { bg: string; text: string }> = {
  'Edupeace':       { bg: 'color-mix(in srgb, var(--orange) 10%, transparent)', text: 'var(--orange)' },
  'Books Review':   { bg: 'rgba(37,99,235,0.1)', text: '#1d4ed8' },
  'The Alma Mater': { bg: 'rgba(5,150,105,0.1)', text: '#047857' },
  'Renaissance':    { bg: 'rgba(124,58,237,0.1)', text: '#6d28d9' },
  'Give & Take':    { bg: 'rgba(217,119,6,0.1)', text: '#b45309' },
  'Islam':          { bg: 'rgba(15,118,110,0.1)', text: '#0f766e' },
}

interface Props {
  category: Category
  selected?: boolean
  onClick?: () => void
  small?: boolean
}

export default function CategoryTag({ category, selected, onClick, small }: Props) {
  const c = colors[category] ?? { bg: 'rgba(0,0,0,0.06)', text: '#555' }
  return (
    <span onClick={onClick}
      style={{
        fontFamily: 'Inter', fontSize: small ? '0.62rem' : '0.7rem', fontWeight: 700,
        letterSpacing: '0.05em', padding: small ? '0.22rem 0.65rem' : '0.32rem 0.85rem',
        borderRadius: '100px', display: 'inline-block',
        backgroundColor: selected ? c.text : c.bg,
        color: selected ? '#fff' : c.text,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s', whiteSpace: 'nowrap',
        border: `1.5px solid ${selected ? c.text : 'transparent'}`,
      }}>
      {category}
    </span>
  )
}
