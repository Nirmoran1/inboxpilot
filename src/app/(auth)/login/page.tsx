'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (!error) setSent(true)
  }

  if (sent) return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-96">
        <CardContent className="pt-6 text-center">
          <p className="text-lg">Check your email for a login link</p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-96">
        <CardHeader><CardTitle>InboxPilot</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          <Button className="w-full" onClick={handleLogin}>Send magic link</Button>
        </CardContent>
      </Card>
    </div>
  )
}
