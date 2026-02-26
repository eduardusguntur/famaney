import { useState } from 'react'
import { useExpenses } from '../../hooks/useExpenses'
import { useFamily } from '../../hooks/useFamily'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { DEFAULT_CATEGORIES, formatCurrency } from '../../lib/utils'

export function InputForm() {
  const { currentFamily, currentMembership } = useFamily()
  const { addExpense } = useExpenses()
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!category || !amount) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await addExpense({
        category,
        amount: parseInt(amount, 10),
        note,
        date,
      })
      // Reset form
      setCategory('')
      setAmount('')
      setNote('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function formatInputAmount(value) {
    // Remove non-digits
    const digits = value.replace(/\D/g, '')
    return digits
  }

  return (
    <div className="p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
        <p className="text-sm text-gray-500">
          {currentFamily?.name} - {currentMembership?.display_name}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Expense added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Category
          </label>
          <div className="grid grid-cols-4 gap-2">
            {DEFAULT_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`p-3 rounded-xl text-center transition-all ${
                  category === cat.id
                    ? 'bg-primary-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-xs truncate">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amount ? parseInt(amount).toLocaleString('id-ID') : ''}
              onChange={(e) => setAmount(formatInputAmount(e.target.value))}
              className="w-full pl-10 pr-4 py-3 text-2xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          {amount && (
            <p className="mt-1 text-sm text-gray-500">
              {formatCurrency(parseInt(amount))}
            </p>
          )}
        </div>

        {/* Note */}
        <Input
          label="Note (optional)"
          placeholder="e.g., Makan siang di warteg"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Date */}
        <Input
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          disabled={!category || !amount}
          className="w-full"
          size="lg"
        >
          Add Expense
        </Button>
      </form>
    </div>
  )
}
