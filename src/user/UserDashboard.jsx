import { useEffect, useState } from 'react'
import { sampleFeed } from './userMockData'
import './UserDashboard.css'
import ExploreCreators from './ExploreCreators'
import UserChats from './UserChats'
import UserNotifications from './UserNotifications'
import CreatorSidebar from '../publicCreators/CreatorSidebar'

function Icon({ name, size = 21 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h5v-7h4v7h5V9" /></>,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
    radio: <><circle cx="12" cy="12" r="2" /><path d="M8 8a6 6 0 0 0 0 8m8-8a6 6 0 0 1 0 8M4.5 4.5a10.6 10.6 0 0 0 0 15m15-15a10.6 10.6 0 0 1 0 15" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
    comment: <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />,
    settings: <><path d="m9 3 1-1h4l1 3 3 1 3-1 2 4-2 2v3l1 2-2 4-3-1-3 1-1 2H9l-1-3-3-1-2 1-2-4 2-2v-3L2 8l2-4 3 1Z" transform="translate(1 0) scale(.92)" /><circle cx="12" cy="12" r="3" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4M12 17h.01" /></>,
    logout: <><path d="M9 3H4v18h5M10 12h11m-4-4 4 4-4 4" /></>,
    external: <><path d="M14 3h7v7M21 3 10 14M10 4H4v16h16v-6" /></>,
    creators: <><rect x="4" y="5" width="16" height="16" rx="3" /><path d="M7 2h10m-5 7 1.4 3 3.3.4-2.4 2.3.6 3.3-2.9-1.6-2.9 1.6.6-3.3-2.4-2.3 3.3-.4Z" /></>,
    bookmark: <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    share: <><path d="M12 16V3m-5 5 5-5 5 5M4 14v7h16v-7" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    more: <><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    membership: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4m-7 9 2 2 4-4" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
function FeedPost({ post, joined, toggleJoin, saved, toggleSave, notify }) {
  const [liked, setLiked] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comments, setComments] = useState([])
  return <article className="uf-post" id={post.id}><header className="uf-post-author"><span className="uf-avatar uf-creator-avatar">{post.initials}</span><div><strong>{post.creator}</strong><small>{post.time}</small></div><button className={joined ? 'uf-joined' : 'uf-join'} onClick={() => toggleJoin(post.creator)}>{joined && <Icon name="check" size={15} />}{joined ? 'Joined' : 'Join'}</button></header><div className="uf-post-media"><img src={post.image} alt={post.title} loading="lazy" /><span>{post.category}</span></div><div className="uf-post-body"><h2>{post.title}</h2><p>{post.description}{expanded && ` ${post.more}`}</p><button className="uf-show-more" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Show less' : 'Show more'}</button><div className="uf-post-actions"><button className={liked ? 'uf-is-liked' : ''} onClick={() => setLiked(!liked)} aria-pressed={liked} aria-label={liked ? 'Unlike post' : 'Like post'}><Icon name="heart" size={19} />{post.likes + Number(liked)}</button><button onClick={() => setCommentsOpen(!commentsOpen)} aria-expanded={commentsOpen} aria-label="Comments"><Icon name="comment" size={19} />{comments.length > 0 && comments.length}</button><button aria-label="Copy post link" onClick={async () => { try { await navigator.clipboard.writeText(`${location.origin}/dashboard#${post.id}`); notify('Post link copied.') } catch { notify('Could not copy the link. Please copy the page address.') } }}><Icon name="share" size={19} /></button><button className={`uf-save ${saved ? 'uf-is-saved' : ''}`} onClick={() => toggleSave(post.id)} aria-pressed={saved} aria-label={saved ? 'Unsave post' : 'Save post'}><Icon name="bookmark" size={19} /></button></div>{commentsOpen && <div className="uf-comments">{comments.map((comment, index) => <p key={index}><strong>You</strong>{comment}</p>)}<form onSubmit={event => { event.preventDefault(); const text = new FormData(event.currentTarget).get('comment').trim(); if (!text) return; setComments(current => [...current, text]); event.currentTarget.reset() }}><input name="comment" aria-label="Write a sample comment" placeholder="Join the conversation…" required maxLength={500} /><button className="uf-primary" type="submit">Post</button></form><small>Comments are saved in this preview only.</small></div>}</div></article>
}

export default function UserDashboard() {
  const [tab, setTab] = useState(() => location.pathname.endsWith('/search') ? 'explore' : location.pathname.endsWith('/messages') ? 'chats' : location.pathname.endsWith('/notifications') ? 'notifications' : 'home')
  const [selectedCreator, setSelectedCreator] = useState(null)
  const [visitedCreators, setVisitedCreators] = useState([])
  const [accountName, setAccountName] = useState('Anil Sharma')
  const [accountEmail, setAccountEmail] = useState('anil@example.com')
  const [compactNav, setCompactNav] = useState(false)
  const [joined, setJoined] = useState([])
  const [saved, setSaved] = useState([])
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const [panel, setPanel] = useState(null)
  useEffect(() => {
    let frame = 0
    const update = () => { frame = 0; setCompactNav(window.scrollY > 32) }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [])
  useEffect(() => { const previous = document.title; document.title = 'Home · Interact'; return () => { document.title = previous } }, [])
  useEffect(() => { if (!notice) return; const timeout = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(timeout) }, [notice])
  useEffect(() => { const close = event => { if (event.key === 'Escape') setPanel(null) }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close) }, [])
  const toggleJoin = creator => setJoined(current => current.includes(creator) ? current.filter(item => item !== creator) : [...current, creator])
  const toggleSave = id => setSaved(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  const posts = sampleFeed.filter(post => (tab !== 'saved' || saved.includes(post.id)) && `${post.title} ${post.creator}`.toLowerCase().includes(query.toLowerCase()))
  const openNotifications = () => {
    setTab('notifications'); setPanel(null)
    if (location.pathname !== '/dashboard/notifications') history.pushState(null, '', '/dashboard/notifications')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const openChats = () => {
    setTab('chats'); setPanel(null)
    if (location.pathname !== '/dashboard/messages') history.pushState(null, '', '/dashboard/messages')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const openSearch = () => {
    setTab('explore'); setPanel(null)
    if (location.pathname !== '/dashboard/search') history.pushState(null, '', '/dashboard/search')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  useEffect(() => {
    const onPop = () => { setTab(location.pathname.endsWith('/search') ? 'explore' : location.pathname.endsWith('/messages') ? 'chats' : location.pathname.endsWith('/notifications') ? 'notifications' : 'home'); setPanel(null) }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  useEffect(() => { if (!['explore', 'chats', 'notifications'].includes(tab) && ['/dashboard/search', '/dashboard/messages', '/dashboard/notifications'].includes(location.pathname)) history.replaceState(null, '', '/dashboard') }, [tab])
  const creatorDirectory = sampleFeed.filter((post, index, array) => array.findIndex(item => item.creator === post.creator) === index).map(post => ({ id: post.creator, name: post.creator, image: post.image, category: post.category, description: post.description }))
  const visitCreator = creator => {
    setSelectedCreator(creator)
    setVisitedCreators(current => [creator, ...current.filter(item => item.name !== creator.name)].slice(0, 8))
    setTab('creator-profile'); setPanel(null); setQuery('')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const showPanel = next => setPanel(current => current === next ? null : next)
  return <div className={`user-feed patreon-layout${tab === 'explore' ? ' creator-explore-shell' : ''}`}><a className="uf-skip" href="#creator-content">Skip to content</a>
    {tab === 'explore' ? <CreatorSidebar active="search" /> : <aside className="pf-rail"><a href="/" className="pf-brand" aria-label="Interact home"><Icon name="radio" size={28} /></a><nav aria-label="Main navigation"><button className={tab === 'home' && !panel ? 'pf-active' : ''} aria-pressed={tab === 'home' && !panel} aria-label="Home" data-tooltip="Home" onClick={() => { setTab('home'); setPanel(null); setQuery('') }}><Icon name="home" size={25} /></button><button className={tab === 'explore' ? 'pf-active' : ''} aria-pressed={tab === 'explore'} aria-label="Search" data-tooltip="Search" onClick={openSearch}><Icon name="search" size={25} /></button><button className={tab === 'chats' ? 'pf-active' : ''} aria-pressed={tab === 'chats'} aria-label="Messages" data-tooltip="Messages" onClick={openChats}><Icon name="comment" size={25} /></button><button className={tab === 'notifications' ? 'pf-active' : ''} aria-pressed={tab === 'notifications'} aria-label="Notifications" data-tooltip="Notifications" onClick={openNotifications}><Icon name="bell" size={25} /></button><button className="pf-create" aria-label="Create" data-tooltip="Create" onClick={() => showPanel('create')}><Icon name="plus" size={26} /></button></nav><div className="pf-rail-bottom"><button className={panel === 'creators' ? 'pf-active' : ''} aria-expanded={panel === 'creators'} aria-label="Your creators" data-tooltip="Your creators" onClick={() => showPanel('creators')}><Icon name="creators" size={24} /></button><button className={panel === 'more' ? 'pf-active' : ''} aria-expanded={panel === 'more'} aria-label="More" data-tooltip="More" onClick={() => showPanel('more')}><Icon name="more" size={25} /></button></div></aside>}
    <main className="pf-surface" id="creator-content"><div className={`pf-feed ${['explore', 'chats', 'notifications'].includes(tab) ? 'pf-explore-wide' : ''}`}>{!['explore', 'chats', 'notifications', 'creator-profile'].includes(tab) && <div className={`pf-tabs ${compactNav ? 'pf-tabs-compact' : ''}`} role="group" aria-label="Feed sections"><button className={tab === 'home' ? 'pf-current' : ''} onClick={() => { setTab('home'); setQuery('') }}>Home</button><button className={tab === 'memberships' ? 'pf-current' : ''} onClick={() => setTab('memberships')}>Memberships</button>{tab === 'saved' && <button className="pf-current">Saved</button>}</div>}
    {tab === 'creator-profile' && selectedCreator ? <section className="yc-profile"><div className="yc-cover"><img src={selectedCreator.image} alt="" /></div><div className="yc-profile-heading"><img src={selectedCreator.image} alt="" /><button className="uf-primary" onClick={() => toggleJoin(selectedCreator.name)}>{joined.includes(selectedCreator.name) ? 'Joined' : 'Join community'}</button><h1>{selectedCreator.name}</h1><p>{selectedCreator.description}</p><span>{selectedCreator.category}</span></div><h2 className="yc-post-heading">Latest posts</h2>{sampleFeed.filter(post => post.creator === selectedCreator.name).length ? sampleFeed.filter(post => post.creator === selectedCreator.name).map(post => <FeedPost key={post.id} post={post} joined={joined.includes(post.creator)} toggleJoin={toggleJoin} saved={saved.includes(post.id)} toggleSave={toggleSave} notify={setNotice} />) : <section className="pf-empty"><h2>No posts yet</h2><p>This sample creator’s posts will appear here.</p></section>}</section> : tab === 'notifications' ? <UserNotifications exploreCreators={openSearch} openCreatorPost={(creator, id) => { setQuery(creator); setTab('home'); window.scrollTo({ top: 0, behavior: 'instant' }); requestAnimationFrame(() => document.getElementById(id === 'notification-4' ? 'preview-3' : id === 'notification-2' ? 'preview-2' : 'preview-1')?.scrollIntoView({ block: 'start' })) }} /> : tab === 'chats' ? <UserChats exploreCreators={openSearch} /> : tab === 'memberships' ? <section className="pf-memberships"><div className="pf-membership-card"><div className="pf-creator-photos" aria-hidden="true"><img src="/images/creator.jpg" alt="" /><img src="/images/live-session.jpg" alt="" /><img src="/images/camera.jpg" alt="" /></div><h1>Find creators you love</h1><p>Join a creator’s community to get their posts, updates and more</p><button type="button" className="pf-explore" onClick={openSearch}>Explore creators <Icon name="arrow" size={18} /></button></div></section> : tab === 'explore' ? <ExploreCreators openCreator={visitCreator} /> : posts.length ? posts.map(post => <FeedPost key={post.id} post={post} joined={joined.includes(post.creator)} toggleJoin={toggleJoin} saved={saved.includes(post.id)} toggleSave={toggleSave} notify={setNotice} />) : <section className="pf-empty"><Icon name={query ? 'search' : 'bookmark'} size={30} /><h1>{query ? 'No matching posts' : 'Your saved posts'}</h1><p>{query ? 'Try another title or creator.' : 'Bookmark posts to find them here.'}</p></section>}
    {!['chats', 'notifications'].includes(tab) && <footer className="pf-preview">Interact preview · sample content and session-only interactions</footer>}</div></main>
    {panel === 'creators' && <><button className="yc-drawer-dismiss" aria-label="Close your creators" onClick={() => setPanel(null)} /><aside className="yc-drawer" aria-labelledby="yc-drawer-title"><header><h2 id="yc-drawer-title">Your creators</h2><button className="uf-icon-button" aria-label="Close your creators" onClick={() => setPanel(null)}><Icon name="close" /></button></header>{visitedCreators.length > 0 && <section><div className="yc-section-heading"><h3>Recently visited</h3><button onClick={() => setVisitedCreators([])}>Clear</button></div>{visitedCreators.map(creator => <button className="yc-creator-row" key={creator.name} onClick={() => visitCreator(creator)}><img src={creator.image} alt="" /><span><strong>{creator.name}</strong><small>{creator.description}</small></span></button>)}</section>}<section><h3>{joined.length ? 'Your communities' : 'Discover creators'}</h3>{creatorDirectory.filter(creator => !joined.length || joined.includes(creator.name)).map(creator => <button className="yc-creator-row" key={creator.name} onClick={() => visitCreator(creator)}><img src={creator.image} alt="" /><span><strong>{creator.name}</strong><small>{creator.description}</small></span></button>)}{joined.length > 0 && !creatorDirectory.some(creator => joined.includes(creator.name)) && <p className="yc-directory-note">Find your other sample creators through Search.</p>}</section><button className="yc-explore" onClick={openSearch}>Explore creators <Icon name="arrow" size={17} /></button><footer>Sample creators · recently visited is saved for this session.</footer></aside></>}
    {panel === 'more' && <><button className="am-dismiss" aria-label="Close account menu" onClick={() => setPanel(null)} /><section className="am-menu" aria-label="Account menu"><header><span className="am-avatar">{accountName.slice(0, 1).toUpperCase()}</span><div><strong>{accountName}</strong><span>{accountEmail}</span></div></header><div className="am-actions"><button onClick={() => setPanel('settings')}><Icon name="settings" size={20} />Settings</button><button onClick={() => setPanel('support')}><Icon name="help" size={20} />Support <Icon name="arrow" size={17} /></button><button onClick={() => setPanel('create')}><Icon name="creators" size={20} />Become a creator</button><button onClick={() => { setJoined([]); setSaved([]); setVisitedCreators([]); window.location.assign('/login') }}><Icon name="logout" size={20} />Log out</button></div><footer><button onClick={() => setPanel('terms')}>Terms of Use</button><span>·</span><button onClick={() => setPanel('privacy')}>Privacy Policy</button><span>·</span><button onClick={() => setPanel('community')}>Community Policies</button></footer></section></>}
    {panel && !['creators', 'more'].includes(panel) && <><button className="pf-panel-scrim" aria-label="Close panel" onClick={() => setPanel(null)} /><section className={`pf-panel ${panel === 'create' ? 'pf-become-creator' : ''}`} aria-labelledby="pf-panel-title"><header><h2 id="pf-panel-title">{{search:'Search',messages:'Messages',notifications:'Notifications',create:'Become a creator',more:'More',creator:selectedCreator?.name,settings:'Settings',support:'Support',terms:'Terms of Use',privacy:'Privacy Policy',community:'Community Policies'}[panel]}</h2><button className="uf-icon-button" aria-label="Close panel" onClick={() => setPanel(null)}><Icon name="close" /></button></header>{panel === 'settings' ? <form className="am-settings" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const name = data.get('name').trim(); if (!name) return; setAccountName(name); setAccountEmail(data.get('email').trim()); setPanel(null); setNotice('Preview account details updated for this session.') }}><label>Display name<input name="name" defaultValue={accountName} required maxLength={60} autoComplete="name" /></label><label>Email address<input name="email" type="email" defaultValue={accountEmail} required autoComplete="email" /></label><small>Sample account · changes apply to this session only.</small><button className="uf-primary" type="submit">Save changes</button></form> : panel === 'support' ? <div className="am-support"><p>How can we help?</p><h3>Getting started</h3><p>Explore creators through Search, join a sample community, or save posts to revisit later.</p><h3>Account access</h3><p>Use the login page to continue to the existing Interact sign-in service.</p><a href="/login" className="uf-secondary">Go to login <Icon name="arrow" size={17} /></a><small>This workspace is a preview. No live support service is connected.</small></div> : ['terms', 'privacy', 'community'].includes(panel) ? <><p>Interact’s official {panel === 'terms' ? 'terms of use' : panel === 'privacy' ? 'privacy policy' : 'community policies'} haven’t been added to this preview yet.</p><small>No policy document is published here.</small></> : panel === 'creator' ? <div className="ec-creator-detail"><img src={selectedCreator.image} alt="" /><small>{selectedCreator.category}</small><p>{selectedCreator.description}</p><button className={joined.includes(selectedCreator.name) ? 'uf-secondary' : 'uf-primary'} onClick={() => toggleJoin(selectedCreator.name)}>{joined.includes(selectedCreator.name) ? 'Joined' : 'Join community'}</button>{sampleFeed.some(post => post.creator === selectedCreator.name) && <button className="uf-secondary" onClick={() => { setQuery(selectedCreator.name); setTab('home'); setPanel(null); window.scrollTo({ top: 0, behavior: 'instant' }) }}>View posts</button>}<small>Sample creator · no payment or live membership is connected.</small></div> : panel === 'search' ? <form onSubmit={event => { event.preventDefault(); setTab('home'); setPanel(null) }}><label htmlFor="feed-search">Find a creator or post</label><input id="feed-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search…" /><button className="uf-primary" type="submit">Search</button></form> : panel === 'more' ? <><button className="yc-saved-action" onClick={() => { setTab('saved'); setPanel(null) }}>Saved posts <Icon name="bookmark" size={17} /></button><a href="/login">Log in <Icon name="arrow" size={17} /></a><a href="/signup">Get started <Icon name="arrow" size={17} /></a><a href="/">Back to Interact <Icon name="arrow" size={17} /></a></> : panel === 'create' ? <><div className="pf-creator-invitation" aria-hidden="true"><img src="/images/camera.jpg" alt="" /><img src="/images/podcast.jpg" alt="" /><img src="/images/editing.jpg" alt="" /></div><p>Build a membership for your fans and get paid to create on your own terms.</p><a href="/signup" className="uf-primary">Get started <Icon name="arrow" size={18} /></a></> : <><p>{panel === 'messages' ? 'Your conversations will appear here.' : 'Updates from creators will appear here.'}</p><small>Preview · no live service connected</small></>}</section></>}
    {notice && <div className="uf-toast" role="status">{notice}</div>}
  </div>
}
