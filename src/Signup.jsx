import { useState } from 'react'
import './Login.css'
import './Signup.css'
import './AuthScene.css'

const ACCOUNT_URL = 'https://main.d6k2t0pcsz8rz.amplifyapp.com'

export default function Signup() {
  const [role, setRole] = useState('creator')
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const next = {}
    if (form.elements.fullName.value.trim().length < 3) next.fullName = 'At least 3 characters.'
    if (form.elements.username.value.trim().length < 3) next.username = 'At least 3 characters.'
    const phone = form.elements.phone.value.trim()
    const digits = phone.replace(/\D/g, '')
    if (!/^[+\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15) next.phone = 'Enter 7–15 digits; a country code is optional.'
    if (!form.elements.email.value.trim() || !form.elements.email.validity.valid) next.email = 'Enter a valid email address.'
    if (!form.elements.password.value) next.password = 'Enter a password.'
    setErrors(next)
    if (Object.keys(next).length) form.elements[Object.keys(next)[0]].focus()
    else window.location.assign(`${ACCOUNT_URL}/signup`)
  }

  return <main className="login-page signup-page">
    <img className="auth-background" src="/images/creator-reel-poster.jpg" alt="" fetchPriority="high" />
      <aside className="login-story signup-welcome" aria-labelledby="signup-heading"><a className="signup-brand" href="/" aria-label="Interact home"><span><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="2.5" fill="currentColor" /><path d="M11.2 11.2a6.8 6.8 0 0 0 0 9.6m9.6-9.6a6.8 6.8 0 0 1 0 9.6M7.5 7.5a12 12 0 0 0 0 17m17-17a12 12 0 0 1 0 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></span>interact<i>.</i></a><div className="signup-welcome-copy"><p>A little more together, every day</p><h1 id="signup-heading"><span className="signup-title-line">Your ideas belong.</span><em className="signup-title-line">Your people await.</em></h1><p className="signup-description">Make room for your voice, discover fresh perspectives, and connect with people who share your curiosity. Your next great conversation starts here.</p></div></aside>

      <section className="login-form-side signup-form-side" aria-labelledby="details-heading"><div className="signup-card"><div className="signup-step"><h2 id="details-heading">Your details</h2><span>01 <span>/ 02</span></span></div><div className="signup-progress" aria-hidden="true"><span /><span /></div>
        <form onSubmit={submit} noValidate>
          <fieldset className="signup-roles"><legend>I want to join as</legend><div>{[{ value: 'creator', title: 'Creator', subtitle: 'Share and go live' }, { value: 'viewer', title: 'Viewer', subtitle: 'Discover and watch' }].map((item) => <label className={`signup-role ${role === item.value ? 'is-selected' : ''}`} key={item.value}><input type="radio" name="role" value={item.value} checked={role === item.value} onChange={() => setRole(item.value)} /><span className="role-indicator" aria-hidden="true" /><span><strong>{item.title}</strong><small>{item.subtitle}</small></span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">{item.value === 'creator' ? <><rect x="7" y="3" width="10" height="13" rx="5" stroke="currentColor" strokeWidth="1.4" /><path d="M4 11v1a8 8 0 0 0 16 0v-1M12 20v2M8 22h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></> : <><path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" stroke="currentColor" strokeWidth="1.4" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" /></>}</svg></label>)}</div></fieldset>
          <div className="signup-fields-grid">
            <div className="signup-field"><label htmlFor="signup-name">Full name</label><input id="signup-name" name="fullName" autoComplete="name" placeholder="Your name" required minLength={3} aria-invalid={!!errors.fullName} aria-describedby="signup-name-hint" onInput={() => setErrors((previous) => ({ ...previous, fullName: undefined }))} /><p id="signup-name-hint" className={errors.fullName ? 'signup-field-error' : ''}>At least 3 characters.</p></div>
            <div className="signup-field"><label htmlFor="signup-username">Username</label><input id="signup-username" name="username" autoComplete="username" autoCapitalize="none" spellCheck="false" placeholder="Your username" required minLength={3} aria-invalid={!!errors.username} aria-describedby="signup-username-hint" onInput={() => setErrors((previous) => ({ ...previous, username: undefined }))} /><p id="signup-username-hint" className={errors.username ? 'signup-field-error' : ''}>At least 3 characters.</p></div>
            <div className="signup-field"><label htmlFor="signup-phone">Phone number</label><input id="signup-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" required aria-invalid={!!errors.phone} aria-describedby="signup-phone-hint" onInput={() => setErrors((previous) => ({ ...previous, phone: undefined }))} /><p id="signup-phone-hint" className={errors.phone ? 'signup-field-error' : ''}>Enter 7–15 digits; a country code is optional.</p></div>
            <div className="signup-field"><label htmlFor="signup-email">Email address</label><input id="signup-email" name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck="false" placeholder="you@example.com" required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'signup-email-error' : undefined} onInput={() => setErrors((previous) => ({ ...previous, email: undefined }))} />{errors.email && <p className="signup-field-error" id="signup-email-error">{errors.email}</p>}</div>
            <div className="signup-field signup-password-field"><label htmlFor="signup-password">Password</label><div className="signup-password-wrap"><input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a password" required aria-invalid={!!errors.password} aria-describedby={errors.password ? 'signup-password-error' : undefined} onInput={() => setErrors((previous) => ({ ...previous, password: undefined }))} /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div>{errors.password && <p className="signup-field-error" id="signup-password-error">{errors.password}</p>}</div>
          </div>
          <button className="signup-continue" type="submit">Continue <span aria-hidden="true">↗</span></button>
        </form>
        <p className="signup-login">Already have an account? <a href={`${ACCOUNT_URL}/login`}>Log in ↗</a></p>
      </div></section>
  </main>
}
