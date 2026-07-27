'use client'

import styles from './StatsCards.module.css'

const formatUZS = (amount) =>
  new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m'

export default function StatsCards({ expenses, filterDate }) {
  const today = new Date().toISOString().slice(0, 10)
  const currentMonth = today.slice(0, 7)

  const todayTotal = expenses
    .filter(e => e.date === today)
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const monthTotal = expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const selectedTotal = filterDate
    ? expenses.filter(e => e.date === filterDate).reduce((sum, e) => sum + Number(e.amount), 0)
    : 0

  const avgDaily = (() => {
    const days = [...new Set(expenses.map(e => e.date))].length
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    return days > 0 ? total / days : 0
  })()

  const cards = [
    {
      id: 'stat-today',
      label: 'Bugun',
      value: formatUZS(todayTotal),
      icon: '📅',
      color: 'accent',
    },
    {
      id: 'stat-month',
      label: 'Bu oy',
      value: formatUZS(monthTotal),
      icon: '📆',
      color: 'success',
    },
    {
      id: 'stat-selected',
      label: filterDate ? filterDate : 'Tanlangan kun',
      value: formatUZS(selectedTotal),
      icon: '🔍',
      color: 'warning',
    },
    {
      id: 'stat-avg',
      label: 'Kunlik o\'rtacha',
      value: formatUZS(Math.round(avgDaily)),
      icon: '📊',
      color: 'purple',
    },
  ]

  return (
    <div className={styles.grid}>
      {cards.map(card => (
        <div key={card.id} id={card.id} className={`${styles.card} ${styles[card.color]}`}>
          <div className={styles.icon}>{card.icon}</div>
          <div className={styles.info}>
            <div className={styles.label}>{card.label}</div>
            <div className={styles.value}>{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
