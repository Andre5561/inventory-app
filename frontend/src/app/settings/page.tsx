'use client'

import { Check, Globe2, Save, WalletCards } from 'lucide-react'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import styles from './Settings.module.css'

type SettingsState = {
  language: string
  currency: string
  notifications: boolean
}

const defaultSettings: SettingsState = {
  language: 'Русский',
  currency: 'UAH',
  notifications: true,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem('inventory-settings')

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const saveSettings = () => {
    localStorage.setItem('inventory-settings', JSON.stringify(settings))
    setIsSaved(true)

    window.setTimeout(() => {
      setIsSaved(false)
    }, 2500)
  }

  return (
    <DashboardLayout activePage="settings">
      <h1 className={styles.pageTitle}>Настройки</h1>

      <section className={styles.card}>
        <div className={styles.cardTitle}>
          <Globe2 size={21} />
          <div>
            <h2>Общие настройки</h2>
            <p>Персонализируйте интерфейс приложения.</p>
          </div>
        </div>

        <label className={styles.field}>
          <span>Язык интерфейса</span>

          <select
            value={settings.language}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                language: event.target.value,
              }))
            }
          >
            <option>Русский</option>
            <option>Українська</option>
            <option>English</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Основная валюта</span>

          <select
            value={settings.currency}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                currency: event.target.value,
              }))
            }
          >
            <option value="UAH">UAH — Украинская гривна</option>
            <option value="USD">USD — Доллар США</option>
            <option value="EUR">EUR — Евро</option>
          </select>
        </label>
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitle}>
          <WalletCards size={21} />
          <div>
            <h2>Уведомления</h2>
            <p>Управление системными уведомлениями.</p>
          </div>
        </div>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                notifications: event.target.checked,
              }))
            }
          />

          <span>
            <strong>Получать уведомления</strong>
            <small>О новых приходах и изменениях продуктов.</small>
          </span>
        </label>
      </section>

      <button className={styles.saveButton} onClick={saveSettings}>
        {isSaved ? <Check size={18} /> : <Save size={18} />}
        {isSaved ? 'Сохранено' : 'Сохранить настройки'}
      </button>
    </DashboardLayout>
  )
}