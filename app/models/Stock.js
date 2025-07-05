import mongoose from 'mongoose'

const stockSchema = new mongoose.Schema({
  name:
      {
        type: String,
        required: [true, 'Stock name is required'],
        nullable: false,
        unique: true
      },
  isin:
      {
        type: String,
        required: [true, 'Stock ISIN is required'],
        nullable: false,
        unique: true
      },
  code:
      {
        type: String,
        required: [true, 'Stock ISIN is required'],
        nullable: false,
        unique: true
      },
  market:
      {
        type: String,
        nullable: true,
        unique: false
      },
  currency:
      {
        type: String,
        nullable: true,
        unique: false
      }    
}, { timestamps: true } )

export const Stock = mongoose.model('Stock', stockSchema)
