import { useState, useEffect } from 'react'
import './App.css'

const INITIAL_BALANCE = 412450.00
const CARD_NUMBER = '4782 •••• •••• 3901'
const CARD_EXPIRY = '09 / 28'
const BANK_NAME = 'Virgin Money Vault'

/* ─── Splash Screen ──────────────────────────────────────────── */
function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="splash">
      <div className="splash-inner">
        <div className="splash-icon">₤</div>
        <h1 className="splash-name">{BANK_NAME}</h1>
        <p className="splash-tagline">Your money, secured.</p>
        <div className="splash-loader">
          <div className="splash-bar" />
        </div>
      </div>
    </div>
  )
}

/* ─── Auth Screen ────────────────────────────────────────────── */
function AuthScreen({ onAuth }) {
  const [fullName, setFullName] = useState('')
  const [gmail, setGmail] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const [loading, setLoading] = useState(false)

  function validate() {
    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      setError('Please enter your first and last name.')
      return false
    }
    if (!gmail.trim()) {
      setError('Please enter your Gmail address.')
      return false
    }
    if (!/^[^\s@]+@gmail\.com$/i.test(gmail.trim())) {
      setError('Only @gmail.com addresses are accepted.')
      return false
    }
    return true
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validate()) return
    const capitalized = fullName.trim().replace(/\b\w/g, c => c.toUpperCase())
    const user = { name: capitalized, email: gmail.trim().toLowerCase() }
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('vmv_user', JSON.stringify(user))
      onAuth(user)
    }, 3000)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <span className="auth-brand-icon">₤</span>
          <span className="auth-brand-name">{BANK_NAME}</span>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError('') }}
          >
            Create Account
          </button>
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError('') }}
          >
            Sign In
          </button>
        </div>

        <p className="auth-subtitle">
          {mode === 'signup'
            ? 'Register with your Gmail to get started.'
            : 'Welcome back. Sign in with your Gmail.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit} style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
          {/* Full name always shown — it sets the dashboard name */}
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input
              className="auth-input"
              type="text"
              placeholder="e.g. James Whitfield"
              value={fullName}
              onChange={e => { setFullName(e.target.value); setError('') }}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Gmail Address</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m2 7 10 7 10-7"/>
                </svg>
              </span>
              <input
                className="auth-input with-icon"
                type="email"
                placeholder="yourname@gmail.com"
                value={gmail}
                onChange={e => { setGmail(e.target.value); setError('') }}
              />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            <span className="auth-btn-content">
              {loading
                ? <span className="auth-spinner"></span>
                : (mode === 'signup' ? 'Create Account' : 'Sign In')
              }
            </span>
          </button>
        </form>

        <p className="auth-note">
          🔒 No password required · Gmail verification only
        </p>
      </div>
    </div>
  )
}

/* ─── Dashboard ──────────────────────────────────────────────── */
// Fixed deadline — never changes for anyone, ever
const PAYMENT_DEADLINE = new Date('2026-04-25T23:59:59').getTime()

