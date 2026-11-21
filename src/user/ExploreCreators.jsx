import { useRef, useState } from 'react'
import './ExploreCreators.css'

import { creators } from '../publicCreators/creators'

const categories = ['All', 'Filmmaking', 'Video editing', 'Podcasting', 'Photography', 'Social content', 'Live streaming', 'Design']
const exploreTopics = [
  { name: 'Podcasts & shows', category: 'Podcasting', icon: 'mic' },
  { name: 'Filmmaking', category: 'Filmmaking', icon: 'film' },
  { name: 'Video editing', category: 'Video editing', icon: 'edit' },
  { name: 'Photography', category: 'Photography', icon: 'camera' },
  { name: 'Live streaming', category: 'Live streaming', icon: 'live' },
  { name: 'Social content', category: 'Social content', icon: 'social' },
  { name: 'Visual design', category: 'Design', icon: 'design' },
  { name: 'Storytelling', topic: 'Storytelling', icon: 'book' },
  { name: 'Studio setup', topic: 'Studio setup', icon: 'studio' },
  { name: 'Creative process', topic: 'Creative process', icon: 'spark' },
]
function TopicIcon({ name }) {
  const shapes = {
    mic: <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" /></>,
    film: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4m-4 6h4m10-6h4m-4 6h4" /></>,
    edit: <><path d="m15 4 5 5M4 20l5-1L21 7l-5-5L4 14zM13 21h8" /></>,
    camera: <><path d="m8 5 2-2h4l2 2h5v15H3V5z" /><circle cx="12" cy="12" r="4" /></>,
    live: <><circle cx="12" cy="12" r="2" /><path d="M7 7a7 7 0 0 0 0 10M17 7a7 7 0 0 1 0 10M3 3a13 13 0 0 0 0 18M21 3a13 13 0 0 1 0 18" /></>,
    social: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 18h4M9 7h6m-6 4h4" /></>,
    design: <><path d="m12 2 10 10-10 10L2 12zM2 12h20M12 2v20" /></>,
    book: <><path d="M12 5C8 2 3 3 2 4v16c3-2 7-1 10 1 3-2 7-3 10-1V4c-3-2-7-1-10 1v16" /></>,
    studio: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 22h8m-4-5v5M5 8h3m-3 4h5m3-4h6m-4 4h4" /></>,
    spark: <path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />,
  }
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>
}
function Arrow({ left = false }) { return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={left ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} /></svg> }
function CreatorRow({ title, items, openCreator }) {
  const row = useRef(null)
  const [position, setPosition] = useState({ left: true, right: false })
  const update = () => { const node = row.current; setPosition({ left: node.scrollLeft <= 1, right: node.scrollLeft + node.clientWidth >= node.scrollWidth - 2 }) }
  const scroll = direction => { const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; row.current.scrollBy({ left: direction * row.current.clientWidth * .75, behavior: reduced ? 'instant' : 'smooth' }) }
  return <section className="ec-creator-section"><header><h2>{title}</h2><div><button aria-label={`Scroll ${title} left`} onClick={() => scroll(-1)} disabled={position.left}><Arrow left /></button><button aria-label={`Scroll ${title} right`} onClick={() => scroll(1)} disabled={items.length < 2 || position.right}><Arrow /></button></div></header><div className="ec-creator-row" ref={row} onScroll={update}>{items.map(creator => <button className="ec-creator-card" key={creator.id} onClick={() => openCreator(creator)}><img src={creator.image} alt="" loading="lazy" /><strong>{creator.name}</strong><span>{creator.description}</span><small>{creator.category}</small></button>)}</div></section>
}

export default function ExploreCreators() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [topic, setTopic] = useState(null)
  const categoryRow = useRef(null)
  const results = creators.filter(creator => (category === 'All' || creator.category === category) && (!topic || creator.topics.includes(topic)) && `${creator.name} ${creator.description} ${creator.category} ${creator.topics.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()))
  const filtered = category !== 'All' || topic || query.trim()
  const reset = () => { setQuery(''); setCategory('All'); setTopic(null) }
  const selectTopic = item => { setQuery(''); setCategory(item.category || 'All'); setTopic(item.topic || null); window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }) }
  return <div className="explore-creators">
    <div className="ec-sticky-search"><form className="ec-search" role="search" onSubmit={event => event.preventDefault()}><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></svg><input type="search" aria-label="Search creators or topics" placeholder="Search creators or topics" value={query} onChange={event => setQuery(event.target.value)} /></form>
      <div className="ec-category-wrap"><div className="ec-categories" ref={categoryRow} role="group" aria-label="Content creation categories">{categories.map(item => <button className={item === category ? 'ec-selected' : ''} aria-pressed={item === category} onClick={() => { setCategory(item); setTopic(null) }} key={item}>{item}</button>)}</div><button className="ec-category-next" aria-label="More categories" onClick={() => categoryRow.current.scrollBy({ left: 250, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><Arrow /></button></div>
    </div>
    {filtered && <div className="ec-results-summary"><span>{topic ? `Exploring ${topic}` : category !== 'All' ? `Exploring ${category}` : `Results for “${query}”`}</span><button className="ec-clear-filters" onClick={reset}>Clear filters ×</button></div>}
    {results.length ? <CreatorRow key={`${category}-${topic}-${query}`} title={filtered ? `${results.length} matching creators` : 'Featured creators'} items={results} openCreator={creator => window.location.assign(`/creators/${creator.id}`)} /> : <section className="ec-no-results"><h2>No creators found</h2><p>Try a different name, topic, or category.</p><button onClick={reset}>Clear filters</button></section>}
    <section className="ec-topic-section"><div className="ec-topic-heading"><h1>Explore topics</h1></div><div className="ec-topic-grid">{exploreTopics.map((item, index) => <button key={item.name} className={`ec-topic ec-topic-${index}${(item.category && category === item.category) || (item.topic && topic === item.topic) ? ' ec-topic-selected' : ''}`} aria-pressed={Boolean((item.category && category === item.category) || (item.topic && topic === item.topic))} onClick={() => selectTopic(item)}><span>{item.name}</span><TopicIcon name={item.icon} /></button>)}</div></section>
    {!filtered && <CreatorRow title="More to explore" items={[...creators.slice(4), ...creators.slice(0,4)]} openCreator={creator => window.location.assign(`/creators/${creator.id}`)} />}
    <footer className="ec-preview">Sample content-creation directory · creator profiles and discovery are previews.</footer>
  </div>
}
