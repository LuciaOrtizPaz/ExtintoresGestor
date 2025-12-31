const express = require('express')
const db = require('./db')

const app = express()

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

app.get('/qr/:codigo', async (req, res) => {
  const url = `http://localhost:3000/extintores/${req.params.codigo}`
  const qr = await QRCode.toDataURL(url)
  res.send(`<img src="${qr}" />`)
})

app.get('/extintores/:codigo', (req, res) => {
  const codigo = req.params.codigo

  db.query(
    'SELECT * FROM extintores WHERE codigo = ?',
    [codigo],
    (err, results) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error de base de datos')
      }

      if (results.length === 0) {
        return res.status(404).send('Extintor no encontrado')
      }

      const extintor = results[0]

      res.send(`
        <h1>Extintor ${extintor.codigo}</h1>
        <p>Tipo: ${extintor.tipo}</p>
        <p>Capacidad: ${extintor.capacidad}</p>
        <p>Ubicación: ${extintor.ubicacion}</p>
      `)
    }
  )
})

