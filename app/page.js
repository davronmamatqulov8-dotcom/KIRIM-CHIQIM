'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AddExpenseModal from '@/components/AddExpenseModal'
import ExpenseList from '@/components/ExpenseList'
import CategoryChart from '@/components/CategoryChart'
import WeeklyChart from '@/components/WeeklyChart'
import StatsCards from '@/components/StatsCards'
import styles from './page.module.css'

const formatUZS = (amount) =>
  new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editExpense, setEditExpense] = useState(null)
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10))
  const [filterCat, setFilterCat] = useState('all')

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = '/auth'
      } else {
        setUser(session.user)
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) window.location.href = '/auth'
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const fetchExpenses = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    if (!error) setExpenses(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleDelete = async (id) => {
    await supabase.from('expenses').delete().eq('id', id)
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  const handleSave = (saved) => {
    setExpenses(prev => {
      const exists = prev.find(e => e.id === saved.id)
      if (exists) return prev.map(e => e.id === saved.id ? saved : e)
      return [saved, ...prev]
    })
    setShowModal(false)
    setEditExpense(null)
  }

  const openEdit = (expense) => {
    setEditExpense(expense)
    setShowModal(true)
  }

  const openAdd = () => {
    setEditExpense(null)
    setShowModal(true)
  }

  // Filtered expenses for the list (by date + category)
  const filteredExpenses = expenses.filter(e => {
    const dateMatch = filterDate ? e.date === filterDate : true
    const catMatch = filterCat === 'all' ? true : e.category === filterCat
    return dateMatch && catMatch
  })

  if (!user) return (
    <div className={styles.loadingScreen}>
      <span className={styles.loadingSpinner} />
    </div>
  )

  return (
    <div className={styles.app}>
      {/* Background */}
      <div className={styles.bgGlow} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>💰</span>
            <span className={styles.brandName}>Xarajat Tracker</span>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.userEmail}>{user.email}</span>
            <button id="logout-btn" onClick={handleLogout} className={styles.logoutBtn}>
              Chiqish
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Stats Cards */}
        <StatsCards expenses={expenses} filterDate={filterDate} />

        {/* Charts Row */}
        <div className={styles.chartsRow}>
          <CategoryChart expenses={expenses} />
          <WeeklyChart expenses={expenses} />
        </div>

        {/* Expense Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Xarajatlar</h2>
            <div className={styles.filters}>
              <input
                id="filter-date"
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className={styles.dateInput}
              />
              <select
                id="filter-category"
                value={filterCat}
                onChange={e => setFilterCat(e.target.value)}
                className={styles.select}
              >
                <option value="all">Barcha kategoriyalar</option>
                <option value="Oziq-ovqat">🍔 Oziq-ovqat</option>
                <option value="Transport">🚗 Transport</option>
                <option value="Kiyim">👗 Kiyim</option>
                <option value="Uy-joy">🏠 Uy-joy</option>
                <option value="Sog'liq">💊 Sog'liq</option>
                <option value="O'yin-kulgi">🎮 O'yin-kulgi</option>
                <option value="Boshqa">📦 Boshqa</option>
              </select>
              <button id="add-expense-btn" onClick={openAdd} className={styles.addBtn}>
                + Qo'shish
              </button>
            </div>
          </div>

          {loading ? (
            <div className={styles.listLoading}>
              <span className={styles.loadingSpinner} />
              <span>Yuklanmoqda...</span>
            </div>
          ) : (
            <ExpenseList
              expenses={filteredExpenses}
              onDelete={handleDelete}
              onEdit={openEdit}
              formatUZS={formatUZS}
            />
          )}
        </section>
      </main>

      {/* Modal */}
      {showModal && (
        <AddExpenseModal
          user={user}
          expense={editExpense}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditExpense(null) }}
        />
      )}
    </div>
  )
}
