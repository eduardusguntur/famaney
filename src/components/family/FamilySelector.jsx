import { useState } from 'react'
import { useFamily } from '../../hooks/useFamily'
import { CreateFamily } from './CreateFamily'
import { JoinFamily } from './JoinFamily'
import { Button } from '../ui/Button'

export function FamilySelector() {
  const { families, switchFamily, loading } = useFamily()
  const [mode, setMode] = useState(null) // null, 'create', 'join'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // If user has families, show selector
  if (families.length > 0 && mode === null) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Select Family
          </h1>

          <div className="space-y-3 mb-6">
            {families.map(family => (
              <button
                key={family.id}
                onClick={() => switchFamily(family.id)}
                className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-200 text-left hover:border-primary-500 transition-colors"
              >
                <div className="font-medium text-gray-900">{family.name}</div>
                <div className="text-sm text-gray-500">
                  as {family.membership.display_name}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setMode('join')} className="flex-1">
              Join Another
            </Button>
            <Button onClick={() => setMode('create')} className="flex-1">
              Create New
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // No families yet - show create/join options
  if (mode === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Join or Create Family</h1>
            <p className="text-gray-500 mt-2">
              Start tracking expenses with your family or group
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setMode('create')}
              className="w-full p-6 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Create New Family</div>
                  <div className="text-sm text-gray-500">Start a new group and invite others</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Join Family</div>
                  <div className="text-sm text-gray-500">Enter invite code to join</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show create or join form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg">
        {mode === 'create' ? (
          <CreateFamily
            onSuccess={() => setMode(null)}
            onCancel={() => setMode(null)}
          />
        ) : (
          <JoinFamily
            onSuccess={() => setMode(null)}
            onCancel={() => setMode(null)}
          />
        )}
      </div>
    </div>
  )
}
