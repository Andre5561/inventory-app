'use client'

import { List, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import DashboardLayout from '@/components/DashboardLayout'
import type { RootState } from '@/store/store'
import styles from './Groups.module.css'

export default function GroupsPage() {
  const orders = useSelector((state: RootState) => state.inventory.orders)
  const products = useSelector((state: RootState) => state.inventory.products)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selectedOrder = orders.find((order) => order.id === selectedId)

  const selectedProducts = products.filter(
    (product) => product.orderId === selectedId
  )

  return (
    <DashboardLayout activePage="groups">
      <h1 className={styles.pageTitle}>
        Группы <span>/ {orders.length}</span>
      </h1>

      <section
        className={`${styles.layout} ${
          selectedOrder ? styles.layoutSelected : ''
        }`}
      >
        <div className={styles.list}>
          {orders.map((order) => (
            <article
              className={`${styles.card} ${
                selectedId === order.id ? styles.cardActive : ''
              }`}
              key={order.id}
              onClick={() => setSelectedId(order.id)}
            >
              <span className={styles.icon}>
                <List size={23} />
              </span>

              <div className={styles.info}>
                <strong>{order.count}</strong>
                <small>Продукта</small>
              </div>

              <div className={styles.date}>
                <small>{order.shortDate}</small>
                <span>{order.date}</span>
              </div>
            </article>
          ))}
        </div>

        {selectedOrder && (
          <aside className={styles.details}>
            <button
              className={styles.close}
              onClick={() => setSelectedId(null)}
              aria-label="Закрыть"
            >
              <X size={21} />
            </button>

            <h2 className={styles.detailsTitle}>{selectedOrder.title}</h2>

            <button className={styles.addProduct}>
              <Plus size={16} />
              Добавить продукт
            </button>

            {selectedProducts.map((product) => (
              <div className={styles.product} key={product.id}>
                <span className={styles.dot} />
                <span className={styles.image}>▣</span>

                <div className={styles.productInfo}>
                  <strong>{product.title}</strong>
                  <small>{product.serial}</small>
                </div>

                <span className={styles.status}>{product.status}</span>
              </div>
            ))}

            {selectedProducts.length === 0 && (
              <div className={styles.empty}>В этой группе пока нет продуктов.</div>
            )}
          </aside>
        )}
      </section>
    </DashboardLayout>
  )
}