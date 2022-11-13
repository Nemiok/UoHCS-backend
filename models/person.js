const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d{6,7}/gm.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
})

/* formats documents to desired form */
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
/* Person */
module.exports = mongoose.model('Person', personSchema)