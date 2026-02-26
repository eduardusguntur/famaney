import { useState } from 'react'
import { useFamily } from '../../hooks/useFamily'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export function SetupName({ onComplete }) {
  const { updateDisplayName } = useFamily()
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!displayName.trim()) return

    setLoading(true)
    setError(null)

    try {
      await updateDisplayName(displayName.trim())
      onComplete?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Set Your Name</h2>
        <p className="text-gray-500 text-sm mb-6">
          How should we display your name in this family?
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Display Name"
            placeholder="e.g., Papa, Mama, Andi"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
}
