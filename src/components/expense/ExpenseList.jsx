import { useState, useEffect } from 'react'
import { useExpenses } from '../../hooks/useExpenses'
import { useFamily } from '../../hooks/useFamily'
import { ExpenseItem } from './ExpenseItem'
import { EditExpenseModal } from './EditExpenseModal'
import { Select } from '../ui/Input'
import { DEFAULT_CATEGORIES, getMonthRange } from '../../lib/utils'

export function ExpenseList() {
  const { currentFamily, getFamilyMembers } = useFamily()
  const [members, setMembers] = useState([])
  const [filters, setFilters] = useState({
    startDate: getMonthRange().start,
    endDate: getMonthRange().end,
    category: '',
    memberId: '',
  })
  const [editingExpense, setEditingExpense] = useState(null)

  const { expenses, loading, deleteExpense, updateExpense } = useExpenses(filters)

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

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  async function handleDelete(id) {
    try {
      await deleteExpense(id)
    } catch (err) {
      alert('Error deleting expense: ' + err.message)
    }
  }

  async function handleUpdate(id, data) {
    try {
      await updateExpense(id, data)
      setEditingExpense(null)
    } catch (err) {
      alert('Error updating expense: ' + err.message)
    }
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">History</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {DEFAULT_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </Select>
          <Select
            value={filters.memberId}
            onChange={(e) => handleFilterChange('memberId', e.target.value)}
          >
            <option value="">All Members</option>
            {members.map(member => (
              <option key={member.user_id} value={member.user_id}>
                {member.display_name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>No expenses found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map(expense => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={setEditingExpense}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onSave={handleUpdate}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  )
}
