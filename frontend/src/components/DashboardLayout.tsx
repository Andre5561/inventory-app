'use client'

import Link from 'next/link'
import {
  LayoutList,
  Package,
  Search,
  Settings,
  SlidersHorizontal,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LiveStatus from './LiveStatus'
import styles from './DashboardLayout.module.css'
import { loadInventory } from '@/store/inventorySlice'
import type { AppDispatch, RootState } from '@/store/store'
import { setSearchQuery } from '@/store/uiSlice'
import { motion } from 'framer-motion'

type DashboardLayoutProps = {
  children: ReactNode
  activePage: 'orders' | 'groups' | 'products' | 'users' | 'settings'
}

export default function DashboardLayout({
  children,
  activePage,
}: DashboardLayoutProps) {
  const dispatch = useDispatch<AppDispatch>()

  const searchQuery = useSelector(
    (state: RootState) => state.ui.searchQuery
  )

  useEffect(() => {
    dispatch(loadInventory())
  }, [dispatch])

  return (
    <div className={styles.app}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/orders">
          <span className={styles.brandLogo}>⬢</span>
          <span>INVENTORY</span>
        </Link>

        <label className={styles.search}>
          <Search size={16} />
          <input
            placeholder="Поиск"
            value={searchQuery}
            onChange={(event) => dispatch(setSearchQuery(event.target.value))}
          />
        </label>

        <LiveStatus />
      </header>

      <aside className={styles.sidebar}>
        <div className={styles.profile}>
          <div className={styles.avatar}>A</div>

          <button className={styles.settings} aria-label="Настройки">
            <Settings size={16} />
          </button>
        </div>

        <nav className={styles.menu}>
          <Link
            className={`${styles.menuItem} ${activePage === 'orders' ? styles.menuItemActive : ''
              }`}
            href="/orders"
          >
            <LayoutList size={17} />
            ПРИХОДЫ
          </Link>

          <Link
            className={`${styles.menuItem} ${activePage === 'groups' ? styles.menuItemActive : ''
              }`}
            href="/groups"
          >
            <Users size={17} />
            ГРУППЫ
          </Link>

          <Link
            className={`${styles.menuItem} ${activePage === 'products' ? styles.menuItemActive : ''
              }`}
            href="/products"
          >
            <Package size={17} />
            ПРОДУКТЫ
          </Link>

          <Link
            className={`${styles.menuItem} ${activePage === 'users' ? styles.menuItemActive : ''
              }`}
            href="/users"
          >
            <Users size={17} />
            ПОЛЬЗОВАТЕЛИ
          </Link>

          <Link
            className={`${styles.menuItem} ${activePage === 'settings' ? styles.menuItemActive : ''
              }`}
            href="/settings"
          >
            <SlidersHorizontal size={17} />
            НАСТРОЙКИ
          </Link>
        </nav>
      </aside>

      <motion.main
        className={styles.content}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.main>
    </div>
  )
}