import mongoose from 'mongoose'
const Schema = mongoose.Schema

const stockSchema = new Schema({
  name:
      {
        type: String,
        required: [true, 'Stock name is required'],
        nullable: false,
        unique: true
      },
  slug:
      {
        type: String,
        required: [true, 'Stock slug is required'],
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
      },
  price:
      {
        type: Number,
        nullable: true,
        unique: false
      },
  absVariation:
      {
        type: Number,
        nullable: true,
        unique: false
      },
  relVariation:
      {
        type: Number,
        nullable: true,
        unique: false
      },
  status:
      {
        type: String,
        nullable: true,
        unique: false
      },
  perf1M:
      {
        type: Number,
        nullable: true,
        unique: false
      },
  perf52W:
      {
        type: Number,
        nullable: true,
        unique: false
      },
  volume:
      {
        type: Number,
        nullable: true,
        unique: false
      },
  cap:
      {
        type: Number,
        nullable: true,
        unique: false
      },
  lastTrade:
      {
        type: String,
        nullable: true,
        unique: false
      },
  support:
      {
        type: Number,
        nullable: true,
        unique: false
      },
  resistance:
      {
        type: Number,
        nullable: true,
        unique: false
      },
  sources:
      {
        type: Schema.Types.Mixed,
        nullable: true,
        unique: false
      }
}, { timestamps: true } )

export const Stock = mongoose.model('Stock', stockSchema)
