require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  else if (error.name = 'ValidationError') {
    return response.status(400).send(error.message)
  }
  else {
    next(error)
    return response.status(400).send({ error: 'wrong' })
  }
}

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/api/persons', (request, response) => {

  mongoose.connect(url)
    .then(() => {
      Person.find({})
        .then(persons => {
          response.json(persons)
        })
    })
})

app.get('/info', (request, response) => {
  mongoose.connect(url)
    .then(() => {
      Person.find({})
        .then(persons => {
          console.log(persons)
          numberOfPersons = persons.length
          response.send(`<p>Phonebook has info for ${numberOfPersons} people</p>
          <div>${new Date()}</div>`)
        })
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  mongoose.connect(url)
    .then(() => {
      Person.findById(request.params.id)
        .then(person => {
          if (person) {
            response.json(person)
          } else {
            response.status(404).end()
          }
        })
        .catch(err => next(err))
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  mongoose.connect(url)
    .then(() => {
      const body = req.body
      const person = {
        name: body.name,
        number: body.number,
      }
      Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
          res.json(updatedPerson)
        })
        .catch(error => next(error))
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
  mongoose.connect(url)
    .then(() => {
      Person.findByIdAndRemove(request.params.id)
        .then((result) => {
          response.status(204).end()
        })
        .catch(err => next(err))
    })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(request.body)

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  else {
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save()
      .then((savedPerson) => response.json(savedPerson))
      .catch(err => next(err))
  }
})
app.use(errorHandler)