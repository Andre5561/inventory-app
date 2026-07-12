'use client'

import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addProduct } from '@/store/inventorySlice'
import type { AppDispatch } from '@/store/store'
import styles from './AddProductModal.module.css'

type AddProductModalProps = {
  isOpen: boolean
  orderId: number | null
  onClose: () => void
}

export default function AddProductModal({
  isOpen,
  orderId,
  onClose,
}: AddProductModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [title, setTitle] = useState('')
  const [serial, setSerial] = useState('')
  const [type, setType] = useState('Мониторы')
  const [error, setError] = useState('')

  if (!isOpen || !orderId) return null

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (title.trim().length < 3 || serial.trim().length < 3) {
      setError('Заполни название и серийный номер')
      return
    }

    dispatch(
      addProduct({
        orderId,
        title: title.trim(),
        serial: serial.trim(),
        type,
      })
    )

    setTitle('')
    setSerial('')
    setType('Мониторы')
    setError('')
    onClose()
  }

  return (
    <div className={styles.overlay}>
      <form className={styles.modal} onSubmit={submitForm}>
        <button className={styles.close} type="button" onClick={onClose}>
          <X size={21} />
        </button>

        <h2>Новый продукт</h2>

        <label className={styles.field}>
          Название продукта
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например, Dell UltraSharp U2723QE"
          />
        </label>

        <label className={styles.field}>
          Серийный номер
          <input
            value={serial}
            onChange={(event) => setSerial(event.target.value)}
            placeholder="SN-12.3456789"
          />
        </label>

        <label className={styles.field}>
          Тип продукта

          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option>Мониторы</option>
            <option>Компьютеры</option>
            <option>Ноутбуки</option>
            <option>Видеосистемы</option>
            <option>Периферия</option>
          </select>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.footer}>
          <button className={styles.cancel} type="button" onClick={onClose}>
            ОТМЕНИТЬ
          </button>

          <button className={styles.submit}>
            <Plus size={16} />
            ДОБАВИТЬ
          </button>
        </div>
      </form>
    </div>
  )
}