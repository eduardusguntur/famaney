import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getCategoryInfo, formatCurrency, formatDate } from '../../lib/utils'

export function ExpenseItem({ expense, onEdit, onDelete }) {
  const { user } = useAuth()
  const [showActions, setShowActions] = useState(false)
  const category = getCategoryInfo(expense.category)
  const isOwn = expense.user_id === user?.id

  return (
    <div
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      onClick={() => isOwn && setShowActions(!showActions)}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">{category.name}</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(expense.amount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="truncate">{expense.note || '-'}</span>
            <span className="ml-2 whitespace-nowrap">{formatDate(expense.date)}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            by {expense.display_name}
          </div>
        </div>
      </div>

      {/* Actions (only for own expenses) */}
      {showActions && isOwn && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(expense)
            }}
            className="flex-1 py-2 text-sm text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (confirm('Delete this expense?')) {
                onDelete?.(expense.id)
              }
            }}
            className="flex-1 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
