import { useEffect, useRef, useState } from 'react'
import { creators } from './creators'
import './PublicCreators.css'

export default function CreatorFinder({ iconOnly = false }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const root = useRef(null)
  const trigger = useRef(null)
  const input = useRef(null)
  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const outside = event => { if (!root.current?.contains(event.target)) setOpen(false) }
    const escape = event => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() } }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [open])
  const results = creators.filter(item => `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase().trim()))
  return <div className="creator-finder" ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
    <button ref={trigger} className={`creator-find-trigger${iconOnly ? ' creator-find-icon' : ''}`} aria-label="Find creators" aria-expanded={open} aria-controls="creator-directory" onClick={() => setOpen(!open)}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></svg>{!iconOnly && <><span>Find creators</span><span aria-hidden="true">⌄</span></>}</button>
    {open && <div className="creator-dropdown" id="creator-directory"><div className="creator-dropdown-heading"><strong>Find your next inspiration</strong><span>Explore creators</span></div><input ref={input} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name or category" aria-label="Search creators" /><div className="creator-dropdown-list">{results.map(item => <a key={item.id} href={`/creators/${item.id}`}><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>{item.category}</small></span><span aria-hidden="true">↗</span></a>)}{!results.length && <p>No creators found. Try another name.</p>}</div><small className="creator-directory-note">Sample creator directory</small></div>}
  </div>
}
