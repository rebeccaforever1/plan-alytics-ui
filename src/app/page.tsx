'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // only run redirect if we’re at root "/"
    if (pathname === '/') {
      const checkSession = async () => {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          router.replace('/dashboard')
        } else {
          router.replace('/login')
        }
      }

      checkSession()
    }
  }, [router, pathname])

  return pathname === '/' ? <p>Redireczzzzzting...</p> : null
}
