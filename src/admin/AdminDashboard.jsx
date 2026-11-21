import { useEffect, useRef, useState } from 'react'
import { initialUsers, initialSessions, initialReports, navigation } from './sampleData'
import './AdminDashboard.css'
import DashboardOverview from './DashboardOverview'
import { mockPosts } from './dashboardMockData'

const dateFormat = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
const formatDate = (date) => dateFormat.format(new Date(`${date}T12:00:00+05:30`))
const initials = (name) => name.split(' ').map((word) => word[0]).slice(0, 2).join('')
const pathView = () => navigation.some((item) => item.id === location.pathname.split('/')[2]) ? location.pathname.split('/')[2] : 'overview'

function Icon({ name, size = 22, ...props }) {
  // Inline Lucide icon geometry; no runtime icon dependency required.
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h5v-7h4v7h5V9" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v3" /></>,
    user: <><circle cx="12" cy="7" r="4" /><path d="M4 22v-3a8 8 0 0 1 16 0v3" /></>,
    broadcast: <><circle cx="12" cy="12" r="2" /><path d="M7.8 7.8a6 6 0 0 0 0 8.4m8.4-8.4a6 6 0 0 1 0 8.4M4.5 4.5a10.6 10.6 0 0 0 0 15m15-15a10.6 10.6 0 0 1 0 15" /></>,
    flag: <><path d="M5 22V3M5 4c5-4 9 4 15 0v11c-6 4-10-4-15 0" /></>,
    settings: <><path d="m9 3 1-1h4l1 3 3 1 3-1 2 4-2 2v3l1 2-2 4-3-1-3 1-1 2H9l-1-3-3-1-2 1-2-4 2-2v-3L2 8l2-4 3 1Z" transform="translate(1 0) scale(.92)" /><circle cx="12" cy="12" r="3" /></>,
    search: <><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></>,
    bell: <><path d="M10.268 21a2 2 0 0 0 3.464 0M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .738-1.674C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" /></>,
    arrow: <><path d="M5 12h14m-7-7 7 7-7 7" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    plus: <path d="M12 4v16M4 12h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M3 6h18M3 12h18M3 18h18" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    play: <path d="m8 4 13 8-13 8Z" />,
    external: <><path d="M14 3h7v7M21 3 10 14M10 4H4v16h16v-6" /></>,
    shield: <><path d="m12 2 9 4v6c0 6-9 10-9 10s-9-4-9-10V6Z" /><path d="m8 12 3 3 5-6" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.home}</svg>
}

function Badge({ children }) {
  return <span className={`ad-badge ad-badge-${String(children).toLowerCase().replaceAll(' ', '-')}`}>{children === 'Live' && <span className="ad-live-dot" />}{children}</span>
}

function Avatar({ name, color = 'purple', large = false }) {
  return <span className={`ad-avatar ad-avatar-${color}${large ? ' ad-avatar-large' : ''}`}>{initials(name)}</span>
}

function Empty({ title = 'No matches found', text = 'Try a different search or reset your filters.' }) {
  return <div className="ad-empty"><span><Icon name="search" size={26} /></span><h3>{title}</h3><p>{text}</p></div>
}