function Dashboard({ user, onSignOut }) {
  const ownerName = user.name
  const [balance] = useState(INITIAL_BALANCE)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [transactions] = useState([
    { id: 1, label: 'Opening balance', amount: 412450.00, type: 'credit', date: '01 Apr 2026' },
  ])
  const [notice, setNotice] = useState('')
  const [timeLeft, setTimeLeft] = useState(PAYMENT_DEADLINE - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = PAYMENT_DEADLINE - Date.now()
      setTimeLeft(remaining > 0 ? remaining : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const days    = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours   = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  function handleWithdraw() {
    setNotice('Only card withdrawal is available for now.')
    setTimeout(() => setNotice(''), 4000)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleWithdraw()
  }

  return (
    <div className="app">
      {/* ── Top bar ── */}
      <header className="topbar">
        <div className="bank-brand">
          <span className="bank-icon">₤</span>
          <span className="bank-name">{BANK_NAME}</span>
        </div>
        <div className="owner-info">
          <div className="avatar">{ownerName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</div>
          <div>
            <p className="owner-name">{ownerName}</p>
          </div>
          <button className="signout-btn" onClick={onSignOut} title="Sign out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Notification banner ── */}
      {timeLeft <= 0 ? (
        <div className="notif-banner notif-locked">
          <span className="vault-locked">Completed, Activate card 💳</span>
        </div>
      ) : (
        <div className="notif-banner">
          <span className="notif-bell">🔔</span>
          <span className="notif-text">
            <strong>£450</strong> payment due — pay within
            <span className="notif-countdown">
              {days}d {String(hours).padStart(2,'0')}h {String(minutes).padStart(2,'0')}m {String(seconds).padStart(2,'0')}s
            </span>
          </span>
        </div>
      )}

      <main className="dashboard">
        {/* ── Balance ── */}
        <section className="balance-section">
          <p className="balance-label">Available Balance</p>
          <h1 className="balance-amount">
            £{balance.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </h1>
          <p className="balance-sub">Current account · GBP</p>
        </section>

        {/* ── Card ── */}
        <section className="card-section">
          <div className="bank-card">
            <div className="card-top">
              <span className="card-bank-name">{BANK_NAME}</span>
              <div className="chip">
                <div className="chip-line" />
                <div className="chip-line" />
                <div className="chip-line" />
              </div>
            </div>
            <div className="card-number">{CARD_NUMBER}</div>
            <div className="card-bottom">
              <div>
                <p className="card-meta-label">Card Holder</p>
                <p className="card-meta-value">{ownerName.toUpperCase()}</p>
              </div>
              <div>
                <p className="card-meta-label">Expires</p>
                <p className="card-meta-value">{CARD_EXPIRY}</p>
              </div>
              <div className="contactless">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 0 1 0 20" strokeLinecap="round"/>
                  <path d="M12 6a6 6 0 0 1 0 12" strokeLinecap="round"/>
                  <path d="M12 10a2 2 0 0 1 0 4" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── Withdraw ── */}
        <section className="withdraw-section">
          <h2 className="section-title">Withdraw Funds</h2>
          <p className="section-sub">Enter the amount you wish to withdraw from your account.</p>

          <div className="input-group">
            <span className="input-prefix">£</span>
            <input
              className="amount-input"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={withdrawAmount}
              onChange={e => { setWithdrawAmount(e.target.value); setNotice('') }}
              onKeyDown={handleKeyDown}
            />
          </div>

          {notice && <p className="feedback notice">{notice}</p>}

          <div className="quick-amounts">
            {[50, 100, 200, 500].map(amt => (
              <button
                key={amt}
                className="quick-btn"
                onClick={() => { setWithdrawAmount(String(amt)); setNotice('') }}
              >
                £{amt}
              </button>
            ))}
          </div>

          <button className="withdraw-btn" onClick={handleWithdraw}>
            Withdraw
          </button>
        </section>

        {/* ── Transaction history ── */}
        <section className="history-section">
          <h2 className="section-title">Recent Transactions</h2>
          <ul className="transaction-list">
            {transactions.map(tx => (
              <li key={tx.id} className="transaction-item">
                <div className={`tx-icon ${tx.type}`}>
                  {tx.type === 'debit' ? '↑' : '↓'}
                </div>
                <div className="tx-details">
                  <p className="tx-label">{tx.label}</p>
                  <p className="tx-date">{tx.date}</p>
                </div>
                <p className={`tx-amount ${tx.type}`}>
                  {tx.type === 'debit' ? '-' : '+'}£{tx.amount.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 {BANK_NAME} · Protected by the Financial Services Compensation Scheme (FSCS)</p>
      </footer>
    </div>
  )
}

/* ─── Root App ───────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState('splash') // 'splash' | 'auth' | 'dashboard'
  const [user, setUser] = useState(null)

  function handleSplashDone() {
    const saved = localStorage.getItem('vmv_user')
    if (saved) {
      setUser(JSON.parse(saved))
      setScreen('dashboard')
    } else {
      setScreen('auth')
    }
  }

  function handleAuth(userData) {
    setUser(userData)
    setScreen('dashboard')
  }

  function handleSignOut() {
    localStorage.removeItem('vmv_user')
    setUser(null)
    setScreen('auth')
  }

  if (screen === 'splash') return <SplashScreen onDone={handleSplashDone} />
  if (screen === 'auth')   return <AuthScreen onAuth={handleAuth} />
  return <Dashboard user={user} onSignOut={handleSignOut} />
}
