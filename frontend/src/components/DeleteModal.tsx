'use client'

import { Trash2, X } from 'lucide-react'
import styles from './DeleteModal.module.css'

type DeleteItem = {
  title: string
  count?: number
  serial?: string
}

type DeleteModalProps = {
  order: DeleteItem | null
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteModal({
  order,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!order) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>
          <X size={21} />
        </button>

        <h2>Вы уверены, что хотите удалить этот элемент?</h2>

        <div className={styles.product}>
          <span className={styles.dot} />
          <span className={styles.image}>▣</span>

          <div className={styles.info}>
            <strong>{order.title}</strong>
            <small>
              {order.serial ?? `${order.count ?? 0} продукта`}
            </small>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancel} onClick={onClose}>
            ОТМЕНИТЬ
          </button>

          <button className={styles.confirm} onClick={onConfirm}>
            <Trash2 size={15} />
            УДАЛИТЬ
          </button>
        </div>
      </div>
    </div>
  )
}