import type { Card, Rating, FSRSState } from '@/types'

const W = [
  0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651, 0.0589,
  1.469, 0.1544, 1.007, 1.9395, 0.11, 0.29, 2.27, 0.25, 2.9898,
]
const DECAY = -0.5
const FACTOR = 0.9 ** (1 / DECAY) - 1
const REQUEST_RETENTION = 0.9

function forgettingCurve(elapsedDays: number, stability: number) {
  return (1 + (FACTOR * elapsedDays) / stability) ** DECAY
}

function initStability(rating: Rating): number {
  return Math.max(W[rating - 1], 0.1)
}

function initDifficulty(rating: Rating): number {
  return Math.min(Math.max(W[4] - Math.exp(W[5] * (rating - 1)) + 1, 1), 10)
}

function nextInterval(stability: number): number {
  const interval = (stability / FACTOR) * (REQUEST_RETENTION ** (1 / DECAY) - 1)
  return Math.max(Math.round(interval), 1)
}

function nextDifficulty(d: number, rating: Rating): number {
  const delta = W[6] * (rating === 1 ? -W[7] : rating === 2 ? 0 : rating === 3 ? W[7] : W[7] * 2)
  const mean = W[4]
  return Math.min(Math.max(d - delta + W[6] * (mean - d) * 0.1, 1), 10)
}

function nextRecallStability(d: number, s: number, r: number, rating: Rating): number {
  const hardPenalty = rating === 2 ? W[15] : 1
  const easyBonus = rating === 4 ? W[16] : 1
  return s * (Math.exp(W[8]) * (11 - d) * s ** -W[9] * (Math.exp((1 - r) * W[10]) - 1) * hardPenalty * easyBonus + 1)
}

function nextForgetStability(d: number, s: number, r: number): number {
  return W[11] * d ** -W[12] * ((s + 1) ** W[13] - 1) * Math.exp((1 - r) * W[14])
}

export function scheduleCard(card: Card, rating: Rating, now = new Date()): Partial<Card> {
  const state = card.fsrs_state as FSRSState
  let stability = card.fsrs_stability
  let difficulty = card.fsrs_difficulty
  let reps = card.fsrs_reps
  let lapses = card.fsrs_lapses
  let newState: FSRSState

  const lastReview = card.last_reviewed_at ? new Date(card.last_reviewed_at) : now
  const elapsedDays = Math.max(0, (now.getTime() - lastReview.getTime()) / 86400000)
  const retrievability = state === 'new' ? 0 : forgettingCurve(elapsedDays, stability)

  if (state === 'new') {
    stability = initStability(rating)
    difficulty = initDifficulty(rating)
    newState = rating === 1 ? 'learning' : 'review'
    reps = 1
  } else if (state === 'learning' || state === 'relearning') {
    if (rating === 1) {
      stability = initStability(1)
      newState = 'relearning'
      lapses++
    } else {
      stability = nextRecallStability(difficulty, stability, retrievability, rating)
      difficulty = nextDifficulty(difficulty, rating)
      newState = 'review'
      reps++
    }
  } else {
    // review
    if (rating === 1) {
      stability = nextForgetStability(difficulty, stability, retrievability)
      difficulty = nextDifficulty(difficulty, rating)
      newState = 'relearning'
      lapses++
    } else {
      stability = nextRecallStability(difficulty, stability, retrievability, rating)
      difficulty = nextDifficulty(difficulty, rating)
      newState = 'review'
      reps++
    }
  }

  const intervalDays = newState === 'learning' || newState === 'relearning'
    ? rating === 1 ? 0 : 1
    : nextInterval(stability)

  const dueDate = new Date(now)
  dueDate.setDate(dueDate.getDate() + intervalDays)

  return {
    fsrs_stability: parseFloat(stability.toFixed(4)),
    fsrs_difficulty: parseFloat(difficulty.toFixed(4)),
    fsrs_reps: reps,
    fsrs_lapses: lapses,
    fsrs_state: newState,
    due_date: dueDate.toISOString(),
    last_reviewed_at: now.toISOString(),
  }
}

export function isDue(card: Card): boolean {
  return new Date(card.due_date) <= new Date()
}

export function getDueCards(cards: Card[]): Card[] {
  return cards.filter(isDue).sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  )
}

export function getRetention(card: Card): number {
  if (card.fsrs_state === 'new') return 0
  const last = card.last_reviewed_at ? new Date(card.last_reviewed_at) : new Date(card.created_at)
  const elapsed = (Date.now() - last.getTime()) / 86400000
  return forgettingCurve(elapsed, card.fsrs_stability)
}
