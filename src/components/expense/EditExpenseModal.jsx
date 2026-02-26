import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { DEFAULT_CATEGORIES, formatCurrency } from '../../lib/utils'

export function EditExpenseModal({ expense, onSave, onClose }) {
  const [category, setCategory] = useState(expense.category)
  const [amount, setAmount] = useState(expense.amount.toString())
  const [note, setNote] = useState(expense.note || '')
  const [date, setDate] = useState(expense.date)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(expense.id, { category, amount, note, date })
    } finally {
      setLoading(false)
    }
  }

  function formatInputAmount(value) {
    const digits = value.replace(/\D/g, '')
    return digits
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Expense</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="grid grid-cols-4 gap-1.5">
              {DEFAULT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 rounded-lg text-center transition-all ${
                    category === cat.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="text-lg">{cat.icon}</div>
                  <div className="text-[10px] leading-tight truncate">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={amount ? parseInt(amount).toLocaleString('id-ID') : ''}
                onChange={(e) => setAmount(formatInputAmount(e.target.value))}
                className="w-full pl-10 pr-4 py-2 text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          {/* Note */}
          <Input
            label="Note"
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

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
