'use client'

import { useState } from 'react'
import styles from './ExpenseList.module.css'

const CAT_COLORS = {
  'Oziq-ovqat':  '#f97316',
  'Transport':   '#3b82f6',
  'Kiyim':       '#ec4899',
  'Uy-joy':      '#8b5cf6',
  "Sog'liq":     '#22d3a3',
  "O'yin-kulgi": '#eab308',
  'Boshqa':      '#6b7280',
}

const CAT_ICONS = {
  'Oziq-ovqat':  '🍔',
  'Transport':   '🚗',
  'Kiyim':       '👗',
  'Uy-joy':      '🏠',
  "Sog'liq":     '💊',
  "O'yin-kulgi": '🎮',
  'Boshqa':      '📦',
}

export default function ExpenseList({ expenses, onDelete, onEdit, formatUZS }) {
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Xarajatni o\'chirishni tasdiqlaysizmi?')) return
    setDeletingId(id)
    await onDelete(id)
    setDeletingId(null)
  }

  if (expenses.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🧾</span>
        <p className={styles.emptyTitle}>Hech narsa topilmadi</p>
        <p className={styles.emptySub}>Bu kun uchun xarajat yo'q yoki filtr mos kelmadi</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {expenses.map((expense, idx) => {
        const color = CAT_COLORS[expense.category] || '#6b7280'
        const icon = CAT_ICONS[expense.category] || '📦'
        return (
          <div
            key={expense.id}
            id={`expense-${expense.id}`}
            className={`${styles.item} ${deletingId === expense.id ? styles.deleting : ''}`}
            style={{ animationDelay: `${idx * 0.04}s` }}
          >
            <div className={styles.iconWrap} style={{ background: `${color}18`, borderColor: `${color}40` }}>
              <span className={styles.icon}>{icon}</span>
            </div>

            <div className={styles.info}>
              <div className={styles.top}>
                <span className={styles.category} style={{ color }}>{expense.category}</span>
                <span className={styles.date}>{expense.date}</span>
              </div>
              {expense.description && (
                <p className={styles.description}>{expense.description}</p>
              )}
            </div>

            <div className={styles.right}>
              <span className={styles.amount}>{formatUZS(expense.amount)}</span>
              <div className={styles.actions}>
                <button
                  id={`edit-${expense.id}`}
                  onClick={() => onEdit(expense)}
                  className={styles.editBtn}
                  title="Tahrirlash"
                >
                  ✏️
                </button>
                <button
                  id={`delete-${expense.id}`}
                  onClick={() => handleDelete(expense.id)}
                  className={styles.deleteBtn}
                  disabled={deletingId === expense.id}
                  title="O'chirish"
                >
                  {deletingId === expense.id ? '⏳' : '🗑️'}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
