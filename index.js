const express = require('express')
const db = require('./db')

const app = express()

const cors = require('cors')
app.use(cors())

app.get('/', (req, res) => {
  res.send('Servidor funcionando')
})

app.get('/extintores', (req, res) => {
  db.query('SELECT * FROM extintores', (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error en base de datos' })
    }
    res.json(results)
  })
})

app.listen(3000, () => {
  console.log('Servidor activo en http://localhost:3000')
})

const QRCode = require('qrcode')

app.get('/api/qr/:codigo', async (req, res) => {
  const codigo = req.params.codigo
  const url = `http://localhost:5173/${codigo}`

  try {
    const qr = await QRCode.toDataURL(url)
    res.json({ codigo, qr })
  } catch (error) {
    res.status(500).json({ error: 'Error generando QR' })
  }
})




app.get('/api/extintores/:codigo', (req, res) => {
  const codigo = req.params.codigo

  db.query(
    'SELECT * FROM extintores WHERE codigo = ?',
    [codigo],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'DB error' })
      if (results.length === 0) {
        return res.status(404).json({ error: 'No encontrado' })
      }
      res.json(results[0])
    }
  )
})