function Modal({ title, close, children }) {
  const dialog = useRef(null)
  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current.focus()
    const keydown = (event) => {
      if (event.key === 'Escape') close()
      if (event.key === 'Tab') {
        const items = dialog.current.querySelectorAll('a[href], button:not(:disabled), input, select, textarea')
        const first = items[0], last = items[items.length - 1]
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog.current)) { event.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', keydown)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', keydown); previousFocus?.focus() }
  }, [close])
  return <div className="ad-modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) close() }}><section className="ad-modal" ref={dialog} role="dialog" aria-modal="true" aria-labelledby="ad-modal-title" tabIndex={-1}><div className="ad-modal-heading"><div><span className="ad-eyebrow">SAMPLE WORKSPACE</span><h2 id="ad-modal-title">{title}</h2></div><button className="ad-icon-button" onClick={close} aria-label="Close dialog"><Icon name="close" /></button></div>{children}</section></div>
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState(mockPosts)
  const [view, setView] = useState(pathView)
  const [users, setUsers] = useState(initialUsers)
  const [sessions, setSessions] = useState(initialSessions)
  const [reports, setReports] = useState(initialReports)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [popover, setPopover] = useState(null)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [profile, setProfile] = useState({ name: 'Admin', email: 'admin@example.com', bio: 'Making room for better conversations.' })
  const [settings, setSettings] = useState({ platformName: 'Interact', reportAlerts: true, sessionAlerts: true, weeklySummary: false })
  const [profileDraft, setProfileDraft] = useState(profile)
  const [settingsDraft, setSettingsDraft] = useState(settings)
  const [formError, setFormError] = useState('')

  const pendingReports = reports.filter((report) => report.status === 'Pending')
  const activePage = navigation.find((item) => item.id === view)
  const matches = (values) => values.join(' ').toLowerCase().includes(query.trim().toLowerCase())
  const filteredUsers = users.filter((user) => matches([user.name, user.email, user.id, user.role]) && (filter === 'All' || user.role === filter) && (statusFilter === 'All' || user.status === statusFilter))
  const filteredSessions = sessions.filter((session) => matches([session.title, session.host, session.category, session.id]) && (filter === 'All' || session.status === filter))
  const filteredReports = reports.filter((report) => matches([report.subject, report.reason, report.reporter, report.id]) && (filter === 'All' || report.status === filter))

  const navigate = (next) => {
    setView(next); setQuery(''); setFilter('All'); setStatusFilter('All'); setSidebarOpen(false); setPopover(null)
    history.pushState(null, '', next === 'overview' ? '/admin' : `/admin/${next}`)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const closeModal = () => { setModal(null); setFormError('') }

  useEffect(() => {
    const onPop = () => { setView(pathView()); setFilter('All'); setStatusFilter('All'); setQuery(''); setSidebarOpen(false) }
    const onKey = (event) => { if (event.key === 'Escape') { setPopover(null); setSidebarOpen(false) } }
    const outside = (event) => { if (!event.target.closest('[data-ad-popover]')) setPopover(null) }
    window.addEventListener('popstate', onPop)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', outside)
    return () => { window.removeEventListener('popstate', onPop); document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', outside) }
  }, [])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 4500)
    return () => clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    const previous = document.title
    document.title = `${activePage.name} · Interact Admin`
    return () => { document.title = previous }
  }, [activePage.name])

  const exportUsers = () => {
    const quote = (value) => `"${String(value).replaceAll('"', '""')}"`
    const rows = [['ID', 'Name', 'Email', 'Role', 'Status', 'Joined'], ...filteredUsers.map((user) => [user.id, user.name, user.email, user.role, user.status, user.joined])]
    const blob = new Blob([rows.map((row) => row.map(quote).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob), anchor = document.createElement('a')
    anchor.href = url; anchor.download = 'interact-sample-users.csv'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
    setToast('Sample users exported.')
  }
  const resolveReport = (report, status) => {
    setReports((current) => current.map((item) => item.id === report.id ? { ...item, status } : item))
    closeModal(); setToast(`Sample report ${status.toLowerCase()}.`)
  }

  const sessionRows = (rows, compact = false) => rows.length ? <div className="ad-session-list">{rows.map((session) => <div className="ad-session-row" key={session.id}><button className="ad-session-main" onClick={() => setModal({ type: 'session', data: session })}><span className="ad-session-thumb"><img src={`/images/${session.image}.jpg`} alt="" loading="lazy" /><span>{session.duration}</span></span><span><strong>{session.title}</strong><small>{session.host} <span>·</span> {compact ? session.category : `${formatDate(session.date)} · ${session.time} IST`}</small></span></button><Badge>{session.status}</Badge><button className="ad-icon-button" aria-label={`View ${session.title}`} onClick={() => setModal({ type: 'session', data: session })}><Icon name="arrow" size={18} /></button></div>)}</div> : <Empty />

  if (view === 'overview') return <>
    <DashboardOverview navigate={navigate} query={query} setQuery={setQuery} posts={posts}
      createPost={() => setModal({ type: 'create-post' })}
      viewPosts={() => setModal({ type: 'posts' })}
      viewEarnings={() => setModal({ type: 'earnings' })}
      viewRecordings={() => setModal({ type: 'recordings' })}
      openPost={(post) => setModal({ type: 'post', data: post })}
      openNotifications={() => navigate('reports')}
      openAccount={() => navigate('profile')} />
    {modal?.type === 'earnings' && <div className="admin-app"><Modal title="My Earnings" close={closeModal}><p className="ad-modal-note">Sample data · no earnings API is connected.</p><dl className="ad-detail-grid"><div><dt>Total Earnings</dt><dd>₹6,250</dd></div></dl></Modal></div>}
    {modal?.type === 'recordings' && <div className="admin-app"><Modal title="My Recordings" close={closeModal}><p className="ad-modal-note">Sample ended sessions · no recordings API is connected.</p>{sessions.filter(session => session.status === 'Ended').map(session => <article className="ad-post-preview-row" key={session.id}><span>{session.title}</span><span>{session.duration}</span></article>)}</Modal></div>}
    {['create-post', 'posts'].includes(modal?.type) && <div className="admin-app"><Modal title={modal.type === 'create-post' ? 'Create Post' : 'My Posts'} close={closeModal}>
      <p className="ad-modal-note">Preview only · sample posts are stored for this session. No publishing API is connected.</p>
      {modal.type === 'create-post' ? <form className="ad-modal-form" onSubmit={(event) => {
        event.preventDefault()
        const title = new FormData(event.currentTarget).get('title').trim()
        if (!title) return
        setPosts(current => [{ id: `mock-post-${Date.now()}`, title, image: '/images/editing.jpg', duration: '0:00', age: 'Just now', status: 'Draft' }, ...current])
        closeModal()
      }}><label>Post title<input name="title" required maxLength={100} placeholder="Give your post a title" /></label><div className="ad-modal-actions"><button type="button" className="ad-button" onClick={closeModal}>Cancel</button><button className="ad-button ad-button-primary" type="submit">Save sample draft</button></div></form> : posts.map(post => <button className="ad-post-preview-row" key={post.id} onClick={() => setModal({ type: 'post', data: post })}><span>{post.title}</span><Badge>{post.status}</Badge></button>)}
    </Modal></div>}
    {modal?.type === 'post' && <div className="admin-app"><Modal title={modal.data.title} close={closeModal}><img className="ad-modal-cover" src={modal.data.image} alt="" /><Badge>{modal.data.status}</Badge><p className="ad-modal-note">Video · {modal.data.age} · {modal.data.duration}</p></Modal></div>}
  </>

  return <div className="admin-app">
    {sidebarOpen && <button className="ad-sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
    <aside className={`ad-sidebar${sidebarOpen ? ' ad-sidebar-open' : ''}`}>
      <a className="ad-logo" href="/" aria-label="Interact home"><span><Icon name="broadcast" size={28} /></span>interact<i>.</i></a>
      <div className="ad-workspace-label">ADMIN WORKSPACE</div>
      <nav aria-label="Admin navigation">{navigation.map((item, index) => <button key={item.id} onClick={() => navigate(item.id)} className={`${view === item.id ? 'is-active' : ''}${index === 4 ? ' ad-nav-separated' : ''}`} aria-current={view === item.id ? 'page' : undefined}><Icon name={item.icon} /><span>{item.name}</span>{item.id === 'reports' && pendingReports.length > 0 && <small>{pendingReports.length}</small>}</button>)}</nav>
      <div className="ad-sidebar-bottom"><div className="ad-preview-note"><Icon name="shield" size={18} /><span>Workspace preview<small>Explore with sample data</small></span></div><button className="ad-sidebar-profile" onClick={() => navigate('profile')}><Avatar name={profile.name} /><span>{profile.name}<small>Administrator</small></span><Icon name="chevron" size={17} /></button><a className="ad-back-site" href="/">Back to website <Icon name="external" size={14} /></a></div>
    </aside>

    <div className="ad-main">
      <header className="ad-topbar"><div className="ad-topbar-left"><button className="ad-icon-button ad-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Open admin navigation" aria-expanded={sidebarOpen}><Icon name="menu" /></button><span className="ad-breadcrumb">Workspace <span>/</span> <strong>{activePage.name}</strong></span></div><div className="ad-topbar-actions"><label className="ad-search"><Icon name="search" size={19} /><input aria-label="Search workspace" placeholder="Search your workspace…" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><Icon name="close" size={15} /></button>}</label><span className="ad-demo-chip">Sample data</span><div className="ad-popover-scope" data-ad-popover><button className="ad-icon-button ad-bell" aria-label="Notifications" aria-expanded={popover === 'notifications'} onClick={() => setPopover(popover === 'notifications' ? null : 'notifications')}><Icon name="bell" size={23} />{pendingReports.length > 0 && <span />}</button>{popover === 'notifications' && <div className="ad-popover"><h3>Needs your attention <span>{pendingReports.length}</span></h3>{pendingReports.length ? pendingReports.map((report) => <button key={report.id} onClick={() => { navigate('reports'); setModal({ type: 'report', data: report }) }}><span className="ad-notification-icon"><Icon name="flag" size={17} /></span><span><strong>{report.reason}</strong><small>{report.subject}</small></span></button>) : <p>You’re all caught up.</p>}<small className="ad-popover-note">Sample workspace notifications</small></div>}</div><div className="ad-popover-scope" data-ad-popover><button className="ad-account-button" aria-label="Account menu" aria-expanded={popover === 'account'} onClick={() => setPopover(popover === 'account' ? null : 'account')}><Avatar name={profile.name} /><Icon name="chevron" size={16} /></button>{popover === 'account' && <div className="ad-popover ad-account-menu"><h3>{profile.name}<small>Administrator · Sample workspace</small></h3><button onClick={() => navigate('profile')}><Icon name="user" size={17} />My profile</button><button onClick={() => navigate('settings')}><Icon name="settings" size={17} />Settings</button><a href="/"><Icon name="external" size={17} />Back to website</a></div>}</div></div></header>

      <main className="ad-content" id="admin-content">
        <div className="ad-demo-banner"><span><Icon name="shield" size={15} /> Preview mode — all data and actions on this dashboard are samples.</span><span>Not connected to your live platform</span></div>
        {view === 'overview' ? null : <div className="ad-view" key={view}>
          <div className="ad-page-heading"><div><span className="ad-eyebrow">YOUR WORKSPACE / {activePage.name.toUpperCase()}</span><h1>{view === 'users' ? 'Your community.' : view === 'sessions' ? 'Room for connection.' : view === 'reports' ? 'A space worth protecting.' : view === 'profile' ? 'A little more you.' : 'Make it your space.'}</h1><p>{view === 'users' ? 'Manage the people who make Interact, Interact.' : view === 'sessions' ? 'Keep an eye on every conversation, from start to finish.' : view === 'reports' ? 'Review concerns and help your community feel at home.' : view === 'profile' ? 'Your administrator profile in this sample workspace.' : 'Set your preferences for this sample workspace.'}</p></div>{view === 'users' && <button className="ad-button ad-button-primary" onClick={() => setModal({ type: 'add-user' })}><Icon name="plus" size={18} />Add user</button>}</div>

          {view === 'users' && <section className="ad-panel"><div className="ad-list-toolbar"><div className="ad-filter-tabs" role="group" aria-label="User role">{['All', 'Creator', 'Viewer'].map((role) => <button className={filter === role ? 'is-active' : ''} onClick={() => setFilter(role)} key={role}>{role === 'All' ? 'All users' : `${role}s`}<span>{users.filter((user) => role === 'All' || user.role === role).length}</span></button>)}</div><div className="ad-toolbar-actions"><select className="ad-select" aria-label="Account status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="All">All statuses</option><option>Active</option><option>Suspended</option></select><button className="ad-button ad-button-small" onClick={exportUsers}><Icon name="download" size={16} />Export</button></div></div>{filteredUsers.length ? <div className="ad-table-scroll"><table className="ad-table"><thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Joined</th><th><span className="ad-sr-only">Actions</span></th></tr></thead><tbody>{filteredUsers.map((user) => <tr key={user.id}><td><div className="ad-person"><Avatar name={user.name} color={user.color} /><div><strong>{user.name}</strong><small>{user.email}</small></div></div></td><td><Badge>{user.role}</Badge></td><td><Badge>{user.status}</Badge></td><td>{formatDate(user.joined)}</td><td><button className="ad-text-button" onClick={() => setModal({ type: 'user', data: user })}>View <Icon name="arrow" size={15} /></button></td></tr>)}</tbody></table></div> : <Empty />}<div className="ad-table-footer"><span>Showing {filteredUsers.length} of {users.length} sample users</span><button className="ad-text-button" onClick={() => { setFilter('All'); setStatusFilter('All'); setQuery('') }}>Reset filters</button></div></section>}

          {view === 'sessions' && <section className="ad-panel"><div className="ad-list-toolbar"><div className="ad-filter-tabs" role="group" aria-label="Session status">{['All', 'Live', 'Scheduled', 'Ended'].map((status) => <button key={status} className={filter === status ? 'is-active' : ''} onClick={() => setFilter(status)}>{status === 'All' ? 'All sessions' : status}<span>{sessions.filter((session) => status === 'All' || session.status === status).length}</span></button>)}</div><span className="ad-timezone"><Icon name="clock" size={14} />Times in IST</span></div>{sessionRows(filteredSessions)}<div className="ad-table-footer"><span>{filteredSessions.length} sample sessions</span><button className="ad-text-button" onClick={() => { setFilter('All'); setQuery('') }}>Reset filters</button></div></section>}

          {view === 'reports' && <section className="ad-panel"><div className="ad-list-toolbar"><div className="ad-filter-tabs" role="group" aria-label="Report status">{['All', 'Pending', 'Resolved', 'Dismissed'].map((status) => <button key={status} className={filter === status ? 'is-active' : ''} onClick={() => setFilter(status)}>{status}<span>{reports.filter((report) => status === 'All' || report.status === status).length}</span></button>)}</div></div>{filteredReports.length ? <div className="ad-table-scroll"><table className="ad-table"><thead><tr><th>Report</th><th>Reported by</th><th>Priority</th><th>Status</th><th><span className="ad-sr-only">Actions</span></th></tr></thead><tbody>{filteredReports.map((report) => <tr key={report.id}><td><div className="ad-table-title"><strong>{report.reason}</strong><small>{report.subject} · {report.target}</small></div></td><td>{report.reporter}</td><td><Badge>{report.priority}</Badge></td><td><Badge>{report.status}</Badge></td><td><button className="ad-text-button" onClick={() => setModal({ type: 'report', data: report })}>Review <Icon name="arrow" size={15} /></button></td></tr>)}</tbody></table></div> : <Empty title="No reports here" text="Reports matching this status and search will appear here." />}<div className="ad-table-footer"><span>{filteredReports.length} sample reports</span><button className="ad-text-button" onClick={() => { setFilter('All'); setQuery('') }}>Reset filters</button></div></section>}

          {view === 'profile' && <form className="ad-panel ad-settings-panel" onSubmit={(event) => { event.preventDefault(); if (profileDraft.name.trim().length < 2) { setToast('Enter a name with at least 2 characters.'); return } setProfile({ ...profileDraft, name: profileDraft.name.trim() }); setToast('Profile updated in this sample workspace.') }}><div className="ad-profile-intro"><Avatar name={profileDraft.name || 'Admin'} large /><div><h2>{profile.name}</h2><p>Administrator <Badge>Sample account</Badge></p></div></div><div className="ad-form-grid"><label>Display name<input required minLength={2} maxLength={60} value={profileDraft.name} onChange={(event) => setProfileDraft({ ...profileDraft, name: event.target.value })} autoComplete="name" /></label><label>Email address<input type="email" required value={profileDraft.email} onChange={(event) => setProfileDraft({ ...profileDraft, email: event.target.value })} autoComplete="email" /></label><label className="ad-full-width">About you<textarea rows={3} maxLength={250} value={profileDraft.bio} onChange={(event) => setProfileDraft({ ...profileDraft, bio: event.target.value })} /></label></div><div className="ad-settings-footer"><span>Changes apply to this preview only.</span><div><button type="button" className="ad-button" onClick={() => setProfileDraft(profile)}>Cancel</button><button className="ad-button ad-button-primary" type="submit">Save profile</button></div></div></form>}

          {view === 'settings' && <form className="ad-panel ad-settings-panel" onSubmit={(event) => { event.preventDefault(); if (!settingsDraft.platformName.trim()) return; setSettings({ ...settingsDraft, platformName: settingsDraft.platformName.trim() }); setToast('Preferences saved for this sample workspace.') }}><div className="ad-settings-section"><div><h2>Workspace preferences</h2><p>A few details to make this space feel like yours.</p></div><label className="ad-setting-input">Workspace name<input required maxLength={60} value={settingsDraft.platformName} onChange={(event) => setSettingsDraft({ ...settingsDraft, platformName: event.target.value })} /></label></div><div className="ad-settings-section"><div><h2>Notifications</h2><p>Choose what you’d like to keep up with.</p></div>{[{ key: 'reportAlerts', title: 'Moderation alerts', text: 'New reports waiting for a review.' }, { key: 'sessionAlerts', title: 'Session activity', text: 'Updates when a host starts a session.' }, { key: 'weeklySummary', title: 'Weekly community summary', text: 'A regular look at your community’s activity.' }].map((setting) => <label className="ad-toggle-row" key={setting.key}><span><strong>{setting.title}</strong><small>{setting.text}</small></span><input type="checkbox" checked={settingsDraft[setting.key]} onChange={(event) => setSettingsDraft({ ...settingsDraft, [setting.key]: event.target.checked })} /><span className="ad-toggle" aria-hidden="true" /></label>)}</div><div className="ad-settings-footer"><span>Preferences are stored for this preview session only.</span><div><button type="button" className="ad-button" onClick={() => setSettingsDraft(settings)}>Cancel</button><button type="submit" className="ad-button ad-button-primary">Save changes</button></div></div></form>}
        </div>}
        <footer className="ad-footer"><span>Made for being here, together.</span><span>Interact Admin <span>·</span> Sample workspace</span></footer>
      </main>
    </div>

    {toast && <div className="ad-toast" role="status"><Icon name="check" size={19} />{toast}<button onClick={() => setToast('')} aria-label="Dismiss message"><Icon name="close" size={16} /></button></div>}

    {modal && <Modal title={modal.type === 'add-user' ? 'Add a community member' : modal.type === 'user' ? 'Member details' : modal.type === 'session' ? 'Session details' : modal.type === 'end-session' ? 'End this sample session?' : modal.type === 'user-status' ? `${modal.data.status === 'Active' ? 'Suspend' : 'Activate'} this sample account?` : 'Review report'} close={closeModal}>
      {modal.type === 'add-user' && <form className="ad-modal-form" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const name = data.get('name').trim(), email = data.get('email').trim().toLowerCase(); if (name.length < 2) { setFormError('Enter a name with at least 2 characters.'); return } if (users.some((user) => user.email.toLowerCase() === email)) { setFormError('This email already exists in the sample workspace.'); return } const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); setUsers((current) => [{ id: `USR-${String(current.length + 1).padStart(3, '0')}`, name, email, role: data.get('role'), status: 'Active', joined: today, color: 'purple' }, ...current]); closeModal(); setToast('Sample user added. No account invitation was sent.') }}><label>Full name<input name="name" required minLength={2} maxLength={60} placeholder="e.g. Aisha Khan" autoComplete="name" /></label><label>Email address<input name="email" type="email" required placeholder="name@example.com" autoComplete="email" /></label><label>Role<select name="role"><option>Viewer</option><option>Creator</option></select></label>{formError && <p className="ad-form-error" role="alert">{formError}</p>}<p className="ad-modal-note">Adds a sample record here. No real account is created.</p><div className="ad-modal-actions"><button type="button" className="ad-button" onClick={closeModal}>Cancel</button><button type="submit" className="ad-button ad-button-primary"><Icon name="plus" size={17} />Add sample user</button></div></form>}
      {modal.type === 'user' && <><div className="ad-member-hero"><Avatar name={modal.data.name} color={modal.data.color} large /><div><h3>{modal.data.name}</h3><p>{modal.data.email}</p><Badge>{modal.data.status}</Badge></div></div><dl className="ad-detail-grid"><div><dt>Member ID</dt><dd>{modal.data.id}</dd></div><div><dt>Role</dt><dd>{modal.data.role}</dd></div><div><dt>Joined</dt><dd>{formatDate(modal.data.joined)}</dd></div><div><dt>Account type</dt><dd>Sample record</dd></div></dl><div className="ad-modal-actions"><button className="ad-button" onClick={closeModal}>Close</button><button className={`ad-button ${modal.data.status === 'Active' ? 'ad-button-danger' : 'ad-button-primary'}`} onClick={() => setModal({ type: 'user-status', data: modal.data })}>{modal.data.status === 'Active' ? 'Suspend' : 'Activate'} sample account</button></div></>}
      {modal.type === 'user-status' && <><p className="ad-confirm-copy">This changes <strong>{modal.data.name}’s</strong> status in this sample workspace only. It does not affect a real Interact account.</p><div className="ad-modal-actions"><button className="ad-button" onClick={closeModal}>Cancel</button><button className={`ad-button ${modal.data.status === 'Active' ? 'ad-button-danger' : 'ad-button-primary'}`} onClick={() => { setUsers((current) => current.map((user) => user.id === modal.data.id ? { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' } : user)); closeModal(); setToast('Sample account status updated.') }}>Confirm change</button></div></>}
      {modal.type === 'session' && <><img className="ad-modal-cover" src={`/images/${modal.data.image}.jpg`} alt="" /><div className="ad-session-detail-title"><h3>{modal.data.title}</h3><Badge>{modal.data.status}</Badge></div><p className="ad-confirm-copy">{modal.data.description}</p><dl className="ad-detail-grid"><div><dt>Host</dt><dd>{modal.data.host}</dd></div><div><dt>Category</dt><dd>{modal.data.category}</dd></div><div><dt>Date & time</dt><dd>{formatDate(modal.data.date)} · {modal.data.time} IST</dd></div><div><dt>{modal.data.status === 'Ended' ? 'Total sample viewers' : 'Sample viewers'}</dt><dd>{modal.data.viewers}</dd></div></dl><div className="ad-modal-actions"><button className="ad-button" onClick={closeModal}>Close</button>{modal.data.status === 'Live' && <button className="ad-button ad-button-danger" onClick={() => setModal({ type: 'end-session', data: modal.data })}>End sample session</button>}</div></>}
      {modal.type === 'end-session' && <><p className="ad-confirm-copy">End <strong>{modal.data.title}</strong> in this preview? The sample session will move to Ended. No real stream will be affected.</p><div className="ad-modal-actions"><button className="ad-button" onClick={closeModal}>Cancel</button><button className="ad-button ad-button-danger" onClick={() => { setSessions((current) => current.map((session) => session.id === modal.data.id ? { ...session, status: 'Ended' } : session)); closeModal(); setToast('Sample session ended.') }}>End sample session</button></div></>}
      {modal.type === 'report' && <><div className="ad-report-detail-top"><Badge>{modal.data.priority}</Badge><Badge>{modal.data.status}</Badge><span>{modal.data.id}</span></div><h3 className="ad-report-detail-title">{modal.data.reason}</h3><p className="ad-confirm-copy">{modal.data.details}</p><dl className="ad-detail-grid"><div><dt>Reported content</dt><dd>{modal.data.subject}</dd></div><div><dt>Reported by</dt><dd>{modal.data.reporter}</dd></div><div><dt>Type</dt><dd>{modal.data.target}</dd></div><div><dt>Reported on</dt><dd>{formatDate(modal.data.date)}</dd></div></dl><p className="ad-modal-note">Preview actions update this sample report only.</p><div className="ad-modal-actions"><button className="ad-button" onClick={closeModal}>Close</button>{modal.data.status === 'Pending' && <><button className="ad-button" onClick={() => resolveReport(modal.data, 'Dismissed')}>Dismiss</button><button className="ad-button ad-button-primary" onClick={() => resolveReport(modal.data, 'Resolved')}><Icon name="check" size={16} />Mark resolved</button></>}</div></>}
    </Modal>}
  </div>
}
