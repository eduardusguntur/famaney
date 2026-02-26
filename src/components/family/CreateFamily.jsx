import { useState } from 'react'
import { useFamily } from '../../hooks/useFamily'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export function CreateFamily({ onSuccess, onCancel }) {
  const { createFamily } = useFamily()
  const [familyName, setFamilyName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!familyName.trim() || !displayName.trim()) return

    setLoading(true)
    setError(null)

    try {
      await createFamily(familyName.trim(), displayName.trim())
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Family</h2>
      <p className="text-gray-500 text-sm mb-6">
        Create a family group to track expenses together
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Family Name"
          placeholder="e.g., Keluarga Budi"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          required
        />

        <Input
          label="Your Display Name"
          placeholder="e.g., Budi"
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
            Create Family
          </Button>
        </div>
      </form>
    </div>
  )
}
