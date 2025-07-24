import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      price_surveys: {
        Row: {
          id: string
          market_id: number
          commodity_id: number
          price: number
          stock_status: string
          quality: string
          notes?: string
          survey_date: string
          operator_name: string
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const pathname = url.pathname
    const searchParams = url.searchParams

    console.log(`API Request: ${req.method} ${pathname}`)

    // GET /commodity-api/prices - Get all price surveys
    if (req.method === 'GET' && pathname.endsWith('/prices')) {
      const market_id = searchParams.get('market_id')
      const commodity_id = searchParams.get('commodity_id')
      const date_from = searchParams.get('date_from')
      const date_to = searchParams.get('date_to')
      const limit = searchParams.get('limit') || '100'

      let query = supabaseClient
        .from('price_surveys')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(parseInt(limit))

      if (market_id) {
        query = query.eq('market_id', parseInt(market_id))
      }
      
      if (commodity_id) {
        query = query.eq('commodity_id', parseInt(commodity_id))
      }

      if (date_from) {
        query = query.gte('survey_date', date_from)
      }

      if (date_to) {
        query = query.lte('survey_date', date_to)
      }

      const { data, error } = await query

      if (error) {
        console.error('Database error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch price data', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: data,
          count: data?.length || 0,
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /commodity-api/latest - Get latest prices per commodity
    if (req.method === 'GET' && pathname.endsWith('/latest')) {
      const market_id = searchParams.get('market_id')

      let query = `
        SELECT DISTINCT ON (commodity_id, market_id) 
          commodity_id, market_id, price, stock_status, quality, survey_date, created_at
        FROM price_surveys
      `
      
      if (market_id) {
        query += ` WHERE market_id = ${parseInt(market_id)}`
      }
      
      query += ` ORDER BY commodity_id, market_id, created_at DESC`

      const { data, error } = await supabaseClient.rpc('execute_custom_query', {
        query_text: query
      })

      if (error) {
        console.error('Database error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch latest prices', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: data,
          count: data?.length || 0,
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /commodity-api/prices - Add new price survey
    if (req.method === 'POST' && pathname.endsWith('/prices')) {
      const body = await req.json()
      
      const requiredFields = ['market_id', 'commodity_id', 'price', 'stock_status', 'quality', 'survey_date', 'operator_name']
      const missingFields = requiredFields.filter(field => !body[field])
      
      if (missingFields.length > 0) {
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields', 
            missing_fields: missingFields 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data, error } = await supabaseClient
        .from('price_surveys')
        .insert([{
          market_id: body.market_id,
          commodity_id: body.commodity_id,
          price: body.price,
          stock_status: body.stock_status,
          quality: body.quality,
          notes: body.notes || null,
          survey_date: body.survey_date,
          operator_name: body.operator_name
        }])
        .select()

      if (error) {
        console.error('Insert error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to insert price data', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: data[0],
          message: 'Price survey added successfully'
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /commodity-api/stats - Get price statistics
    if (req.method === 'GET' && pathname.endsWith('/stats')) {
      const commodity_id = searchParams.get('commodity_id')
      const market_id = searchParams.get('market_id')
      const period = searchParams.get('period') || '30' // days

      let baseQuery = supabaseClient
        .from('price_surveys')
        .select('price, created_at')
        .gte('created_at', new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString())

      if (commodity_id) {
        baseQuery = baseQuery.eq('commodity_id', parseInt(commodity_id))
      }

      if (market_id) {
        baseQuery = baseQuery.eq('market_id', parseInt(market_id))
      }

      const { data, error } = await baseQuery

      if (error) {
        console.error('Stats error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch statistics', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (!data || data.length === 0) {
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              count: 0,
              avg_price: 0,
              min_price: 0,
              max_price: 0,
              period_days: parseInt(period)
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const prices = data.map(item => item.price)
      const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            count: data.length,
            avg_price: Math.round(avgPrice),
            min_price: minPrice,
            max_price: maxPrice,
            period_days: parseInt(period)
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If no route matches
    return new Response(
      JSON.stringify({ 
        error: 'Not found',
        available_endpoints: [
          'GET /commodity-api/prices',
          'POST /commodity-api/prices', 
          'GET /commodity-api/latest',
          'GET /commodity-api/stats'
        ]
      }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unhandled error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})