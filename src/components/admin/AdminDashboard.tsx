'use client'

/* Admin data tabs intentionally load on mount; React 19 lint flags this pattern. */
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, User, Code2, Briefcase, Wrench,
  LogOut, Plus, Pencil, Trash2, Save, X, ChevronRight,
  Eye, EyeOff, Mail, MessageSquare, BarChart3, Blocks, Upload, FileText, Image
} from 'lucide-react'

/* eslint-disable @typescript-eslint/no-explicit-any */

type Tab = 'dashboard' | 'profile' | 'skills' | 'experiences' | 'educations' | 'services' | 'messages' | 'stats' | 'integrations'

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'experiences', label: 'Experience', icon: Briefcase },
  { id: 'educations', label: 'Education', icon: FileText },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'integrations', label: 'Systems', icon: Blocks },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="admin-shell min-h-screen flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} glass-card border-r border-dark-border transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-dark-border">
          <h1 className={`font-bold gradient-text ${sidebarOpen ? 'text-xl' : 'text-sm text-center'}`}>
            {sidebarOpen ? 'Marsh Admin' : 'M'}
          </h1>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-primary/20 text-primary border-r-2 border-primary'
                  : 'text-text-muted hover:text-text hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-dark-border space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-text rounded-lg hover:bg-white/5"
          >
            <ChevronRight size={18} className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            {sidebarOpen && <span>Collapse</span>}
          </button>
          <a
            href="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-text rounded-lg hover:bg-white/5"
          >
            <Eye size={18} />
            {sidebarOpen && <span>View Site</span>}
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'skills' && <SkillsTab />}
        {activeTab === 'experiences' && <ExperiencesTab />}
        {activeTab === 'educations' && <EducationsTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'stats' && <StatsTab />}
        {activeTab === 'integrations' && <IntegrationsTab />}
        {activeTab === 'messages' && <MessagesTab />}
      </main>
    </div>
  )
}

