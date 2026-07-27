'use client'

import { useMemo, useState } from 'react'
import styles from './CategoryChart.module.css'

const CATEGORIES = [
  { key: 'Oziq-ovqat',   label: '🍔 Oziq-ovqat',   color: '#f97316' },
  { key: 'Transport',    label: '🚗 Transport',     color: '#3b82f6' },
  { key: 'Kiyim',        label: '👗 Kiyim',         color: '#ec4899' },
  { key: 'Uy-joy',       label: '🏠 Uy-joy',        color: '#8b5cf6' },
  { key: "Sog'liq",      label: "💊 Sog'liq",       color: '#22d3a3' },
  { key: "O'yin-kulgi",  label: "🎮 O'yin-kulgi",   color: '#eab308' },
  { key: 'Boshqa',       label: '📦 Boshqa',        color: '#6b7280' },
]

const formatUZS = (amount) =>
  new Intl.NumberFormat('uz-UZ').format(Math.round(amount)) + ' so\'m'

function buildDonut(slices, cx, cy, r, gap = 2) {
  const total = slices.reduce((s, x) => s + x.value, 0)
  if (total === 0) return []

  const paths = []
  let angle = -Math.PI / 2

  slices.forEach((slice) => {
    const fraction = slice.value / total
    const sweep = fraction * 2 * Math.PI - (gap * Math.PI) / 180

    if (sweep <= 0) return

    const x1 = cx + r * Math.cos(angle)
    const y1 = cy + r * Math.sin(angle)
    const endAngle = angle + sweep
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const large = sweep > Math.PI ? 1 : 0

    const midAngle = angle + sweep / 2

    paths.push({
      d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`,
      color: slice.color,
      key: slice.key,
      midAngle,
      fraction,
      value: slice.value,
    })

    angle = endAngle + (gap * Math.PI) / 180
  })

  return paths
}

export default function CategoryChart({ expenses }) {
  const [hovered, setHovered] = useState(null)

  const currentMonth = new Date().toISOString().slice(0, 7)

  const data = useMemo(() => {
    const monthExpenses = expenses.filter(e => e.date.startsWith(currentMonth))
    const totals = {}
    monthExpenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + Number(e.amount)
    })
    return CATEGORIES
      .map(cat => ({ ...cat, value: totals[cat.key] || 0 }))
      .filter(cat => cat.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [expenses, currentMonth])

  const total = data.reduce((s, d) => s + d.value, 0)

  const cx = 100, cy = 100, r = 70, innerR = 44
  const paths = buildDonut(data, cx, cy, r)

  const hoveredData = hovered ? data.find(d => d.key === hovered) : null

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Kategoriyalar bo'yicha</h3>
        <span className={styles.subtitle}>Bu oy</span>
      </div>

      {total === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📊</span>
          <p>Bu oy hali xarajat yo'q</p>
        </div>
      ) : (
        <div className={styles.chartArea}>
          {/* Donut SVG */}
          <div className={styles.donutWrap}>
            <svg viewBox="0 0 200 200" className={styles.svg}>
              {/* Background circle */}
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="28" />

              {/* Slices */}
              {paths.map(p => (
                <path
                  key={p.key}
                  d={p.d}
                  fill="none"
                  stroke={p.color}
                  strokeWidth={hovered === p.key ? 32 : 26}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                    opacity: hovered && hovered !== p.key ? 0.35 : 1,
                    cursor: 'pointer',
                    filter: hovered === p.key ? `drop-shadow(0 0 6px ${p.color}88)` : 'none',
                  }}
                  onMouseEnter={() => setHovered(p.key)}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}

              {/* Inner hole */}
              <circle cx={cx} cy={cy} r={innerR} fill="var(--bg-card)" />

              {/* Center text */}
              {hoveredData ? (
                <>
                  <text x={cx} y={cy - 8} textAnchor="middle" fill={hoveredData.color} fontSize="11" fontWeight="700">
                    {Math.round(hoveredData.fraction * 100)}%
                  </text>
                  <text x={cx} y={cy + 8} textAnchor="middle" fill="var(--text-secondary)" fontSize="7.5">
                    {hoveredData.key}
                  </text>
                </>
              ) : (
                <>
                  <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text-primary)" fontSize="10" fontWeight="700">
                    {data.length} tur
                  </text>
                  <text x={cx} y={cy + 8} textAnchor="middle" fill="var(--text-muted)" fontSize="7.5">
                    xarajat
                  </text>
                </>
              )}
            </svg>
          </div>

          {/* Legend */}
          <div className={styles.legend}>
            {data.map(cat => (
              <div
                key={cat.key}
                className={`${styles.legendItem} ${hovered === cat.key ? styles.legendActive : ''}`}
                onMouseEnter={() => setHovered(cat.key)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className={styles.legendDot} style={{ background: cat.color, boxShadow: `0 0 6px ${cat.color}66` }} />
                <div className={styles.legendInfo}>
                  <span className={styles.legendLabel}>{cat.label}</span>
                  <span className={styles.legendValue}>{formatUZS(cat.value)}</span>
                </div>
                <span className={styles.legendPct} style={{ color: cat.color }}>
                  {Math.round((cat.value / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
