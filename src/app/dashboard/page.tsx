'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const [gmailConnected, setGmailConnected] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/gmail/status')
      .then(r => r.json())
      .then(data => setGmailConnected(data.connected))
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-96">
        <CardHeader><CardTitle>InboxPilot</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {gmailConnected === null && <p className="text-muted-foreground">Checking Gmail connection...</p>}
          {gmailConnected === false && (
            <div className="space-y-2">
              <p className="text-muted-foreground">Connect your Gmail to get started</p>
              <Button className="w-full" onClick={() => window.location.href = '/api/auth/gmail'}>
                Connect Gmail
              </Button>
            </div>
          )}
          {gmailConnected === true && (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">Gmail connected</p>
              <p className="text-muted-foreground">Dashboard coming in Step 6</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
