import { useState, useCallback, useEffect } from 'react'
import type { GeneratedOutput, InputMetadata } from '../engine/types'

export interface HistoryEntry {
  id: string
  createdAt: string          // ISO timestamp
  storyPreview: string       // First 80 chars of the story text
  metadata: InputMetadata
  output: GeneratedOutput
}

const STORAGE_KEY = 'tcf-history'
const MAX_ENTRIES = 20

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // Storage quota exceeded — drop oldest
    const trimmed = entries.slice(0, Math.floor(MAX_ENTRIES / 2))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory)

  // Persist whenever history changes
  useEffect(() => {
    saveHistory(history)
  }, [history])

  const addEntry = useCallback((storyText: string, metadata: InputMetadata, output: GeneratedOutput) => {
    const entry: HistoryEntry = {
      id: `h-${Date.now()}`,
      createdAt: new Date().toISOString(),
      storyPreview: storyText.replace(/\s+/g, ' ').trim().slice(0, 80),
      metadata,
      output,
    }
    setHistory(prev => [entry, ...prev].slice(0, MAX_ENTRIES))
  }, [])

  const removeEntry = useCallback((id: string) => {
    setHistory(prev => prev.filter(e => e.id !== id))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return { history, addEntry, removeEntry, clearHistory }
}
