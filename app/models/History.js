import mongoose from 'mongoose'
const Schema = mongoose.Schema

const historySchema = new Schema({
  isin:
      {
        type: String,
        required: [true, 'History ISIN is required'],
        nullable: false,
        unique: true
      },
  prices:
      {
        type: Schema.Types.Mixed,
        nullable: true,
        unique: false
      },
  volumes:
      {
        type: Schema.Types.Mixed,
        nullable: true,
        unique: false
      }
}, { timestamps: true } )

export const History = mongoose.model('History', historySchema)
