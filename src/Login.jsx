import { useState } from 'react'
import './Login.css'
import './AuthScene.css'

const ACCOUNT_URL = 'https://main.d6k2t0pcsz8rz.amplifyapp.com'

function LoginLogo() {
  return <a className="login-brand" href="/" aria-label="Interact home"><span><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="2.5" fill="currentColor" /><path d="M11.2 11.2a6.8 6.8 0 0 0 0 9.6m9.6-9.6a6.8 6.8 0 0 1 0 9.6M7.5 7.5a12 12 0 0 0 0 17m17-17a12 12 0 0 1 0 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></span>interact<i>.</i></a>
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const email = form.elements.email.value.trim()
    const password = form.elements.password.value
    const next = {}
    if (!email) next.email = 'Enter your email address.'
    else if (!form.elements.email.validity.valid) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Enter your password.'
    setErrors(next)
    setNotice(false)
    if (Object.keys(next).length) form.elements[Object.keys(next)[0]].focus()
    else setNotice(true)
  }

  return <main className="login-page">
    <img className="auth-background" src="/images/creator-reel-poster.jpg" alt="" fetchPriority="high" />
    <aside className="login-story" aria-labelledby="login-story-heading">
      <LoginLogo />
      <div className="login-story-copy"><p className="login-eyebrow"><span /> YOUR PEOPLE ARE OUT THERE.</p><h2 id="login-story-heading"><span className="login-title-mask"><span className="login-title-line">A familiar place.</span></span><span className="login-title-mask"><em className="login-title-line">A new conversation.</em></span></h2><p>Come back to the ideas, the voices, and the little moments that bring us together.</p></div>
      <div className="login-story-bottom"><span>REAL VOICES. SHARED POSSIBILITIES.</span><span>INTERACT.</span></div>
    </aside>
    <section className="login-form-side" aria-labelledby="login-heading">
      <div className="login-topbar"><a href="/">← Back to Interact</a><span>New here? <a href="/signup">Join us ↗</a></span></div>
      <div className="login-form-wrap">
        <div className="login-mobile-brand"><LoginLogo /></div>
        <p className="login-eyebrow">A LITTLE MORE YOU. A LITTLE MORE TOGETHER.</p>
        <h1 id="login-heading">Welcome <em>back.</em></h1>
        <p className="login-intro">Your next favorite conversation is waiting.</p>
        <form className="login-form" onSubmit={submit} noValidate>
          <div className="login-field"><label htmlFor="email">Email address</label><div className={`login-input-wrap ${errors.email ? 'has-error' : ''}`}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.4" /><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg><input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="username" autoCapitalize="none" spellCheck="false" required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} onInput={() => { setErrors((previous) => ({ ...previous, email: undefined })); setNotice(false) }} /></div>{errors.email && <p className="login-error" id="email-error">{errors.email}</p>}</div>
          <div className="login-field"><label htmlFor="password">Password</label><div className={`login-input-wrap ${errors.password ? 'has-error' : ''}`}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="3" stroke="currentColor" strokeWidth="1.4" /><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.4" /><circle cx="12" cy="15.5" r="1.3" fill="currentColor" /></svg><input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" required aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined} onInput={() => { setErrors((previous) => ({ ...previous, password: undefined })); setNotice(false) }} /><button className="password-toggle" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div>{errors.password && <p className="login-error" id="password-error">{errors.password}</p>}</div>
          <button className="login-submit" type="submit">Log in <span aria-hidden="true">↗</span></button>
          {notice && <div className="login-notice" role="status">This page’s sign-in service isn’t connected yet. <a href={`${ACCOUNT_URL}/login`}>Continue to your existing Interact login ↗</a></div>}
        </form>
        <div className="login-signup"><span>There’s room for you here.</span><p>Don’t have an account? <a href="/signup">Get started ↗</a></p></div>
      </div>
      <footer className="login-footer"><span>Made for being here, together.</span><span>© {new Date().getFullYear()} Interact</span></footer>
    </section>
  </main>
}
