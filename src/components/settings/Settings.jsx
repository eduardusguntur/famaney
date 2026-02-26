import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useFamily } from '../../hooks/useFamily'
import { FamilySettings } from './FamilySettings'
import { Profile } from './Profile'
import { Button } from '../ui/Button'

export function Settings() {
  const { user, signOut } = useAuth()
  const { currentFamily, families, switchFamily } = useFamily()
  const [showFamilySettings, setShowFamilySettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await signOut()
    } catch (err) {
      console.error('Error signing out:', err)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* User Info */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-4">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="w-14 h-14 rounded-full"
            />
          ) : (
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold text-primary-500">
                {user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {user?.user_metadata?.full_name || user?.email}
            </div>
            <div className="text-sm text-gray-500 truncate">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Current Family */}
      {currentFamily && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Current Family</h3>
            <button
              onClick={() => setShowFamilySettings(true)}
              className="text-primary-500 text-sm font-medium"
            >
              Manage
            </button>
          </div>
          <div className="text-lg font-semibold text-gray-900">{currentFamily.name}</div>
          <div className="text-sm text-gray-500">
            Invite code: <span className="font-mono font-semibold">{currentFamily.invite_code}</span>
          </div>
        </div>
      )}

      {/* Switch Family */}
      {families.length > 1 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-medium text-gray-900 mb-3">Switch Family</h3>
          <div className="space-y-2">
            {families.map(family => (
              <button
                key={family.id}
                onClick={() => switchFamily(family.id)}
                className={`w-full p-3 rounded-xl text-left transition-colors ${
                  family.id === currentFamily?.id
                    ? 'bg-primary-50 border-2 border-primary-500'
                    : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                }`}
              >
                <div className="font-medium text-gray-900">{family.name}</div>
                <div className="text-sm text-gray-500">as {family.membership.display_name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={() => setShowProfile(true)}
          className="w-full justify-start gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Edit Profile
        </Button>

        <Button
          variant="danger"
          onClick={handleLogout}
          loading={loggingOut}
          className="w-full justify-start gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </Button>
      </div>

      {/* Modals */}
      {showFamilySettings && (
        <FamilySettings onClose={() => setShowFamilySettings(false)} />
      )}

      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} />
      )}
    </div>
  )
}
