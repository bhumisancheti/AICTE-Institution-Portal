
import { useState } from 'react'
import {
  LayoutDashboard,
  Files,
  ShieldCheck,
  GitBranch,
  CalendarClock,
  BellRing,
  ChartNoAxesCombined,
  ClipboardList,
  Users,
  Settings,
  Search,
  Menu,
  ChevronDown,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MoreHorizontal,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import './index.css'

const navigation = [
  {
    label: 'WORKSPACE',
    items: [
      { name: 'Overview', icon: LayoutDashboard },
      { name: 'All Applications', icon: Files },
      { name: 'Document Verification', icon: ShieldCheck },
      { name: 'Approval Workflow', icon: GitBranch },
    ],
  },
  {
    label: 'MONITORING',
    items: [
      { name: 'Compliance & Deadlines', icon: CalendarClock },
      { name: 'Alerts & Escalations', icon: BellRing },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { name: 'Analytics & Reports', icon: ChartNoAxesCombined },
      { name: 'Audit Trail', icon: ClipboardList },
      { name: 'User Management', icon: Users },
      { name: 'Settings', icon: Settings },
    ],
  },
]

const applications = [
  { id: 'AICTE-2026-0142', institution: 'North Valley Institute of Technology', type: 'Extension of Approval', date: '24 Oct 2026', status: 'Under Review' },
  { id: 'AICTE-2026-0138', institution: 'Shree Institute of Engineering', type: 'New Institution', date: '23 Oct 2026', status: 'Under Verification' },
  { id: 'AICTE-2026-0131', institution: 'Eastern School of Technology', type: 'Intake Approval', date: '22 Oct 2026', status: 'Action Required' },
  { id: 'AICTE-2026-0125', institution: 'Central Institute of Applied Sciences', type: 'Extension of Approval', date: '21 Oct 2026', status: 'Approved' },
  { id: 'AICTE-2026-0119', institution: 'Greenfield College of Engineering', type: 'New Institution', date: '20 Oct 2026', status: 'Submitted' },
]

const statusData = [
  { name: 'Approved', value: 38, color: '#16a378' },
  { name: 'Under Review', value: 27, color: '#3978ed' },
  { name: 'Verification', value: 18, color: '#e9a23b' },
  { name: 'Action Required', value: 10, color: '#df6471' },
  { name: 'Other', value: 7, color: '#a1aebe' },
]

const trendData = [
  { month: 'May', received: 38, approved: 25 },
  { month: 'Jun', received: 52, approved: 34 },
  { month: 'Jul', received: 45, approved: 31 },
  { month: 'Aug', received: 68, approved: 48 },
  { month: 'Sep', received: 57, approved: 43 },
  { month: 'Oct', received: 82, approved: 59 },
]

const initialAlerts = [
  { id: 1, title: 'Compliance deadline approaching', detail: 'Eastern School of Technology · Due in 2 days', type: 'warning' },
  { id: 2, title: 'Documents need attention', detail: 'Shree Institute of Engineering · 3 files', type: 'danger' },
  { id: 3, title: 'Application awaiting review', detail: 'North Valley Institute · Pending 5 days', type: 'info' },
]

function StatusBadge({ status }) {
  const styles = {
    Approved: 'status-approved',
    'Under Review': 'status-review',
    'Under Verification': 'status-verification',
    'Action Required': 'status-action',
    Submitted: 'status-submitted',
  }

  return <span className={`status-badge ${styles[status] || 'status-submitted'}`}>{status}</span>
}

function Sidebar({ active, onNavigate, open, onClose }) {
  return (
    <>
      {open && <button className="mobile-overlay" aria-label="Close menu" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><ShieldCheck size={23} /></div>
          <div>
            <div className="brand-name">AICTE<span>Flow</span></div>
            <div className="brand-caption">APPROVAL MANAGEMENT</div>
          </div>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-avatar">A</div>
          <div className="workspace-copy">
            <strong>Admin Workspace</strong>
            <span>Administrator</span>
          </div>
          <ChevronDown size={15} />
        </div>

        <nav className="navigation">
          {navigation.map((group) => (
            <div className="nav-group" key={group.label}>
              <div className="nav-label">{group.label}</div>
              {group.items.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  className={`nav-item ${active === name ? 'nav-item-active' : ''}`}
                  onClick={() => {
                    onNavigate(name)
                    onClose()
                  }}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{name}</span>
                  {name === 'Alerts & Escalations' && <span className="nav-count">3</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status"><span /> All systems operational</div>
          <div className="sidebar-user">
            <div className="user-avatar">DR</div>
            <div className="user-copy"><strong>Portal Admin</strong><span>Super Administrator</span></div>
            <MoreHorizontal size={18} />
          </div>
        </div>
      </aside>
    </>
  )
}

function Header({ active, onMenu }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button mobile-menu" aria-label="Open menu" onClick={onMenu}><Menu size={21} /></button>
        <div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div>
      </div>
      <div className="topbar-actions">
        <label className="global-search">
          <Search size={17} />
          <input placeholder="Search anything..." aria-label="Search anything" />
          <kbd>⌘ K</kbd>
        </label>
        <button className="icon-button notification-button" aria-label="Notifications"><BellRing size={19} /><i /></button>
        <div className="topbar-divider" />
        <button className="profile-button">
          <div className="user-avatar">DR</div>
          <div className="profile-copy"><strong>Drishti Rana</strong><span>Administrator</span></div>
          <ChevronDown size={15} />
        </button>
      </div>
    </header>
  )
}

function MetricCard({ label, value, change, icon: Icon, tone, note }) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <span className={`metric-icon ${tone}`}><Icon size={19} /></span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-foot">
        <span className="metric-change"><ArrowUpRight size={14} /> {change}</span>
        <span>{note}</span>
      </div>
    </article>
  )
}

function Dashboard({ onNavigate }) {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [alerts, setAlerts] = useState(initialAlerts)

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === 'All' || app.status === filter
    const query = search.toLowerCase()
    const matchesSearch = `${app.id} ${app.institution} ${app.type} ${app.status}`.toLowerCase().includes(query)
    return matchesFilter && matchesSearch
  })

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow"><span className="live-dot" /> ADMINISTRATIVE OVERVIEW</div>
          <h1>Good morning, Drishti <span className="wave">✦</span></h1>
          <p>Here's what's happening across your approval ecosystem today.</p>
        </div>
        <button className="primary-button" onClick={() => onNavigate('All Applications')}><Files size={17} /> View applications <ArrowUpRight size={16} /></button>
      </div>

      <section className="metrics-grid">
        <MetricCard label="Total Applications" value="1,284" change="+12.8%" note="vs. last month" icon={Files} tone="blue" />
        <MetricCard label="Pending Review" value="246" change="+4.2%" note="vs. last month" icon={Clock3} tone="amber" />
        <MetricCard label="Approved Applications" value="812" change="+18.6%" note="vs. last month" icon={CheckCircle2} tone="green" />
        <MetricCard label="Needs Attention" value="38" change="8 urgent" note="require action" icon={AlertTriangle} tone="red" />
      </section>

      <section className="charts-grid">
        <article className="panel trend-panel">
          <div className="panel-heading">
            <div><h2>Application activity</h2><p>Submission and approval trends over time</p></div>
            <button className="select-button">Last 6 months <ChevronDown size={15} /></button>
          </div>
          <div className="chart-legend">
            <span><i className="legend-blue" /> Applications received</span>
            <span><i className="legend-green" /> Applications approved</span>
          </div>
          <div className="trend-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="receivedFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3978ed" stopOpacity={0.17} /><stop offset="95%" stopColor="#3978ed" stopOpacity={0} /></linearGradient>
                  <linearGradient id="approvedFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16a378" stopOpacity={0.13} /><stop offset="95%" stopColor="#16a378" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="#edf0f5" strokeDasharray="4 5" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#8490a3', fontSize: 12 }} dy={10} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8490a3', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e7ebf2', fontSize: 12 }} />
                <Area type="monotone" dataKey="received" name="Received" stroke="#3978ed" strokeWidth={2.5} fill="url(#receivedFill)" />
                <Area type="monotone" dataKey="approved" name="Approved" stroke="#16a378" strokeWidth={2.5} fill="url(#approvedFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel status-panel">
          <div className="panel-heading"><div><h2>Application status</h2><p>Current distribution</p></div><button className="more-button" aria-label="More status options"><MoreHorizontal size={20} /></button></div>
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={66} outerRadius={88} paddingAngle={3} stroke="none">
                  {statusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center"><strong>1,284</strong><span>Total apps</span></div>
          </div>
          <div className="status-legend">
            {statusData.map((entry) => <div className="status-legend-item" key={entry.name}><span><i style={{ background: entry.color }} />{entry.name}</span><strong>{entry.value}%</strong></div>)}
          </div>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel applications-panel">
          <div className="panel-heading applications-heading">
            <div><h2>Recent applications</h2><p>Monitor and manage the latest submissions</p></div>
            <button className="text-button" onClick={() => onNavigate('All Applications')}>View all <ArrowUpRight size={15} /></button>
          </div>
          <div className="table-toolbar">
            <label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applications..." /></label>
            <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter applications by status">
              <option value="All">All statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Verification">Under Verification</option>
              <option value="Under Review">Under Review</option>
              <option value="Action Required">Action Required</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>APPLICATION / INSTITUTION</th><th>TYPE</th><th>SUBMITTED</th><th>STATUS</th><th /></tr></thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td><div className="application-name"><span className="file-icon"><FileText size={17} /></span><div><strong>{app.institution}</strong><span>{app.id}</span></div></div></td>
                    <td>{app.type}</td><td>{app.date}</td><td><StatusBadge status={app.status} /></td>
                    <td><button className="row-action" aria-label={`View ${app.id}`} onClick={() => onNavigate('All Applications')}><ArrowUpRight size={16} /></button></td>
                  </tr>
                ))}
                {filteredApplications.length === 0 && <tr><td colSpan="5" className="empty-state">No applications match your search.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="table-footer"><span>Showing {filteredApplications.length} of {applications.length} sample applications</span><span className="sample-label">DEMO DATA</span></div>
        </article>

        <article className="panel alerts-panel">
          <div className="panel-heading"><div><h2>Needs your attention</h2><p>Items that may require action</p></div><span className="alert-count">{alerts.length}</span></div>
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div className="alert-item" key={alert.id}>
                <span className={`alert-icon alert-${alert.type}`}>{alert.type === 'warning' ? <Clock3 size={17} /> : alert.type === 'danger' ? <AlertTriangle size={17} /> : <FileText size={17} />}</span>
                <div className="alert-copy"><strong>{alert.title}</strong><span>{alert.detail}</span></div>
                <button className="dismiss-button" aria-label="Dismiss alert" onClick={() => setAlerts((current) => current.filter((item) => item.id !== alert.id))}>×</button>
              </div>
            ))}
            {alerts.length === 0 && <div className="empty-alerts"><CheckCircle2 size={23} /><strong>You're all caught up</strong><span>No demo alerts remain.</span></div>}
          </div>
          <button className="all-alerts-button" onClick={() => onNavigate('Alerts & Escalations')}>Open alert centre <ArrowUpRight size={15} /></button>
        </article>
      </section>

      <div className="demo-notice"><span><ShieldCheck size={16} /></span><div><strong>Prototype preview</strong><p>The figures, institutions, and alerts shown here are illustrative demo data—not live AICTE records or official system connections.</p></div></div>
    </>
  )
}

