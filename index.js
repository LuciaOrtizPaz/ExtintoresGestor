const express = require('express')
const db = require('./db')
const app = express()

app.get('/', (req, res) => {
  res.send('Servidor + MySQL funcionando')
})

app.listen(3000)

app.get('/extintores', (req, res) => {
  db.query('SELECT * FROM extintores', (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
})
