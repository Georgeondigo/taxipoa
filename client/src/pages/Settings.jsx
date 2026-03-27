import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Bell, Shield, Save, Eye, EyeOff, CheckCircle } from 'lucide-react'
import api from '../api/api'
import toast from 'react-hot-toast'

// ── Reusable Field ─────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 font-body mb-1.5">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-slate-400 text-xs font-body mt-1">{hint}</p>
      )}
    </div>
  )
}

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-body text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"

// ── Section Card ───────────────────────────────────────────────
function Section({ icon, title, desc, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="font-display font-semibold text-slate-800 text-sm">{title}</h3>
            <p className="text-slate-400 text-xs font-body mt-0.5">{desc}</p>
          </div>
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
export default function Settings() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [showPin, setShowPin] = useState(false)

  // Profile form
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    kraPin: '',
    preferredLanguage: 'en',
  })

  // Password form
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [showPasswords, setShowPasswords] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || '',
        phone: user.phone || '',
        kraPin: user.kraPin || '',
        preferredLanguage: user.preferredLanguage || 'en',
      })
    }
  }, [user])

  // ── Save profile ───────────────────────────────────────────
  const saveProfile = async () => {
    if (!profile.fullName.trim()) {
      toast.error('Full name is required')
      return
    }
    setSaving(true)
    try {
      const res = await api.patch('/api/auth/me', {
        fullName: profile.fullName,
        phone: profile.phone || undefined,
        kraPin: profile.kraPin || undefined,
        preferredLanguage: profile.preferredLanguage,
      })

      // Update stored user
      const updated = res.data.data.user
      localStorage.setItem('taxipoa_user', JSON.stringify(updated))
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-slate-500 text-sm font-body mt-1">
          Manage your account, KRA PIN, and preferences
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium font-body transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {activeTab === 'profile' && (
        <div className="space-y-4">

          {/* Avatar */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#1A5276] rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl font-display font-bold">
                  {profile.fullName?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <div className="font-display font-semibold text-slate-800">
                  {profile.fullName || 'Your Name'}
                </div>
                <div className="text-slate-400 text-sm font-body">{user?.email}</div>
                <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium font-body ${
                  user?.plan === 'free'
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {user?.plan === 'free' ? 'Free plan' : 'Pro plan'}
                </div>
              </div>
            </div>
          </div>

          {/* Profile form */}
          <Section
            icon={<User className="w-4 h-4 text-slate-500" />}
            title="Personal Information"
            desc="Update your name, phone and language"
          >
            <Field label="Full Name">
              <input
                type="text"
                value={profile.fullName}
                onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="Your full name"
                className={inputClass}
              />
            </Field>

            <Field
              label="Phone Number"
              hint="Used for SMS deadline reminders — include country code"
            >
              <input
                type="tel"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+254712345678"
                className={inputClass}
              />
            </Field>

            <Field
              label="KRA PIN"
              hint="Your KRA Personal Identification Number — stored securely"
            >
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={profile.kraPin}
                  onChange={e => setProfile({ ...profile, kraPin: e.target.value.toUpperCase() })}
                  placeholder="e.g. A123456789B"
                  className={`${inputClass} pr-12 uppercase`}
                  maxLength={11}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPin
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </Field>

            <Field label="Preferred Language">
              <select
                value={profile.preferredLanguage}
                onChange={e => setProfile({ ...profile, preferredLanguage: e.target.value })}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="en">English</option>
                <option value="sw">Kiswahili</option>
              </select>
            </Field>

            <button
              onClick={saveProfile}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1A5276] hover:bg-[#154360] text-white font-display font-semibold text-sm rounded-xl transition-all duration-200 disabled:opacity-60 shadow-lg shadow-blue-900/20 hover:-translate-y-0.5 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </Section>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-red-50">
              <h3 className="font-display font-semibold text-red-700 text-sm">Danger Zone</h3>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-slate-700 font-medium">Sign out of TaxiPoa</p>
                  <p className="font-body text-xs text-slate-400 mt-0.5">
                    You will need to log in again to access your filings
                  </p>
                </div>
                <button
                  onClick={() => {
                    logout()
                    window.location.href = '/login'
                  }}
                  className="px-4 py-2 border border-red-200 text-red-600 font-display font-semibold text-sm rounded-xl hover:bg-red-50 transition-all duration-200 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECURITY TAB ── */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <Section
            icon={<Shield className="w-4 h-4 text-slate-500" />}
            title="Password"
            desc="Change your account password"
          >
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
              <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 text-xs font-body">
                Use a strong password with at least 8 characters.
                Never share your password with anyone.
              </p>
            </div>

            <Field label="Current Password">
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwords.current}
                  onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="Your current password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            <Field label="New Password">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwords.new}
                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                placeholder="Minimum 8 characters"
                className={inputClass}
              />
            </Field>

            <Field label="Confirm New Password">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="Repeat new password"
                className={inputClass}
              />
            </Field>

            <button
              onClick={async () => {
                if (!passwords.current || !passwords.new) {
                  toast.error('Please fill in all password fields')
                  return
                }
                if (passwords.new !== passwords.confirm) {
                  toast.error('New passwords do not match')
                  return
                }
                if (passwords.new.length < 8) {
                  toast.error('Password must be at least 8 characters')
                  return
                }
                setChangingPassword(true)
                try {
                  await api.patch('/api/auth/me', {
                    currentPassword: passwords.current,
                    newPassword: passwords.new,
                  })
                  toast.success('Password changed successfully')
                  setPasswords({ current: '', new: '', confirm: '' })
                } catch (err) {
                  toast.error(err.response?.data?.message || 'Could not change password')
                } finally {
                  setChangingPassword(false)
                }
              }}
              disabled={changingPassword}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1A5276] hover:bg-[#154360] text-white font-display font-semibold text-sm rounded-xl transition-all duration-200 disabled:opacity-60 cursor-pointer"
            >
              {changingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Change Password
                </>
              )}
            </button>
          </Section>

          {/* Account info */}
          <Section
            icon={<CheckCircle className="w-4 h-4 text-slate-500" />}
            title="Account Details"
            desc="Your account information"
          >
            {[
              { label: 'Email', value: user?.email },
              { label: 'Account Plan', value: user?.plan === 'free' ? 'Free' : 'Pro' },
              { label: 'Login Method', value: user?.passwordHash === '' ? 'Google OAuth' : 'Email & Password' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                <span className="text-slate-500 text-sm font-body">{label}</span>
                <span className="font-display font-semibold text-slate-800 text-sm">{value}</span>
              </div>
            ))}
          </Section>
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ── */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <Section
            icon={<Bell className="w-4 h-4 text-slate-500" />}
            title="Deadline Reminders"
            desc="Get notified before the June 30 KRA filing deadline"
          >
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-blue-700 text-sm font-body">
                <span className="font-semibold">SMS reminders</span> are sent automatically
                to your registered phone number 30 days, 7 days, and 1 day before June 30.
              </p>
            </div>

            {[
              { label: '30 days before deadline', desc: 'May 31 — early warning to start filing', enabled: true },
              { label: '7 days before deadline', desc: 'June 23 — urgent reminder to complete filing', enabled: true },
              { label: '1 day before deadline', desc: 'June 29 — final reminder', enabled: true },
            ].map(({ label, desc, enabled }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div>
                  <p className="font-body text-sm text-slate-700 font-medium">{label}</p>
                  <p className="font-body text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
                <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                  enabled ? 'bg-[#1A5276]' : 'bg-slate-200'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    enabled ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </div>
              </div>
            ))}

            {!user?.phone && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3">
                <Bell className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-display font-semibold text-orange-800 text-sm">
                    No phone number added
                  </p>
                  <p className="text-orange-700 text-xs font-body mt-0.5">
                    Add your phone number in the Profile tab to receive SMS reminders.
                  </p>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="text-orange-700 text-xs font-medium underline mt-1 cursor-pointer"
                  >
                    Go to Profile →
                  </button>
                </div>
              </div>
            )}
          </Section>

          {/* KRA Deadlines reference */}
          <Section
            icon={<CheckCircle className="w-4 h-4 text-slate-500" />}
            title="KRA Filing Deadlines"
            desc="Key dates to remember"
          >
            {[
              { date: '20th monthly', obligation: 'Turnover Tax (TOT) return', urgent: false },
              { date: '30 June annually', obligation: 'Individual Income Tax return', urgent: true },
              { date: '20 Apr, Jul, Oct', obligation: 'Instalment tax payments', urgent: false },
              { date: '20th monthly', obligation: 'VAT return (if registered)', urgent: false },
            ].map(({ date, obligation, urgent }) => (
              <div key={obligation} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    urgent ? 'bg-red-400' : 'bg-slate-300'
                  }`} />
                  <span className="text-slate-600 text-sm font-body">{obligation}</span>
                </div>
                <span className={`text-xs font-medium font-body px-2 py-0.5 rounded-full ${
                  urgent
                    ? 'bg-red-50 text-red-700'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {date}
                </span>
              </div>
            ))}
          </Section>
        </div>
      )}

    </div>
  )
}