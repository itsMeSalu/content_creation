import Icon from './CreatorIcon'
import './PublicCreators.css'

export default function CreatorSidebar({ active }) {
  return <aside className="public-creator-rail" aria-label="Interact navigation"><a href="/" aria-label="Interact home" className="public-creator-logo"><svg width="30" height="32" viewBox="0 0 32 36" fill="currentColor" aria-hidden="true"><path d="M4 26V12C4 4 12 1 19 3c9 2 11 9 5 14-3 3-8 2-10 6-3 5-5 11-8 8-1-1-2-3-2-5Z" /></svg></a><a href="/dashboard/search" aria-label="Explore creators" title="Explore creators" aria-current={active === 'search' ? 'page' : undefined}><Icon name="search" /></a><a href="/login" aria-label="Chats" title="Chats"><Icon name="chat" /></a><a href="/login" aria-label="Notifications" title="Notifications"><Icon name="bell" /></a><a href="/signup" aria-label="Create" title="Create"><Icon name="plus" /></a><details className="creator-rail-more"><summary aria-label="More options"><Icon name="more" /></summary><div><a href="/">Interact home</a><a href="/login">Log in</a><a href="/signup">Sign up</a></div></details></aside>
}
