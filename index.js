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

app.get('/qr/:codigo', async (req, res) => {
  const codigo = req.params.codigo
  const url = `http://localhost:5173/${codigo}`

  try {
    const qr = await QRCode.toDataURL(url)

    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>QR Extintor ${codigo}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f4f6f8;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .card {
            background: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            text-align: center;
            width: 320px;
          }
          h1 {
            font-size: 20px;
            margin-bottom: 10px;
            color: #333;
          }
          .codigo {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
          }
          img {
            width: 220px;
            height: 220px;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Extintor</h1>
          <div class="codigo">Código: <b>${codigo}</b></div>
          <img src="${qr}" alt="QR Extintor">
          <div class="footer">
            Escanee para ver información del extintor
          </div>
        </div>
      </body>
      </html>
    `)
  } catch (error) {
    res.status(500).send('Error generando QR')
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



