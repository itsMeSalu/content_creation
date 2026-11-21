import { useEffect, useRef, useState } from 'react'
import { creators } from './creators'
import { sampleFeed } from '../user/userMockData'
import CreatorFinder from './CreatorFinder'
import './PublicCreators.css'
import Icon from './CreatorIcon'
import CreatorSidebar from './CreatorSidebar'
import CreatorPosts from './CreatorPosts'

const tabs = ['Home', 'Posts', 'Collections', 'Chats', 'Membership', 'Recommendations']
function PostRow({ title, posts, onOpen }) {
  const row = useRef(null)
  const [position, setPosition] = useState({ first: true, last: false })
  const update = () => { const el = row.current; setPosition({ first: el.scrollLeft < 2, last: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 }) }
  const move = direction => row.current.scrollBy({ left: direction * (row.current.firstElementChild.getBoundingClientRect().width + 20), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  return <section className="creator-post-section"><header><button className="creator-post-heading" onClick={() => onOpen(null)}>{title}<Icon name="arrow" size={18} /></button><div className="creator-post-arrows"><button aria-label={`Previous ${title.toLowerCase()}`} disabled={position.first} onClick={() => move(-1)}><Icon name="arrow" size={18} /></button><button aria-label={`Next ${title.toLowerCase()}`} disabled={position.last} onClick={() => move(1)}><Icon name="arrow" size={18} /></button></div></header><div className="creator-post-row" ref={row} onScroll={update}>{posts.map(post => <button className="creator-preview-card" key={post.id} onClick={() => onOpen(post)}><div className={`creator-preview-mosaic ${post.locked ? 'is-locked' : ''}`}><div className="creator-preview-photos"><img src={post.image} alt="" loading="lazy" /><img src={post.secondary} alt="" loading="lazy" /><img src={post.third} alt="" loading="lazy" /></div><span className="creator-post-badge"><Icon name={post.locked ? 'lock' : 'image'} size={14} />{post.locked ? 'Locked' : '3 photos'}</span></div><h3>{post.title}</h3><p>{post.description}</p><div className="creator-post-meta"><span>{post.date}</span><span><Icon name="heart" size={17} />{post.likes}</span><span><Icon name="comment" size={17} />{post.comments}</span></div></button>)}</div></section>
}
export default function CreatorProfile() {
  const id = window.location.pathname.split('/')[2]
  const creator = creators.find(item => item.id === id)
  const [tab, setTabState] = useState(() => window.location.pathname.endsWith('/posts') ? 'Posts' : 'Home')
  const setTab = name => {
    setTabState(name)
    const path = `/creators/${id}${name === 'Posts' ? '/posts' : ''}`
    if (location.pathname !== path) history.pushState(null, '', path)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  useEffect(() => {
    const onPop = () => setTabState(location.pathname.endsWith('/posts') ? 'Posts' : 'Home')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const [openedPost, setOpenedPost] = useState(null)
  const [navCompact, setNavCompact] = useState(false)
  const profileHeader = useRef(null)
  useEffect(() => {
    const element = profileHeader.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      setNavCompact(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    }, { threshold: 0, rootMargin: '-76px 0px 0px 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [id, tab])
  if (!creator) return <main className="public-creator-missing"><h1>Creator not found</h1><a href="/">Return to Interact</a></main>
  const posts = sampleFeed.filter(post => post.creator === creator.name)
  const examples = posts.length ? posts : [{ id: 'intro', title: `Welcome to ${creator.name}`, image: creator.image, description: creator.description, category: creator.category }]
  const rowPosts = [
    { title: 'A look at what we’re making next', image: creator.image, secondary: '/images/camera.jpg', third: '/images/editing.jpg', description: 'A few moments from the studio, and a first look at the ideas taking shape.', date: '3 May', likes: 48, comments: 12 },
    { title: 'Behind the scenes: the creative process', image: '/images/editing.jpg', secondary: creator.image, third: '/images/studio.jpg', description: 'From the first idea to the details that make it work. Come inside the process.', date: '16 March', likes: 37, comments: 18, locked: true },
    { title: 'Studio notes: a new perspective', image: '/images/hero.jpg', secondary: '/images/workshop.jpg', third: creator.image, description: 'Experiments, inspiration, and the small discoveries behind the work.', date: '22 February', likes: 42, comments: 21, locked: true },
    { title: 'Finding a rhythm that feels like you', image: '/images/podcast.jpg', secondary: '/images/creator.jpg', third: creator.image, description: 'Making space for creativity, one small step at a time.', date: '18 February', likes: 63, comments: 15, locked: true },
    { title: 'From an idea to a shared moment', image: '/images/workshop.jpg', secondary: '/images/studio.jpg', third: '/images/camera.jpg', description: 'A closer look at the conversations and experiments that bring us together.', date: '10 February', likes: 56, comments: 24, locked: true },
  ].map((post, index) => ({ ...post, id: `sample-${index}` }))
  const openPost = post => { if (!post) { setOpenedPost(null); setTab('Posts') } else if (post.locked) { setOpenedPost(null); setTab('Membership') } else { setOpenedPost(post); setTab('Posts') } }
  return <div className="public-creator">
    <CreatorSidebar />
    <div className="public-creator-shell"><header className={`public-creator-nav creator-scroll-nav${navCompact || tab !== 'Home' ? ' is-scrolled' : ''}`}><a href="#" className="public-creator-wordmark" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'auto' }); setTab('Home') }}><img src={creator.image} alt="" /><span>{creator.name}</span></a><div role="tablist" aria-label="Creator sections">{tabs.map(name => <button key={name} role="tab" id={`tab-${name}`} aria-selected={tab === name} aria-controls="creator-panel" tabIndex={tab === name ? 0 : -1} onClick={() => { setOpenedPost(null); setTab(name) }} onKeyDown={event => { const index = tabs.indexOf(name); const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null; if (next !== null) { event.preventDefault(); setTab(tabs[next]); document.getElementById(`tab-${tabs[next]}`)?.focus() } }}>{name}</button>)}</div><CreatorFinder iconOnly /><a className="creator-nav-join" href={`/signup?creator=${creator.id}`}>Join for free</a><a href="/login" className="public-login">Log in</a></header>
      {tab !== 'Posts' && <><div className="public-creator-banner"><img src={creator.image} alt={`${creator.name} studio`} /><span>{creator.category}<br /><em>Made to be shared.</em></span></div>
      <section className="public-creator-intro" ref={profileHeader}><img className="public-creator-avatar" src={creator.image} alt={creator.name} /><div className="public-creator-actions"><button onClick={() => { setTab('Membership'); document.getElementById('creator-panel')?.scrollIntoView({ behavior: 'auto', block: 'start' }) }}>Membership options</button><a href={`/signup?creator=${creator.id}`}>Join for free</a></div><div className="public-creator-bio"><div><p className="public-creator-category">{creator.category}</p><h1>{creator.name}</h1><p>{creator.description}</p></div><div className="public-creator-topics">{creator.topics.map(topic => <span key={topic}>{topic}</span>)}</div></div></section></>}
      <main className="public-creator-content" id="creator-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
        {tab === 'Home' && <><div className="public-section-heading"><h2>{tab === 'Home' ? 'Latest post' : 'Posts'}</h2><span>Creator preview</span></div>{(tab === 'Home' ? examples.slice(0, 1) : examples).map(post => <article className="public-creator-post" key={post.id}><img src={post.image} alt="" /><div><span className="public-creator-category">{post.category}</span><h3>{post.title}</h3><p>{post.description}</p><a href={`/signup?creator=${creator.id}`}>Join the conversation ↗</a></div></article>)}</>}
        {tab === 'Home' && <><PostRow title="Recent posts" posts={rowPosts} onOpen={openPost} /><PostRow title="Popular posts" posts={[rowPosts[3], rowPosts[4], rowPosts[2], rowPosts[1], rowPosts[0]]} onOpen={openPost} /></>}
        {tab === 'Posts' && <CreatorPosts creator={creator} posts={rowPosts} selectedPost={openedPost} clearSelection={() => setOpenedPost(null)} onMembership={() => setTab('Membership')} />}
        {tab === 'Home' && <PostRow title="Explore more" posts={[rowPosts[4], rowPosts[0], rowPosts[3], rowPosts[1], rowPosts[2]]} onOpen={openPost} />}
        {tab === 'Collections' && <><h2>Collections</h2><div className="public-creator-collection-grid">{creator.topics.map((topic, i) => <button key={topic} onClick={() => setTab('Posts')}><img src={i ? '/images/editing.jpg' : creator.image} alt="" /><strong>{topic}</strong><span>Explore posts ↗</span></button>)}</div></>}
        {tab === 'Chats' && <section className="public-creator-callout"><span>LET’S TALK</span><h2>A space for the conversation.</h2><p>Sign in to connect with creators and find your community.</p><a href="/login">Log in to Interact ↗</a></section>}
        {tab === 'Membership' && <section className="public-creator-callout"><span>BE PART OF IT</span><h2>Stay close to the creative process.</h2><p>Create an account to explore Interact. Paid membership options are not available in this preview.</p><a href={`/signup?creator=${creator.id}`}>Join for free ↗</a></section>}
        {tab === 'Recommendations' && <><h2>More creators to discover</h2><div className="public-creator-recommendations">{creators.filter(item => item.id !== id).map(item => <a key={item.id} href={`/creators/${item.id}`}><img src={item.image} alt="" /><strong>{item.name}</strong><span>{item.category}</span></a>)}</div></>}
        <p className="public-creator-preview">Sample creator profile · illustrative content, not a live creator account.</p>
      </main>
    </div>
  </div>
}
