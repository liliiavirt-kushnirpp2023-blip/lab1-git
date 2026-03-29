import { ref, computed } from 'vue'

export function useWorkouts() {
  const workouts = ref([])

  function addWorkout(type, duration, date) {
 if (!type || type.trim() === '') return false
    if (!duration || duration <= 0) return false
    if (!date) return false

    workouts.value.push({
      id: Date.now(),
      type: type.trim(),
      duration: Number(duration),
      date,
      completed: false,
    })
    return true
  }

  function removeWorkout(id) {
    const index = workouts.value.findIndex(w => w.id === id)
    if (index === -1) return false
    workouts.value.splice(index, 1)
    return true
  }

  function toggleWorkout(id) {
    const workout = workouts.value.find(w => w.id === id)
    if (!workout) return false
    workout.completed = !workout.completed
    return true
  }

  function getByType(type) {
    return workouts.value.filter(w => w.type === type)
  }

  function getTotalMinutes() {
    return workouts.value.reduce((sum, w) => sum + w.duration, 0)
  }

  const completedCount = computed(() =>
    workouts.value.filter(w => w.completed).length
  )
  const totalCount = computed(() => workouts.value.length)

  return {
    workouts, addWorkout, removeWorkout,
    toggleWorkout, getByType, getTotalMinutes,
    completedCount, totalCount
  }
}
