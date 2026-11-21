import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'
import CreatorFinder from './publicCreators/CreatorFinder'

gsap.registerPlugin(ScrollTrigger)

const APP_URL = 'https://main.d6k2t0pcsz8rz.amplifyapp.com'
const SIGNUP_URL = '/signup'
const LOGIN_URL = '/login'
const links = [
  { name: 'How it works', href: '#how-it-works' },
  { name: "Who it's for", href: '#who-its-for' },
  { name: 'Questions', href: '#questions' },
]
const creatorFormats = [
  { image: 'camera', title: 'Create an account.', category: 'GET STARTED', description: 'Sign up for Interact. Start with your curiosity and make a space for yourself.' },
  { image: 'workshop', title: 'Host or discover.', category: 'FIND YOUR MOMENT', description: 'Bring an idea to life as a host, or find a session that speaks to you.' },
  { image: 'hero', title: 'Join the conversation.', category: 'CONNECT', description: 'Show up, share a perspective, and spend a little time with your people.' },
]
const questions = [
  { question: 'What is Interact?', answer: 'Interact is a place for hosts and viewers to come together around live moments. Share an idea, discover a different perspective, or simply be part of a conversation that interests you.' },
  { question: 'Who is it for?', answer: 'For anyone with something to share, and anyone curious enough to listen. Whether you want to host a thoughtful conversation, share a creative session, or find your people, there’s room for you here.' },
  { question: 'How do I get started?', answer: 'Create your account using Get started. From there, explore Interact and find your way to take part—as a host, a viewer, or both.' },
]

function HeadingLine({ children }) {
  return <span className="heading-mask"><span className="heading-line">{children}</span></span>
}

function BroadcastIcon() {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="2.5" fill="currentColor" /><path d="M11.2 11.2a6.8 6.8 0 0 0 0 9.6m9.6-9.6a6.8 6.8 0 0 1 0 9.6M7.5 7.5a12 12 0 0 0 0 17m17-17a12 12 0 0 1 0 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
}

function Brand({ onClick, footer = false }) {
  return <a className="brand" href={footer ? `${APP_URL}/` : '#home'} onClick={onClick} aria-label="Interact home"><span className="brand-icon"><BroadcastIcon /></span><span>interact<span className="brand-period">.</span></span></a>
}

function ActionLink({ children = 'Get started', className = '', href = SIGNUP_URL }) {
  return <a className={`action-link ${className}`} href={href}>{children}<span aria-hidden="true">↗</span></a>
}

function Navigation({ close }) {
  return <nav className="editorial-links" aria-label="Mobile navigation">{links.map((link, index) => <a key={link.name} href={link.href} onClick={close}><span>{link.name}</span><sup>0{index + 1}</sup><i aria-hidden="true">↗</i></a>)}<div className="mobile-auth"><a href={LOGIN_URL}>Log in</a><ActionLink /></div></nav>
}

const activities = [
  { title: 'Livestreaming', image: 'live-session', description: 'Go live in your element. Bring your community into the moment.', label: '01 / IN THE MOMENT' },
  { title: 'Podcast creation', image: 'podcast', description: 'Make room for conversations that stay with people.', label: '02 / FIND YOUR VOICE' },
  { title: 'Video storytelling', image: 'camera', description: 'From the first frame to the final cut. Tell it your way.', label: '03 / A NEW PERSPECTIVE' },
  { title: 'Audience connection', image: 'audience', description: 'Turn a shared interest into a community that belongs.', label: '04 / BETTER TOGETHER' },
  { title: 'Your creator studio', image: 'editing', description: 'A place for every idea, and the tools to bring it to life.', label: '05 / MADE FOR YOU' },
]

