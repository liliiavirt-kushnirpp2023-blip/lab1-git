<template>
  <div class="app">
    <header>
      <h1>Мої тренування</h1>
      <p class="subtitle">
        Відстежуй свій прогрес щодня
      </p>
    </header>

    <form
      class="form"
      @submit.prevent="handleAdd"
    >
      <input
        v-model="newType"
        data-testid="workout-input"
        placeholder="Тип тренування (йога, біг...)"
        class="input"
      />
      <input
        v-model="newDuration"
        data-testid="duration-input"
        type="number"
        placeholder="Тривалість (хв)"
        class="input"
      />
      <input
        v-model="newDate"
        data-testid="date-input"
        type="date"
        class="input"
      />
      <button
        type="submit"
        data-testid="add-button"
        class="btn"
      >
        + Додати
      </button>
    </form>

    <button
      v-if="showUrgentFilter"
      class="urgent-btn"
    >
    Тільки термінові
    </button>

    <p
      v-if="workouts.length === 0"
      data-testid="empty-message"
      class="empty"
    >
      Тренувань ще немає. Додай перше!
    </p>

    <ul class="list">
      <li
        v-for="workout in workouts"
        :key="workout.id"
        data-testid="workout-item"
        :class="['card', { done: workout.completed }]"
      >
        <div class="card-info">
          <span
            class="card-type"
            @click="handleToggle(workout.id)"
          >
            {{ workout.type }}
          </span>
          <span class="card-meta">{{ workout.duration }} хв · {{ workout.date }}</span>
        </div>
        <button
          data-testid="delete-button"
          class="delete"
          @click="handleRemove(workout.id)"
        >
          ✕
        </button>
      </li>
    </ul>

    <div
      v-if="workouts.length > 0"
      class="stats"
      data-testid="stats"
    >
      <span>{{ completedCount }} / {{ totalCount }} виконано</span>
      <span>⏱ {{ getTotalMinutes() }} хв загалом</span>
    </div>
  </div>
  <footer class="footer">
    <span>Режим: {{ appStatus }}</span>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import posthog from 'posthog-js'
import { useWorkouts } from './composables/useWorkouts'

const appStatus = import.meta.env.VITE_APP_STATUS

const { workouts, addWorkout, removeWorkout, toggleWorkout,
        getTotalMinutes, completedCount, totalCount } = useWorkouts()

const newType = ref('')
const newDuration = ref('')
const newDate = ref('')
const showUrgentFilter = ref(false)

onMounted(() => {
  posthog.onFeatureFlags(() => {
    showUrgentFilter.value = posthog.isFeatureEnabled('show-urgent-filter')
  })
})

function handleAdd() {
  const result = addWorkout(newType.value, newDuration.value, newDate.value)
  if (result) {
    posthog.capture('workout_created', {
      type: newType.value,
      duration: newDuration.value,
    })
    newType.value = ''
    newDuration.value = ''
    newDate.value = ''
  }
}

function handleRemove(id) {
  removeWorkout(id)
  posthog.capture('workout_deleted')
}

function handleToggle(id) {
  toggleWorkout(id)
  posthog.capture('workout_completed')
}
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #f4ffe6;
  font-family: 'Segoe UI', sans-serif;
  color: #2d2d2d;
}

.app {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 20px;
}

header {
  text-align: center;
  margin-bottom: 32px;
}

h1 {
  font-size: 2rem;
  color: #5a8a00;
}

.subtitle {
  color: #88aa44;
  margin-top: 6px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.input {
  padding: 12px 16px;
  border: 2px solid #c8e89a;
  border-radius: 12px;
  background: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}

.input:focus { border-color: #88cc00; }

.btn {
  padding: 12px;
  background: #a8d800;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn:hover { background: #88aa00; }

.urgent-btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 16px;
  background: #ff6b35;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.urgent-btn:hover { background: #e55a25; }

.empty {
  text-align: center;
  color: #99bb55;
  padding: 40px 0;
  font-size: 1.1rem;
}

.list { list-style: none; display: flex; flex-direction: column; gap: 12px; }

.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 2px solid #d4f0a0;
  border-radius: 14px;
  padding: 16px 20px;
  transition: all 0.2s;
}

.card.done { opacity: 0.5; text-decoration: line-through; }

.card-info { display: flex; flex-direction: column; gap: 4px; }

.card-type {
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  color: #bbf969;
}

.card-meta { font-size: 0.85rem; color: #88aa44; }

.delete {
  background: #f0ffe0;
  border: 1px solid #c8e89a;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  color: #88aa44;
  transition: all 0.2s;
}

.delete:hover { background: #ffeeee; border-color: #ffaaaa; color: #cc4444; }

.stats {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  background: #eeffcc;
  border-radius: 12px;
  padding: 14px 20px;
  color: #5a8a00;
  font-weight: 500;
}

.footer {
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  background: #d4f0a0;
  border-radius: 8px;
  color: #5a8a00;
  font-size: 0.85rem;
}
</style>
