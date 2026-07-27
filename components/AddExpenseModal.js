'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './AddExpenseModal.module.css'

const CATEGORIES = [
  { value: 'Oziq-ovqat',  label: '🍔 Oziq-ovqat' },
  { value: 'Transport',   label: '🚗 Transport' },
  { value: 'Kiyim',       label: '👗 Kiyim' },
  { value: 'Uy-joy',      label: '🏠 Uy-joy' },
  { value: "Sog'liq",     label: "💊 Sog'liq" },
  { value: "O'yin-kulgi", label: "🎮 O'yin-kulgi" },
  { value: 'Boshqa',      label: '📦 Boshqa' },
]

export default function AddExpenseModal({ user, expense, onSave, onClose }) {
  const isEdit = !!expense
  const [amount, setAmount] = useState(expense?.amount || '')
  const [category, setCategory] = useState(expense?.category || 'Oziq-ovqat')
  const [description, setDescription] = useState(expense?.description || '')
  const [date, setDate] = useState(expense?.date || new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) {
      setError('Summa 0 dan katta bo\'lishi kerak')
      return
    }
    setLoading(true)
    setError('')

    const payload = {
      user_id: user.id,
      amount: Number(amount),
      category,
      description: description.trim() || null,
      date,
    }

    try {
      if (isEdit) {
        const { data, error: err } = await supabase
          .from('expenses')
          .update(payload)
          .eq('id', expense.id)
          .select()
          .single()
        if (err) throw err
        onSave(data)
      } else {
        const { data, error: err } = await supabase
          .from('expenses')
          .insert(payload)
          .select()
          .single()
        if (err) throw err
        onSave(data)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Format number with spaces while typing
  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '')
    setAmount(raw)
  }

  const displayAmount = amount ? Number(amount).toLocaleString('uz-UZ') : ''

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEdit ? '✏️ Tahrirlash' : '➕ Yangi xarajat'}
          </h2>
          <button id="modal-close" onClick={onClose} className={styles.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Amount */}
          <div className={styles.field}>
            <label className={styles.label}>Summa (so'm)</label>
            <div className={styles.amountWrap}>
              <input
                id="expense-amount"
                type="text"
                inputMode="numeric"
                value={displayAmount}
                onChange={handleAmountChange}
                placeholder="0"
                required
                className={styles.amountInput}
              />
              <span className={styles.currency}>so'm</span>
            </div>
          </div>

          {/* Category */}
          <div className={styles.field}>
            <label className={styles.label}>Kategoriya</label>
            <div className={styles.catGrid}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  id={`cat-${cat.value}`}
                  onClick={() => setCategory(cat.value)}
                  className={`${styles.catBtn} ${category === cat.value ? styles.catActive : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className={styles.field}>
            <label className={styles.label}>Sana</label>
            <input
              id="expense-date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>Izoh (ixtiyoriy)</label>
            <input
              id="expense-description"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Nima uchun sarflandi?"
              maxLength={120}
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Bekor qilish
            </button>
            <button id="save-expense" type="submit" disabled={loading} className={styles.saveBtn}>
              {loading ? <span className={styles.spinner} /> : isEdit ? 'Saqlash' : 'Qo\'shish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
