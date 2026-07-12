'use client'

import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addOrder } from '@/store/inventorySlice'
import type { AppDispatch } from '@/store/store'
import styles from './AddOrderModal.module.css'

type AddOrderModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function AddOrderModal({
  isOpen,
  onClose,
}: AddOrderModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (title.trim().length < 3) {
      setError('Введите название минимум из 3 символов')
      return
    }

    dispatch(addOrder(title))
    setTitle('')
    setError('')
    onClose()
  }

  return (
    <div className={styles.overlay}>
      <form className={styles.modal} onSubmit={submitForm}>
        <button className={styles.close} type="button" onClick={onClose}>
          <X size={21} />
        </button>

        <h2>Новый приход</h2>

        <label className={styles.field}>
          Название прихода

          <input
            autoFocus
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              setError('')
            }}
            placeholder="Например, техника для офиса"
          />
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