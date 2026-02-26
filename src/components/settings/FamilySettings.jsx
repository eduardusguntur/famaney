import { useState, useEffect } from 'react'
import { useFamily } from '../../hooks/useFamily'
import { CreateFamily } from '../family/CreateFamily'
import { JoinFamily } from '../family/JoinFamily'
import { Button } from '../ui/Button'

export function FamilySettings({ onClose }) {
  const { currentFamily, getFamilyMembers } = useFamily()
  const [members, setMembers] = useState([])
  const [mode, setMode] = useState(null) // null, 'create', 'join'
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadMembers()
  }, [currentFamily])

  async function loadMembers() {
    try {
      const data = await getFamilyMembers()
      setMembers(data)
    } catch (err) {
      console.error('Error loading members:', err)
    }
  }

  function copyInviteCode() {
    navigator.clipboard.writeText(currentFamily.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (mode === 'create') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
        <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl">
          <CreateFamily
            onSuccess={() => {
              setMode(null)
              onClose()
            }}
            onCancel={() => setMode(null)}
          />
        </div>
      </div>
    )
  }

  if (mode === 'join') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
        <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl">
          <JoinFamily
            onSuccess={() => {
              setMode(null)
              onClose()
            }}
            onCancel={() => setMode(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Family Settings</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Family Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-1">Family Name</div>
            <div className="text-lg font-semibold text-gray-900">{currentFamily?.name}</div>
          </div>

          {/* Invite Code */}
          <div className="bg-primary-50 rounded-xl p-4">
            <div className="text-sm text-primary-600 mb-2">Invite Code</div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-mono font-bold text-primary-700 tracking-widest">
                {currentFamily?.invite_code}
              </div>
              <button
                onClick={copyInviteCode}
                className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="text-xs text-primary-600 mt-2">
              Share this code to invite others
            </div>
          </div>

          {/* Members */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Members ({members.length})</h3>
            <div className="space-y-2">
              {members.map(member => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  {member.user?.avatar_url ? (
                    <img
                      src={member.user.avatar_url}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="font-medium text-gray-600">
                        {member.display_name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{member.display_name}</div>
                    <div className="text-xs text-gray-500">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <Button
              variant="outline"
              onClick={() => setMode('join')}
              className="w-full"
            >
              Join Another Family
            </Button>
            <Button
              onClick={() => setMode('create')}
              className="w-full"
            >
              Create New Family
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
