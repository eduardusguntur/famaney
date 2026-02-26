import { useState } from 'react'
import { useFamily } from '../../hooks/useFamily'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export function JoinFamily({ onSuccess, onCancel }) {
  const { joinFamily } = useFamily()
  const [inviteCode, setInviteCode] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!inviteCode.trim() || !displayName.trim()) return

    setLoading(true)
    setError(null)

    try {
      await joinFamily(inviteCode.trim(), displayName.trim())
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Join Family</h2>
      <p className="text-gray-500 text-sm mb-6">
        Enter the invite code to join an existing family
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Invite Code"
          placeholder="e.g., ABC123"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          maxLength={6}
          className="uppercase tracking-widest text-center font-mono text-lg"
          required
        />

        <Input
          label="Your Display Name"
          placeholder="e.g., Ani"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <div className="flex gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
          <Button type="submit" loading={loading} className="flex-1">
            Join Family
          </Button>
        </div>
      </form>
    </div>
  )
}
