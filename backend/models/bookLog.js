const mongoose = require('mongoose')

const bookLogSchema = mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  readLength: {
    type: Number,
    required: true,
    min: 0,
  },
  notes: {
    type: String,
  },
  currentPage: {
    type: Number,
    required: true,
    min: 0
  },
  finished: {
    type: Boolean,
    default: false
  }
})

bookLogSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('BookLog', bookLogSchema)