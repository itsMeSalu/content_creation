export const initialUsers = [
  { id: 'USR-008', name: 'Anil Sharma', email: 'anil@example.com', role: 'Creator', status: 'Active', joined: '2026-11-09', color: 'purple' },
  { id: 'USR-007', name: 'Maya Patel', email: 'maya@example.com', role: 'Viewer', status: 'Active', joined: '2026-11-08', color: 'pink' },
  { id: 'USR-006', name: 'Rohan Mehta', email: 'rohan@example.com', role: 'Creator', status: 'Active', joined: '2026-11-08', color: 'blue' },
  { id: 'USR-005', name: 'Sara Wilson', email: 'sara@example.com', role: 'Viewer', status: 'Active', joined: '2026-11-07', color: 'green' },
  { id: 'USR-004', name: 'Priya Nair', email: 'priya@example.com', role: 'Creator', status: 'Active', joined: '2026-11-06', color: 'orange' },
  { id: 'USR-003', name: 'Alex Morgan', email: 'alex@example.com', role: 'Viewer', status: 'Suspended', joined: '2026-11-05', color: 'pink' },
  { id: 'USR-002', name: 'Neha Rao', email: 'neha@example.com', role: 'Viewer', status: 'Active', joined: '2026-11-05', color: 'purple' },
  { id: 'USR-001', name: 'David Kim', email: 'david@example.com', role: 'Viewer', status: 'Active', joined: '2026-11-03', color: 'blue' },
]

export const initialSessions = [
  { id: 'SES-006', title: 'The ideas behind the work', host: 'Anil Sharma', category: 'Conversation', status: 'Live', viewers: 24, date: '2026-11-09', time: '16:00', image: 'live-session', duration: '32 min', description: 'A conversation about the ideas, habits, and small moments behind creative work.' },
  { id: 'SES-005', title: 'Make your first short film', host: 'Rohan Mehta', category: 'Workshop', status: 'Live', viewers: 18, date: '2026-11-09', time: '16:15', image: 'camera', duration: '17 min', description: 'An introductory workshop on finding a story and bringing it into the frame.' },
  { id: 'SES-004', title: 'A little room for big ideas', host: 'Priya Nair', category: 'Community', status: 'Scheduled', viewers: 0, date: '2026-11-10', time: '18:30', image: 'hero', duration: '45 min', description: 'A community gathering for sharing ideas and discovering different perspectives.' },
  { id: 'SES-003', title: 'Finding your creative voice', host: 'Anil Sharma', category: 'Conversation', status: 'Scheduled', viewers: 0, date: '2026-11-11', time: '17:00', image: 'podcast', duration: '60 min', description: 'A thoughtful discussion about making a little room for your own perspective.' },
  { id: 'SES-002', title: 'Small steps, better stories', host: 'Rohan Mehta', category: 'Workshop', status: 'Ended', viewers: 36, date: '2026-11-08', time: '18:00', image: 'editing', duration: '52 min', description: 'A practical session on editing, pacing, and shaping a story worth sharing.' },
  { id: 'SES-001', title: 'Meet your people', host: 'Priya Nair', category: 'Community', status: 'Ended', viewers: 29, date: '2026-11-07', time: '17:30', image: 'workshop', duration: '41 min', description: 'A welcome session for people looking for new conversations and shared interests.' },
]

export const initialReports = [
  { id: 'RPT-003', subject: 'The ideas behind the work', target: 'Session', reason: 'Inappropriate language', reporter: 'Maya Patel', status: 'Pending', priority: 'High', date: '2026-11-09', details: 'A viewer flagged language used during the conversation. Review the session context before taking action.' },
  { id: 'RPT-002', subject: 'Alex Morgan', target: 'User', reason: 'Repeated unsolicited messages', reporter: 'Sara Wilson', status: 'Pending', priority: 'Medium', date: '2026-11-09', details: 'A community member reported repeated unsolicited messages. The account is currently suspended in this sample workspace.' },
  { id: 'RPT-001', subject: 'Small steps, better stories', target: 'Session', reason: 'Misleading session description', reporter: 'Neha Rao', status: 'Pending', priority: 'Low', date: '2026-11-08', details: 'The viewer felt the session topic differed from its description. Review the description and available session context.' },
]

export const navigation = [
  { id: 'overview', name: 'Dashboard', icon: 'home' },
  { id: 'users', name: 'Users', icon: 'users' },
  { id: 'sessions', name: 'Live Sessions', icon: 'broadcast' },
  { id: 'reports', name: 'Reports', icon: 'flag' },
  { id: 'profile', name: 'Profile', icon: 'user' },
  { id: 'settings', name: 'Settings', icon: 'settings' },
]
