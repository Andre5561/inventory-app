const express = require('express')
const cors = require('cors')
const http = require('http')
const fs = require('fs')
const path = require('path')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

app.use(cors())
app.use(express.json())

const databaseFile = path.join(__dirname, 'database.json')

const initialData = {
  orders: [
    {
      id: 1,
      title: 'Мониторы для дизайнерского отдела',
      count: 4,
      date: '06 / Апр / 2017',
      shortDate: '04 / 12',
      usd: '2 500 $',
      uah: '250 000.50 UAH',
    },
    {
      id: 2,
      title: 'Оборудование переговорных комнат',
      count: 2,
      date: '06 / Июн / 2017',
      shortDate: '09 / 12',
      usd: '3 898 $',
      uah: '155 920 UAH',
    },
    {
      id: 3,
      title: 'Обновление рабочих станций',
      count: 2,
      date: '06 / Сен / 2017',
      shortDate: '06 / 12',
      usd: '918 $',
      uah: '36 720 UAH',
    },
    {
      id: 4,
      title: 'Техника для нового офиса',
      count: 2,
      date: '06 / Окт / 2017',
      shortDate: '02 / 12',
      usd: '1 898 $',
      uah: '75 920 UAH',
    },
  ],
  products: [
    {
      id: 1,
      title: 'Gigabyte Technology X58-USB3',
      serial: 'SN-12.3456789',
      type: 'Монитор',
      status: 'Свободен',
      orderId: 1,
    },
    {
      id: 2,
      title: 'Dell UltraSharp U2723QE',
      serial: 'SN-23.9876543',
      type: 'Монитор',
      status: 'Свободен',
      orderId: 1,
    },
    {
      id: 3,
      title: 'Apple Studio Display',
      serial: 'SN-34.1357924',
      type: 'Монитор',
      status: 'В ремонте',
      orderId: 1,
    },
    {
      id: 4,
      title: 'LG UltraFine 32EP950',
      serial: 'SN-45.2468135',
      type: 'Монитор',
      status: 'Свободен',
      orderId: 1,
    },
    {
      id: 5,
      title: 'Logitech Rally Bar',
      serial: 'SN-56.3141592',
      type: 'Оборудование',
      status: 'Свободен',
      orderId: 2,
    },
    {
      id: 6,
      title: 'Jabra Speak 750',
      serial: 'SN-67.2718281',
      type: 'Оборудование',
      status: 'Свободен',
      orderId: 2,
    },
    {
      id: 7,
      title: 'Lenovo ThinkStation P620',
      serial: 'SN-78.4567890',
      type: 'Компьютер',
      status: 'Свободен',
      orderId: 3,
    },
    {
      id: 8,
      title: 'Apple MacBook Pro 16',
      serial: 'SN-89.5678901',
      type: 'Ноутбук',
      status: 'В ремонте',
      orderId: 3,
    },
    {
      id: 9,
      title: 'HP LaserJet Pro M404dn',
      serial: 'SN-90.6789012',
      type: 'Принтер',
      status: 'Свободен',
      orderId: 4,
    },
    {
      id: 10,
      title: 'Samsung Flip Pro 65',
      serial: 'SN-10.7890123',
      type: 'Оборудование',
      status: 'Свободен',
      orderId: 4,
    },
  ],
}

function readDatabase() {
  if (!fs.existsSync(databaseFile)) {
    fs.writeFileSync(databaseFile, JSON.stringify(initialData, null, 2))
    return initialData
  }

  return JSON.parse(fs.readFileSync(databaseFile, 'utf8'))
}

let { orders, products } = readDatabase()

function saveDatabase() {
  fs.writeFileSync(
    databaseFile,
    JSON.stringify({ orders, products }, null, 2)
  )
}

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/orders', (request, response) => {
  response.json(orders)
})

app.get('/api/products', (request, response) => {
  response.json(products)
})

app.post('/api/orders', (request, response) => {
  const title = request.body.title?.trim()

  if (!title) {
    return response.status(400).json({ message: 'Название обязательно' })
  }

  const newOrder = {
    id: Date.now(),
    title,
    count: 0,
    date: '12 / Июл / 2026',
    shortDate: '12 / 07',
    usd: '0 $',
    uah: '0 UAH',
  }

  orders.unshift(newOrder)
  saveDatabase()

  response.status(201).json(newOrder)
})

app.delete('/api/orders/:id', (request, response) => {
  const id = Number(request.params.id)

  orders = orders.filter((order) => order.id !== id)
  products = products.filter((product) => product.orderId !== id)

  saveDatabase()

  response.status(204).end()
})

app.post('/api/products', (request, response) => {
  const { title, serial, type, orderId } = request.body

  if (!title?.trim() || !serial?.trim() || !type?.trim() || !orderId) {
    return response.status(400).json({ message: 'Заполните все поля' })
  }

  const order = orders.find((item) => item.id === Number(orderId))

  if (!order) {
    return response.status(404).json({ message: 'Приход не найден' })
  }

  const newProduct = {
    id: Date.now(),
    title: title.trim(),
    serial: serial.trim(),
    type: type.trim(),
    status: 'Свободен',
    orderId: Number(orderId),
  }

  products.push(newProduct)
  order.count += 1
  saveDatabase()

  response.status(201).json(newProduct)
})

app.delete('/api/products/:id', (request, response) => {
  const id = Number(request.params.id)
  const product = products.find((item) => item.id === id)

  products = products.filter((item) => item.id !== id)

  if (product) {
    const order = orders.find((item) => item.id === product.orderId)

    if (order) {
      order.count -= 1
    }
  }

  saveDatabase()

  response.status(204).end()
})

let activeSessions = 0

io.on('connection', (socket) => {
  activeSessions += 1
  io.emit('sessions:count', activeSessions)

  socket.on('disconnect', () => {
    activeSessions -= 1
    io.emit('sessions:count', activeSessions)
  })
})

server.listen(4000, () => {
  console.log('Backend started on http://localhost:4000')
})