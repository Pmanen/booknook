const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    trim: true,
  },
  outlet: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: v => {
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: props => `${props.value} is not a valid url`,
    },
    set: v => {
      v = v.trim().toLowerCase();
      if (!/^https?:\/\//i.test(v)) {
        return `https://${v}`;
      }
      v = v.replace(/\?.*$/, '');
      v = v.replace(/\/$/, '');
      return v;
    },
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  length: {
    type: Number, // read time in minutes
    required: true,
    min: 0,
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: props => `${props.value} is not an integer`,
    },
  },
  datePublished: {
    type: Date,
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

articleSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Article', articleSchema);
