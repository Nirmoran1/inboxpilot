import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { exchangeCodeForTokens } from '@/lib/gmail'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,  // service key for writing gmail_tokens
    { cookies: { getAll: () => cookieStore.getAll(), setAll: (cookies) => cookies.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } }
  )

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const userId = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !userId) {
    return NextResponse.redirect(new URL('/dashboard?error=gmail_auth_failed', request.url))
  }

  try {
    const tokens = await exchangeCodeForTokens(code)

    // Store tokens in Supabase (service key bypasses RLS on gmail_tokens)
    await supabase.from('gmail_tokens').upsert({
      user_id: userId,
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token ?? null,
      token_expiry: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })

    return NextResponse.redirect(new URL('/dashboard?connected=true', request.url))
  } catch (err) {
    console.error('Gmail OAuth callback error:', err)
    return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', request.url))
  }
}
