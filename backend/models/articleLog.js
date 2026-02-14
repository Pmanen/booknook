const mongoose = require('mongoose')

const articleLogSchema = mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
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
    min: 0
  },
  notes: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false
  }
})

articleLogSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('ArticleLog', articleLogSchema)