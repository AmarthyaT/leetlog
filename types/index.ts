export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type CardStatus = 'pending' | 'generating' | 'ready' | 'failed'
export type FSRSState = 'new' | 'learning' | 'review' | 'relearning'
export type Rating = 1 | 2 | 3 | 4

export interface Profile {
  id: string
  leetcode_username: string | null
  groq_api_key: string | null
  email_notifications: boolean
  last_sync_at: string | null
  last_submission_timestamp: number
}

export interface Card {
  id: string
  user_id: string
  problem_id: number
  problem_title: string
  problem_slug: string
  difficulty: Difficulty | null
  lc_topic_tags: string[]
  submitted_code: string | null
  language: string | null
  card_status: CardStatus
  pattern_tags: string[]
  core_intuition: string | null
  approach_summary: string | null
  optimal_approach: string | null
  time_complexity: string | null
  space_complexity: string | null
  gotchas: string[]
  struggle_assessment: string | null
  fsrs_stability: number
  fsrs_difficulty: number
  fsrs_reps: number
  fsrs_lapses: number
  fsrs_state: FSRSState
  due_date: string
  last_reviewed_at: string | null
  created_at: string
  updated_at: string
}

export interface ReviewLog {
  id: string
  card_id: string
  user_id: string
  rating: Rating
  reviewed_at: string
}

export const PATTERN_COLORS: Record<string, { bg: string; text: string }> = {
  'Two Pointers':       { bg: '#1e3a5f', text: '#60a5fa' },
  'Sliding Window':     { bg: '#1a3a2a', text: '#4ade80' },
  'Binary Search':      { bg: '#2d1b4e', text: '#a78bfa' },
  'Hash Map':           { bg: '#3b2a1a', text: '#fb923c' },
  'Stack':              { bg: '#1f2937', text: '#9ca3af' },
  'Queue':              { bg: '#1c2b3a', text: '#7dd3fc' },
  'Monotonic Stack':    { bg: '#2a1f37', text: '#c084fc' },
  'Heap':               { bg: '#3a2020', text: '#f87171' },
  'Trie':               { bg: '#1a3030', text: '#5eead4' },
  'Graph BFS':          { bg: '#1e3040', text: '#38bdf8' },
  'Graph DFS':          { bg: '#152535', text: '#0ea5e9' },
  'Topological Sort':   { bg: '#2a2a10', text: '#facc15' },
  'Union Find':         { bg: '#3a1a2a', text: '#f472b6' },
  'Dynamic Programming':{ bg: '#2d1b4e', text: '#818cf8' },
  'Backtracking':       { bg: '#3a2010', text: '#fb923c' },
  'Greedy':             { bg: '#1a3a1a', text: '#86efac' },
  'Divide and Conquer': { bg: '#1a2a3a', text: '#93c5fd' },
  'Bit Manipulation':   { bg: '#2a2a2a', text: '#d1d5db' },
  'Math':               { bg: '#3a3a10', text: '#fde68a' },
  'Linked List':        { bg: '#3a1a1a', text: '#fca5a5' },
  'Tree BFS':           { bg: '#1a3520', text: '#6ee7b7' },
  'Tree DFS':           { bg: '#102a15', text: '#4ade80' },
  'Prefix Sum':         { bg: '#2a1a3a', text: '#d8b4fe' },
  'Matrix':             { bg: '#1a2a2a', text: '#67e8f9' },
  'Segment Tree':       { bg: '#3a2a10', text: '#fed7aa' },
}
