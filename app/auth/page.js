'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './auth.module.css'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = '/'
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('✅ Emailingizni tasdiqlang va qayta kiring!')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.bgGlow} />
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>💰</span>
          <h1 className={styles.logoText}>Xarajat Tracker</h1>
          <p className={styles.logoSub}>Pulni nazorat qil, maqsadga yet</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isLogin ? styles.tabActive : ''}`}
            onClick={() => setIsLogin(true)}
            id="tab-login"
          >
            Kirish
          </button>
          <button
            className={`${styles.tab} ${!isLogin ? styles.tabActive : ''}`}
            onClick={() => setIsLogin(false)}
            id="tab-register"
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@mail.com"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Parol</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.success}>{message}</div>}

          <button
            id="auth-submit"
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              isLogin ? 'Kirish →' : 'Ro\'yxatdan o\'tish →'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