/* ========== Dashboard Tab ========== */
function DashboardTab() {
  const [stats, setStats] = useState({ skills: 0, experiences: 0, educations: 0, services: 0, messages: 0, unread: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/skills').then(r => r.json()),
      fetch('/api/admin/experiences').then(r => r.json()),
      fetch('/api/admin/educations').then(r => r.json()),
      fetch('/api/admin/services').then(r => r.json()),
      fetch('/api/admin/messages').then(r => r.json()),
    ]).then(([skills, exps, educations, services, messages]) => {
      setStats({
        skills: skills.length || 0,
        experiences: exps.length || 0,
        educations: educations.length || 0,
        services: services.length || 0,
        messages: messages.length || 0,
        unread: messages.filter?.((m: any) => !m.isRead)?.length || 0,
      })
    })
  }, [])

  const cards = [
    { label: 'Skills', value: stats.skills, color: 'text-primary' },
    { label: 'Experiences', value: stats.experiences, color: 'text-secondary' },
    { label: 'Education', value: stats.educations, color: 'text-accent' },
    { label: 'Services', value: stats.services, color: 'text-success' },
    { label: 'Messages', value: stats.messages, color: 'text-warning' },
    { label: 'Unread', value: stats.unread, color: 'text-red-400' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(card => (
          <div key={card.label} className="glass-card rounded-xl p-6">
            <p className="text-text-muted text-sm">{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========== Profile Tab ========== */
function ProfileTab() {
  const [profile, setProfile] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/profile').then(r => r.json()).then(setProfile)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'resume') => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(type)
    setUploadError(null)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setUploadError(data.error || 'Upload failed')
        setUploading(null)
        return
      }
      if (data.url) {
        setProfile({ ...profile, [type === 'avatar' ? 'avatarUrl' : 'resumeUrl']: data.url })
      }
    } catch (err) {
      console.error('Upload failed:', err)
      setUploadError('Upload failed. Please try again.')
    }
    setUploading(null)
  }

  if (!profile) return <p className="text-text-muted">Loading...</p>

  const fields = [
    { key: 'name', label: 'Full Name (EN)', type: 'text' },
    { key: 'nameAr', label: 'Full Name (AR)', type: 'text' },
    { key: 'title', label: 'Title (EN)', type: 'text' },
    { key: 'titleAr', label: 'Title (AR)', type: 'text' },
    { key: 'subtitle', label: 'Subtitle (EN)', type: 'text' },
    { key: 'subtitleAr', label: 'Subtitle (AR)', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'whatsapp', label: 'WhatsApp', type: 'text' },
    { key: 'location', label: 'Location (EN)', type: 'text' },
    { key: 'locationAr', label: 'Location (AR)', type: 'text' },
    { key: 'yearsOfExp', label: 'Years of Experience', type: 'number' },
    { key: 'projectsCount', label: 'Roles Count', type: 'number' },
    { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
    { key: 'website', label: 'Website URL', type: 'url' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Profile</h2>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm transition-all disabled:opacity-50">
          <Save size={16} /> {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* File Uploads */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="font-bold mb-4">Profile Image & Resume</h3>
        {uploadError && <p className="text-red-500 text-sm mb-4">{uploadError}</p>}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-text-muted block mb-2">Profile Image</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-dark-card border border-dark-border overflow-hidden flex items-center justify-center">
                {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <Image size={32} className="text-text-muted" />}
              </div>
              <div>
                <label className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border hover:border-primary rounded-lg cursor-pointer transition-all text-sm">
                  <Upload size={16} /> {uploading === 'avatar' ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'avatar')} className="hidden" disabled={uploading === 'avatar'} />
                </label>
                <p className="text-xs text-text-muted mt-1">JPG, PNG, GIF, WebP</p>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm text-text-muted block mb-2">Resume (PDF)</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center">
                <FileText size={32} className={profile.resumeUrl ? 'text-primary' : 'text-text-muted'} />
              </div>
              <div>
                <label className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border hover:border-primary rounded-lg cursor-pointer transition-all text-sm">
                  <Upload size={16} /> {uploading === 'resume' ? 'Uploading...' : 'Upload PDF'}
                  <input type="file" accept=".pdf" onChange={e => handleFileUpload(e, 'resume')} className="hidden" disabled={uploading === 'resume'} />
                </label>
                {profile.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block">View current resume</a>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="grid md:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-sm text-text-muted block mb-1">{f.label}</label>
              <input
                type={f.type}
                value={profile[f.key] || ''}
                onChange={e => setProfile({ ...profile, [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm"
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className="text-sm text-text-muted block mb-1">Bio (EN)</label>
          <textarea
            rows={4}
            value={profile.bio || ''}
            onChange={e => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm resize-none"
          />
        </div>
        <div className="mt-4">
          <label className="text-sm text-text-muted block mb-1">Bio (AR)</label>
          <textarea
            rows={4}
            value={profile.bioAr || ''}
            onChange={e => setProfile({ ...profile, bioAr: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm resize-none"
            dir="rtl"
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm text-text-muted">Available for hire:</label>
          <button
            onClick={() => setProfile({ ...profile, available: !profile.available })}
            className={`w-12 h-6 rounded-full transition-colors relative ${profile.available ? 'bg-success' : 'bg-dark-border'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${profile.available ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ========== Skills Tab ========== */
function SkillsTab() {
  const [skills, setSkills] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  const loadSkills = useCallback(async () => {
    const data = await fetch('/api/admin/skills').then(r => r.json())
    setSkills(data)
  }, [])

  useEffect(() => { loadSkills() }, [loadSkills])

  const categoryMap: Record<string, string> = {
    Accounting: 'المحاسبة',
    Systems: 'الأنظمة',
    Languages: 'اللغات',
    'Soft Skills': 'مهارات شخصية',
  }
  const emptySkill = {
    name: '',
    nameAr: '',
    level: 'Intermediate',
    category: 'Accounting',
    categoryAr: 'المحاسبة',
    icon: '',
    sortOrder: 0,
  }

  const handleSave = async () => {
    if (!editing?.name?.trim() || !editing?.nameAr?.trim() || !editing?.category?.trim() || !editing?.categoryAr?.trim()) {
      alert('English and Arabic name + category are required.')
      return
    }
    const method = editing?.id ? 'PUT' : 'POST'
    await fetch('/api/admin/skills', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    setShowForm(false)
    setEditing(null)
    loadSkills()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    await fetch('/api/admin/skills', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadSkills()
  }

  const categories = Object.keys(categoryMap)
  const levels = ['Beginner', 'Intermediate', 'Advanced']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Skills ({skills.length})</h2>
        <button onClick={() => { setEditing(emptySkill); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{editing?.id ? 'Edit Skill' : 'New Skill'}</h3>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="text-text-muted hover:text-text"><X size={18} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-text-muted block mb-1">Name (EN) *</label>
              <input required value={editing?.name || ''} onChange={e => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Name (AR) *</label>
              <input required dir="rtl" value={editing?.nameAr || ''} onChange={e => setEditing({ ...editing, nameAr: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Category (EN) *</label>
              <select
                value={editing?.category || ''}
                onChange={e => {
                  const category = e.target.value
                  setEditing({ ...editing, category, categoryAr: categoryMap[category] || editing?.categoryAr || '' })
                }}
                className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Category (AR) *</label>
              <input required dir="rtl" value={editing?.categoryAr || ''} onChange={e => setEditing({ ...editing, categoryAr: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Level</label>
              <select value={editing?.level || ''} onChange={e => setEditing({ ...editing, level: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm">
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Sort Order</label>
              <input type="number" value={editing?.sortOrder || 0} onChange={e => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
          </div>
          <button onClick={handleSave} className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm">
            <Save size={16} /> Save
          </button>
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(skills.reduce((acc: any, s: any) => { acc[s.category] = acc[s.category] || []; acc[s.category].push(s); return acc }, {})).map(([cat, catSkills]: [string, any]) => (
          <div key={cat} className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-bold text-primary mb-3">{cat}</h3>
            <div className="space-y-2">
              {catSkills.map((skill: any) => (
                <div key={skill.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-dark-light/50 hover:bg-dark-light">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{skill.name}</span>
                    {skill.nameAr ? <span className="text-xs text-text-muted" dir="rtl">{skill.nameAr}</span> : null}
                    <span className={`text-xs px-2 py-0.5 rounded ${skill.level === 'Advanced' ? 'bg-success/10 text-success' : skill.level === 'Intermediate' ? 'bg-warning/10 text-warning' : 'bg-white/5 text-text-muted'}`}>{skill.level}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(skill); setShowForm(true) }} className="p-1 text-text-muted hover:text-primary"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(skill.id)} className="p-1 text-text-muted hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========== Experiences Tab ========== */
function ExperiencesTab() {
  const [experiences, setExperiences] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    const data = await fetch('/api/admin/experiences').then(r => r.json())
    setExperiences(data)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const emptyExp = {
    company: '',
    companyAr: '',
    position: '',
    positionAr: '',
    description: '',
    descriptionAr: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    location: '',
    type: 'fulltime',
    logoUrl: '',
    websiteUrl: '',
    sortOrder: 0,
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editing) return
    setUploadingLogo(true)
    setUploadError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'logo')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setUploadError(data.error || 'Upload failed')
      } else {
        setEditing({ ...editing, logoUrl: data.url })
      }
    } catch {
      setUploadError('Upload failed')
    }
    setUploadingLogo(false)
    e.target.value = ''
  }

  const handleSave = async () => {
    const method = editing?.id ? 'PUT' : 'POST'
    await fetch('/api/admin/experiences', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    setShowForm(false)
    setEditing(null)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return
    await fetch('/api/admin/experiences', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    loadData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Experience ({experiences.length})</h2>
        <button onClick={() => { setEditing(emptyExp); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm">
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{editing?.id ? 'Edit Experience' : 'New Experience'}</h3>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="text-text-muted hover:text-text"><X size={18} /></button>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-xl border border-dark-border bg-dark-card flex items-center justify-center">
              {editing?.logoUrl ? (
                <img src={editing.logoUrl} alt="Company logo" className="h-full w-full object-contain p-1" />
              ) : (
                <Image size={24} className="text-text-muted" />
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border hover:border-primary rounded-lg cursor-pointer transition-all text-sm">
                <Upload size={16} />
                {uploadingLogo ? 'Uploading...' : 'Upload company logo'}
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
              </label>
              {editing?.logoUrl && (
                <button
                  type="button"
                  onClick={() => setEditing({ ...editing, logoUrl: '' })}
                  className="mt-2 block text-xs text-red-400 hover:underline"
                >
                  Remove logo
                </button>
              )}
              {uploadError && <p className="mt-1 text-xs text-red-400">{uploadError}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: 'company', label: 'Company' },
              { key: 'companyAr', label: 'Company (Arabic)' },
              { key: 'position', label: 'Position' },
              { key: 'positionAr', label: 'Position (Arabic)' },
              { key: 'websiteUrl', label: 'Company website URL' },
              { key: 'startDate', label: 'Start Date (YYYY-MM)' },
              { key: 'endDate', label: 'End Date (YYYY-MM or empty)' },
              { key: 'location', label: 'Location' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm text-text-muted block mb-1">{f.label}</label>
                <input value={editing?.[f.key] || ''} onChange={e => setEditing({ ...editing, [f.key]: e.target.value || null })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
              </div>
            ))}
            <div>
              <label className="text-sm text-text-muted block mb-1">Type</label>
              <select value={editing?.type || 'fulltime'} onChange={e => setEditing({ ...editing, type: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm">
                <option value="fulltime">Full-time</option>
                <option value="freelance">Freelance</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm text-text-muted block mb-1">Description</label>
            <textarea rows={4} value={editing?.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm resize-none" />
          </div>
          <div className="mt-4">
            <label className="text-sm text-text-muted block mb-1">Description (Arabic)</label>
            <textarea rows={3} value={editing?.descriptionAr || ''} onChange={e => setEditing({ ...editing, descriptionAr: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm resize-none" />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
              <input type="checkbox" checked={editing?.isCurrent || false} onChange={e => setEditing({ ...editing, isCurrent: e.target.checked })} className="accent-primary" />
              Currently working here
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-muted">Sort:</label>
              <input type="number" value={editing?.sortOrder || 0} onChange={e => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })} className="w-16 px-2 py-1 rounded bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
          </div>
          <button onClick={handleSave} className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm">
            <Save size={16} /> Save
          </button>
        </div>
      )}

      <div className="space-y-3">
        {experiences.map((exp: any) => (
          <div key={exp.id} className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-dark-border bg-dark-card flex items-center justify-center">
                  {exp.logoUrl ? (
                    <img src={exp.logoUrl} alt={exp.company} className="h-full w-full object-contain p-1" />
                  ) : (
                    <Briefcase size={18} className="text-text-muted" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold">{exp.position}</h3>
                    {exp.isCurrent && <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Current</span>}
                  </div>
                  <p className="text-primary text-sm">{exp.company}</p>
                  {exp.websiteUrl && (
                    <a href={exp.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-primary break-all">
                      {exp.websiteUrl}
                    </a>
                  )}
                  <p className="text-text-muted text-xs mt-1">{exp.startDate} — {exp.endDate || 'Present'} · {exp.type}</p>
                  <p className="text-text-muted text-sm mt-2 line-clamp-2">{exp.description}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setEditing(exp); setShowForm(true) }} className="p-2 text-text-muted hover:text-primary"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(exp.id)} className="p-2 text-text-muted hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========== Education Tab ========== */
function EducationsTab() {
  const [educations, setEducations] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  const loadData = useCallback(async () => {
    const data = await fetch('/api/admin/educations').then((r) => r.json())
    setEducations(data)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const emptyEdu = {
    degree: '',
    degreeAr: '',
    institution: '',
    institutionAr: '',
    description: '',
    descriptionAr: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    location: '',
    sortOrder: 0,
  }

  const handleSave = async () => {
    const method = editing?.id ? 'PUT' : 'POST'
    await fetch('/api/admin/educations', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    setShowForm(false)
    setEditing(null)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this education entry?')) return
    await fetch('/api/admin/educations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Education ({educations.length})</h2>
        <button
          onClick={() => {
            setEditing(emptyEdu)
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm"
        >
          <Plus size={16} /> Add Education
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{editing?.id ? 'Edit Education' : 'New Education'}</h3>
            <button
              onClick={() => {
                setShowForm(false)
                setEditing(null)
              }}
              className="text-text-muted hover:text-text"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: 'degree', label: 'Degree (EN)' },
              { key: 'degreeAr', label: 'Degree (AR)' },
              { key: 'institution', label: 'Institution (EN)' },
              { key: 'institutionAr', label: 'Institution (AR)' },
              { key: 'startDate', label: 'Start Date (YYYY-MM)' },
              { key: 'endDate', label: 'End Date (YYYY-MM or empty)' },
              { key: 'location', label: 'Location' },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-sm text-text-muted block mb-1">{f.label}</label>
                <input
                  value={editing?.[f.key] || ''}
                  onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm"
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="text-sm text-text-muted block mb-1">Description (EN)</label>
            <textarea
              rows={3}
              value={editing?.description || ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm resize-none"
            />
          </div>
          <div className="mt-4">
            <label className="text-sm text-text-muted block mb-1">Description (AR)</label>
            <textarea
              rows={3}
              value={editing?.descriptionAr || ''}
              onChange={(e) => setEditing({ ...editing, descriptionAr: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm resize-none"
              dir="rtl"
            />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={editing?.isCurrent || false}
                onChange={(e) => setEditing({ ...editing, isCurrent: e.target.checked })}
                className="accent-primary"
              />
              Currently studying
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-muted">Sort:</label>
              <input
                type="number"
                value={editing?.sortOrder || 0}
                onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-16 px-2 py-1 rounded bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm"
          >
            <Save size={16} /> Save
          </button>
        </div>
      )}

      <div className="space-y-3">
        {educations.map((edu: any) => (
          <div key={edu.id} className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-bold">{edu.degree}</h3>
                <p className="text-primary text-sm">{edu.institution}</p>
                <p className="text-text-muted text-xs mt-1">
                  {edu.startDate} — {edu.endDate || 'Present'}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditing(edu)
                    setShowForm(true)
                  }}
                  className="p-2 text-text-muted hover:text-primary"
                >
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(edu.id)} className="p-2 text-text-muted hover:text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========== Services Tab ========== */
function ServicesTab() {
  const [services, setServices] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [featureInput, setFeatureInput] = useState('')

  const loadData = useCallback(async () => {
    const data = await fetch('/api/admin/services').then(r => r.json())
    setServices(data)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const [featureInputAr, setFeatureInputAr] = useState('')
  const emptyService = {
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    icon: 'wrench',
    features: '[]',
    featuresAr: '[]',
    sortOrder: 0,
  }

  const startEdit = (s: any) => {
    setEditing({
      ...s,
      _features: JSON.parse(s.features || '[]'),
      _featuresAr: JSON.parse(s.featuresAr || '[]'),
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!editing?.title?.trim() || !editing?.titleAr?.trim() || !editing?.description?.trim() || !editing?.descriptionAr?.trim()) {
      alert('English and Arabic title + description are required.')
      return
    }
    const toSave = {
      ...editing,
      features: JSON.stringify(editing._features || []),
      featuresAr: JSON.stringify(editing._featuresAr || []),
    }
    delete toSave._features
    delete toSave._featuresAr
    const method = editing?.id ? 'PUT' : 'POST'
    await fetch('/api/admin/services', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(toSave) })
    setShowForm(false)
    setEditing(null)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    await fetch('/api/admin/services', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    loadData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Services ({services.length})</h2>
        <button onClick={() => { setEditing({ ...emptyService, _features: [], _featuresAr: [] }); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm">
          <Plus size={16} /> Add Service
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{editing?.id ? 'Edit Service' : 'New Service'}</h3>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="text-text-muted hover:text-text"><X size={18} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-text-muted block mb-1">Title (EN) *</label>
              <input required value={editing?.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Title (AR) *</label>
              <input required dir="rtl" value={editing?.titleAr || ''} onChange={e => setEditing({ ...editing, titleAr: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Icon (lucide name)</label>
              <input value={editing?.icon || ''} onChange={e => setEditing({ ...editing, icon: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" placeholder="e.g. building-2" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Sort Order</label>
              <input type="number" value={editing?.sortOrder || 0} onChange={e => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-text-muted block mb-1">Description (EN) *</label>
              <textarea rows={3} required value={editing?.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm resize-none" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Description (AR) *</label>
              <textarea rows={3} required dir="rtl" value={editing?.descriptionAr || ''} onChange={e => setEditing({ ...editing, descriptionAr: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm resize-none" />
            </div>
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-text-muted block mb-1">Features (EN)</label>
              <div className="flex gap-2 mb-2">
                <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (featureInput.trim()) { setEditing({ ...editing, _features: [...(editing._features || []), featureInput.trim()] }); setFeatureInput('') } } }} placeholder="Add feature..." className="flex-1 px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
                <button onClick={() => { if (featureInput.trim()) { setEditing({ ...editing, _features: [...(editing._features || []), featureInput.trim()] }); setFeatureInput('') } }} className="px-3 py-2 bg-primary/20 text-primary rounded-lg text-sm"><Plus size={14} /></button>
              </div>
              <ul className="space-y-1">
                {editing?._features?.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-muted bg-dark-light/50 px-3 py-2 rounded-lg">
                    <span className="flex-1">{f}</span>
                    <button onClick={() => setEditing({ ...editing, _features: editing._features.filter((_: string, j: number) => j !== i) })} className="text-red-400"><X size={14} /></button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Features (AR)</label>
              <div className="flex gap-2 mb-2">
                <input dir="rtl" value={featureInputAr} onChange={e => setFeatureInputAr(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (featureInputAr.trim()) { setEditing({ ...editing, _featuresAr: [...(editing._featuresAr || []), featureInputAr.trim()] }); setFeatureInputAr('') } } }} placeholder="أضف ميزة..." className="flex-1 px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
                <button onClick={() => { if (featureInputAr.trim()) { setEditing({ ...editing, _featuresAr: [...(editing._featuresAr || []), featureInputAr.trim()] }); setFeatureInputAr('') } }} className="px-3 py-2 bg-primary/20 text-primary rounded-lg text-sm"><Plus size={14} /></button>
              </div>
              <ul className="space-y-1">
                {editing?._featuresAr?.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-muted bg-dark-light/50 px-3 py-2 rounded-lg" dir="rtl">
                    <span className="flex-1">{f}</span>
                    <button onClick={() => setEditing({ ...editing, _featuresAr: editing._featuresAr.filter((_: string, j: number) => j !== i) })} className="text-red-400"><X size={14} /></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button onClick={handleSave} className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm">
            <Save size={16} /> Save
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s: any) => (
          <div key={s.id} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-sm">{s.title}</h3>
                {s.titleAr ? <p className="text-xs text-text-muted mt-0.5" dir="rtl">{s.titleAr}</p> : null}
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(s)} className="p-1 text-text-muted hover:text-primary"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-1 text-text-muted hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-text-muted text-xs line-clamp-2">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========== Messages Tab ========== */
function MessagesTab() {
  const [messages, setMessages] = useState<any[]>([])

  const loadData = useCallback(async () => {
    const data = await fetch('/api/admin/messages').then(r => r.json())
    setMessages(data)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const toggleRead = async (msg: any) => {
    await fetch('/api/admin/messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: msg.id, isRead: !msg.isRead }),
    })
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return
    await fetch('/api/admin/messages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    loadData()
  }

  const unread = messages.filter(m => !m.isRead).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Messages ({messages.length}){unread > 0 && <span className="text-sm text-red-400 ml-2">({unread} unread)</span>}</h2>
      </div>
      {messages.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Mail size={48} className="mx-auto text-text-muted mb-4" />
          <p className="text-text-muted">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg: any) => (
            <div key={msg.id} className={`glass-card rounded-xl p-5 ${!msg.isRead ? 'border-l-4 border-l-primary' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-sm">{msg.name}</h3>
                    <span className="text-text-muted text-xs">{msg.email}</span>
                    {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  {msg.subject && <p className="text-primary text-sm mb-1">{msg.subject}</p>}
                  <p className="text-text-muted text-sm">{msg.message}</p>
                  <p className="text-text-muted text-xs mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => toggleRead(msg)} className="p-2 text-text-muted hover:text-primary" title={msg.isRead ? 'Mark unread' : 'Mark read'}>
                    {msg.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => handleDelete(msg.id)} className="p-2 text-text-muted hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ========== Stats Tab ========== */
function StatsTab() {
  const [stats, setStats] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  const loadStats = useCallback(async () => {
    const data = await fetch('/api/admin/stats').then(r => r.json())
    setStats(Array.isArray(data) ? data : [])
  }, [])

  useEffect(() => { loadStats() }, [loadStats])

  const emptyStat = { value: '', label: '', labelAr: '', color: 'primary', sortOrder: 0 }

  const handleSave = async () => {
    if (!editing?.label?.trim() || !editing?.labelAr?.trim() || !editing?.value?.trim()) {
      alert('Value plus English and Arabic labels are required.')
      return
    }
    const method = editing?.id ? 'PUT' : 'POST'
    await fetch('/api/admin/stats', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    setShowForm(false)
    setEditing(null)
    loadStats()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this stat?')) return
    await fetch('/api/admin/stats', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadStats()
  }

  const colors = ['primary', 'secondary', 'accent', 'success', 'warning']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Stats ({stats.length})</h2>
        <button onClick={() => { setEditing(emptyStat); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm">
          <Plus size={16} /> Add Stat
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{editing?.id ? 'Edit Stat' : 'New Stat'}</h3>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="text-text-muted hover:text-text"><X size={18} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-text-muted block mb-1">Value (e.g., &quot;300+&quot;) *</label>
              <input required value={editing?.value || ''} onChange={e => setEditing({ ...editing, value: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Label (EN) *</label>
              <input required value={editing?.label || ''} onChange={e => setEditing({ ...editing, label: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Label (AR) *</label>
              <input required dir="rtl" value={editing?.labelAr || ''} onChange={e => setEditing({ ...editing, labelAr: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Color</label>
              <select value={editing?.color || 'primary'} onChange={e => setEditing({ ...editing, color: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm">
                {colors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Sort Order</label>
              <input type="number" value={editing?.sortOrder || 0} onChange={e => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
          </div>
          <button onClick={handleSave} className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm">
            <Save size={16} /> Save
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat: any) => (
          <div key={stat.id} className="glass-card rounded-xl p-4 text-center group">
            <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
            <p className="text-text-muted text-sm mt-1">{stat.label}</p>
            <div className="mt-3 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditing(stat); setShowForm(true) }} className="p-1 text-text-muted hover:text-primary"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(stat.id)} className="p-1 text-text-muted hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ========== Integrations Tab ========== */
function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  const loadIntegrations = useCallback(async () => {
    const data = await fetch('/api/admin/integrations').then(r => r.json())
    setIntegrations(Array.isArray(data) ? data : [])
  }, [])

  useEffect(() => { loadIntegrations() }, [loadIntegrations])

  const emptyIntegration = {
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    icon: 'globe',
    category: 'api',
    sortOrder: 0,
  }

  const handleSave = async () => {
    if (!editing?.name?.trim() || !editing?.nameAr?.trim() || !editing?.description?.trim() || !editing?.descriptionAr?.trim()) {
      alert('English and Arabic name + description are required.')
      return
    }
    const method = editing?.id ? 'PUT' : 'POST'
    await fetch('/api/admin/integrations', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    setShowForm(false)
    setEditing(null)
    loadIntegrations()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this integration?')) return
    await fetch('/api/admin/integrations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadIntegrations()
  }

  const icons = ['globe', 'file-check', 'truck', 'message-square', 'credit-card', 'fingerprint', 'radio', 'cpu', 'shield', 'blocks', 'bar-chart-3']
  const categories = ['api', 'government', 'shipping', 'payment', 'communication', 'hardware', 'ai', 'notification', 'analytics', 'hosting', 'hospitality']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Integrations ({integrations.length})</h2>
        <button onClick={() => { setEditing(emptyIntegration); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm">
          <Plus size={16} /> Add Integration
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{editing?.id ? 'Edit Integration' : 'New Integration'}</h3>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="text-text-muted hover:text-text"><X size={18} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-text-muted block mb-1">Name (EN) *</label>
              <input required value={editing?.name || ''} onChange={e => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Name (AR) *</label>
              <input required dir="rtl" value={editing?.nameAr || ''} onChange={e => setEditing({ ...editing, nameAr: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Description (EN) *</label>
              <input required value={editing?.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Description (AR) *</label>
              <input required dir="rtl" value={editing?.descriptionAr || ''} onChange={e => setEditing({ ...editing, descriptionAr: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Icon</label>
              <select value={editing?.icon || 'globe'} onChange={e => setEditing({ ...editing, icon: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm">
                {icons.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Category</label>
              <select value={editing?.category || 'api'} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-text-muted block mb-1">Sort Order</label>
              <input type="number" value={editing?.sortOrder || 0} onChange={e => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-primary focus:outline-none text-text text-sm" />
            </div>
          </div>
          <button onClick={handleSave} className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm">
            <Save size={16} /> Save
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((int: any) => (
          <div key={int.id} className="glass-card rounded-xl p-4 group">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-sm">{int.name}</h4>
                {int.nameAr ? <p className="text-xs text-text-muted" dir="rtl">{int.nameAr}</p> : null}
                <p className="text-text-muted text-xs mt-1">{int.description}</p>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{int.category}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditing(int); setShowForm(true) }} className="p-1 text-text-muted hover:text-primary"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(int.id)} className="p-1 text-text-muted hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
