require('dotenv').config()
const express = require('express')
const http = require('http')

const app = express()

//Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the tradingradar XP project' })
})

//HTTP
const port = process.env.PORT || 8080
http.createServer(app).listen(port, () => {
  console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode.`)
})