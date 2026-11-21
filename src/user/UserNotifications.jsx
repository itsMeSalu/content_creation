import { useState } from 'react'
import './UserNotifications.css'

// Presentation-only examples. No notification service is connected.
const sampleNotifications = [
  { id: 'notification-1', creator: 'The Creative Room', initials: 'CR', type: 'post', title: 'A new conversation is waiting', text: 'The Creative Room shared “The ideas behind the work”.', time: '2 hours ago', group: 'Today', read: false, action: 'View post' },
  { id: 'notification-2', creator: 'Frame by Frame', initials: 'FF', type: 'post', title: 'Something new for your creative practice', text: 'Frame by Frame shared “Small steps. Better stories.”', time: '4 hours ago', group: 'Today', read: false, action: 'View post' },
  { id: 'notification-3', creator: 'Interact', initials: 'in', type: 'community', title: 'Find a little more inspiration', text: 'Explore filmmakers, podcasters, and creative communities to find your people.', time: 'Yesterday', group: 'Earlier', read: true, action: 'Explore creators' },
  { id: 'notification-4', creator: 'The Creative Room', initials: 'CR', type: 'post', title: 'A peek behind the scenes', text: 'Discover what’s taking shape in “A little room for your next big idea”.', time: '2 days ago', group: 'Earlier', read: true, action: 'View post' },
]
function NotificationIcon({ name, size = 21 }) {
  const paths = {
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    double: <><path d="m2 12 4 4L16 6m-5 10 3 3L24 9" transform="translate(0 -1) scale(.92)" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    post: <><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export default function UserNotifications({ openCreatorPost, exploreCreators }) {
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [filter, setFilter] = useState('all')
  const [announcement, setAnnouncement] = useState('')
  const unread = notifications.filter(item => !item.read).length
  const visible = notifications.filter(item => filter !== 'unread' || !item.read)
  const markRead = id => setNotifications(current => current.map(item => item.id === id ? { ...item, read: true } : item))
  return <section className="user-notifications"><header className="un-heading"><div><p className="un-eyebrow">YOUR COMMUNITY, A LITTLE CLOSER</p><h1>Notifications {unread > 0 && <span>{unread}</span>}</h1><p>New posts, fresh ideas, and moments worth catching up on.</p></div><button className="un-mark-all" disabled={!unread} onClick={() => { setNotifications(current => current.map(item => ({ ...item, read: true }))); setAnnouncement('All sample notifications marked as read.') }}><NotificationIcon name="double" size={18} /><span>Mark all as read</span></button></header><div className="un-toolbar"><div className="un-tabs" role="group" aria-label="Filter notifications"><button className={filter === 'all' ? 'un-selected' : ''} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All activity</button><button className={filter === 'unread' ? 'un-selected' : ''} aria-pressed={filter === 'unread'} onClick={() => setFilter('unread')}>Unread <span>{unread}</span></button></div><span className="un-preview-label"><i /> Sample notifications</span></div><p className="un-announcement" role="status">{announcement}</p>
    {visible.length ? <div className="un-notification-card">{['Today', 'Earlier'].map(group => visible.some(item => item.group === group) && <section className="un-group" key={group} aria-label={group}><h2>{group}</h2>{visible.filter(item => item.group === group).map(item => <article className={`un-row ${!item.read ? 'un-unread' : ''}`} key={item.id}><span className={`un-avatar ${item.type === 'community' ? 'un-interact-avatar' : ''}`}>{item.initials}<span><NotificationIcon name={item.type === 'community' ? 'bell' : 'post'} size={11} /></span></span><div className="un-row-content"><div className="un-row-title"><h3>{item.title}</h3>{!item.read && <span className="un-unread-dot" aria-label="Unread" />}</div><p>{item.text}</p><div className="un-row-footer"><time>{item.time}</time><button className="un-view" onClick={() => { markRead(item.id); if (item.type === 'community') exploreCreators(); else openCreatorPost(item.creator, item.id) }}>{item.action}<NotificationIcon name="arrow" size={15} /></button></div></div><button className="un-read-button" disabled={item.read} aria-label={item.read ? 'Already read' : `Mark ${item.title} as read`} title={item.read ? 'Read' : 'Mark as read'} onClick={() => { markRead(item.id); setAnnouncement('Notification marked as read.') }}><NotificationIcon name="check" size={17} /></button></article>)}</section>)}</div> : <div className="un-empty"><span><NotificationIcon name="bell" size={31} /></span><h2>You’re all caught up</h2><p>You’ve read every update. New posts and community moments will appear here.</p><button onClick={() => setFilter('all')}>View all activity</button></div>}
    <footer className="un-footnote">Preview workspace · these are sample notifications, not live account activity.</footer>
  </section>
}