function StudioSection() {
  const section = useRef(null)
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(null)
  const current = hovered ?? active

  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      const progress = { value: 0 }
      let previous = 0
      gsap.to(progress, {
        value: activities.length,
        ease: 'none',
        onUpdate: () => {
          const next = Math.min(activities.length - 1, Math.floor(progress.value))
          if (next !== previous) {
            previous = next
            setActive(next)
            setHovered(null)
          }
        },
        scrollTrigger: {
          trigger: section.current,
          start: 'top 80px',
          end: () => `+=${Math.round(window.innerHeight * 2)}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      })
    })
    return () => media.revert()
  }, [])

  return <section ref={section} className="activities" id="studio" aria-labelledby="studio-heading">
    <img className="activity-fragment fragment-one" src="/images/camera.jpg" alt="" loading="lazy" />
    <img className="activity-fragment fragment-two" src="/images/creator.jpg" alt="" loading="lazy" />
    <div className="activity-layout">
      <div className="activity-copy"><h2 className="eyebrow" id="studio-heading">ROOM TO CREATE</h2>
        <div className="activity-list" onPointerLeave={() => setHovered(null)}>{activities.map((item, i) => <button key={item.title} className={current === i ? 'selected' : ''} onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(i) }} onFocus={() => setHovered(i)} onBlur={() => setHovered(null)} onClick={() => setActive(i)} aria-pressed={current === i}>{item.title}<span aria-hidden="true">↗</span></button>)}</div>
        <p className="activity-description" aria-live="polite">{activities[current].description}</p>
      </div>
      <div className="activity-visual"><div className="activity-images">{activities.map((item, i) => <img key={item.image} src={`/images/${item.image}.jpg`} alt={item.description} className={current === i ? 'is-active' : ''} loading="lazy" />)}<span className="image-badge">MADE<br />TO CREATE ↗</span></div><div className="image-meta"><span>{activities[current].label}</span><span>INTERACT.</span></div></div>
    </div>
    <span className="section-index">02 — THE POSSIBILITIES</span>
  </section>
}

function AudienceSection() {
  return <section className="audience-section" id="who-its-for" aria-labelledby="audience-heading">
    <div className="section-heading reveal"><p className="eyebrow">A place for both sides</p><h2 id="audience-heading"><HeadingLine>Your voice. Your people.</HeadingLine><HeadingLine><em>Your space.</em></HeadingLine></h2><p>There’s more than one way to be part of a great live moment.</p></div>
    <div className="audience-grid">
      <article className="audience-card host-card reveal"><div className="audience-card-image"><img src="/images/live-session.jpg" alt="Two hosts sharing a conversation in a recording studio" loading="lazy" /><span className="session-chip"><span /> A LITTLE ROOM FOR YOUR IDEAS</span><div className="host-wave" aria-hidden="true">{Array.from({ length: 31 }, (_, i) => <span key={i} style={{ height: `${12 + ((i * 17 + 9) % 43)}px` }} />)}</div></div><div className="audience-card-copy"><p className="eyebrow">For hosts</p><h3>Bring your ideas<br />to life.</h3><p>From a thoughtful conversation to a creative session, make a little room for whatever you want to share.</p><ActionLink /></div></article>
      <article className="audience-card viewer-card reveal"><div className="audience-card-image"><img src="/images/workshop.jpg" alt="An audience discovering new perspectives at a creative workshop" loading="lazy" /><span className="session-chip">GOOD COMPANY. SHARED CURIOSITY.</span><div className="community-note"><span>Different perspectives.<br /><strong>A little more connection.</strong></span></div></div><div className="audience-card-copy"><p className="eyebrow">For viewers</p><h3>Find something that<br />feels like you.</h3><p>Discover perspectives, follow along, and make time for the things that catch your curiosity.</p><ActionLink className="action-outline">Join the community</ActionLink></div></article>
    </div>
  </section>
}

const exampleSessions = [
  { category: 'Conversation', title: 'The ideas behind the work', image: 'live-session', host: 'Your host', topic: 'A conversation about finding your creative voice.', messages: [{ name: 'A viewer', text: 'How do you get past the fear of starting?' }, { name: 'Another viewer', text: 'Making something small helped me find my rhythm.' }] },
  { category: 'Creative workshop', title: 'Make your first short film', image: 'camera', host: 'Your workshop host', topic: 'From a simple idea to a story you can share.', messages: [{ name: 'A viewer', text: 'Can we start with just a phone camera?' }, { name: 'Another viewer', text: 'I’m here to work on my first story.' }] },
  { category: 'Community', title: 'A little room for big ideas', image: 'hero', host: 'Your community host', topic: 'Meet people who see things a little differently.', messages: [{ name: 'A viewer', text: 'What’s everyone making this week?' }, { name: 'Another viewer', text: 'A podcast about the things we’re learning.' }] },
]

function SessionPreview() {
  const [selected, setSelected] = useState(0)
  const session = exampleSessions[selected]
  return <section className="session-section" id="session-preview" aria-labelledby="session-heading">
    <div className="section-heading reveal"><p className="eyebrow">A glimpse of being here</p><h2 id="session-heading"><HeadingLine>Less watching.</HeadingLine><HeadingLine><em>More being part of it.</em></HeadingLine></h2><p>Explore a few examples of the moments you could make room for.</p></div>
    <div className="session-topics reveal" role="group" aria-label="Choose an example session">{exampleSessions.map((item, i) => <button key={item.category} aria-pressed={selected === i} onClick={() => setSelected(i)}>{item.category}</button>)}</div>
    <div className="session-window reveal">
      <div className="session-toolbar"><span className="session-wordmark">interact<span>.</span></span><span className="preview-label">ILLUSTRATIVE SESSION PREVIEW</span><span className="preview-status"><span /> A SHARED MOMENT</span></div>
      <div className="session-layout"><div className="session-stage"><img src={`/images/${session.image}.jpg`} alt={session.topic} loading="lazy" /><div className="stage-caption"><span>{session.category}</span><h3>{session.title}</h3><p>{session.host} · {session.topic}</p></div><span className="stage-icon" aria-hidden="true"><BroadcastIcon /></span></div>
      <aside className="session-conversation" aria-label="Example conversation" aria-live="polite"><div className="conversation-heading"><h3>The conversation</h3><span>EXAMPLE</span></div><p className="conversation-welcome">Different perspectives.<br />One moment, together.</p>{session.messages.map((message, i) => <div className="example-message" key={message.text}><span className={`message-avatar avatar-${i}`} aria-hidden="true">{i === 0 ? 'A' : 'B'}</span><div><strong>{message.name}</strong><p>{message.text}</p></div></div>)}<div className="conversation-join"><p>There’s room for your voice, too.</p><ActionLink>Find your people</ActionLink></div></aside></div>
      <div className="session-disclaimer"><span>Example topics and messages. Not a live session.</span><a href={SIGNUP_URL}>Explore Interact ↗</a></div>
    </div>
  </section>
}

function FAQSection() {
  return <section className="faq-section" id="questions" aria-labelledby="faq-heading"><div className="faq-heading reveal"><p className="eyebrow">Good to know</p><h2 id="faq-heading"><HeadingLine>A few things you</HeadingLine><HeadingLine>might <em>wonder.</em></HeadingLine></h2><p>A little clarity before you settle in.</p></div><div className="faq-list reveal">{questions.map((item, i) => <details className="faq-item" key={item.question} name="interact-faq" onToggle={() => ScrollTrigger.refresh()}><summary><span className="faq-number">0{i + 1}</span><h3>{item.question}</h3><span className="faq-plus" aria-hidden="true" /></summary><div className="faq-answer"><p>{item.answer}</p>{i === 2 && <a href={SIGNUP_URL}>Get started ↗</a>}</div></details>)}</div></section>
}

function ClosingSection() {
  return <><section className="closing-section" aria-labelledby="closing-heading"><div className="closing-orbits" aria-hidden="true"><span /><span /><span /></div><div className="closing-content reveal"><span className="closing-icon"><BroadcastIcon /></span><p className="eyebrow">There’s room for you here</p><h2 id="closing-heading"><HeadingLine>Let’s make something</HeadingLine><HeadingLine><em>worth sharing.</em></HeadingLine></h2><p>Your next favorite conversation could be one click away.</p><ActionLink>Get started</ActionLink></div><div className="closing-caption"><span>A VOICE WORTH HEARING.</span><span>A MOMENT WORTH MAKING.</span></div></section><footer className="interact-footer"><div><Brand footer /><p>Made for being here, together.</p></div><nav aria-label="Footer"><a href={LOGIN_URL}>Log in</a><a href={SIGNUP_URL}>Sign up <span aria-hidden="true">↗</span></a></nav><div className="footer-fineprint"><span>© {new Date().getFullYear()} Interact</span><a href="#home">Back to top ↑</a></div></footer></>
}

function HeroVideo() {
  const video = useRef(null)
  const userPaused = useRef(false)
  const [paused, setPaused] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const element = video.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = true
    const syncPlayback = () => {
      if (visible && !document.hidden && !motion.matches && !navigator.connection?.saveData && !userPaused.current) {
        element.play().catch(() => {})
      } else element.pause()
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncPlayback() }, { threshold: 0.05 })
    observer.observe(element)
    motion.addEventListener('change', syncPlayback)
    document.addEventListener('visibilitychange', syncPlayback)
    return () => { observer.disconnect(); motion.removeEventListener('change', syncPlayback); document.removeEventListener('visibilitychange', syncPlayback); element.pause() }
  }, [])

  const togglePlayback = () => {
    if (video.current.paused) { userPaused.current = false; video.current.play().catch(() => {}) }
    else { userPaused.current = true; video.current.pause() }
  }

  return <>
    <div className="hero-media">
      <img className="hero-poster" src="/images/creator-reel-poster.jpg" alt="A creator recording a podcast in her studio" fetchPriority="high" />
      <video ref={video} className={`hero-video ${failed ? 'video-failed' : ''}`} muted loop playsInline preload="none" poster="/images/creator-reel-poster.jpg" aria-hidden="true" onPlay={() => setPaused(false)} onPause={() => setPaused(true)} onError={(event) => { if (event.target === event.currentTarget && event.currentTarget.error) setFailed(true) }}>
        <source src="/videos/creator-reel-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
        <source src="/videos/creator-reel.mp4" type="video/mp4" />
      </video>
    </div>
    {!failed && <button className="video-control" onClick={togglePlayback} aria-label={paused ? 'Play background video' : 'Pause background video'}><span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span><span>{paused ? 'PLAY FILM' : 'PAUSE FILM'}</span></button>}
  </>
}

function App() {
  const root = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [navCompact, setNavCompact] = useState(false)

  useEffect(() => {
    let frame = 0
    let compact = false
    const updateNavbar = () => {
      frame = 0
      const next = window.scrollY > 0
      if (next !== compact) { compact = next; setNavCompact(next) }
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateNavbar) }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [])

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    const context = gsap.context(() => {
      mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 769px)' }, ({ conditions }) => {
        if (!conditions.motion) return
        const desktop = conditions.desktop
        const enter = (trigger, start = 'top 90%') => ({ trigger, start, once: true })
        const hero = gsap.timeline({ defaults: { ease: 'power3.out' } })
        hero.from('.hero-kicker', { y: 20, autoAlpha: 0, duration: 0.55 })
          .from('.hero-title .title-line', { y: 28, autoAlpha: 0, duration: 0.85, stagger: 0.13 }, 0.15)
          .from('.hero-caption', { y: 25, autoAlpha: 0, duration: 0.6 }, 0.65)
          .from('.hero-cta', { y: 20, autoAlpha: 0, duration: 0.55 }, 0.85)


        gsap.utils.toArray('.vision-copy, .section-heading, .faq-heading, .closing-content').forEach((heading) => {
          const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: enter(heading) })
          timeline.from(heading.querySelectorAll('.eyebrow'), { y: 20, autoAlpha: 0, duration: 0.5 })
            .from(heading.querySelectorAll('.heading-line'), { yPercent: 65, autoAlpha: 0, duration: 0.85, stagger: 0.13 }, 0.1)
            .from(heading.querySelectorAll('p:not(.eyebrow)'), { y: 24, autoAlpha: 0, duration: 0.65 }, 0.5)
          const button = heading.querySelector('.action-link')
          if (button) timeline.from(button, { y: 20, autoAlpha: 0, duration: 0.55 }, 0.8)
        })

        const cards = gsap.utils.toArray('.format-card')
        if (desktop) {
          gsap.from(cards, { y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.17, ease: 'power3.out', scrollTrigger: enter('.format-gallery') })
        } else cards.forEach((card) => gsap.from(card, { y: 28, autoAlpha: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: enter(card, 'top 92%') }))
        cards.forEach((card) => gsap.from(card.querySelector('img'), { scale: 1.04, duration: 1.2, ease: 'power2.out', scrollTrigger: enter(card, 'top 92%') }))

        gsap.from('.activity-list button', { x: -16, autoAlpha: 0, duration: 0.65, stagger: 0.09, ease: 'power3.out', scrollTrigger: enter('.activity-copy') })
        gsap.from('.activity-visual', { y: 25, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: enter('.activity-visual') })
        gsap.utils.toArray('.audience-card').forEach((card, i) => {
          const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: enter(card) })
          timeline.from(card, { y: 24, autoAlpha: 0, duration: 0.85, delay: desktop ? i * 0.12 : 0 })
            .from(card.querySelector('img'), { scale: 1.04, duration: 1.15 }, 0)
            .from(card.querySelectorAll('.audience-card-copy > *'), { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.55 }, 0.25)
        })
        gsap.from('.session-topics button', { y: 25, autoAlpha: 0, stagger: 0.09, duration: 0.6, scrollTrigger: enter('.session-topics') })
        const preview = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: enter('.session-window') })
        preview.from('.session-window', { y: 24, autoAlpha: 0, duration: 0.85 })
          .from('.session-stage > img', { scale: 1.04, duration: 1.1 }, 0.1)
          .from('.conversation-heading, .conversation-welcome', { y: 20, autoAlpha: 0, stagger: 0.1, duration: 0.55 }, 0.4)
          .from('.example-message', { x: 25, autoAlpha: 0, stagger: 0.1, duration: 0.6 }, 0.65)
        gsap.utils.toArray('.faq-item').forEach((item, i) => gsap.from(item, { y: 35, autoAlpha: 0, duration: 0.65, delay: desktop ? i * 0.1 : 0, scrollTrigger: enter(item, 'top 92%') }))
      })
      ScrollTrigger.refresh()
    }, root)
    let disposed = false
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
    return () => { disposed = true; mm.revert(); context.revert() }
  }, [])

  useLayoutEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => { if (event.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    const first = document.querySelector('.menu-close')
    first?.focus()
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); document.querySelector('.menu-toggle')?.focus() }
  }, [menuOpen])

  return (
    <div ref={root}>
      <a href="#how-it-works" className="skip-link">Skip to content</a>
      <header className={`site-header${navCompact ? ' is-compact' : ''}`}>
        <div className="navbar-inner"><Brand /><nav className="desktop-nav" aria-label="Primary">{links.map((link) => <a href={link.href} key={link.name}>{link.name}</a>)}</nav><div className="header-actions"><CreatorFinder /><a className="login-link" href={LOGIN_URL}>Log in</a><ActionLink className="nav-cta" /><button className="menu-toggle" aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="navigation-overlay" onClick={() => setMenuOpen(true)}><span /><span /></button></div></div>
      </header>
      <div className="navbar-spacer" aria-hidden="true" />
      <main>
        <section className="hero relative min-h-svh overflow-hidden" id="home">
          <HeroVideo />
          <div className="hero-shade" />
          <div className="hero-copy"><p className="hero-kicker"><span /> A LITTLE MORE LIVE. A LITTLE MORE HUMAN.</p><h1 className="hero-title"><span className="title-line">Your voice.</span><span className="title-line"><em>In motion.</em></span></h1><div className="hero-intro"><p className="hero-caption">A place to share what moves you.<br />And find the people who feel it, too.</p><ActionLink className="hero-cta">Get started</ActionLink></div></div>
          <div className="hero-side-note"><span className="record-dot" /> REAL VOICES. REAL CONNECTION.</div>
          <div className="hero-bottom flex justify-between"><span>MADE FOR BEING HERE, TOGETHER.</span><a href="#how-it-works">SCROLL TO EXPLORE <span className="scroll-arrow">↓</span></a></div>
        </section>

        <section className="vision relative overflow-hidden" id="how-it-works" aria-labelledby="vision-heading">
          <div className="vision-topline"><span>01 / HOW IT WORKS</span><span>A LITTLE CURIOSITY GOES A LONG WAY.</span></div>
          <div className="vision-copy"><p className="eyebrow">How it works</p><h2 id="vision-heading"><HeadingLine>Good moments.</HeadingLine><HeadingLine><em>Simple beginnings.</em></HeadingLine></h2><p className="vision-description">Create an account. Host or discover a session.<br className="desktop-break" /> Then join the conversation.</p></div>
          <div className="format-gallery">{creatorFormats.map((format, index) => <a className={`format-card format-${index}`} href={SIGNUP_URL} key={format.title}><div className="format-image"><img src={`/images/${format.image}.jpg`} alt={format.description} loading="lazy" /><span className="format-category">0{index + 1} — {format.category}</span><span className="format-arrow" aria-hidden="true">↗</span></div><div className="format-caption"><h3>{format.title}</h3><p>{format.description}</p></div></a>)}</div>
          <div className="vision-footnote"><span>YOUR IDEAS. YOUR MEDIUM. YOUR PEOPLE.</span><a href="#who-its-for">FIND YOUR PLACE HERE ↗</a></div>
        </section>

        <StudioSection />
        <AudienceSection />
        <SessionPreview />
        <FAQSection />
        <ClosingSection />
      </main>
      {menuOpen && <div className="navigation-overlay" id="navigation-overlay" role="dialog" aria-modal="true" aria-label="Navigation" onKeyDown={(event) => { if (event.key === 'Tab') { const items = event.currentTarget.querySelectorAll('a, button'); const first = items[0]; const last = items[items.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() } } }}><div className="overlay-top"><Brand onClick={() => setMenuOpen(false)} /><button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation">✕</button></div><Navigation close={() => setMenuOpen(false)} /><p className="eyebrow overlay-bottom">MADE FOR BEING HERE, TOGETHER.</p></div>}
    </div>
  )
}
export default App
