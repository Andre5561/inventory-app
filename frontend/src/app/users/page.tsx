'use client'

import { Mail, ShieldCheck } from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import styles from './Users.module.css'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

const users = [
  {
    id: 1,
    name: 'Александр Коваленко',
    email: 'alexander@inventory.ua',
    role: 'Администратор',
    initials: 'АК',
    online: true,
  },
  {
    id: 2,
    name: 'Марина Шевченко',
    email: 'marina@inventory.ua',
    role: 'Менеджер',
    initials: 'МШ',
    online: true,
  },
  {
    id: 3,
    name: 'Андрей Иванов',
    email: 'andrew@inventory.ua',
    role: 'Сотрудник',
    initials: 'АИ',
    online: false,
  },
  {
    id: 4,
    name: 'Олег Бондаренко',
    email: 'oleg@inventory.ua',
    role: 'Сотрудник',
    initials: 'ОБ',
    online: false,
  },
]

export default function UsersPage() {
      const searchQuery = useSelector(
    (state: RootState) => state.ui.searchQuery.trim().toLowerCase()
  )

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.role}`
      .toLowerCase()
      .includes(searchQuery)
  )
  return (
    <DashboardLayout activePage="users">
      <h1 className={styles.pageTitle}>
        Пользователи <span>/ {users.length}</span>
      </h1>

      <section className={styles.list}>
       {filteredUsers.map((user) => (
          <article className={styles.card} key={user.id}>
            <div className={styles.avatar}>{user.initials}</div>

            <div className={styles.info}>
              <strong>{user.name}</strong>

              <span>
                <Mail size={14} />
                {user.email}
              </span>
            </div>

            <div className={styles.role}>
              <ShieldCheck size={17} />
              {user.role}
            </div>

            <span
              className={`${styles.status} ${
                user.online ? styles.statusOnline : ''
              }`}
            >
              <i />
              {user.online ? 'В сети' : 'Не в сети'}
            </span>
          </article>
        ))}
      </section>
    </DashboardLayout>
  )
}