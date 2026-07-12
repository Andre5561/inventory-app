'use client'

import { Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardLayout from '@/components/DashboardLayout'
import DeleteModal from '@/components/DeleteModal'
import type { AppDispatch, RootState } from '@/store/store'
import {
  deleteProduct,
  type Product,
} from '@/store/inventorySlice'
import styles from './Products.module.css'

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const products = useSelector((state: RootState) => state.inventory.products)
  const orders = useSelector((state: RootState) => state.inventory.orders)

  const [typeFilter, setTypeFilter] = useState('Все')
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const types = useMemo(
    () => ['Все', ...Array.from(new Set(products.map((product) => product.type)))],
    [products]
  )

const searchQuery = useSelector(
  (state: RootState) => state.ui.searchQuery.trim().toLowerCase()
)

const filteredProducts = products.filter((product) => {
  const matchesType =
    typeFilter === 'Все' || product.type === typeFilter

  const matchesSearch =
    product.title.toLowerCase().includes(searchQuery) ||
    product.serial.toLowerCase().includes(searchQuery) ||
    product.type.toLowerCase().includes(searchQuery)

  return matchesType && matchesSearch
})

  const confirmDelete = () => {
    if (!productToDelete) return

    dispatch(deleteProduct(productToDelete.id))
    setProductToDelete(null)
  }

  return (
    <DashboardLayout activePage="products">
      <h1 className={styles.pageTitle}>
        Продукты <span>/ {products.length}</span>
      </h1>

      <div className={styles.filters}>
        <label htmlFor="type">Тип:</label>

        <select
          id="type"
          className={styles.select}
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
        >
          {types.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <section className={styles.list}>
        {filteredProducts.map((product) => {
          const order = orders.find((item) => item.id === product.orderId)
          const isRepair = product.status === 'В ремонте'

          return (
            <article className={styles.card} key={product.id}>
              <span
                className={`${styles.dot} ${
                  isRepair ? styles.dotRepair : ''
                }`}
              />

              <span className={styles.image}>▣</span>

              <div className={styles.info}>
                <strong>{product.title}</strong>
                <small>{product.serial}</small>
              </div>

              <span
                className={`${styles.status} ${
                  isRepair ? styles.statusRepair : ''
                }`}
              >
                {product.status}
              </span>

              <div className={styles.group}>
                <strong>{product.type}</strong>
                <small>Тип продукта</small>
              </div>

              <div className={styles.order}>
                <strong>{order?.title ?? 'Без прихода'}</strong>
                <small>{order?.date ?? ''}</small>
              </div>

              <button
                className={styles.deleteButton}
                onClick={() => setProductToDelete(product)}
                aria-label="Удалить продукт"
              >
                <Trash2 size={16} />
              </button>
            </article>
          )
        })}

        {filteredProducts.length === 0 && (
          <div className={styles.empty}>Продукты не найдены</div>
        )}
      </section>

      <DeleteModal
        order={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />
    </DashboardLayout>
  )
}