'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AddExpenseModal from '@/components/AddExpenseModal'
import ExpenseList from '@/components/ExpenseList'
import CategoryChart from '@/components/CategoryChart'
import WeeklyChart from '@/components/WeeklyChart'
import StatsCards from '@/components/StatsCards'
import styles from './page.module.css'

const formatUZS = (amount) =>
  new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editExpense, setEditExpense] = useState(null)
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10))
  const [filterCat, setFilterCat] = useState('all')

  // Session helpers
  const getSession = useCallback(() => {
    try {
      const session = JSON.parse(localStorage.getItem('session'))
      const user = JSON.parse(localStorage.getItem('user'))
      if (session?.access_token && user) return { session, user }
    } catch {}
    return null
  }, [])

  const getToken = useCallback(() => {
    try {
      const session = JSON.parse(localStorage.getItem('session'))
      return session?.access_token || null
    } catch {}
    return null
  }, [])

  // OAuth & Session initialization
  useEffect(() => {
    // 1. Google OAuth hash fragment handling (#access_token=...&refresh_token=...)
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
      const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const expiresAt = hashParams.get('expires_at')

      if (accessToken) {
        setLoading(true)
        fetch('/api/auth/user', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.user) {
              localStorage.setItem('session', JSON.stringify({
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_at: expiresAt
              }))
              localStorage.setItem('user', JSON.stringify(data.user))
              setUser(data.user)
              window.history.replaceState(null, '', '/')
            } else {
              router.push('/auth')
            }
          })
          .catch(() => router.push('/auth'))
        return
      }
    }

    // 2. Query param session handling
    const sessionParam = searchParams.get('session')
    if (sessionParam) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(sessionParam))
        localStorage.setItem('session', JSON.stringify({
          access_token: sessionData.access_token,
          refresh_token: sessionData.refresh_token,
          expires_at: sessionData.expires_at,
        }))
        localStorage.setItem('user', JSON.stringify(sessionData.user))
        setUser(sessionData.user)
        router.replace('/')
        return
      } catch {}
    }

    // 3. LocalStorage session check
    const saved = getSession()
    if (saved) {
      setUser(saved.user)
    } else {
      router.push('/auth')
    }
  }, [searchParams, router, getSession])

  // Xarajatlarni olish
  const fetchExpenses = useCallback(async () => {
    const token = getToken()
    if (!token) return

    setLoading(true)
    try {
      const res = await fetch('/api/expenses', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setExpenses(data)
      } else if (res.status === 401) {
        localStorage.removeItem('session')
        localStorage.removeItem('user')
        router.push('/auth')
      }
    } catch (err) {
      console.error('Fetch error:', err)
    }
    setLoading(false)
  }, [getToken, router])

  useEffect(() => {
    if (user) fetchExpenses()
  }, [user, fetchExpenses])

  const handleLogout = () => {
    localStorage.removeItem('session')
    localStorage.removeItem('user')
    router.push('/auth')
  }

  const handleDelete = async (id) => {
    const token = getToken()
    await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
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
        <StatsCards expenses={expenses} filterDate={filterDate} />

        <div className={styles.chartsRow}>
          <CategoryChart expenses={expenses} />
          <WeeklyChart expenses={expenses} />
        </div>

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

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className={styles.loadingScreen}>
        <span className={styles.loadingSpinner} />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
