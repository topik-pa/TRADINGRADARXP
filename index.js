import dotenv from 'dotenv'
import express from 'express'

dotenv.config()
const app = express()
const port = process.env.PORT || 8080

//Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the tradingradar XP project' })
})
app.use((req, res) => {
  res.status(404).json({
    error: 404,
    message: 'Resource not found'
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode.`)
})
