'use client'

import { Clock3, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import styles from './LiveStatus.module.css'

export default function LiveStatus() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sessions, setSessions] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000'

    const socket = io(socketUrl)

    socket.on('sessions:count', (count: number) => {
      setSessions(count)
    })

    return () => {
      clearInterval(timer)
      socket.disconnect()
    }
  }, [])

  return (
    <div className={styles.status}>
      <span>Сегодня</span>

      <strong>
        {currentTime.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}
      </strong>

      <small>
        <Clock3 size={14} />
        {currentTime.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </small>

      <b>
        <Users size={14} />
        {sessions}
      </b>
    </div>
  )
}