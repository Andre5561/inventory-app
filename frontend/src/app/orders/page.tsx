'use client'

import {
  ChevronRight,
  List,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddOrderModal from '@/components/AddOrderModal'
import AddProductModal from '@/components/AddProductModal'
import DashboardLayout from '@/components/DashboardLayout'
import DeleteModal from '@/components/DeleteModal'
import {
  deleteOrder,
  deleteProduct,
  type Order,
} from '@/store/inventorySlice'
import type { AppDispatch, RootState } from '@/store/store'
import styles from './Orders.module.css'

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>()

  const orders = useSelector(
    (state: RootState) => state.inventory.orders
  )

  const products = useSelector(
    (state: RootState) => state.inventory.products
  )

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  const selectedOrder = orders.find((order) => order.id === selectedId)

  const searchQuery = useSelector(
  (state: RootState) => state.ui.searchQuery
)

const filteredOrders = orders.filter((order) =>
  order.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
)

  const selectedProducts = products.filter(
    (product) => product.orderId === selectedId
  )

  const confirmDelete = () => {
    if (!orderToDelete) return

    dispatch(deleteOrder(orderToDelete.id))

    if (selectedId === orderToDelete.id) {
      setSelectedId(null)
    }

    setOrderToDelete(null)
  }

  return (
    <DashboardLayout activePage="orders">
      <section>
        <div className={styles.pageTitle}>
          <button
            className={styles.addButton}
            onClick={() => setIsAddOrderOpen(true)}
          >
            <Plus size={21} />
          </button>

          <h1>
            Приходы <span>/ {orders.length}</span>
          </h1>
        </div>

        <div
          className={`${styles.layout} ${
            selectedOrder ? styles.layoutSelected : ''
          }`}
        >
          <div className={styles.list}>
           {filteredOrders.map((order) => (
              <article
                className={`${styles.orderCard} ${
                  selectedId === order.id ? styles.orderCardActive : ''
                }`}
                key={order.id}
                onClick={() => setSelectedId(order.id)}
              >
                {!selectedOrder && (
                  <button className={styles.orderTitle}>
                    {order.title}
                  </button>
                )}

                <div className={styles.count}>
                  <span className={styles.countIcon}>
                    <List size={22} />
                  </span>

                  <div className={styles.countText}>
                    <strong>{order.count}</strong>
                    <small>Продукта</small>
                  </div>
                </div>

                <div className={styles.date}>
                  <small>{order.shortDate}</small>
                  <span>{order.date}</span>
                </div>

                {!selectedOrder && (
                  <div className={styles.price}>
                    <small>{order.usd}</small>
                    <span>{order.uah}</span>
                  </div>
                )}

                {!selectedOrder && (
                  <button
                    className={styles.iconButton}
                    onClick={(event) => {
                      event.stopPropagation()
                      setOrderToDelete(order)
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                {selectedOrder && (
                  <span className={styles.arrow}>
                    <ChevronRight size={25} />
                  </span>
                )}
              </article>
            ))}
          </div>

          {selectedOrder && (
            <aside className={styles.details}>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedId(null)}
              >
                <X size={21} />
              </button>

              <h2>{selectedOrder.title}</h2>

              <button
                className={styles.addProductButton}
                onClick={() => setIsAddProductOpen(true)}
              >
                <Plus size={15} />
                Добавить продукт
              </button>

              {selectedProducts.map((product) => (
                <div className={styles.detailProduct} key={product.id}>
                  <span
                    className={`${styles.dot} ${
                      product.status === 'В ремонте'
                        ? styles.dotRepair
                        : ''
                    }`}
                  />

                  <div className={styles.productImage}>▣</div>

                  <div className={styles.productInfo}>
                    <strong>{product.title}</strong>
                    <small>{product.serial}</small>
                  </div>

                  <span
                    className={`${styles.productStatus} ${
                      product.status === 'В ремонте'
                        ? styles.productStatusRepair
                        : ''
                    }`}
                  >
                    {product.status}
                  </span>

                  <button
                    className={styles.iconButton}
                    onClick={() => dispatch(deleteProduct(product.id))}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </aside>
          )}
        </div>
      </section>

      <DeleteModal
        order={orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={confirmDelete}
      />

      <AddOrderModal
        isOpen={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        orderId={selectedOrder?.id ?? null}
        onClose={() => setIsAddProductOpen(false)}
      />
    </DashboardLayout>
  )
}