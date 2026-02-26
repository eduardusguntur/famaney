import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useFamily } from '../context/FamilyContext'
import { useAuth } from '../context/AuthContext'

export function useExpenses(options = {}) {
  const { user } = useAuth()
  const { currentFamily } = useFamily()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { startDate, endDate, category, memberId } = options

  const loadExpenses = useCallback(async () => {
    if (!currentFamily) {
      setExpenses([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('expenses')
        .select(`
          *,
          user:users(id, name, avatar_url)
        `)
        .eq('family_id', currentFamily.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (startDate) {
        query = query.gte('date', startDate)
      }
      if (endDate) {
        query = query.lte('date', endDate)
      }
      if (category) {
        query = query.eq('category', category)
      }
      if (memberId) {
        query = query.eq('user_id', memberId)
      }

      const { data, error: queryError } = await query

      if (queryError) throw queryError

      // Get display names for each expense
      const expensesWithNames = await Promise.all(
        (data || []).map(async (expense) => {
          const { data: memberData } = await supabase
            .from('family_members')
            .select('display_name')
            .eq('family_id', currentFamily.id)
            .eq('user_id', expense.user_id)
            .single()

          return {
            ...expense,
            display_name: memberData?.display_name || expense.user?.name || 'Unknown',
          }
        })
      )

      setExpenses(expensesWithNames)
    } catch (err) {
      console.error('Error loading expenses:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [currentFamily?.id, startDate, endDate, category, memberId])

  useEffect(() => {
    loadExpenses()
  }, [loadExpenses])

  async function addExpense({ category, amount, note, date }) {
    if (!currentFamily || !user) {
      throw new Error('No family selected')
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        family_id: currentFamily.id,
        user_id: user.id,
        category,
        amount: parseInt(amount, 10),
        note: note || null,
        date,
      })
      .select()
      .single()

    if (error) throw error

    await loadExpenses()
    return data
  }

  async function updateExpense(id, updates) {
    const { data, error } = await supabase
      .from('expenses')
      .update({
        category: updates.category,
        amount: parseInt(updates.amount, 10),
        note: updates.note || null,
        date: updates.date,
      })
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update own expenses
      .select()
      .single()

    if (error) throw error

    await loadExpenses()
    return data
  }

  async function deleteExpense(id) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only delete own expenses

    if (error) throw error

    await loadExpenses()
  }

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refresh: loadExpenses,
  }
}
