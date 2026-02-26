import { useState, useEffect, useMemo } from 'react'
import { useExpenses } from '../../hooks/useExpenses'
import { useFamily } from '../../hooks/useFamily'
import { Summary } from './Summary'
import { CategoryPieChart } from './PieChart'
import { DailyBarChart } from './BarChart'
import { MemberBreakdown } from './MemberBreakdown'
import { getMonthRange, getPreviousMonthRange, formatCurrency } from '../../lib/utils'

export function Dashboard() {
  const { currentFamily, getFamilyMembers } = useFamily()
  const [members, setMembers] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  const monthRange = useMemo(() => getMonthRange(selectedMonth), [selectedMonth])
  const prevMonthRange = useMemo(() => getPreviousMonthRange(selectedMonth), [selectedMonth])

  const { expenses: currentExpenses, loading } = useExpenses({
    startDate: monthRange.start,
    endDate: monthRange.end,
  })

  const { expenses: prevExpenses } = useExpenses({
    startDate: prevMonthRange.start,
    endDate: prevMonthRange.end,
  })

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

  const currentTotal = useMemo(() =>
    currentExpenses.reduce((sum, e) => sum + e.amount, 0),
    [currentExpenses]
  )

  const prevTotal = useMemo(() =>
    prevExpenses.reduce((sum, e) => sum + e.amount, 0),
    [prevExpenses]
  )

  const categoryData = useMemo(() => {
    const grouped = {}
    currentExpenses.forEach(e => {
      if (!grouped[e.category]) {
        grouped[e.category] = 0
      }
      grouped[e.category] += e.amount
    })
    return Object.entries(grouped).map(([category, amount]) => ({
      category,
      amount,
    }))
  }, [currentExpenses])

  const dailyData = useMemo(() => {
    const grouped = {}
    currentExpenses.forEach(e => {
      if (!grouped[e.date]) {
        grouped[e.date] = 0
      }
      grouped[e.date] += e.amount
    })
    return Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [currentExpenses])

  const memberData = useMemo(() => {
    const grouped = {}
    currentExpenses.forEach(e => {
      if (!grouped[e.user_id]) {
        grouped[e.user_id] = {
          userId: e.user_id,
          displayName: e.display_name,
          amount: 0,
          count: 0,
        }
      }
      grouped[e.user_id].amount += e.amount
      grouped[e.user_id].count += 1
    })
    return Object.values(grouped).sort((a, b) => b.amount - a.amount)
  }, [currentExpenses])

  function handlePrevMonth() {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1))
  }

  function handleNextMonth() {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1))
  }

  const monthLabel = selectedMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>

      {/* Month Selector */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-medium text-gray-900">{monthLabel}</span>
        <button
          onClick={handleNextMonth}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Summary */}
      <Summary
        total={currentTotal}
        prevTotal={prevTotal}
        transactionCount={currentExpenses.length}
      />

      {/* Charts */}
      <div className="space-y-6 mt-6">
        <CategoryPieChart data={categoryData} />
        <DailyBarChart data={dailyData} />
        <MemberBreakdown data={memberData} total={currentTotal} />
      </div>
    </div>
  )
}
