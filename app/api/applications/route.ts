import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = supabase
      .from("applications")
      .select("*, schemes(name, ministry, category)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data: applications, error } = await query

    if (error) {
      console.error("Error fetching applications:", error)
      return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
    }

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Error in applications API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { scheme_id, form_data, documents } = body

    if (!scheme_id) {
      return NextResponse.json(
        { error: "Scheme ID is required" },
        { status: 400 }
      )
    }

    const { data: application, error } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        scheme_id,
        status: "draft",
        form_data,
        documents,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating application:", error)
      return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
    }

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    console.error("Error in applications API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, form_data, documents } = body

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 })
    }

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (status) updateData.status = status
    if (form_data) updateData.form_data = form_data
    if (documents) updateData.documents = documents

    // If submitting, set submitted_at
    if (status === "submitted") {
      updateData.submitted_at = new Date().toISOString()
    }

    const { data: application, error } = await supabase
      .from("applications")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating application:", error)
      return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error("Error in applications API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
