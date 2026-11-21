import { useEffect, useRef, useState } from 'react'
import './UserChats.css'

function ChatIcon({ name, size = 22 }) {
  const paths = {
    compose: <><path d="M12 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7" /><path d="m16 3 5 5M10 14l2-5 7-7 5 5-7 7-5 2" transform="translate(-1 0) scale(.9)" /></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="4" /><path d="m3 8 9 6 9-6" /></>,
    group: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v3" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    check: <path d="m5 12 4 4L19 6" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export default function UserChats({ exploreCreators }) {
  const [tab, setTab] = useState('group')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [composing, setComposing] = useState(false)
  const [drafts, setDrafts] = useState([])
  const [activeDraft, setActiveDraft] = useState(null)
  const [saved, setSaved] = useState(false)
  const [search, setSearch] = useState('')
  const filterWrap = useRef(null)
  const filterButton = useRef(null)
  useEffect(() => {
    const outside = event => { if (!filterWrap.current?.contains(event.target)) setFilterOpen(false) }
    const escape = event => { if (event.key === 'Escape' && filterOpen) { setFilterOpen(false); filterButton.current?.focus() } }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [filterOpen])
  const startDraft = () => { setComposing(true); setActiveDraft(null); setSaved(false); setTab('direct'); setSearch('') }
  const filterOptions = [
    { id: 'all', title: 'All chats', description: 'Every conversation in one place', icon: 'mail', count: drafts.length },
    { id: 'unread', title: 'Unread', description: 'Conversations with new messages', icon: 'group', count: 0 },
    { id: 'drafts', title: 'Drafts', description: 'Pick up where you left off', icon: 'compose', count: drafts.length },
  ]
  const closeComposer = () => { setComposing(false); setActiveDraft(null) }
  const visibleDrafts = tab === 'direct' && filter !== 'unread' ? drafts.filter(draft => `${draft.recipient} ${draft.message}`.toLowerCase().includes(search.toLowerCase())) : []
  return <section className="user-chats"><header className="uc-heading"><div><p className="uc-eyebrow">YOUR CONVERSATIONS</p><h1>Chats</h1><p className="uc-heading-description">A little closer to your creative community.</p></div><button className="uc-compose-button" aria-label="New message" title="New message" onClick={startDraft}><ChatIcon name="compose" size={19} /><span>New message</span></button></header><div className="uc-toolbar"><div className="uc-filter-wrap" ref={filterWrap}><button ref={filterButton} className={`uc-filter uc-filter-trigger ${filter !== 'all' ? 'uc-filter-active' : ''}`} aria-label="Show chats" aria-expanded={filterOpen} aria-controls="uc-filter-options" onClick={() => setFilterOpen(!filterOpen)}><ChatIcon name="filter" size={18} /><span>{filterOptions.find(item => item.id === filter).title}</span><ChatIcon name="chevron" size={15} /></button>{filterOpen && <fieldset className="uc-filter-menu" id="uc-filter-options"><legend className="ad-sr-only">Show chats</legend><p>SHOW CHATS</p>{filterOptions.map(option => <label className={`uc-filter-option ${filter === option.id ? 'uc-option-selected' : ''}`} key={option.id}><input type="radio" name="chat-filter" value={option.id} checked={filter === option.id} onChange={() => { setFilter(option.id); setFilterOpen(false); filterButton.current?.focus() }} /><span className="uc-filter-option-icon"><ChatIcon name={option.icon} size={19} /></span><span className="uc-filter-option-copy"><strong>{option.title}</strong><small>{option.description}</small></span><span className="uc-filter-count">{option.count}</span>{filter === option.id && <ChatIcon name="check" size={15} />}</label>)}<footer>Preview conversations only</footer></fieldset>}</div><div className="uc-tabs" role="group" aria-label="Chat type"><button className={tab === 'direct' ? 'uc-active' : ''} aria-pressed={tab === 'direct'} onClick={() => { setTab('direct'); closeComposer(); setSaved(false) }}><ChatIcon name="mail" size={17} />Direct messages{drafts.length > 0 && <span className="uc-tab-count">{drafts.length}</span>}</button><button className={tab === 'group' ? 'uc-active' : ''} aria-pressed={tab === 'group'} onClick={() => { setTab('group'); closeComposer(); setSaved(false) }}><ChatIcon name="group" size={18} />Group chats</button></div>{filter !== 'all' && <button className="uc-reset-filter" aria-label="Clear chat filter" onClick={() => setFilter('all')}>Clear <ChatIcon name="close" size={13} /></button>}<label className="uc-chat-search"><ChatIcon name="search" size={17} /><input value={search} onChange={event => setSearch(event.target.value)} aria-label="Search draft conversations" placeholder="Search conversations" /></label></div>
    {composing ? <section className="uc-composer" aria-labelledby="uc-compose-title"><header><h2 id="uc-compose-title">New message</h2><button className="uc-filter" aria-label="Close message draft" onClick={closeComposer}><ChatIcon name="close" /></button></header><p>Start a conversation with a creator.</p><form key={activeDraft?.id || 'new'} onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); const message = form.get('message').trim(); if (!message) return; const next = { id: activeDraft?.id || Date.now(), recipient: form.get('recipient'), message }; setDrafts(current => [next, ...current.filter(item => item.id !== next.id)]); closeComposer(); setFilter('all'); setSaved(true) }}><label>To<select name="recipient" defaultValue={activeDraft?.recipient || 'The Creative Room'}><option>The Creative Room</option><option>Frame by Frame</option></select></label><label>Message<textarea name="message" rows={5} maxLength={2000} defaultValue={activeDraft?.message || ''} required placeholder="Say hello, ask a question, or share an idea…" /></label><footer><small>Preview only. Saving a draft does not send a message.</small><button type="submit">Save draft</button></footer></form></section> : visibleDrafts.length ? <div className="uc-draft-list">{saved && <p className="uc-save-notice" role="status">Draft saved. No message was sent.</p>}{visibleDrafts.map(draft => <button className="uc-draft" key={draft.id} onClick={() => { setActiveDraft(draft); setComposing(true); setSaved(false) }}><span className="uc-draft-avatar">{draft.recipient.split(' ').map(word => word[0]).slice(0,2).join('')}</span><span><strong>{draft.recipient}</strong><p>{draft.message}</p></span><small>Draft</small></button>)}</div> : <div className="uc-empty"><span className="uc-empty-icon"><ChatIcon name={tab === 'group' ? 'group' : 'mail'} size={32} /></span><h2>{search ? 'No matching conversations' : filter === 'drafts' ? 'No drafts here yet' : filter === 'unread' ? 'You’re all caught up' : tab === 'group' ? 'No group chats yet' : 'No direct messages yet'}</h2><p>{search ? 'Try another name or message to find your conversation.' : filter === 'drafts' ? 'Start a message and save a draft. Your ideas will be right here when you’re ready.' : filter === 'unread' ? 'Unread conversations will appear here when you have new messages.' : tab === 'group' ? 'This is where group chats will appear. When a creator you support starts a chat, you’ll be able to join and talk with other members.' : 'Your conversations with creators will appear here. Start a conversation to share an idea or ask a question.'}</p>{search || filter === 'unread' ? <button className="uc-empty-action" onClick={() => { setSearch(''); setFilter('all') }}>View all chats</button> : <button className="uc-empty-action" onClick={tab === 'group' && filter !== 'drafts' ? exploreCreators : startDraft}>{tab === 'group' && filter !== 'drafts' ? 'Explore creators' : 'Start a draft'}</button>}<span className="uc-empty-note">A space for ideas, questions, and good conversations.</span></div>}
    <footer className="uc-preview">Preview workspace · messaging isn’t connected. Drafts last for this session only.</footer>
  </section>
}
