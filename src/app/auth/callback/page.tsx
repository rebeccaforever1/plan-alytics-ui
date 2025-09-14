'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function Callback() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    })
  }, [router])

  return <p className="text-center p-8">Logging you in...</p>
}
