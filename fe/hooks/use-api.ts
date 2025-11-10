"use client"

import { useState, useCallback } from "react"

export function useApi<T>(asyncFunction: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFunction()
      setData(result)
      return result
    } catch (err: any) {
      const message = err.message || "An error occurred"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [asyncFunction])

  return { data, loading, error, execute }
}
