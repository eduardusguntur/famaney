import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { generateInviteCode } from '../lib/utils'

const FamilyContext = createContext({})

export function FamilyProvider({ children }) {
  const { user } = useAuth()
  const [families, setFamilies] = useState([])
  const [currentFamily, setCurrentFamily] = useState(null)
  const [currentMembership, setCurrentMembership] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadFamilies()
    } else {
      setFamilies([])
      setCurrentFamily(null)
      setCurrentMembership(null)
      setLoading(false)
    }
  }, [user])

  async function loadFamilies() {
    setLoading(true)
    try {
      // Get all family memberships for this user with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      const { data: memberships, error: membershipsError } = await supabase
        .from('family_members')
        .select(`
          *,
          family:families(*)
        `)
        .eq('user_id', user.id)
        .abortSignal(controller.signal)

      clearTimeout(timeoutId)

      if (membershipsError) throw membershipsError

      const familyList = memberships?.map(m => ({
        ...m.family,
        membership: {
          id: m.id,
          display_name: m.display_name,
          role: m.role,
          joined_at: m.joined_at,
        }
      })) || []

      setFamilies(familyList)

      // Restore last selected family from localStorage or use first one
      const lastFamilyId = localStorage.getItem('currentFamilyId')
      const savedFamily = familyList.find(f => f.id === lastFamilyId)

      if (savedFamily) {
        setCurrentFamily(savedFamily)
        setCurrentMembership(savedFamily.membership)
      } else if (familyList.length > 0) {
        setCurrentFamily(familyList[0])
        setCurrentMembership(familyList[0].membership)
      }
    } catch (error) {
      console.error('Error loading families:', error)
    } finally {
      setLoading(false)
    }
  }

  async function createFamily(name, displayName) {
    const inviteCode = generateInviteCode()

    // Create family
    const { data: family, error: familyError } = await supabase
      .from('families')
      .insert({
        name,
        invite_code: inviteCode,
        owner_id: user.id,
      })
      .select()
      .single()

    if (familyError) throw familyError

    // Add user as owner member
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        family_id: family.id,
        user_id: user.id,
        display_name: displayName,
        role: 'owner',
      })

    if (memberError) throw memberError

    await loadFamilies()
    switchFamily(family.id)

    return family
  }

  async function joinFamily(inviteCode, displayName) {
    // Find family by invite code
    const { data: family, error: findError } = await supabase
      .from('families')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .single()

    if (findError || !family) {
      throw new Error('Family not found. Please check the invite code.')
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from('family_members')
      .select('id')
      .eq('family_id', family.id)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      throw new Error('You are already a member of this family.')
    }

    // Add as member
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        family_id: family.id,
        user_id: user.id,
        display_name: displayName,
        role: 'member',
      })

    if (memberError) throw memberError

    await loadFamilies()
    switchFamily(family.id)

    return family
  }

  function switchFamily(familyId) {
    const family = families.find(f => f.id === familyId)
    if (family) {
      setCurrentFamily(family)
      setCurrentMembership(family.membership)
      localStorage.setItem('currentFamilyId', familyId)
    }
  }

  async function updateDisplayName(newName) {
    if (!currentMembership) return

    const { error } = await supabase
      .from('family_members')
      .update({ display_name: newName })
      .eq('id', currentMembership.id)

    if (error) throw error

    await loadFamilies()
  }

  async function getFamilyMembers() {
    if (!currentFamily) return []

    const { data, error } = await supabase
      .from('family_members')
      .select(`
        *,
        user:users(*)
      `)
      .eq('family_id', currentFamily.id)

    if (error) throw error
    return data || []
  }

  const value = {
    families,
    currentFamily,
    currentMembership,
    loading,
    createFamily,
    joinFamily,
    switchFamily,
    updateDisplayName,
    getFamilyMembers,
    refreshFamilies: loadFamilies,
  }

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  )
}

export function useFamily() {
  const context = useContext(FamilyContext)
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider')
  }
  return context
}
