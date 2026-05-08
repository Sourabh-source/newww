import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("schemes")
      .select("*", { count: "exact" })
      .order("name")
      .range(offset, offset + limit - 1)

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: schemes, error, count } = await query

    if (error) {
      console.error("Error fetching schemes:", error)
      return NextResponse.json({ error: "Failed to fetch schemes" }, { status: 500 })
    }

    return NextResponse.json({ 
      schemes, 
      total: count,
      limit,
      offset
    })
  } catch (error) {
    console.error("Error in schemes API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin (you'd need to implement admin check)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      name, 
      description, 
      ministry, 
      category, 
      eligibility_criteria,
      benefits,
      documents_required,
      application_process,
      deadline
    } = body

    if (!name || !ministry || !category) {
      return NextResponse.json(
        { error: "Name, ministry, and category are required" },
        { status: 400 }
      )
    }

    const { data: scheme, error } = await supabase
      .from("schemes")
      .insert({
        name,
        description,
        ministry,
        category,
        eligibility_criteria,
        benefits,
        documents_required,
        application_process,
        deadline,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating scheme:", error)
      return NextResponse.json({ error: "Failed to create scheme" }, { status: 500 })
    }

    return NextResponse.json({ scheme }, { status: 201 })
  } catch (error) {
    console.error("Error in schemes API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
