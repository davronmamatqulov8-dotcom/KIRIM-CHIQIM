'use client'

import { useMemo } from 'react'
import styles from './WeeklyChart.module.css'

const formatUZS = (amount) =>
  new Intl.NumberFormat('uz-UZ').format(Math.round(amount)) + ' so\'m'

const DAY_LABELS = ['Yak', 'Du', 'Se', 'Cho', 'Pay', 'Ju', 'Sha']

export default function WeeklyChart({ expenses }) {
  const days = useMemo(() => {
    const result = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const dayName = DAY_LABELS[d.getDay()]
      const total = expenses
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + Number(e.amount), 0)
      result.push({ date: dateStr, label: dayName, total, isToday: i === 0 })
    }
    return result
  }, [expenses])

  const maxTotal = Math.max(...days.map(d => d.total), 1)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>So'nggi 7 kun</h3>
        <span className={styles.subtitle}>Kunlik xarajat</span>
      </div>

      <div className={styles.chart}>
        {days.map((day, i) => {
          const heightPct = (day.total / maxTotal) * 100
          return (
            <div key={day.date} className={styles.barCol}>
              {day.total > 0 && (
                <span className={styles.barAmount}>{formatUZS(day.total)}</span>
              )}
              <div className={styles.barTrack}>
                <div
                  className={`${styles.bar} ${day.isToday ? styles.barToday : ''}`}
                  style={{ height: `${Math.max(heightPct, day.total > 0 ? 4 : 0)}%` }}
                  title={`${day.date}: ${formatUZS(day.total)}`}
                />
              </div>
              <span className={`${styles.dayLabel} ${day.isToday ? styles.dayLabelToday : ''}`}>
                {day.label}
              </span>
              {day.isToday && <span className={styles.todayDot} />}
            </div>
          )
        })}
      </div>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>7 kunlik jami</span>
        <span className={styles.totalValue}>
          {formatUZS(days.reduce((s, d) => s + d.total, 0))}
        </span>
      </div>
    </div>
  )
}
