import { useState } from 'react'
import './DashboardOverview.css'

function Icon({ name, size = 24 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h5v-7h4v7h5V9" /></>,
    play: <path d="m8 4 13 8-13 8Z" />,
    posts: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m10 8 6 4-6 4Z" /></>,
    radio: <><circle cx="12" cy="12" r="2" /><path d="M7.8 7.8a6 6 0 0 0 0 8.4m8.4-8.4a6 6 0 0 1 0 8.4M4.5 4.5a10.6 10.6 0 0 0 0 15m15-15a10.6 10.6 0 0 1 0 15" /></>,
    wallet: <><path d="M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v12H5a3 3 0 0 1-3-3V6" /><path d="M20 12h-4v5h4" /></>,
    coins: <><ellipse cx="10" cy="6" rx="8" ry="3" /><path d="M2 6v5c0 2 6 4 12 2M2 11v5c0 2 6 4 12 2" /><ellipse cx="18" cy="15" rx="4" ry="2" /><path d="M14 15v5c0 3 8 3 8 0v-5" /></>,
    film: <><rect x="3" y="8" width="18" height="13" rx="2" /><path d="m3 8 18-4-1-4L2 4l1 4m3-5 3 4m3-6 3 4m3-6 3 4M3 13h18m-13 4h2" /></>,
    user: <><circle cx="12" cy="7" r="4" /><path d="M4 22v-3a8 8 0 0 1 16 0v3" /></>,
    settings: <><path d="m9 3 1-1h4l1 3 3 1 3-1 2 4-2 2v3l1 2-2 4-3-1-3 1-1 2H9l-1-3-3-1-2 1-2-4 2-2v-3L2 8l2-4 3 1Z" transform="translate(1 0) scale(.92)" /><circle cx="12" cy="12" r="3" /></>,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.34-4.34" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    plus: <path d="M12 4v16M4 12h16" />,
    arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
    chevron: <path d="m7 10 5 5 5-5" />,
    more: <><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></>,
    menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export default function DashboardOverview({ navigate, openPost, openNotifications, openAccount, query, setQuery, posts, createPost, viewPosts, viewEarnings, viewRecordings }) {
  const [menu, setMenu] = useState(false)
  const nav = [
    ['Dashboard', 'home', () => navigate('overview')],
    ['My Posts', 'posts', viewPosts],
    ['My Earnings', 'coins', viewEarnings],
    ['Live Streams', 'radio', () => navigate('sessions')],
    ['My Recordings', 'film', viewRecordings],
    ['Profile', 'user', () => navigate('profile')],
    ['Settings', 'settings', () => navigate('settings')],
  ]
  return <div className="reference-dashboard">
    {menu && <button className="rd-scrim" aria-label="Close navigation" onClick={() => setMenu(false)} />}
    <aside className={`rd-sidebar ${menu ? 'rd-open' : ''}`}><a href="/" className="rd-brand"><span><Icon name="radio" size={32} /></span>interact<span className="rd-period">.</span></a><nav aria-label="Dashboard navigation">{nav.map(([label, icon, action], index) => <button key={label} className={`${index === 0 ? 'rd-selected' : ''} ${index === 5 ? 'rd-separated' : ''}`} aria-current={index === 0 ? 'page' : undefined} onClick={() => { action(); setMenu(false) }}><Icon name={icon} size={25} />{label}</button>)}</nav><svg className="rd-sidebar-wave" viewBox="0 0 280 300" preserveAspectRatio="none" aria-hidden="true"><path d="M0 160Q170 40 280 45V300H0Z" fill="#432086" /></svg></aside>
    <div className="rd-main"><header className="rd-header"><button className="rd-mobile-menu" aria-label="Open navigation" onClick={() => setMenu(!menu)}><Icon name="menu" /></button><label className="rd-search"><Icon name="search" /><input placeholder="Search your content..." aria-label="Search your content" value={query} onChange={event => setQuery(event.target.value)} /></label><button className="rd-notification" aria-label="Notifications" onClick={openNotifications}><Icon name="bell" size={28} /><i /></button><button className="rd-account" aria-label="Account menu" onClick={openAccount}><img src="/images/creator.jpg" alt="" /><Icon name="chevron" size={19} /></button></header>
    <main className="rd-content"><section className="rd-welcome"><img src="/images/admin-workspace.jpg" alt="" /><div className="rd-welcome-copy"><p>WELCOME BACK</p><h1>Anil <span>👋</span></h1><h2>Create, publish, and grow your content in one place.</h2><div className="rd-actions"><button className="rd-create" onClick={createPost}><Icon name="plus" size={27} />Create Post</button><button className="rd-go-live" disabled><Icon name="radio" size={30} /><strong>Go Live</strong><span className="rd-pill">Coming Soon</span></button></div></div></section>
    <section className="rd-stats" aria-label="Statistics">{[['12','Total Posts','play'],['0','Live Streams','radio'],['4','Recordings','film'],['₹6,250','Total Earnings','wallet']].map(([value,label,icon]) => <article className="rd-stat" key={label}><span className="rd-stat-icon"><Icon name={icon} size={35} /></span><div><strong>{value}</strong><p>{label}</p></div></article>)}</section>
    <div className="rd-panels"><section className="rd-panel"><div className="rd-panel-heading"><h2>Recent Posts</h2><button onClick={viewPosts}>View All <Icon name="arrow" size={20} /></button></div><div>{posts.filter(post => `${post.title} ${post.status}`.toLowerCase().includes(query.toLowerCase())).map(post => <article className="rd-post" key={post.id}><button className="rd-post-main" onClick={() => openPost(post)}><span className="rd-thumbnail"><img src={post.image} alt="" /><span>{post.duration}</span></span><span className="rd-post-copy"><strong>{post.title}</strong><small>Video <b>•</b> {post.age}</small></span></button><span className={`rd-status rd-${post.status.toLowerCase()}`}>{post.status}</span><button className="rd-more" aria-label={`View ${post.title}`} onClick={() => openPost(post)}><Icon name="more" /></button></article>)}</div></section>
    <section className="rd-panel rd-streams"><div className="rd-panel-heading"><h2>Live Streams</h2><span className="rd-pill">Coming Soon</span></div><div className="rd-stream-empty"><span className="rd-stream-icon"><Icon name="radio" size={46} /></span><h3>Your live experience starts here</h3><p>Streams will appear here once live streaming is set up.</p><svg viewBox="0 0 600 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 35C110 0 210 105 360 65S520 0 600 10V90H0Z" fill="#e4d6ff" /></svg></div></section></div></main></div></div>
}
