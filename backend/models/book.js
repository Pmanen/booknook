const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    trim: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  pages: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: props => `${props.value} is not an integer`,
    },
  },
  yearPublished: {
    type: Number,
    min: 1000,
    max: 2500,
    validate: {
      validator: Number.isInteger,
      message: props => `${props.value} is not a valid year`,
    },
  },
  genreTag: {
    type: Number,
    min: 0,
    max: 99,
    validate: {
      validator: Number.isInteger,
      message: props =>
        `${props.value} is not a valid genre tag between 0 and 99`,
    },
  },
});

bookSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Book', bookSchema);
