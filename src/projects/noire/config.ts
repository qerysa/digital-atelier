/** Shared, dependency-free settings for the Noiré scene and its player UI. */
export type Mood = 'amber' | 'midnight' | 'gold'

export const DURATION = 24

export interface MoodDef {
  bg: string
  key: string
  rimA: string
  rimB: string
  liquid: string
  glow: string
  env: number
  keyI: number
}

export const moods: Record<Mood, MoodDef> = {
  amber: { bg: '#0b0706', key: '#ffd6a8', rimA: '#ff7a2e', rimB: '#ffb36b', liquid: '#7a300a', glow: '#ff8a3a', env: 0.55, keyI: 130 },
  midnight: { bg: '#04060c', key: '#c9d5ff', rimA: '#3f57ff', rimB: '#8e7dff', liquid: '#1e1a5e', glow: '#6c5cff', env: 0.42, keyI: 120 },
  gold: { bg: '#0d0a05', key: '#fff1cf', rimA: '#ffc24d', rimB: '#ffe19b', liquid: '#a8701a', glow: '#ffcf6a', env: 0.75, keyI: 140 },
}

export interface NoireHandle {
  setMood(m: Mood): void
  setPlaying(p: boolean): void
  replay(): void
  seek(t: number): void
  setActive(a: boolean): void
  dispose(): void
}

