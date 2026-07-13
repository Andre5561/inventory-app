'use client'

import { Clock3, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import styles from './LiveStatus.module.css'

export default function LiveStatus() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [sessions, setSessions] = useState(0)

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date())

    updateTime()

    const timer = window.setInterval(updateTime, 1000)

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000'

    const socket = io(socketUrl)

    socket.on('sessions:count', (count: number) => {
      setSessions(count)
    })

    return () => {
      window.clearInterval(timer)
      socket.disconnect()
    }
  }, [])

  const date = currentTime
    ? currentTime.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const time = currentTime
    ? currentTime.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--'

  return (
    <div className={styles.status}>
      <span>Сегодня</span>
      <strong>{date}</strong>

      <small>
        <Clock3 size={14} />
        {time}
      </small>

      <b>
        <Users size={14} />
        {sessions}
      </b>
    </div>
  )
}