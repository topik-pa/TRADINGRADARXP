import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dataRegistrazione: { type: Date, default: Date.now }
})

export const User = mongoose.model('User', userSchema)
