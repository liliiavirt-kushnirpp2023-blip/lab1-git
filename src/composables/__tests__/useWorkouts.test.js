import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useWorkouts } from '../useWorkouts'

describe('useWorkouts', () => {
  let workouts, addWorkout, removeWorkout, toggleWorkout, getByType, getTotalMinutes, completedCount, totalCount // eslint-disable-line no-unused-vars

  beforeEach(() => {
    ({ workouts, addWorkout, removeWorkout, toggleWorkout,
       getByType, getTotalMinutes, completedCount, totalCount } = useWorkouts())
  })

  it('додає нове тренування з коректними даними', () => {
    const result = addWorkout('Йога', 60, '2026-03-01')
    expect(result).toBe(true)
    expect(workouts.value).toHaveLength(1)
    expect(workouts.value[0].type).toBe('Йога')
  })

  it('не додає тренування з порожнім типом', () => {
    const result = addWorkout('', 60, '2026-03-01')
    expect(result).toBe(false)
    expect(workouts.value).toHaveLength(0)
  })

  it('не додає тренування з нульовою тривалістю', () => {
    const result = addWorkout('Біг', 0, '2026-03-01')
    expect(result).toBe(false)
    expect(workouts.value).toHaveLength(0)
  })

  it('не додає тренування без дати', () => {
    const result = addWorkout('Біг', 30, '')
    expect(result).toBe(false)
    expect(workouts.value).toHaveLength(0)
  })

  it('видаляє тренування за id', () => {
    addWorkout('Йога', 45, '2026-03-01')
    const id = workouts.value[0].id
    const result = removeWorkout(id)
    expect(result).toBe(true)
    expect(workouts.value).toHaveLength(0)
  })

  it('повертає false при видаленні неіснуючого id', () => {
    const result = removeWorkout(9999)
    expect(result).toBe(false)
  })

  it('позначає тренування як виконане', () => {
    addWorkout('Пілатес', 50, '2026-03-01')
    const id = workouts.value[0].id
    toggleWorkout(id)
    expect(workouts.value[0].completed).toBe(true)
  })

  it('фільтрує тренування за типом', () => {
    addWorkout('Йога', 60, '2026-03-01')
    addWorkout('Біг', 30, '2026-03-02')
    addWorkout('Йога', 45, '2026-03-03')
    const yoga = getByType('Йога')
    expect(yoga).toHaveLength(2)
  })

  it('рахує загальну кількість хвилин', () => {
    addWorkout('Йога', 60, '2026-03-01')
    addWorkout('Біг', 30, '2026-03-02')
    expect(getTotalMinutes()).toBe(90)
  })

  it('використовує Date.now для id (spy mock)', () => {
    const mockDate = vi.spyOn(Date, 'now').mockReturnValue(12345)
    addWorkout('Стретчинг', 20, '2026-03-01')
    expect(workouts.value[0].id).toBe(12345)
    mockDate.mockRestore()
  })
})