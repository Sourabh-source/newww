"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface UserProfile {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: "citizen" | "officer" | "admin"
  aadhaar_verified: boolean
  created_at: string
  updated_at: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetchUser() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          throw userError
        }

        setUser(user)

        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

          if (profileError && profileError.code !== "PGRST116") {
            console.error("Error fetching profile:", profileError)
          }

          if (profileData) {
            setProfile(profileData as UserProfile)
          }
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (profileData) {
            setProfile(profileData as UserProfile)
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error("Not authenticated") }

    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      return { error }
    }

    setProfile(data as UserProfile)
    return { data }
  }

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  const getDisplayName = () => {
    return profile?.full_name || user?.email?.split("@")[0] || "User"
  }

  return {
    user,
    profile,
    loading,
    error,
    updateProfile,
    getInitials,
    getDisplayName,
    isAuthenticated: !!user,
  }
}
