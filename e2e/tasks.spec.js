import { test, expect } from '@playwright/test'

test.describe('Трекер тренувань — критичний шлях', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('успішно додає нове тренування', async ({ page }) => {
    await page.getByTestId('workout-input').fill('Йога')
    await page.getByTestId('duration-input').fill('60')
    await page.getByTestId('date-input').fill('2026-03-01')
    await page.getByTestId('add-button').click()
    await expect(page.getByTestId('workout-item')).toBeVisible()
    await expect(page.getByTestId('workout-item')).toContainText('Йога')
  })

  test('не додає тренування з порожніми полями', async ({ page }) => {
    await page.getByTestId('add-button').click()
    await expect(page.getByTestId('empty-message')).toBeVisible()
  })

  test('видаляє тренування', async ({ page }) => {
    await page.getByTestId('workout-input').fill('Біг')
    await page.getByTestId('duration-input').fill('30')
    await page.getByTestId('date-input').fill('2026-03-01')
    await page.getByTestId('add-button').click()
    await page.getByTestId('delete-button').click()
    await expect(page.getByTestId('empty-message')).toBeVisible()
  })
})