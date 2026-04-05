import { useState, useCallback } from 'react'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
  id: number
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, id: Date.now() })
  }, [])

  const clearToast = useCallback(() => setToast(null), [])

  return { toast, showToast, clearToast }
}