function PlaceholderPage({ title }) {
  const descriptions = {
    'All Applications': 'Search, filter and review institution approval applications.',
    'Document Verification': 'Review submitted documents and identify missing information.',
    'Approval Workflow': 'Track application stages, officer reviews and approval decisions.',
    'Compliance & Deadlines': 'Monitor compliance requirements and upcoming deadlines.',
    'Alerts & Escalations': 'Review urgent issues, reminders and escalation history.',
    'Analytics & Reports': 'Explore approval trends and prepare operational reports.',
    'Audit Trail': 'Review a traceable history of administrative activities.',
    'User Management': 'Manage institution, officer and administrator access.',
    Settings: 'Configure portal preferences and workflow options.',
  }
  return (
    <section className="placeholder-page panel">
      <div className="placeholder-icon"><LayoutDashboard size={27} /></div>
      <h2>{title}</h2>
      <p>{descriptions[title] || 'Manage your approval workspace.'}</p>
      <span className="coming-soon">MODULE PLACEHOLDER</span>
      <p className="placeholder-note">This page is ready to be connected to its module implementation.</p>
    </section>
  )
}

export default function App() {
  const [active, setActive] = useState('Overview')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={setActive} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main-area">
        <Header active={active} onMenu={() => setMenuOpen(true)} />
        <main className="page-content">
          {active === 'Overview' ? <Dashboard onNavigate={setActive} /> : <PlaceholderPage title={active} />}
          <footer className="page-footer"><span>AICTEFlow · Approval Management Portal</span><span>Prototype v0.1 <i /> Built for workflow transparency</span></footer>
        </main>
      </div>
    </div>
  )
}
